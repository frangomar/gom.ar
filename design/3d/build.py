# Objetos 3D de gom.ar modelados por código y renderizados en Cycles.
# Uso: blender -b -P design/3d/build.py -- --only phone,plate --res 900 --samples 128 --out design/3d/preview
# Cada objeto se arma en una escena vacía, a escala real (metros), con fondo transparente
# y sombra de contacto (shadow catcher), pensado para componerse sobre #070708.
import bpy, bmesh, math, os, sys, argparse
from mathutils import Vector, kdtree

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
HDRI = os.path.join(bpy.utils.system_resource("DATAFILES"), "studiolights", "world", "studio.exr")
FONT = os.path.join(HERE, "sg-900.ttf")
UV, RED = (0.478, 0.361, 1.0), (1.0, 0.169, 0.306)  # #7a5cff y #ff2b4e en sRGB


def srgb(c):
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (1,)


# ---------- escena ----------
def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    prefs = bpy.context.preferences.addons["cycles"].preferences
    for kind in ("OPTIX", "CUDA"):
        try:
            prefs.compute_device_type = kind
            prefs.get_devices()
            if any(d.type == kind for d in prefs.devices):
                for d in prefs.devices:
                    d.use = d.type == kind
                sc.cycles.device = "GPU"
                break
        except TypeError:
            pass
    sc.cycles.use_denoising = True
    sc.render.film_transparent = True
    sc.view_settings.view_transform = "AgX"
    sc.view_settings.look = "AgX - Medium High Contrast"
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGBA"
    w = bpy.data.worlds.new("w")
    sc.world = w
    w.use_nodes = True
    nt = w.node_tree
    env = nt.nodes.new("ShaderNodeTexEnvironment")
    env.image = bpy.data.images.load(HDRI)
    nt.links.new(env.outputs[0], nt.nodes["Background"].inputs[0])
    nt.nodes["Background"].inputs[1].default_value = 0.25
    return sc


def link(ob):
    bpy.context.scene.collection.objects.link(ob)
    return ob


def mesh_obj(name, bm, mat=None):
    me = bpy.data.meshes.new(name)
    bm.normal_update()
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    ob = link(bpy.data.objects.new(name, me))
    if mat:
        ob.data.materials.append(mat)
    return ob


def bevel(ob, w, seg=4, angle=35):
    m = ob.modifiers.new("bevel", "BEVEL")
    m.width, m.segments, m.limit_method = w, seg, "ANGLE"
    m.angle_limit = math.radians(angle)
    m.harden_normals = True
    return m


def boolean(ob, cutter, op="DIFFERENCE"):
    """Corta y aplica en el acto: un cortador oculto quedaría fuera del depsgraph de render y no cortaría."""
    m = ob.modifiers.new("bool", "BOOLEAN")
    m.operation, m.object, m.solver = op, cutter, "EXACT"
    apply_mods(ob)
    bpy.data.objects.remove(cutter)


def apply_mods(ob):
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    ob.modifiers.clear()
    ob.data = me


def slab(name, w, h, d, r, edge, mat=None, seg=14):
    """Caja de esquinas redondeadas en planta (radio r) y aristas biseladas (edge)."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1)
    bmesh.ops.scale(bm, vec=(w, h, d), verts=bm.verts)
    vertical = [e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) > 1e-9]
    bmesh.ops.bevel(bm, geom=vertical, offset=r, segments=seg, affect="EDGES", profile=0.5)
    ob = mesh_obj(name, bm, mat)
    if edge:
        bevel(ob, edge, 4, 30)
    return ob


def cyl(name, r, depth, verts=64, mat=None, edge=0.0):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=verts, radius1=r, radius2=r, depth=depth)
    ob = mesh_obj(name, bm, mat)
    if edge:
        bevel(ob, edge, 3, 30)
    return ob


def text_mesh(name, body, size, depth, mat, bevel_d=0.0, font=FONT, extra=(), char_mat=None, align_y="CENTER"):
    """Texto extruido. extra + char_mat ({índice de letra: índice de material}) pintan letras sueltas."""
    cu = bpy.data.curves.new(name, "FONT")
    cu.body, cu.size, cu.extrude = body, size, depth
    cu.font = bpy.data.fonts.load(font) if font else None
    cu.align_x, cu.align_y = "CENTER", align_y
    cu.bevel_depth, cu.bevel_resolution = bevel_d, 4
    cu.resolution_u = 24
    for m_ in (mat, *extra):
        cu.materials.append(m_)
    for i, k in (char_mat or {}).items():
        cu.body_format[i].material_index = k
    ob = curve_mesh(name, cu, mat)
    m = ob.modifiers.new("ws", "WEIGHTED_NORMAL")
    m.keep_sharp = True
    return ob


def curve_mesh(name, cu, mat):
    """Convierte una curva a malla (el bound box de las curvas evaluadas no es confiable para encuadrar)."""
    tmp = link(bpy.data.objects.new(name + "_c", cu))
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(tmp.evaluated_get(dg))
    bpy.data.objects.remove(tmp)
    for p in me.polygons:
        p.use_smooth = True
    ob = link(bpy.data.objects.new(name, me))
    if not ob.data.materials:
        ob.data.materials.append(mat)
    return ob


def parent(children, name="rig"):
    root = link(bpy.data.objects.new(name, None))
    for c in children:
        c.parent = root
    return root


# ---------- materiales ----------
def mat(name, base=(0.8, 0.8, 0.8), metal=0.0, rough=0.4, coat=0.0, coat_rough=0.05, rough_var=0.06, bump=0.0, bump_scale=900.0, spec=0.5):
    """Principled con variación de roughness y micro-relieve (ruido) para que nada se vea de CG plano."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = srgb(base)
    p.inputs["Metallic"].default_value = metal
    p.inputs["Specular IOR Level"].default_value = spec
    p.inputs["Coat Weight"].default_value = coat
    p.inputs["Coat Roughness"].default_value = coat_rough
    tc = nt.nodes.new("ShaderNodeTexCoord")
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = bump_scale
    n.inputs["Detail"].default_value = 6
    nt.links.new(tc.outputs["Object"], n.inputs["Vector"])
    big = nt.nodes.new("ShaderNodeTexNoise")
    big.inputs["Scale"].default_value = 40
    nt.links.new(tc.outputs["Object"], big.inputs["Vector"])
    mr = nt.nodes.new("ShaderNodeMapRange")
    mr.inputs["To Min"].default_value = max(0.0, rough - rough_var)
    mr.inputs["To Max"].default_value = rough + rough_var
    nt.links.new(big.outputs["Fac"], mr.inputs["Value"])
    nt.links.new(mr.outputs["Result"], p.inputs["Roughness"])
    if bump:
        b = nt.nodes.new("ShaderNodeBump")
        b.inputs["Strength"].default_value = bump
        b.inputs["Distance"].default_value = 0.0002
        nt.links.new(n.outputs["Fac"], b.inputs["Height"])
        nt.links.new(b.outputs["Normal"], p.inputs["Normal"])
    return m


def screen_mat(name, img_path, crop=1.0, flip=False):
    """Pantalla: imagen emisiva bajo un vidrio con barniz. crop = fracción superior de la imagen visible."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (0.0, 0.0, 0.0, 1)
    p.inputs["Roughness"].default_value = 0.4
    p.inputs["Specular IOR Level"].default_value = 0.0  # el reflejo lo da solo el barniz, bajo
    p.inputs["Coat Weight"].default_value = 0.0  # los softbox reflejados tapaban la captura; el vidrio lo da el borde
    p.inputs["Coat Roughness"].default_value = 0.03
    p.inputs["Emission Strength"].default_value = 1.0
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Location"].default_value = (0, 1 if flip else 1 - crop, 0)
    mp.inputs["Scale"].default_value = (1, -crop if flip else crop, 1)
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = bpy.data.images.load(img_path)
    tex.extension = "EXTEND"
    nt.links.new(tc.outputs["Generated"], mp.inputs["Vector"])
    nt.links.new(mp.outputs["Vector"], tex.inputs["Vector"])
    nt.links.new(tex.outputs["Color"], p.inputs["Emission Color"])
    return m


def carbon_mat():
    """Tejido de carbono plano (tafetán): checker elige entre bandas en X y en Y; relieve + reflejo."""
    m = mat("carbon", (0.025, 0.025, 0.028), 0.0, 0.32, coat=1.0, coat_rough=0.22, rough_var=0.04)
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Rotation"].default_value = (0, 0, math.radians(45))
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    ch = nt.nodes.new("ShaderNodeTexChecker")
    ch.inputs["Scale"].default_value = 260
    ch.inputs["Color1"].default_value = (1, 1, 1, 1)
    ch.inputs["Color2"].default_value = (0, 0, 0, 1)
    nt.links.new(mp.outputs["Vector"], ch.inputs["Vector"])
    waves = []
    for d in ("X", "Y"):
        w = nt.nodes.new("ShaderNodeTexWave")
        w.wave_type, w.bands_direction, w.wave_profile = "BANDS", d, "SIN"
        w.inputs["Scale"].default_value = 260 * 0.5
        w.inputs["Distortion"].default_value = 0.0
        nt.links.new(mp.outputs["Vector"], w.inputs["Vector"])
        waves.append(w)
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "FLOAT"
    nt.links.new(ch.outputs["Fac"], mix.inputs["Factor"])
    nt.links.new(waves[0].outputs["Fac"], mix.inputs[2])
    nt.links.new(waves[1].outputs["Fac"], mix.inputs[3])
    b = nt.nodes.new("ShaderNodeBump")
    b.inputs["Strength"].default_value = 0.18
    b.inputs["Distance"].default_value = 0.0002
    nt.links.new(mix.outputs[0], b.inputs["Height"])
    nt.links.new(b.outputs["Normal"], p.inputs["Normal"])
    # cada mecha refleja distinto según su dirección: variación de color y roughness
    cr = nt.nodes.new("ShaderNodeMapRange")
    cr.inputs["To Min"].default_value, cr.inputs["To Max"].default_value = 0.012, 0.03
    nt.links.new(ch.outputs["Fac"], cr.inputs["Value"])
    rgb = nt.nodes.new("ShaderNodeCombineColor")
    for i in range(3):
        nt.links.new(cr.outputs["Result"], rgb.inputs[i])
    nt.links.new(rgb.outputs["Color"], p.inputs["Base Color"])
    return m


def cast_iron_mat():
    """Pintura martillada sobre fundición, con desgaste a hierro en las aristas (pointiness)."""
    m = mat("iron", (0.11, 0.115, 0.12), 0.55, 0.42, rough_var=0.06, bump=0.0)
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    vo = nt.nodes.new("ShaderNodeTexVoronoi")
    vo.inputs["Scale"].default_value = 220
    vo.feature = "SMOOTH_F1"
    nt.links.new(tc.outputs["Object"], vo.inputs["Vector"])
    b = nt.nodes.new("ShaderNodeBump")
    b.inputs["Strength"].default_value = 0.25
    b.inputs["Distance"].default_value = 0.0004
    nt.links.new(vo.outputs["Distance"], b.inputs["Height"])
    nt.links.new(b.outputs["Normal"], p.inputs["Normal"])
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 90
    nt.links.new(tc.outputs["Object"], noise.inputs["Vector"])
    add = nt.nodes.new("ShaderNodeMath")
    add.operation = "MULTIPLY_ADD"
    nt.links.new(noise.outputs["Fac"], add.inputs[0])
    add.inputs[1].default_value = 0.12
    nt.links.new(geo.outputs["Pointiness"], add.inputs[2])
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.60
    ramp.color_ramp.elements[1].position = 0.64
    nt.links.new(add.outputs["Value"], ramp.inputs["Fac"])
    paint_c = nt.nodes.new("ShaderNodeMix")
    paint_c.data_type = "RGBA"
    paint_c.inputs[6].default_value = srgb((0.11, 0.115, 0.12))
    paint_c.inputs[7].default_value = srgb((0.55, 0.55, 0.56))
    nt.links.new(ramp.outputs["Color"], paint_c.inputs[0])
    nt.links.new(paint_c.outputs[2], p.inputs["Base Color"])
    return m


def stripes_mat(name, base, rough, scale, direction="DIAGONAL", strength=0.6, profile="SIN"):
    """Relieve en bandas (overgrip, moleteado)."""
    m = mat(name, base, 0.0, rough, rough_var=0.05)
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    w = nt.nodes.new("ShaderNodeTexWave")
    w.wave_type, w.bands_direction, w.wave_profile = "BANDS", direction, profile
    w.inputs["Scale"].default_value = scale
    nt.links.new(tc.outputs["Object"], w.inputs["Vector"])
    b = nt.nodes.new("ShaderNodeBump")
    b.inputs["Strength"].default_value = strength
    b.inputs["Distance"].default_value = 0.0005
    nt.links.new(w.outputs["Fac"], b.inputs["Height"])
    nt.links.new(b.outputs["Normal"], p.inputs["Normal"])
    return m


def knurl_mat():
    m = mat("knurl", (0.78, 0.78, 0.8), 1.0, 0.28, rough_var=0.04)
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    outs = []
    for ang in (45, -45):
        mp = nt.nodes.new("ShaderNodeMapping")
        mp.inputs["Rotation"].default_value = (math.radians(ang), 0, 0)
        nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
        w = nt.nodes.new("ShaderNodeTexWave")
        w.wave_type, w.bands_direction, w.wave_profile = "BANDS", "Z", "TRI"
        w.inputs["Scale"].default_value = 260
        nt.links.new(mp.outputs["Vector"], w.inputs["Vector"])
        outs.append(w)
    mul = nt.nodes.new("ShaderNodeMath")
    mul.operation = "MINIMUM"
    nt.links.new(outs[0].outputs["Fac"], mul.inputs[0])
    nt.links.new(outs[1].outputs["Fac"], mul.inputs[1])
    b = nt.nodes.new("ShaderNodeBump")
    b.inputs["Strength"].default_value = 0.8
    b.inputs["Distance"].default_value = 0.0004
    nt.links.new(mul.outputs[0], b.inputs["Height"])
    nt.links.new(b.outputs["Normal"], p.inputs["Normal"])
    return m


# ---------- objetos ----------
def phone():
    """Smartphone propio: marco satinado, frente de vidrio, módulo de cámara vertical en cápsula."""
    W, H, D = 0.0716, 0.1505, 0.0082
    frame = mat("frame", (0.56, 0.55, 0.53), 1.0, 0.3, rough_var=0.05, bump=0.08)
    back_glass = mat("back", (0.20, 0.21, 0.23), 0.0, 0.32, coat=1.0, coat_rough=0.25, rough_var=0.03, bump=0.05, bump_scale=2500)
    black = mat("bezel", (0.004, 0.004, 0.005), 0.0, 0.3, coat=1.0, coat_rough=0.02, rough_var=0.0)
    lens = mat("lens", (0.01, 0.012, 0.02), 0.0, 0.05, coat=1.0, coat_rough=0.0, rough_var=0.0)
    ring = mat("ring", (0.62, 0.61, 0.59), 1.0, 0.18, rough_var=0.03)
    parts = [slab("body", W, H, D, 0.0105, 0.0011, frame)]
    front = slab("front", W - 0.0012, H - 0.0012, 0.0006, 0.0099, 0.00025, black)
    front.location.z = D / 2
    scr = slab("screen", W - 0.0038, H - 0.0038, 0.0002, 0.0086, 0, screen_mat("scr", os.path.join(HERE, "screens/phone-01.png")))
    scr.location.z = D / 2 + 0.0005  # por encima del vidrio negro: si se cruzan, su reflejo se cuela en la pantalla
    back = slab("back", W - 0.0012, H - 0.0012, 0.0006, 0.0099, 0.00025, back_glass)
    back.location.z = -D / 2
    parts += [front, scr, back]
    # módulo: cápsula vertical elevada con dos lentes y flash
    cap = slab("module", 0.0175, 0.040, 0.0016, 0.0086, 0.0005, back_glass)
    cap.location = (-W / 2 + 0.0145, H / 2 - 0.027, -D / 2 - 0.0009)
    parts.append(cap)
    for i, y in enumerate((0.0095, -0.0095)):
        rg = cyl(f"ring{i}", 0.0072, 0.0014, 64, ring, 0.0003)
        rg.location = (cap.location.x, cap.location.y + y, -D / 2 - 0.0021)
        ln = cyl(f"lens{i}", 0.0057, 0.0006, 64, lens)
        ln.location = (cap.location.x, cap.location.y + y, -D / 2 - 0.0026)
        parts += [rg, ln]
    fl = cyl("flash", 0.0019, 0.0004, 32, mat("flash", (0.9, 0.86, 0.7), 0, 0.2))
    fl.location = (cap.location.x + 0.0158, cap.location.y + 0.012, -D / 2 - 0.0002)
    parts.append(fl)
    for nm, side, y, ln in (("vol+", -1, 0.032, 0.016), ("vol-", -1, 0.012, 0.016), ("pwr", 1, 0.024, 0.024)):
        b = slab(nm, 0.0016, ln, 0.0028, 0.0007, 0.0003, frame, seg=6)
        b.location = (side * (W / 2 + 0.0003), y, 0)
        parts.append(b)
    rig = parent(parts)
    rig.rotation_euler = (math.radians(78), 0, math.radians(-24))
    rig.location.z = H / 2 * math.sin(math.radians(78)) + 0.004
    return rig, dict(az=-14, el=10, lens=85, fit=0.95)


def notebook():
    """Notebook propia: aluminio anodizado mate, teclado en pozo, trackpad, tapa abierta 112°."""
    W, Dp, T = 0.304, 0.214, 0.0085
    alu = mat("alu", (0.66, 0.67, 0.69), 1.0, 0.42, rough_var=0.06, bump=0.06, bump_scale=3000)
    key = mat("key", (0.035, 0.036, 0.04), 0.0, 0.55, rough_var=0.05)
    black = mat("bezel", (0.004, 0.004, 0.005), 0.0, 0.3, coat=1.0, coat_rough=0.02, rough_var=0.0)
    pad = mat("pad", (0.66, 0.67, 0.69), 0.9, 0.3, rough_var=0.02)
    base = slab("base", W, Dp, T, 0.009, 0.0016, alu)
    base.location.z = T / 2
    parts = [base]
    well = slab("well", 0.272, 0.108, 0.004, 0.004, 0.0004, alu)
    well.location = (0, 0.034, T + 0.0018)
    boolean(base, well)
    kw, pitch = 0.0158, 0.0188
    for r in range(6):
        cols = 14 if r else 15
        for c in range(cols):
            w = kw if r else kw * 0.62
            x0 = -(cols - 1) / 2 * pitch
            k = slab(f"k{r}_{c}", w, kw if r else kw * 0.55, 0.0016, 0.0014, 0.0004, key, seg=4)
            k.location = (x0 + c * pitch, 0.034 + 0.045 - r * pitch, T - 0.0006)
            parts.append(k)
    tp = slab("trackpad", 0.135, 0.084, 0.0004, 0.006, 0.0002, pad)
    tp.location = (0, -0.058, T + 0.0001)
    parts.append(tp)
    # tapa en coordenadas de la bisagra: cerrada se extiende hacia -Y con la pantalla mirando a -Z
    hinge = link(bpy.data.objects.new("hinge", None))
    hinge.location = (0, Dp / 2 - 0.004, T)
    L = Dp - 0.004
    lid = slab("lid", W, L, 0.006, 0.009, 0.0014, alu)
    lid.location = (0, -L / 2, 0.003)
    bez = slab("bez", W - 0.006, L - 0.006, 0.0004, 0.007, 0.0002, black)
    bez.location = (0, -L / 2, -0.0001)
    sh = (W - 0.022) / 1.6
    scr = slab("screen", W - 0.022, sh, 0.0002, 0.002, 0, screen_mat("scr", os.path.join(HERE, "screens/qt-landing-01.jpg"), crop=(1100 / 1.6) / 2828, flip=True))
    scr.location = (0, -L / 2 - 0.002, -0.0004)
    for o in (lid, bez, scr):
        o.parent = hinge
    hinge.rotation_euler.x = math.radians(-112)
    rig = parent(parts + [hinge])
    rig.rotation_euler.z = math.radians(-28)
    return rig, dict(az=-8, el=24, lens=70)


def paddle():
    """Paleta de pádel en lágrima: cara blanca mate con grano, agujeros en anillos biselados,
    puente en Y en la garganta y mango negro con overgrip encimado en espiral."""
    TH, C, RH = 0.038, (0.0, 0.335), 0.128
    t0 = math.radians(-25)
    out = [(C[0] + RH * math.cos(t0 + (math.pi - 2 * t0) * i / 120), C[1] + RH * math.sin(t0 + (math.pi - 2 * t0) * i / 120)) for i in range(121)]
    out += [(-0.024, 0.135), (0.024, 0.135)]

    def prism(bm, poly, z0=-TH, z1=TH):
        vs = [bm.verts.new((x, y, z0)) for x, y in poly]
        f = bm.faces.new(vs)
        e = bmesh.ops.extrude_face_region(bm, geom=[f])
        bmesh.ops.translate(bm, vec=(0, 0, z1 - z0), verts=[v for v in e["geom"] if isinstance(v, bmesh.types.BMVert)])

    bm = bmesh.new()
    prism(bm, out, -TH / 2, TH / 2)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    face = mat("face", (0.8, 0.8, 0.79), 0.0, 0.5, coat=0.4, coat_rough=0.3, rough_var=0.06, bump=0.12, bump_scale=2600)
    head = mesh_obj("head", bm, face)
    cut = bmesh.new()
    for r, n, ph in ((0.0, 0, 0), (0.03, 8, 0.5), (0.055, 12, 0), (0.08, 16, 0.5), (0.104, 22, 0)):
        for k in range(n):
            ang = (k + ph) / n * math.tau + math.pi / 2
            x, y = C[0] + r * math.cos(ang), C[1] + r * math.sin(ang)
            if y < 0.25:
                continue
            g = bmesh.ops.create_cone(cut, cap_ends=True, segments=32, radius1=0.0066, radius2=0.0066, depth=TH * 2)
            bmesh.ops.translate(cut, vec=(x, y, 0), verts=g["verts"])
    for sx in (-1, 1):  # puente en Y: dos triángulos y un rombo
        prism(cut, [(sx * x, y) for x, y in ((-0.064, 0.222), (-0.008, 0.222), (-0.02, 0.178))][:: sx])
    prism(cut, [(0, 0.181), (-0.014, 0.165), (0, 0.149), (0.014, 0.165)])
    bmesh.ops.recalc_face_normals(cut, faces=cut.faces)
    boolean(head, mesh_obj("holes", cut))
    bevel(head, 0.003, 5, 40)
    # mango: overgrip encimado = perfil diente de sierra que sigue una hélice
    L, R0, pitch, step = 0.125, 0.0172, 0.021, 0.0008
    bm = bmesh.new()
    rings, seg = 260, 72
    grid = []
    for j in range(rings + 1):
        y = j / rings * L
        row = []
        for i in range(seg):
            a_ = i / seg * math.tau
            u = (a_ / math.tau + y / pitch) % 1.0
            r = R0 + step * u - step * 3 * max(0.0, u - 0.94) / 0.06 * 0  # la caída del borde la hace el salto de u
            row.append(bm.verts.new((r * math.cos(a_), y, r * math.sin(a_))))
        grid.append(row)
    for j in range(rings):
        for i in range(seg):
            bm.faces.new((grid[j][i], grid[j][(i + 1) % seg], grid[j + 1][(i + 1) % seg], grid[j + 1][i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    tape = mat("overgrip", (0.03, 0.03, 0.033), 0.0, 0.62, rough_var=0.06, bump=0.25, bump_scale=3500)
    grip = mesh_obj("grip", bm, tape)
    grip.location.y = 0.135 - L
    butt = cyl("butt", 0.0215, 0.012, 64, tape, 0.003)
    butt.rotation_euler.x = math.pi / 2
    butt.location.y = 0.135 - L - 0.005
    rig = parent([head, grip, butt])
    rig.rotation_euler = (math.radians(86), math.radians(-6), math.radians(-20))
    rig.location.z = 0.005
    return rig, dict(az=-4, el=8, lens=70, fit=1.0)


def plate():
    """Disco bumper de 20 kg: goma negra mate, buje de acero, peso impreso en blanco a ambos lados."""
    prof = [
        (0.0252, -0.031), (0.0252, 0.031), (0.046, 0.031), (0.048, 0.029), (0.050, 0.029),
        (0.108, 0.029), (0.112, 0.027), (0.205, 0.027), (0.218, 0.024), (0.225, 0.016), (0.225, -0.016),
        (0.218, -0.024), (0.205, -0.027), (0.112, -0.027), (0.108, -0.029), (0.050, -0.029),
        (0.048, -0.029), (0.046, -0.031),
    ]
    bm = bmesh.new()
    vs = [bm.verts.new((r, 0, z)) for r, z in prof]
    es = [bm.edges.new((vs[i], vs[(i + 1) % len(vs)])) for i in range(len(vs))]
    bmesh.ops.spin(bm, geom=vs + es, cent=(0, 0, 0), axis=(0, 0, 1), angle=math.tau, steps=192, use_duplicate=False)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    rubber = mat("rubber", (0.01, 0.01, 0.011), 0.0, 0.55, rough_var=0.08, bump=0.18, bump_scale=2200, spec=0.18)
    disc = mesh_obj("disc", bm, rubber)
    bevel(disc, 0.0015, 3, 25)
    steel = mat("steel", (0.72, 0.72, 0.74), 1.0, 0.24, rough_var=0.05, bump=0.04, bump_scale=4000)
    hb = bmesh.new()  # buje: anillo de acero con labio, por revolución (sin booleans entre cilindros coaxiales)
    hp = [(0.0252, -0.0325), (0.0252, 0.0325), (0.044, 0.0325), (0.047, 0.031), (0.047, -0.031), (0.044, -0.0325)]
    hv = [hb.verts.new((r, 0, z)) for r, z in hp]
    he = [hb.edges.new((hv[i], hv[(i + 1) % len(hv)])) for i in range(len(hv))]
    bmesh.ops.spin(hb, geom=hv + he, cent=(0, 0, 0), axis=(0, 0, 1), angle=math.tau, steps=128, use_duplicate=False)
    bmesh.ops.remove_doubles(hb, verts=hb.verts, dist=1e-6)
    bmesh.ops.recalc_face_normals(hb, faces=hb.faces)
    hub = mesh_obj("hub", hb, steel)
    bevel(hub, 0.0008, 3, 25)
    ink = mat("ink", (0.92, 0.92, 0.9), 0.0, 0.55, rough_var=0.04)
    parts = [disc, hub]
    for side in (1, -1):  # cara de adelante y de atrás
        for sx, rot in ((-1, 0.0), (1, math.pi)):
            for s_, dy in (("20", 0.023), ("KG", -0.023)):
                t = text_mesh(f"t{s_}{sx}{side}", s_, 0.04, 0.00015, ink)
                t.rotation_euler = (0 if side > 0 else math.pi, 0, rot)
                x, y = sx * 0.16, dy if rot == 0 else -dy
                t.location = (x, y, side * 0.0291)
                parts.append(t)
    rig = parent(parts)
    rig.rotation_euler = (math.radians(90), 0, math.radians(-38))
    rig.location.z = 0.225
    return rig, dict(az=-4, el=8, lens=70, fit=0.92)


def golf():
    """Pelota de golf: 332 hoyuelos tallados en la geometría (KD-tree), laca con barniz."""
    r = 0.02135
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=7, radius=r)
    n = 332
    kd = kdtree.KDTree(n)
    for i in range(n):
        y = 1 - (i / (n - 1)) * 2
        rr, th = math.sqrt(1 - y * y), i * math.pi * (3 - math.sqrt(5))
        kd.insert(Vector((math.cos(th) * rr, y, math.sin(th) * rr)), i)
    kd.balance()
    R = 0.098
    for v in bm.verts:
        d = v.co.normalized()
        _, _, dist = kd.find(d)
        dent = 0.0145 * (1 - (dist / R) ** 2) if dist < R else 0.0
        v.co = d * r * (1 - dent)
    ob = mesh_obj("ball", bm, mat("ball", (0.74, 0.74, 0.73), 0.0, 0.35, coat=1.0, coat_rough=0.1, rough_var=0.05, bump=0.04, bump_scale=4000))
    ob.location.z = r
    return parent([ob]), dict(az=-10, el=16, lens=85, fit=1.15)


def dumbbell():
    """Mancuerna hexagonal: cabezas de goma, collarines cromados y barra moleteada."""
    rubber = mat("rubber", (0.045, 0.046, 0.05), 0.0, 0.72, rough_var=0.08, bump=0.15, bump_scale=1800)
    chrome = mat("chrome", (0.86, 0.86, 0.88), 1.0, 0.12, rough_var=0.03)
    satin = mat("satin", (0.7, 0.7, 0.72), 1.0, 0.32, rough_var=0.05, bump=0.05, bump_scale=3000)
    parts = []
    bar = cyl("bar", 0.0165, 0.132, 64, knurl_mat(), 0.001)
    bar.rotation_euler.y = math.pi / 2
    parts.append(bar)
    for s in (-1, 1):
        col = cyl(f"col{s}", 0.022, 0.012, 64, chrome, 0.0012)
        col.rotation_euler.y = math.pi / 2
        col.location.x = s * 0.072
        hx = cyl(f"head{s}", 0.066, 0.064, 6, rubber, 0.006)
        hx.rotation_mode = "ZYX"  # primero gira sobre su eje (cara plana abajo), después se acuesta
        hx.rotation_euler = (0, math.pi / 2, math.radians(30))
        hx.location.x = s * (0.078 + 0.032)
        cap = cyl(f"cap{s}", 0.03, 0.0016, 64, satin, 0.0004)
        cap.rotation_euler.y = math.pi / 2
        cap.location.x = s * (0.078 + 0.064 + 0.0006)
        num = text_mesh(f"n{s}", "10", 0.016, 0.0006, chrome, 0.00015)
        num.rotation_euler = (math.pi / 2, 0, s * math.pi / 2)
        num.location = (s * (0.078 + 0.064 + 0.0016), 0, 0)
        parts += [col, hx, cap, num]
    rig = parent(parts)
    rig.location.z = 0.066 * math.cos(math.radians(30))
    rig.rotation_euler.z = math.radians(-30)
    return rig, dict(az=-6, el=22, lens=70)


def anodized(name, color):
    return mat(name, color, 1.0, 0.26, rough_var=0.05, bump=0.05, bump_scale=3000)


def wordmark():
    """gom.ar del footer: aluminio satinado con el punto en rojo anodizado."""
    alu = mat("alu", (0.82, 0.82, 0.84), 1.0, 0.3, rough_var=0.05, bump=0.05, bump_scale=3000)
    t = text_mesh("wm", "gom.ar", 0.1, 0.014, alu, 0.002, extra=[anodized("anod_red", RED)], char_mat={3: 1})
    rig = parent([t])
    rig.rotation_euler = (math.radians(90 - 6), 0, math.radians(-8))
    return rig, dict(az=-2, el=4, lens=85, fit=1.0, floor=False, px=1600)


OBJECTS = dict(phone=phone, notebook=notebook, paddle=paddle, plate=plate, golf=golf, dumbbell=dumbbell, wordmark=wordmark)
# lado del render en px (2x del tamaño en pantalla): objetos chicos sobre el título, mockups grandes
PX = dict(paddle=480, plate=480, golf=480, dumbbell=480, phone=1600, notebook=1600, wordmark=(1600, 560))

GLYPHS = {"0": "0", "1": "1", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7", "8": "8", "9": "9", ",": "comma", ".": "dot", "s": "s"}


def glyphs(out, px_h, samples):
    """Número del hero en piezas: un PNG por carácter con la misma cámara ortográfica y la misma luz,
    así se arman uno al lado del otro en el DOM con cualquier valor del LCP. Escribe glyphs.json con los anchos."""
    import json
    sc = reset()
    sc.cycles.samples = samples
    sc.view_settings.view_transform, sc.view_settings.look = "Standard", "None"  # AgX corre el violeta de marca hacia el azul
    violet, red = anodized("anod_uv", UV), anodized("anod_red", RED)
    obs = {}
    for k, ch in enumerate(GLYPHS):
        unit = ch == "s"
        t = text_mesh("g_" + GLYPHS[ch], ch, 0.042 if unit else 0.1, 0.006 if unit else 0.012, red if unit else violet, 0.0009 if unit else 0.0018, align_y="BOTTOM_BASELINE")
        t.location.x = k * 0.3  # separados: cada uno se renderiza solo
        t.rotation_euler = (math.radians(90 - 8), 0, math.radians(-10))
        obs[ch] = t
    dg = bpy.context.evaluated_depsgraph_get()
    ext = {}
    for ch, t in obs.items():
        e = t.evaluated_get(dg)
        pts = [e.matrix_world @ Vector(c) for c in e.bound_box]
        ext[ch] = (min(p.x for p in pts), max(p.x for p in pts), min(p.z for p in pts), max(p.z for p in pts))
    z0, z1 = min(v[2] for v in ext.values()), max(v[3] for v in ext.values())
    pad = (z1 - z0) * 0.06
    H = z1 - z0 + 2 * pad
    cam_d = bpy.data.cameras.new("cam")
    cam_d.type, cam_d.sensor_fit, cam_d.ortho_scale = "ORTHO", "VERTICAL", H
    cam = link(bpy.data.objects.new("cam", cam_d))
    sc.camera = cam
    el, az = math.radians(4), math.radians(-2)
    look = Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)))  # de la letra hacia la cámara
    cam.rotation_euler = (-look).to_track_quat("-Z", "Y").to_euler()
    # luces colgadas de la cámara (coordenadas de cámara: -Z mira a la letra): viajan con ella de letra en letra
    for nm, off, size, pw, col in (("key", (-0.45, 0.55, 0.0), 0.12, 10, (1, 1, 1)), ("fill", (0.5, 0.1, 0.1), 0.2, 2.5, (1, 1, 1)), ("rim", (0.5, 0.35, -0.75), 0.06, 8, (0.92, 0.95, 1.0))):
        l = area(nm, (0, 0, 0), Vector((0, 0, -1)), size, pw, col)
        l.parent = cam
        l.location = Vector(off)
        l.rotation_euler = (Vector((0, 0, -0.4)) - l.location).to_track_quat("-Z", "Y").to_euler()
    os.makedirs(out, exist_ok=True)
    meta = {"h": px_h, "w": {}}
    for ch, t in obs.items():
        for o in obs.values():
            o.hide_render = o is not t
        x0, x1 = ext[ch][0] - pad, ext[ch][1] + pad
        w_px = round(px_h * (x1 - x0) / H)
        sc.render.resolution_x, sc.render.resolution_y = w_px, px_h
        cam.location = Vector(((x0 + x1) / 2, 0, (z0 + z1) / 2)) + look * 0.4
        sc.render.filepath = os.path.join(out, GLYPHS[ch] + ".png")
        bpy.ops.render.render(write_still=True)
        meta["w"][GLYPHS[ch]] = w_px
    json.dump(meta, open(os.path.join(out, "glyphs.json"), "w"))
    print("OK glyphs", meta)


# ---------- luz, cámara, render ----------
def bounds():
    dg = bpy.context.evaluated_depsgraph_get()
    pts = []
    for ob in bpy.context.scene.objects:
        if ob.type in ("MESH", "CURVE") and not ob.hide_render:
            e = ob.evaluated_get(dg)
            pts += [e.matrix_world @ Vector(c) for c in e.bound_box]
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    return lo, hi


def area(name, loc, target, size, power, color=(1, 1, 1)):
    l = bpy.data.lights.new(name, "AREA")
    l.shape = "DISK"  # reflejo redondo de softbox
    l.size, l.energy, l.color = size, power, color
    ob = link(bpy.data.objects.new(name, l))
    ob.location = loc
    ob.rotation_euler = (target - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    return ob


def stage(cam_opts, box=None):
    lo, hi = box or bounds()
    c = (lo + hi) / 2
    rad = (hi - lo).length / 2
    # estudio: key cálida arriba a la izquierda, fill amplio al frente, rim fría atrás a la derecha
    k = rad * 4
    area("key", c + Vector((-1.1, -1.0, 1.4)) * k, c, rad * 3, 140 * k * k)
    area("fill", c + Vector((1.2, -1.6, 0.3)) * k, c, rad * 5, 25 * k * k)
    area("rim", c + Vector((1.3, 1.4, 0.9)) * k, c, rad * 1.5, 180 * k * k, (0.92, 0.95, 1.0))
    if cam_opts.get("floor", True):
        bm = bmesh.new()
        bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=rad * 20)
        floor = mesh_obj("floor", bm)
        floor.location.z = lo.z - 0.00005
        floor.is_shadow_catcher = True
    cam_d = bpy.data.cameras.new("cam")
    cam_d.lens = cam_opts.get("lens", 70)
    cam = link(bpy.data.objects.new("cam", cam_d))
    bpy.context.scene.camera = cam
    az, el = math.radians(cam_opts.get("az", 0)), math.radians(cam_opts.get("el", 10))
    fov = 2 * math.atan(18 / cam_d.lens)
    dist = rad / math.sin(fov / 2) * cam_opts.get("fit", 0.82)
    cam.location = c + Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el))) * dist
    cam.rotation_euler = (c - cam.location).to_track_quat("-Z", "Y").to_euler()
    return c, rad


def main():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default=",".join([*OBJECTS, "glyphs"]))
    ap.add_argument("--res", type=int, default=0, help="lado en px; 0 = el de PX")
    ap.add_argument("--samples", type=int, default=128)
    ap.add_argument("--seq", type=int, default=0, help="cuadros del giro de -15° a +15° (impar: el del medio es el still)")
    ap.add_argument("--mid", action="store_true", help="con --seq: solo el cuadro del medio, como still.png (para el still a más resolución)")
    ap.add_argument("--out", default=os.path.join(HERE, "preview"))
    ap.add_argument("--blend", action="store_true", help="guarda el .blend de cada objeto en design/3d/blend")
    a = ap.parse_args(argv)
    a.out = os.path.abspath(a.out)  # Blender resuelve las rutas relativas de render contra la raíz del disco
    os.makedirs(a.out, exist_ok=True)
    for name in a.only.split(","):
        if name == "glyphs":
            glyphs(os.path.join(a.out, "glyphs"), a.res or 520, a.samples)
            continue
        sc = reset()
        sc.cycles.samples = a.samples
        rig, cam = OBJECTS[name]()
        px = a.res or PX[name]
        sc.render.resolution_x, sc.render.resolution_y = px if isinstance(px, tuple) else (px, px)
        base = rig.rotation_euler.z
        box = None
        if a.seq:  # encuadre que contiene los dos extremos del giro
            los, his = [], []
            for deg in (-15, 0, 15):
                rig.rotation_euler.z = base + math.radians(deg)
                lo, hi = bounds()
                los.append(lo)
                his.append(hi)
            box = (Vector([min(v[i] for v in los) for i in range(3)]), Vector([max(v[i] for v in his) for i in range(3)]))
            rig.rotation_euler.z = base
        stage(cam, box)
        if a.blend:
            os.makedirs(os.path.join(HERE, "blend"), exist_ok=True)
            bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, "blend", name + ".blend"))
        if not a.seq:
            sc.render.filepath = os.path.join(a.out, name + ".png")
            bpy.ops.render.render(write_still=True)
        else:
            for i in [(a.seq - 1) // 2] if a.mid else range(a.seq):
                rig.rotation_euler.z = base + math.radians(-15 + 30 * i / (a.seq - 1))
                sc.render.filepath = os.path.join(a.out, name, "still.png" if a.mid else f"f{i:02}.png")
                bpy.ops.render.render(write_still=True)
        print("OK", name)


if __name__ == "__main__":
    main()
