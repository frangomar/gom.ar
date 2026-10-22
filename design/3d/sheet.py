# Compone los PNG transparentes sobre #070708 en una hoja de contacto (para revisar los renders).
# Uso: blender -b -P design/3d/sheet.py -- design/3d/preview out.png [columnas]
import bpy, sys, os, numpy as np

argv = sys.argv[sys.argv.index("--") + 1 :]
src, out = os.path.abspath(argv[0]), os.path.abspath(argv[1])
cols = int(argv[2]) if len(argv) > 2 else 3
files = sorted(f for f in os.listdir(src) if f.endswith(".png") and not f.startswith("_"))
bg = np.array([7, 7, 8], float) / 255
tiles = []
for f in files:
    im = bpy.data.images.load(os.path.join(src, f))
    w, h = im.size
    px = np.array(im.pixels[:]).reshape(h, w, 4)  # ya en sRGB (PNG 8 bits sin gestión de color)
    tiles.append(px[..., :3] * px[..., 3:] + bg * (1 - px[..., 3:]))
h, w = max(t.shape[0] for t in tiles), max(t.shape[1] for t in tiles)
rows = -(-len(tiles) // cols)
sheet = np.tile(bg, (rows * h, cols * w, 1))
for i, t in enumerate(tiles):
    r, c = divmod(i, cols)
    y0 = (rows - 1 - r) * h  # las filas de pixels de Blender van de abajo hacia arriba
    sheet[y0 : y0 + t.shape[0], c * w : c * w + t.shape[1]] = t
img = bpy.data.images.new("sheet", cols * w, rows * h)
img.pixels[:] = np.concatenate([sheet, np.ones(sheet.shape[:2] + (1,))], 2).ravel()
img.filepath_raw, img.file_format = out, "PNG"
img.save()
print("sheet", out, files)
