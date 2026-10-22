# gom.ar · Rediseño completo · Brief para Claude Code

> **Para Francisco, cómo usar este archivo**
> 1. Guardalo en el repo como `docs/rediseno-gomar.md`.
> 2. Si ya existe un `CLAUDE.md` (por ejemplo, con la investigación), agregale esta línea: `@docs/rediseno-gomar.md`. Si no existe, crealo solo con esa línea. Así Claude Code carga este brief automáticamente en cada sesión.
> 3. Abrí una sesión nueva por bloque y escribí: **"Ejecutá el Bloque N de docs/rediseno-gomar.md"**.
> 4. Los bloques 0 y 2 terminan con un punto de control: revisá el resultado y aprobá antes de seguir.

---

## Decisiones vigentes de Francisco (reemplazan partes de este brief)

Actualizado el 2026-10-22, al cerrar el Bloque 2. **Donde este brief y esta lista no coinciden, gana esta lista**: son decisiones de Francisco. El detalle y los motivos están en `docs/PROGRESO.md` (Bloque 2).

**Parte B (dirección de diseño): reemplazada**
- Identidad propia negro + neón láser, en colores planos y **sin gradientes**:
  - negro `#070708`; superficies `#0e0e11` y `#18181c`; texto `#ededf0`; secundario `#a6a6b0`;
  - violeta UV `#7a5cff` como color principal;
  - rojo láser `#ff2b4e` solo para el CTA de WhatsApp y detalles.
- El clima de referencia es el techno oscuro (Argy, Fred again..).
- Queda sin efecto la paleta del brief: fondo papel, hero azul `#2440FF` a sangre, Link y Visitado.
- Las marcas de clientes van solo como guiño: su logo y los puntos de su dominio en su color. Nunca se pintan secciones con los colores de una marca. Fiter nunca va en negro sobre amarillo.
- **Hero vigente, "cronómetro":** el tiempo de carga real (LCP) en 3D, el H1, el CTA de WhatsApp y una franja de marcas con el rodillo por letra. El rodillo es lo único que sobrevivió del concepto "barra de direcciones".
- **Imágenes:**
  - nada de capturas crudas de sitios;
  - cada caso lleva una foto de marca bajada del sitio del cliente (de Megatlon, solo fotos de sedes Black+ y Black);
  - la app y Quicktrade muestran sus diseños en mockups 3D (iPhone y MacBook);
  - redes muestra un muro de piezas.
- Los casos son un mazo de cards apiladas. El resto de las secciones se disuelven sin cortes.
- El 3D se hace con estética de render: gelatina translúcida (cáscara brillante y un núcleo que brilla) con luz de estudio clara. Nada de negros brillosos con una capa roja.
- Siguen prohibidos: glass, pills y eyebrows; glows decorativos; el concepto "archivo"; los layouts editoriales; el cursor custom; los preloaders; Lenis y el scroll-jacking.

**Parte C (movimiento): reemplazada en parte**
- Todos los bloques llevan animación, no solo el hero. Se usa scroll nativo, CSS scroll-driven animations y JS liviano. Siguen sin entrar librerías de smooth scroll.
- **3D con three.js permitido** (el brief no permitía WebGL en el hero), con estas condiciones:
  - va en un chunk aparte que carga después de `load`;
  - un solo contexto WebGL para toda la página;
  - fallback estático.
- Los botones tienen mucha respuesta: imán, relleno desde el cursor, rodillo de letras y rebote. También van personalizados el scrollbar, la selección de texto y el select.
- Los presupuestos de performance siguen siendo el objetivo, pero **no se midieron con el diseño nuevo**: medirlos es lo primero del Bloque 3.

**Parte D (estructura y contacto)**
- Sin precios en el sitio: no hay "desde USD".
- El formulario no tiene rango de presupuesto.
- El caso de redes no lleva la nota "el feed incluye trabajo de otras personas".
- Quicktrade entra en el ciclo del hero.
- El email de contacto es `info@gom.ar`.

**Proceso**
- Antes de implementar algo visual, primero se muestra un preview (imágenes o video).
- Ramas: Francisco puede pedir el merge directo a `main`, como hizo en el Bloque 2. Sin ese pedido explícito, sigue la regla de no mergear a `main` antes del Bloque 7.

---

## Instrucciones de trabajo para Claude Code

- **Fuentes, en orden de autoridad:**
  1. este archivo
  2. la investigación que ya hiciste para este proyecto (buscala en el repo, en `/docs` o en `CLAUDE.md`; si no la encontrás, frená y preguntá dónde está)
  3. el código actual
- Si la investigación contradice este brief, gana el brief. Anotá la contradicción y tu argumento en `docs/PROGRESO.md` para decidirla.
- **Memoria entre sesiones:** las sesiones no comparten memoria, así que `docs/PROGRESO.md` es el registro.
  - Al **empezar** cada bloque, leelo.
  - Al **terminar** cada bloque, actualizalo con: bloque, estado, decisiones tomadas (una línea cada una con el porqué), métricas medidas (números reales), pendientes y qué necesita el bloque siguiente.
- **Ramas:**
  - Creá la rama de integración `redesign` desde `main` (solo en el Bloque 0).
  - Cada bloque trabaja en `redesign/bN-nombre` y abre un PR contra `redesign`, con preview de Vercel.
  - Nunca mergees a `main`. Eso pasa en el Bloque 7, con aprobación de Francisco.
- **Commits:** descriptivos (conventional commits), uno por unidad lógica.
- **Preguntas:** si falta un dato clave, preguntá antes de producir (máximo 3, las de mayor impacto). Si el dato es menor, asumí algo razonable y anotalo en PROGRESO.md.
- **Honestidad:** si no pudiste verificar o medir algo, decilo explícitamente. Nunca des por hecha una revisión visual o una medición que no hiciste.

### Qué podés cambiar y qué no

**Libertad total** (decidí vos y justificá en una línea):
- arquitectura, carpetas, dependencias y modelo de contenido
- componentes y jerarquía interna de cada sección
- copy en todos los idiomas, dentro de las reglas de la Parte E
- todo lo del sitio actual: se puede borrar, nada es sagrado

**Requiere argumento y aprobación de Francisco:**
- cambiar la dirección de diseño de la Parte B (concepto, paleta, tipografía, concepto del hero)
- agregar o quitar secciones de la home
- sumar un momento de movimiento que no esté en el presupuesto de la Parte C

**No negociable:**
- **No inventar datos.** Nada de métricas, resultados, testimonios, clientes, cifras ni precios inventados. Si falta un dato, va un placeholder visible entre corchetes: [COMPLETAR PRECIO], [TESTIMONIO REAL], [VERIFICAR CIFRA SEDES MEGATLON], [FOTO FRANCISCO], [CONFIRMAR ROL].
- **No atribuir trabajo ajeno.** En cada caso se separa qué hizo Francisco y qué hizo el equipo.
- **Los presupuestos de performance de la Parte C son un requisito, no una aspiración.** Si una animación no entra en el presupuesto, se simplifica o se saca.

---

## Parte A · Contexto

### Objetivo
El sitio tiene un solo objetivo medible: **generar consultas calificadas de clientes de ticket alto**, en Argentina y en el exterior. Todo se evalúa contra eso.

El sitio también es el caso de estudio principal. Tiene que demostrar por sí mismo que Francisco diseña y construye sitios rápidos, memorables y que convierten. Tiene que impactar al entrar y cargar al instante. Si algo se ve como plantilla, está mal aunque sea "lindo".

**Prioridades, cuando entren en conflicto:**
1. Conversión a leads de ticket alto
2. Performance y accesibilidad
3. Claridad del mensaje
4. Impacto visual y memorabilidad
5. Novedad técnica

El impacto es obligatorio. Se logra **dentro** de los presupuestos de performance, no a costa de ellos.

### Quién es
- Francisco Gomar. Senior Graphic Designer · UI/UX · Web Design & Development.
- Más de 5 años de experiencia. San Isidro, Buenos Aires.
- Español nativo, inglés C2.
- **Formación:**
  - Licenciatura en Diseño y Comunicación Visual (UCES)
  - Full Stack Web Development (Digital House)
  - UX/UI Design (Interaction Design Foundation)
- **Contacto:**
  - WhatsApp: +54 9 11 3067 2095 (`https://wa.me/5491130672095`)
  - Email: frangomar8@gmail.com
  - LinkedIn: linkedin.com/in/frangomar99
  - Behance: behance.net/franciscogomar (complementario, nunca destino principal, nunca embebido)

### Posicionamiento
- Diseño digital, diseño web y UX/UI, de punta a punta: diseño, desarrollo y lanzamiento.
- **Diferencial:** integra IA generativa (Claude, Higgsfield, generación de imagen y video) en flujos reales de producción. Eso le da más velocidad sin bajar la calidad.
  - Se comunica como ventaja concreta para el cliente (plazos, iteraciones, alcance), nunca como buzzword.
- **Rango de plataformas:** elige la plataforma según el cliente (WordPress, HubSpot CMS, Tienda Nube o Next.js con código propio). Ese rango es parte del argumento de venta.
- **Alcance visual:** además de web y producto, diseña las redes y las campañas de una marca grande (Megatlon). Eso amplía el pitch: puede sostener la identidad de una marca en todos sus canales, no solo en el sitio.

### Experiencia actual: Senior UX/UI Graphic Designer, Grupo Megatlon (desde febrero de 2025)
Megatlon es una cadena de gimnasios high-end de Argentina. [VERIFICAR CIFRAS DE SEDES Y SOCIOS antes de publicarlas]

- Lideró el rediseño de la app de Megatlon con los equipos de producto y desarrollo, incluido el handoff.
- Integró planes de entrenamiento generados con IA en la app, junto con Amalgama.
- Diseñó y desarrolló en Next.js el sitio de La Estación Fútbol - Padel, una marca nueva del grupo.
- Construyó el sitio de Fiter Uruguay desde cero. Fiter es la marca low-cost del grupo.
- Diseñó y construyó el sitio de Driving Norte.
- Gestiona el sitio de Megatlon y construyó Megatlon Shop.
- **Diseña las redes sociales de Megatlon.** [CONFIRMAR ALCANCE: qué formatos (posts, stories, reels, carruseles), desde cuándo y qué piezas son 100 % suyas vs. del equipo o de una agencia]
- Lidera la automatización con IA de la producción de diseño y marketing.
- Dirección creativa de campañas integradas (HotMega, BlackMega, CyberMega, Mundial) en web, email, redes y señalética.

### Experiencia anterior
- **SBS Trading / Quicktrade** (fintech): UI de la app mobile y landings responsive de productos financieros.
- **Freelance para Terrazas del Gutiérrez – Meliá Collection** (real estate de lujo): contenido para redes.
- **Freelance para Shantala:** identidad de marca, packaging y stand para Expo Rural.

### Clientes objetivo
- Startups, pymes, agencias y marcas personales, en Argentina y en el exterior.
- Se prioriza el ticket alto por sobre el volumen.

### Permisos y material
- Permiso confirmado para mostrar el trabajo de Grupo Megatlon.
- Capturas en todos los casos y Figmas en algunos.
- No hay testimonios ni métricas todavía.

### Estado actual de gom.ar
- Repositorio en GitHub, deploy en Vercel, Next.js con Pages Router.
- No está indexado en Google.
- **Problemas a eliminar:**
  - Arial y estética de fondo negro con verde ácido (#92ff6b)
  - proyectos en iframes de Behance, con un error visible ("{title}")
  - cursor custom que queda fijo en pantallas táctiles
  - `lang="en"` en contenido en español
  - dos H1
  - animaciones de aparición en todas las secciones

---

## Parte B · Dirección de diseño

### Concepto: el dominio como titular
- La marca de Francisco es un dominio (gom.ar) y lo que vende son sitios online.
- Cada caso se titula con su **dominio real** en tipografía grande, con los puntos y las barras en un tono secundario.
- Cada título lleva a dos lugares: el caso de estudio y el sitio en vivo, como prueba verificable.
- Nombres especiales:
  - la app se titula "App Megatlon · iOS y Android" (el "·" solo en ese nombre, no como recurso de diseño)
  - el caso de redes se titula con la URL del perfil: `instagram.com/megatlon` [VERIFICAR HANDLE EXACTO]

### Color: la lógica del hipervínculo, con contraste fuerte

| Token | Hex | Uso |
|---|---|---|
| Papel | `#F3F4F2` | fondo general (frío, no crema) |
| Tinta | `#1A1C20` | texto; fondo de la sección de contacto y el footer |
| Link | `#2440FF` | CTA, links y **fondo completo del hero** |
| Visitado | `#6B2FD6` | casos ya vistos, con `:visited` real del navegador (solo color, como exige la spec) |
| Gris | `#6E737A` | solo texto grande: puntos y barras de los dominios |
| Gris texto | `#676C73` | texto secundario chico |
| Línea | `#D5D8DC` | divisores |

**Ritmo de contraste:** hero azul a sangre con texto papel → cuerpo papel con tinta → contacto y footer en tinta con texto papel. El sitio entero se lee como un hipervínculo: entrás por un link "seleccionado" y salís por la tinta.

**Contrastes calculados de antemano (verificalos con una herramienta antes de cerrar):**
- Papel sobre Link ≈ 5,8:1. Pasa AA.
- Link sobre Papel ≈ 5,9:1. Pasa AA.
- Visitado sobre Papel ≈ 6,3:1. Pasa AA.
- Tinta sobre Link ≈ 2,7:1. **No usar.**
- `#6E737A` sobre Papel ≈ 4,3:1. **No alcanza AA para texto chico.** Va solo en texto grande; para secundario chico, `#676C73` (≈ 4,8:1).
- Revisá cada combinación real del hero: el estado visitado sobre azul probablemente no tenga contraste suficiente, así que resolvé ahí el estado visitado con otro recurso que no dependa solo del color.

### Tipografía
- **Una sola familia:** Schibsted Grotesk variable, vía `next/font/google`, con subsets latin y latin-ext. Se usa para titulares y texto.
- **La tipografía es el material principal del impacto:**
  - contraste de escala extremo entre el dominio gigante del hero y el texto corrido
  - contraste de peso (variable de 400 a 900)
- Escala clara, líneas de menos de 80 caracteres.
- No animes `font-variation-settings` en textos grandes (provoca relayout). Se permite solo en elementos chicos, como respuesta a hover o foco.
- **Para /zh:** Noto Sans SC con subset, cargada solo en esa ruta. Verificalo en la pestaña Network: no puede descargarse en /es.

### Layout
- Todo alineado a la izquierda, sobre una grilla asimétrica.
- **Desktop** (`@media (hover: hover) and (pointer: fine)`): la captura del caso aparece al pasar el mouse por su fila **y también con foco de teclado**.
- **Mobile:** miniatura arriba del dominio. La fila más cercana al centro del viewport se activa con una scroll-driven animation; es el equivalente táctil del hover.

### Prohibido, porque delata plantilla o IA
- fondo negro con un único acento neón
- crema + serif + terracota
- tarjetas redondeadas idénticas con sombra gris
- etiquetas en mayúsculas espaciadas sobre títulos
- numeración 01/02/03 en contenido que no es una secuencia
- fade-up al scrollear
- una palabra destacada en color en cada titular
- monoespaciada para etiquetas
- Arial, Inter o Geist
- cursor custom
- "→" pegado al texto de cada link
- marquees infinitos de logos o de palabras
- **preloaders, pantallas de intro o splash screens**
- **scroll-jacking y librerías de smooth scroll** (Lenis y similares): empeoran el INP, rompen la accesibilidad y se sienten lentos

### Antes de cada pieza visual nueva
1. Escribí un plan breve: tokens usados, tipografía y escala, layout en ASCII (375 y 1440) y principios.
2. Revisalo contra este brief. Si se parece a lo que harías para cualquier otro portfolio, cambialo y anotá por qué en PROGRESO.md.

---

## Parte C · Movimiento e impacto sin sacrificar velocidad

Francisco quiere un sitio con movimiento, contraste y un hero que haga que la gente quiera quedarse a mirar. Y también quiere que sea rapidísimo. Las dos cosas conviven con estas reglas.

### Principio 1: el contenido nunca espera a la animación
- El H1, el primer dominio y la primera captura del hero están en el HTML estático y **visibles desde el primer frame**, con opacidad 1.
- Ningún texto arranca en `opacity: 0` esperando JS. Chrome no cuenta como candidato a LCP un elemento invisible, así que una entrada animada del H1 empeora el LCP.
- La animación es mejora progresiva: arranca después del primer paint (`requestAnimationFrame` doble o `requestIdleCallback`) y se suma a una página que ya funciona.
- Sin JS, el hero se ve completo y correcto.

### Principio 2: solo propiedades del compositor
- Se anima solo `transform` y `opacity`, con `will-change` puntual y temporal.
- Las máscaras se resuelven con `overflow: hidden` + transform del contenido o de un overlay, no animando `clip-path` en elementos grandes (salvo que midas que no genera paint en cada frame).
- Nada de animar `width`, `height`, `top`, `left`, `filter: blur` en elementos grandes ni `box-shadow`.

### Principio 3: cero librerías de animación en el bundle inicial
- Herramientas, en este orden: CSS animations y transitions, Web Animations API, CSS scroll-driven animations (`animation-timeline: view()` / `scroll()`) y View Transitions.
- Las scroll-driven animations se usan dentro de `@supports (animation-timeline: view())`. Sin soporte, el resultado queda estático y correcto. Verificá el soporte actual por navegador; no lo asumas.
- **Si necesitás una librería,** se carga lazy (después de LCP o en interacción), nunca para el hero, y se justifica con el costo medido en KB y ms.
- **Sin WebGL ni canvas en el hero**, salvo que lo propongas con mediciones que respeten el presupuesto y con fallback estático.

### Principio 4: el movimiento responde a la persona
Lo que retiene es el movimiento que reacciona al cursor, al scroll y al toque, no la decoración que corre sola.

| Movimiento | Lugar | Cuándo |
|---|---|---|
| Autónomo | solo en el hero | siempre (con pausa) |
| Ligado al scroll | lista de casos y paso del hero a la lista | al scrollear |
| Respuesta a una acción | CTA, links, formulario, selector de idioma, transición a la página de caso | al interactuar |

### Principio 5: navegar es instantáneo
- SSG + CDN de Vercel + prefetch de `next/link`: las páginas de caso se abren sin espera.
- Sin spinners para contenido estático.
- La única "espera" visible del sitio es el envío del formulario, y tiene feedback inmediato.

### Presupuesto de movimiento (no se suman momentos sin aprobación)
1. **Hero (recurso de firma):** ver "Concepto del hero".
2. **Lista de casos:**
   - Desktop: la captura sigue el cursor con inercia (lerp en rAF, solo transform) y entra con un reveal de máscara de 300 a 400 ms.
   - Mobile: activación por scroll de la fila central.
3. **Del hero a la lista (opcional, con feature detection):** al scrollear, el dominio activo del hero se achica y se acomoda como la primera fila de la lista. Es un match cut ligado al scroll. Si no entra en el presupuesto o complica la accesibilidad, se descarta.
4. **Caso → página del caso:** la captura se expande y se convierte en el hero de la página.
   - Se resuelve con View Transitions. Investigá cómo lo soporta la versión estable actual de Next.js y React (`experimental.viewTransition`, `<ViewTransition>` o `document.startViewTransition`) y elegí la vía más robusta.
   - Sin soporte, navegación normal.
5. **Micro-interacciones:** subrayado de links, estados de CTA, estados del formulario y cambio de idioma, de 150 a 300 ms, solo como respuesta a una acción.
6. **Loops de redes en el caso de Megatlon:** video corto, muted, liviano y con poster. Se reproduce solo cuando está visible y se pausa fuera de pantalla.

### Concepto del hero (recomendado): "la barra de direcciones"
El hero es la prueba: muestra sitios reales funcionando, no una frase sobre hacer sitios.

- **Fondo:** `#2440FF` a sangre, con altura máxima de 100svh (sin heros más altos que la pantalla).
- **H1:** estático, en papel, visible desde el primer frame. Es el elemento LCP.
  - Fórmula: qué hace + para quién + qué resultado obtiene.
  - Las variantes de copy se escriben en el Bloque 2.
- **Dominio cinético:** debajo del H1, una línea gigante muestra el dominio de un caso real. Cada 2,5 a 3 s cambia al siguiente con un rodillo por carácter:
  - cada letra sube dentro de una máscara, con stagger de 20 a 30 ms
  - los puntos y las barras en papel atenuado
  - cada dominio es un link real a su caso
- **La captura viva:** junto al dominio, la captura de ese sitio entra con un wipe de máscara y hace un scroll interno lento (translateY), como si alguien lo estuviera navegando.
  - Desktop: el cursor la desplaza levemente (parallax de ±12 px con inercia), solo con puntero fino.
- **Mobile:** la misma secuencia, con la captura arriba en tamaño reducido y sin parallax.
- **Ciclo:** solo sitios web y la app. Las redes no entran en el hero, para no diluir el posicionamiento web; tienen su propio caso.
- **Control:** botón visible de pausa y reproducción. Lo exige WCAG 2.2.2 para todo movimiento automático que dure más de 5 s.
- **Ahorro:** se pausa cuando el hero sale del viewport (IntersectionObserver) o cuando la pestaña está oculta (`visibilitychange`).
- **prefers-reduced-motion:** se muestra un dominio fijo con su captura y un control para pasar al siguiente. La composición sigue siendo fuerte; solo deja de moverse sola.
- **Carga:**
  - primera captura en AVIF con `priority`
  - el resto se carga después de `load`, con `fetchpriority="low"`
  - el JS propio del hero no supera los 6 KB gzip

**Alternativa a bocetar en el Bloque 2: "tipografía-pantalla".** "gom.ar" gigante funciona como máscara y las capturas de los casos pasan por dentro de las letras.
- Riesgo: legibilidad y que se lea como efecto conocido.
- Se boceta solo para comparar. La decisión final es de Francisco.

### Presupuestos de performance (se miden en cada bloque, con números reales)

| Métrica | Objetivo |
|---|---|
| LCP, mobile 4G media (Lighthouse mobile) | < 1,8 s (máximo absoluto 2,5 s) |
| CLS | < 0,05 |
| INP | < 200 ms |
| TBT | < 150 ms |
| Lighthouse | ≥ 95 en las cuatro categorías |
| JS propio de cliente en la home, sin contar el runtime de Next y React | ≤ 35 KB gzip |
| Peso total de la home en la primera carga (HTML, CSS, JS, fuentes y la imagen del hero) | ≤ 500 KB en mobile |
| Imágenes del hero cargadas antes de `load`, en mobile | ≤ 150 KB |
| Tareas largas en los primeros 5 s (CPU 4x throttle) | ninguna > 50 ms |
| Animaciones del hero en DevTools con CPU 4x | 60 fps sostenidos, sin frames con paint completo |

Si algo no entra en el presupuesto, primero se simplifica la animación, después se reduce el asset y, por último, se saca el efecto. **El presupuesto nunca se sube.**

---

## Parte D · Estructura

### Home
1. **Hero:** concepto "la barra de direcciones" + CTA principal (WhatsApp) + CTA secundario (ver casos).
2. **Lista de casos por dominio.**
3. **Servicios:** 3, cada uno con alcance y "desde USD [COMPLETAR]".
4. **Cómo trabaja con IA:** qué acelera la IA (plazos, iteraciones, alcance) y qué controla Francisco.
5. **Sobre mí:** [FOTO FRANCISCO] y 3 líneas. Una de las líneas cubre el alcance completo: web, producto y las redes de una marca grande.
6. **Contacto:** en tinta.

### Página de caso
- Hero con la captura grande (es la imagen LCP: `priority`).
- Dominio + botón "Ver online".
- Cliente, rol, stack y año.
- Problema, decisiones clave, uso de IA y resultado, con visuales intercalados.
- Siguiente caso.
- CTA de contacto.
- Escaneable en 30 segundos, con profundidad para quien lo lea entero.

### Casos, en este orden
1. **App Megatlon · iOS y Android:** rediseño UX/UI + planes de entrenamiento con IA, junto con Amalgama. Si hay links a las tiendas, se usan como prueba.
2. **laestacionfutbolpadel.com.ar** (Next.js): marca nueva, diseño y desarrollo con código propio. Es el caso principal de desarrollo web.
3. **fiter.com/UY** (HubSpot CMS): construido desde cero.
4. **drivingnorte.com.ar** (WordPress + Elementor): diseño y desarrollo.
5. **megatlon.com + Megatlon Shop** (WordPress): gestión, diseño responsive y tienda.
6. **instagram.com/megatlon** (redes + campañas integradas):
   - diseño de piezas para redes [CONFIRMAR FORMATOS Y ALCANCE]
   - dirección creativa de HotMega, BlackMega, CyberMega y Mundial en web, email, redes y señalética
   - Va después de los casos web para no diluir el posicionamiento: es la prueba de que sostiene una marca en todos sus canales.
   - **Visuales:** grilla de piezas reales exportadas (imágenes AVIF y loops livianos), agrupadas por campaña.
   - **Nada de embeds de Instagram:** cargan cientos de KB de JS de terceros y rastreo.
   - **"Ver en Instagram" como prueba en vivo,** con una nota de rol precisa: el feed incluye trabajo de otras personas y cambia con el tiempo, así que el caso dice exactamente qué piezas son de Francisco.
7. **Landings de Quicktrade:** solo capturas y Figmas, sin link en vivo. El sitio actual ya no refleja su trabajo.

**Trabajo secundario** (Shantala, Terrazas del Gutiérrez – Meliá Collection): bloque compacto, sin página propia, salvo que lo justifiques.

### Verificación de sitios de clientes, antes de mostrar "Ver online"
Antes de linkear un sitio, verificá su estado actual con fetch o curl:
- **La Estación:** revisá robots.txt, app/robots.ts y metadata.robots. Hoy bloquea el acceso automático y puede estar bloqueando a Google.
- **Fiter UY:** error "Entrenameinto" en el footer.
- **Driving Norte:** tiene noindex, nofollow. Además, el horario del lunes figura como 11:45 en un lugar y 12:00 en otro.

Estos sitios no se arreglan desde este repo. Cada caso lleva un flag `liveVerified`. Si un problema sigue, el flag queda en `false`, el link en vivo no se renderiza y el pendiente se anota en PROGRESO.md.

### Contacto (baja fricción, filtra ticket)
- **WhatsApp:** con mensaje precargado por idioma.
- **Email.**
- **Formulario corto:**
  - campos: nombre, email, tipo de proyecto (select), rango de presupuesto (select con [COMPLETAR RANGOS]) y mensaje corto
  - Server Action + validación con zod + honeypot
  - envío con Resend (`RESEND_API_KEY`); si no está configurada, fallback claro a mailto
  - estados de éxito y error accesibles, con `aria-live`
- **Texto visible:** "Respondo en menos de 24 h".
- **LinkedIn y Behance:** solo como links secundarios.

---

## Parte E · Copy

- Escribí sobre los problemas y resultados del cliente, no sobre adjetivos de Francisco.
- **Clichés prohibidos sin prueba:** "apasionado", "dejar huella", "centrado en las personas", "pienso lateral", "soluciones innovadoras".
- **Fórmula del titular:** qué hace + para quién + qué resultado obtiene.
- **Los CTA dicen exactamente qué pasa al tocarlos:** "Escribime por WhatsApp", no "Hablemos".
- **Idiomas:**
  - español rioplatense con voseo
  - inglés adaptado, no traducido literal
  - pt-BR adaptado al mercado brasileño
  - fr y zh como borrador marcado "pendiente de revisión nativa"
- **Variantes:** para el hero, los CTA principales y los titulares de casos, escribí 3 en es y 3 en en. Implementá la que recomiendes y dejá las otras con la justificación en `docs/copy-variantes.md`.
- **Placeholders:** nunca inventes datos, clientes ni testimonios. Si faltan, el placeholder queda visible.

---

## Parte F · Internacionalización

- **Idiomas:** es (por defecto), en, pt (Brasil), fr, zh (chino simplificado).
- **Rutas con next-intl:** /es, /en, /pt, /fr, /zh, con `localePrefix: 'always'`. `/` redirige a `/es`.
- **Detección:** `localeDetection: false`. El idioma del navegador se usa solo para un banner de sugerencia descartable, nunca para redirigir.
- **Selector:** visible y accesible, con cada idioma escrito en su propio idioma.
- **Contenido:**
  - UI en `messages/{locale}.json`
  - casos en archivos separados por idioma (por ejemplo, `content/casos/{slug}/{locale}.mdx`); elegí el formato y justificalo
- **fr y zh:** construidos pero **no publicados** hasta la revisión nativa. Van con noindex, fuera del sitemap, fuera de hreflang y ocultos en el selector, detrás de un flag en la config de idiomas.
- **En cada página:** hreflang, `lang` correcto, metadatos y Open Graph por idioma, y sitemap multilingüe.

---

## Parte G · Estándares técnicos

- **Stack:**
  - Next.js con App Router, en la última versión estable (verificala; no la asumas).
  - SSG en todas las páginas: `generateStaticParams` para locales y casos, `setRequestLocale` para que next-intl siga siendo estático.
  - Server Components por defecto. JS de cliente solo en: hero, preview de la lista, view transition, formulario, selector de idioma y banner de sugerencia.
- **Imágenes:**
  - `next/image` con AVIF y WebP, `sizes` correctos y `priority` solo en la imagen LCP
  - cero iframes
  - video liviano, con poster y sin autoplay de archivos pesados
- **Tipografías:** `next/font` con subset, preload y `display: swap`.
- **Accesibilidad:** WCAG 2.2 AA.
  - contraste
  - foco visible propio
  - navegación completa por teclado
  - HTML semántico
  - alt descriptivos
  - skip link
  - pausa del movimiento automático (2.2.2)
  - prefers-reduced-motion
- **SEO:**
  - un solo H1 por página y `lang` correcto en `<html>`
  - `metadataBase: https://gom.ar`, `generateMetadata` por idioma, canonical y `alternates.languages`
  - `opengraph-image` por idioma
  - `app/sitemap.ts` y `app/robots.ts`
  - JSON-LD Person + ProfessionalService en la home y CreativeWork por caso
  - 301 desde las rutas viejas
- **Medición:**
  - `@vercel/analytics` + `@vercel/speed-insights`
  - eventos: `whatsapp_click`, `email_click`, `form_submit` (solo con envío exitoso), `language_change`, `live_site_click` (con el dominio), `hero_pause`
- **Tooling de calidad,** instalado en el Bloque 1:
  - Playwright (capturas en 375 y 1440)
  - Lighthouse CI con los presupuestos de la Parte C como assertions
  - axe-core
  - bundle analyzer

---

## Parte H · Bloques (una sesión por bloque)

### Bloque 0 · Auditoría y plan · PUNTO DE CONTROL
1. Leé este brief, la investigación y el repo completo.
2. Verificá el estado actual de los sitios de clientes (ver Parte D).
3. Creá `docs/PLAN.md` con:
   - inventario de lo que se borra, se migra y se crea
   - árbol de archivos propuesto
   - modelo de contenido
   - plan visual de la home en ASCII (375 y 1440), con el hero detallado como timeline (qué capa, qué operación, cuándo, cuánto dura, qué easing)
   - escala tipográfica
   - contradicciones entre la investigación y el brief
   - riesgos de performance del hero y cómo los vas a medir
4. Creá una ficha por caso en `docs/casos/{slug}-ficha.md`, precargada con lo que sabés y [COMPLETAR] en el resto:
   - cliente y año
   - rol de Francisco y rol del equipo
   - stack
   - problema
   - decisiones clave
   - uso de IA
   - resultado verificable (o cómo conseguirlo: Analytics del cliente, PageSpeed antes y después, plazos, alcance, indexación)
   - assets disponibles
5. Listá los assets y datos faltantes, con nombre de archivo y tamaño exactos.
6. Creá `docs/PROGRESO.md`.
7. **FRENÁ.** No escribas código de la app hasta que Francisco apruebe el plan.

### Bloque 1 · Base técnica
- Migración a App Router, con el Pages Router eliminado.
- next-intl con los flags de idiomas.
- Tokens de color y tipografía como variables CSS.
- `next/font`, layout raíz, `generateMetadata`, sitemap, robots y redirects.
- Limpieza de todo lo prohibido en el sitio viejo y de las dependencias sin uso.
- Tooling de calidad con los presupuestos como assertions.
- **Terminado cuando:** build verde, rutas /es y /en sirviendo una página mínima, Lighthouse CI corriendo y PROGRESO.md actualizado.

### Bloque 2 · Hero · PUNTO DE CONTROL
- Construí el concepto "la barra de direcciones" completo y un boceto rápido de la alternativa "tipografía-pantalla", en `/[locale]/lab/hero-a` y `/[locale]/lab/hero-b`, con noindex y fuera del sitemap.
- Escribí las 3 variantes del H1 y de los CTA en es y en (`docs/copy-variantes.md`).
- Medí las dos versiones contra los presupuestos de la Parte C y registrá los números.
- Capturas de Playwright en 375 y 1440, incluido un frame a mitad de la transición del dominio.
- Probá con prefers-reduced-motion y sin JS.
- Push y link de la preview de Vercel.
- **FRENÁ.** Francisco elige el concepto y el copy antes de seguir.

### Bloque 3 · Resto de la home (es y en)
- Hero elegido integrado; las rutas de lab se borran.
- Lista de casos con preview (desktop: cursor + foco; mobile: activación por scroll).
- Paso opcional del hero a la lista, si entra en el presupuesto.
- Servicios, sección IA, Sobre mí y contacto (solo UI).
- **Terminado cuando:** presupuestos cumplidos en la home, capturas en 375 y 1440, recorrido completo con Tab y PROGRESO.md actualizado.

### Bloque 4 · Casos
- Plantilla de página de caso.
- View transition de la lista al caso, con fallback y corte directo bajo reduced motion.
- `:visited` funcionando.
- Contenido de los 7 casos en es y en, a partir de las fichas. Lo que falte queda como placeholder visible.
- Caso `instagram.com/megatlon` con grilla por campaña, loops livianos (play al estar visible) y nota de rol.
- Flags `liveVerified` revisados de nuevo.
- **Terminado cuando:** cada caso cumple los presupuestos, hay capturas en 375 y 1440, y ningún dato está inventado.

### Bloque 5 · Conversión, SEO y medición
- Formulario funcional (Server Action, zod, honeypot, Resend con fallback).
- WhatsApp con mensajes precargados por idioma.
- Eventos de analytics.
- JSON-LD, Open Graph por idioma y hreflang.
- Verificación de un solo H1 y `lang` correcto por ruta.
- **Terminado cuando:** cada evento se dispara (verificalo en la consola o en el panel de Vercel), el formulario envía o cae al fallback, y los validadores de schema no dan errores.

### Bloque 6 · Idiomas
- pt-BR adaptado y publicado.
- fr y zh como borradores detrás del flag, con Noto Sans SC solo en /zh (verificado en Network).
- Banner de sugerencia de idioma.
- **Terminado cuando:** /pt pasa los mismos presupuestos, y fr y zh no aparecen ni en el sitemap ni en el selector.

### Bloque 7 · QA final y PR a main
- Revisión visual de cada ruta publicada, en 375 y 1440. Si no tenés navegador, decilo; no la des por hecha.
- Lighthouse mobile ≥ 95 en la home y en todos los casos.
- axe-core sin violaciones serias ni críticas.
- Recorrido completo con Tab.
- Reduced motion.
- Sin CLS en los hovers.
- Hero pausable.
- Formulario y eventos.
- Abrí el PR `redesign` → `main` (sin mergear) con:
  1. qué cambió y por qué
  2. métricas reales
  3. pendientes ordenados por impacto en leads (placeholders, assets, sitios de clientes, traducciones, variables de entorno, alta en Google Search Console y envío del sitemap)
  4. deuda técnica asumida conscientemente
