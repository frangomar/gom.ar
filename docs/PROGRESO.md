# gom.ar · Registro de progreso

Leelo al empezar cada bloque y actualizalo al terminarlo. Es la única memoria entre sesiones.

---

## Bloque 0 · Auditoría y plan · 2026-10-22

**Estado:** plan **aprobado por Francisco** (puntos 1–8, 2026-10-22). Se juntaron los assets. No se escribió código de la app.
**Rama:** `redesign-b0-plan`, que sale de `redesign`, que sale de `main` en `44c9edc`.

### Decisiones tomadas
- Las ramas de bloque se llaman `redesign-bN-nombre`, no `redesign/bN-nombre`: git no permite que exista `redesign` y a la vez `redesign/…`.
- El brief se movió a `docs/rediseno-gomar.md` y `CLAUDE.md` lo carga con `@docs/rediseno-gomar.md`, como pide el propio brief.
- La investigación es `REFERENCIAS-PORTFOLIOS.md` (raíz, gitignored). Queda fuera del repo a propósito.
- Contenido en módulos TS (`src/content/casos/{slug}/{meta,locale}.ts`), no MDX: no suma dependencias y el build falla si a un idioma le falta un campo.
- Tailwind 4 se queda: ya está instalado, no tiene runtime y expone los tokens con `@theme`.
- framer-motion sale: el brief exige cero librerías de animación y hoy solo se usa para fade-up, que está prohibido.
- La ruta de caso es `/{locale}/casos/{slug}`, con el mismo segmento en todos los idiomas. Es un supuesto menor: localizar el segmento agrega la config de `pathnames` sin beneficio claro.
- `:visited` no se marca en el hero, porque Visitado sobre Link da 1,08:1. Se marca en la lista (sobre papel).
- Los links sobre tinta van en papel subrayado, porque Link sobre Tinta da 2,64:1.
- El rodillo del dominio no lleva rebote ni rotación aleatoria. La investigación lo sugiere (Mat Voyce), pero el concepto pide un sistema y no una ilustración.
- El trabajo secundario es un bloque compacto. Ayuda3 y Tea Travel (académicos) salen del sitio.

### Decisiones de Francisco (2026-10-22)
- Aprobados los 8 puntos del resumen del Bloque 0.
- Los sitios de clientes se linkean como están. `liveVerified` pasa a significar "responde y muestra el sitio". Solo quedan en `false` la Shop (contraseña) y Quicktrade.
- El email de contacto es `info@gom.ar`.
- **Sin precios en el sitio**, nunca. Esto contradice la Parte D del brief ("desde USD") y gana Francisco.
- Años: Megatlon, Fiter, La Estación y Driving Norte, 2025–hoy. Quicktrade, 2022–2024 (lo confirmó Francisco; el CV dice jul. 2022 – dic. 2023).
- Ownership: megatlon.com y la app desde feb. 2025; Fiter UY y Driving Norte desde ago. 2025; La Estación desde oct. 2026.
- Dato publicable: megatlon.com tiene ~70.000 visitas/mes (Google Analytics, revisado por Francisco).
- Francisco tiene permiso para mostrar todo.
- El formulario no lleva select de presupuesto: nombre, email, tipo de proyecto y mensaje (contra la Parte D del brief).
- Megatlon Shop no se linkea; se nombra dentro del caso megatlon.com.

### Contradicciones para decidir
1. **Investigación contra brief:** Lenis, preloader, cursor custom, GSAP, line reveals y sonido. **Gana el brief**; el detalle está en PLAN.md §9. No pido cambiar nada.
2. **Brief contra realidad:**
   - el repo ya está en App Router;
   - Megatlon Shop es Tienda Nube y está cerrada con contraseña;
   - `fiter.com/UY` distingue mayúsculas;
   - Parte D "desde USD": Francisco decidió no publicar precios.
3. **Tamaño del dominio del hero:** `laestacionfutbolpadel.com.ar` (28 caracteres) limita el dominio a unos 29 px en 375 y 96 px en 1440, aun partiéndolo en dos líneas. El contraste de escala lo hace el peso más que el tamaño. Se prueba en B2.

### Métricas medidas
- Contrastes WCAG calculados con un script (ver la tabla en PLAN.md §5). No los verifiqué con una herramienta externa todavía.
- No medí la performance del sitio actual: `node_modules` está incompleto (`require('react')` falla) y el sitio actual se borra de todos modos.

### Verificación de los sitios de clientes (curl, 2026-10-22)
| Caso | liveVerified | Motivo |
|---|---|---|
| laestacionfutbolpadel.com.ar | true (se linkea como está) | `robots.txt Disallow: /` + `noindex, nofollow` |
| fiter.com/UY | true (se linkea como está) | "Entrenameinto" en el menú |
| drivingnorte.com.ar | true (se linkea como está) | `noindex, nofollow`; lunes 11:45 contra 12:00 |
| megatlon.com | true | 200, index, follow |
| shop.megatlon.com | false | redirige a `/password/` |
| instagram.com/megatlon | true | el handle está linkeado desde megatlon.com (no hice fetch a IG) |
| App (App Store) | true | id1531151799; falta Google Play |

### Assets armados (2026-10-22)
- Capturas de las 4 webs con Playwright: desktop @2x, mobile @3x, detalles y página completa.
- App: las 4 capturas oficiales de App Store.
- Instagram: 72 portadas de oct.–nov. 2025, may. 2026 y jul.–oct. 2026, bajadas desde la sesión de Francisco en Chrome. La API de IG respondió 429, así que salieron de la grilla del perfil. La fecha se calculó a partir del ID de cada post.
- Quicktrade y Shantala, desde `Pictures/gom.ar/posts-imgs`.
- El detalle y lo que falta están en PLAN.md §12.

### Pendientes
- Assets y datos que faltan: PLAN.md §12.
- No mostrar el rating de App Store (1,9/5).
- En Descargas hay un "Compromiso de Confidencialidad - SBS Trading" (2024-11-06). Francisco confirmó que tiene permiso para todo; queda registrado.
- No verificado: la versión estable de Next por fuera de npm (`npm view next version` = 16.4.2), qué exporta React 19.3 para `<ViewTransition>` y el soporte actual de `animation-timeline` por navegador.

### Qué necesita el Bloque 1
- Correr `npm ci` (node_modules roto).
- `site.ts`: `CONTACT_EMAIL = 'info@gom.ar'`.
- No necesita assets todavía.

---

## Bloque 1 · Base técnica · 2026-10-22

**Estado:** terminado. Build verde, `/es` y `/en` sirven una página mínima (SSG), Playwright y Lighthouse CI pasan con los presupuestos como assertions.
**Rama:** `redesign-b1-base`, que sale de `redesign-b0-plan`.

### Decisiones tomadas
- No hubo migración: el App Router ya estaba en `main` (PR #1). El bloque fue limpieza, tokens, tipografía y tooling.
- `/en` se publica ya (`publishedLocales = ['es','en']`), adelantado de B3, porque el criterio de cierre de B1 pide `/en` sirviendo.
- **Sin 301 de `/presupuesto`** (Francisco: "borrar todo lo de presupuesto"). La ruta vieja da 404.
- Tokens en `@theme` de Tailwind 4 con `--color-*: initial`: solo existen los colores del brief, así no se cuela un gris de Tailwind.
- `next/font` con Schibsted Grotesk variable, latin + latin-ext, `display: swap`. El navegador baja un solo woff2 (47 KB) en /es y /en.
- Skip link en el layout; foco propio con `outline` de 3 px en `currentColor`, que se ve sobre papel, link y tinta.
- `TrackEvent` pasa a `src/lib/track.ts` con los 6 eventos del brief.
- `messages/*.json` reescritos sin clichés y con solo las claves que se usan. pt, fr y zh son copia de en hasta B6 (no se publican).
- JSON-LD se mueve a la home (antes estaba en el layout y salía en el 404).
- Lighthouse CI usa `throttlingMethod: devtools`. Con `simulate` (Lantern), el LCP en localhost da 1,8–2,25 s aunque el LCP observado sea 75–150 ms: el modelo mete en el grafo todo el JS que terminó antes del primer paint. Devtools aplica la red 4G lenta y la CPU 4× de verdad.
- Lighthouse usa el Chrome del sistema: el Chromium de Playwright falla con `spawn UNKNOWN` en esta máquina.
- `npm run analyze` se prende con `npm_lifecycle_event` en vez de `ANALYZE=true`, que no anda en los scripts de npm en Windows.
- Sin workflow de GitHub Actions para LHCI todavía: corre local. Se suma si hace falta en B7.
- Verificado: Next 16.4.2 es la última estable (`npm view next version`) y React 19.3.1 exporta `ViewTransition` y `addTransitionType` sin flag. La guía de view transitions que trae Next 16.4 no pide `experimental.viewTransition`. Queda para B4.

### Métricas medidas (build de producción, localhost, Lighthouse mobile con devtools throttling, 3 corridas por URL)
| URL | LCP | FCP | TBT | CLS | Peso | Perf / A11y / BP / SEO |
|---|---|---|---|---|---|---|
| /es | 1457–1483 ms | igual al LCP | 119–124 ms | 0 | 207 KB | 99 / 100 / 96 / 100 |
| /en | 1462–1476 ms | igual al LCP | 116–120 ms | 0 | 207 KB | 99 / 100 / 96 / 100 |

- Best Practices 96: solo por el 404 de `/_vercel/insights` y `/_vercel/speed-insights` en localhost (en Vercel existen).
- JS de cliente (gzip, medido con fetch + zlib): runtime React/Next 130 KB (`4bd1b696` 62,6 + `794` 65,8 + webpack 1,7 + main-app 0,2); polyfills 38,7 KB `nomodule` (no se baja en navegadores modernos); **JS propio 9,3 KB** (layout 3,3 + page 1,5 + not-found 4,5, incluye next-intl, Vercel Analytics y TrackedLink). Presupuesto: ≤ 35 KB.
- Playwright: 8/8 (lang correcto, un H1, axe sin violaciones serias ni críticas, `/` → `/es`, pt/fr/zh dan 404) en 375 y 1440.
- axe verificó el contraste de las combinaciones que hay hoy en la página (papel sobre link, link sobre papel). El resto de la tabla de PLAN.md §5 sigue verificada solo por script.

### Riesgos detectados
- **TBT ya está en ~120 ms con una página trivial** (presupuesto: 150). Casi todo es la evaluación del runtime de React/Next con CPU 4×. El hero de B2 tiene unos 30 ms de margen: el JS del hero tiene que arrancar después de `load` y no hidratar nada pesado arriba del fold.
- `node_modules` se instaló incompleto dos veces en esta máquina (faltaban archivos de `rxjs` y `lighthouse` sin error de npm). Si algo falla con `Cannot find module`, borrar `node_modules` y correr `npm ci`.

### Pendientes
- Medir Lighthouse sobre la preview de Vercel (la preview manda `X-Robots-Tag: noindex`, así que SEO va a bajar ahí; el número que importa es performance).
- Long tasks > 50 ms en los primeros 5 s: Lighthouse no lo asierta directo. Se mide en B2 con un `longtask` observer en Playwright.

### Qué necesita el Bloque 2
- Copy: las 3 variantes del H1 y de los CTA (es y en) van en `docs/copy-variantes.md`.
- Capturas del hero: `cover.jpg` y `hero-scroll.jpg` de las 4 webs ya están en `src/content/casos/*/img/`.
- Las rutas `lab/hero-a` y `lab/hero-b` necesitan `robots: noindex` y quedar fuera de `sitemap.ts` (hoy `PATHS = [""]`, así que no entran solas).

---

## Bloque 2 · Hero y home · 2026-10-22 · TERMINADO (en `main`, PR frangomar/gom.ar#5)

**Estado final:** la home completa quedó implementada y mergeada a `main` por pedido de Francisco. El bloque pasó por cuatro rondas de diseño, y las tres primeras direcciones se rechazaron. Las decisiones vigentes están resumidas al principio de `docs/rediseno-gomar.md`. Abajo queda el registro de cada ronda, en orden. La primera ronda (justo debajo) cuenta las direcciones rechazadas y ya no describe el estado actual.

**Mockups y videos:** viven en `docs/previews/`, que está fuera de git por peso (161 MB). Solo existen en la máquina de Francisco. El preview compartido de la ronda 4 está en https://claude.ai/artifact/E8a6roLw9aBdRKjCVK8zQ1 (privado).

### Ronda 1 · direcciones rechazadas

### Reglas nuevas de Francisco (valen para todos los bloques que siguen)
1. **Preview primero, sí o sí.** Para cualquier cosa visual, primero se le muestran imágenes del diseño propuesto, en 1440 y 375. Se arma un mockup HTML aislado, se captura con Playwright y se manda. Recién con su OK se escribe código de la app.
2. **Nada de capturas crudas de sitios de clientes**, ni en el hero ni "tiradas por ahí". En el hero van **logos**. El trabajo de cada marca se muestra solo cuando alguien quiere verlo, y de una manera creativa y dirigida, nunca como una grilla o una pila de screenshots.
3. **Quiere algo moderno, de 2026.** Lo que vio le pareció genérico, precario, confuso, de baja calidad visual y "de 2009". Prefiere el sitio negro viejo antes que lo que se le mostró.
4. **Innovar, no quedarse en lo primero que él menciona.** Si nombra una referencia ("un archivo donde las piezas pasan una detrás de la otra"), es un ejemplo y no una instrucción. **El concepto "archivo/carpetas" está descartado: "ya lo vi", es común.**
5. **Cuando pide "sí o no", se responde solo "sí" o "no".**
6. **Logos:** usar los que se bajaron de los sitios (`docs/previews/b2/logos/`). No tiene los vectoriales ahora. El de La Estación es un PNG blanco de 206×42 y se ve pixelado en grande.

### Lo que se mostró y por qué se rechazó
| Intento | Qué era | Veredicto de Francisco |
|---|---|---|
| **Hero A** "barra de direcciones" (el concepto del brief) | Fondo `#2440FF` a sangre, H1 papel, captura cruda del sitio con wipe + scroll interno, dominio gigante con rodillo. Capturas en `docs/capturas/b2/` | "Pantallazo de error de Windows", "un asco el diseño", "parece que tiraste cosas random", "no parece ni un sitio". La animación del texto está bien. |
| **Hero B** "tipografía-pantalla" (boceto del brief) | "gom.ar" gigante como máscara SVG con capturas pasando por dentro | Rechazado junto con el A, sin comentario específico. |
| **Hero C** "oscuro + luz de marca" (lo eligió de 3 opciones en ASCII) | Fondo `#0b0c0f` con grano, glow radial del color de la marca activa, logo de la marca, nav en pill con vidrio, puntito de color arriba del H1, datos en pills, fila de logos. Mockup en `docs/previews/b2/hero-c.html` y PNG en esa carpeta | "Va un poco mejor, sigue muy genérico." Le parecen **AI slop**: la nav en pill con vidrio, el puntito de color tipo eyebrow arriba del título y poner todo en pills. |
| **Concepto "archivo"** (carpetas por marca, piezas pasando una detrás de otra) | Solo se propuso por texto, no llegó a preview | Descartado: "no te limites al archivo, ya lo vi, es común". |

### Diagnóstico propio (para no repetirlo)
- El brief de la Parte B (azul a sangre + papel + capturas) produjo algo plano y sin sistema: elementos flotando sueltos, sin grilla, sin navegación, sin profundidad, y la captura cruda de un sitio ajeno rebajando el trabajo.
- El hero C reemplazó una plantilla por otra: glow, glass, pills y eyebrow son justo los tics que las skills de diseño (taste, impeccable) listan como marcas de diseño generado por IA.
- **Falta una idea propia del sujeto.** Taste-skill lo formula así: "En esta página, [algo que pertenece solo a gom.ar/Francisco] se convierte en [el recurso]". Ninguno de los tres intentos pasa el test del competidor: otro portfolio podría usarlos igual.

### Prohibido de ahora en más (suma a la lista de la Parte B)
- Nav flotante en pill, glass o backdrop-blur decorativo.
- Eyebrow o kicker arriba del H1 (puntito de color + label, chips, "Nuevo ·").
- Datos en pills o chips.
- Glows y blobs de gradiente como fondo.
- Capturas crudas de sitios como imagen principal.
- El concepto archivo/carpetas/rolodex.
- Fondo azul `#2440FF` a sangre (el hero del brief).

### Skills instaladas (en `~/.claude/skills/`, con el OK de Francisco)
- `impeccable` (pbakaus/impeccable): su launcher baja un binario en la primera corrida; **no se ejecutó**, solo se leen SKILL.md y referencias.
- `design-taste-frontend` (leonxlnx/taste-skill): las escenas de scroll usan GSAP + Lenis y **chocan con el brief**; se usan sus reglas y su método, no sus scripts de escena.
- De emilkowalski/skills: `emil-design-eng`, `animate`, `animation-performance`, `animation-vocabulary`, `review-animations`, `improve-animations`, `find-animation-opportunities`, `break-ui`, `prototype`.
- Playwright MCP (plugin oficial): se le mostró la tarjeta de instalación; lo activa Francisco. Playwright como dependencia ya está en el repo.
- Leer `craft-floor.md` de impeccable y las house rules de taste antes de la próxima propuesta visual.

### Qué se puede reusar del código (está en el working tree, sin commitear)
- `src/components/home/HeroCycle.tsx`: el ciclo del rodillo por letra, ya resuelto y medido. Incluye la pausa (botón, IntersectionObserver, `visibilitychange`, foco en el link), reduced motion con "siguiente caso", la versión sin JS, la precarga después de `load` con `decode()` y el parallax con lerp. **2,9 KB gzip.** La captura y la cortina habría que sacarlas o reemplazarlas por lo que muestre el nuevo diseño.
- `src/lib/domain.ts` (`splitTitle`, `DIM_CHARS`) y `src/content/casos/index.ts` (`HERO_CASES`).
- `tests/hero.spec.ts`: sin JS, reduced motion, pausa, frame a mitad de transición, axe, y métricas con CPU 4× (long tasks, bytes de imágenes antes de `load`, LCP, conteo de paints).
- Rutas `src/app/[locale]/lab/hero-a|hero-b` (noindex, fuera del sitemap) y `docs/copy-variantes.md`. El H1 de 90 caracteres es demasiado largo: taste pide titulares de 2 líneas como máximo (~32 caracteres).
- Las imágenes `src/content/casos/*/img/hero.jpg` (recortes de capturas) probablemente sobran, porque Francisco no quiere capturas en el hero.

### Aprendizajes técnicos medidos
- **Rodillo por letra con stagger = repaint del viewport en cada frame.** Cada letra que empieza o termina su animación cambia de capa. Con `will-change: transform` en las letras, puesto un frame antes y sacado al final (clase `.hero-rolling`), bajó de 86 a 0 paints por transición. Quedan unos 43 paints de inicialización en un solo frame, 2 en el cambio de imagen y 2 al final.
- `<Image>` de Next es un componente cliente: sumaba ~5 KB de JS. Con `getImageProps` + `<img loading="eager" fetchPriority="high">` renderizado en el servidor, el chunk del hero bajó de 7,1 a 2,9 KB gzip. `getImageProps` devuelve `loading="lazy"` por defecto: hay que pisarlo.
- Next 16: `priority` está deprecado, se usa `preload`; `images.qualities` tiene que listar cada calidad que se use (se agregó `[60, 75]` en `next.config.ts`).
- El ancho de "laestacionfutbolpadel" en Schibsted Grotesk 800 con tracking -0,035em es de 10,31 em. El tamaño se fija con `font-size: min(calc(100cqi / 10.5), 9rem)`.
- **Violación abierta del presupuesto:** con CPU 4× hay una tarea larga de 190–230 ms antes de `load` en **todas** las páginas, incluida la mínima de B1. Es la evaluación del runtime de React/Next y no la causa el hero. No tiene arreglo barato; hay que decidirlo.

### Métricas (hero A, ya descartado; sirven de referencia)
- Lighthouse mobile, devtools throttling, 3 corridas: LCP 1,54–1,58 s · TBT 108–112 ms · CLS 0,003 · 301 KB · Performance 98, A11y 100, BP 96. SEO 58 por noindex, a propósito.
- Hero B: LCP 1,53–1,56 s · TBT 114–161 ms · CLS 0 · Performance 97–99.
- Imágenes antes de `load` en 375: 34,7 KB (A) y 89,6 KB (B). Presupuesto: 150 KB.
- Playwright: 14/14 pasan.

### Qué necesita la próxima sesión
1. Leer esta sección completa y las memorias `visual-preview-first` y `gomar-design-direction`.
2. Proponer una **idea nueva y propia** para el hero y para "cómo se ve el trabajo de una marca", pasando el test del competidor. Mostrarla **solo en imágenes** (mockup HTML → capturas de Playwright en 1440 y 375) y esperar el OK.
3. Mantener el rodillo por letra del dominio, que es lo único aprobado.
4. Decidir con Francisco qué hacer con la Parte B del brief: paleta, tipografía y concepto del hero quedaron invalidados por sus decisiones de esta sesión.
5. Recién con el diseño aprobado: implementar, medir, commitear y abrir el PR contra `redesign`.

### Bloque 2, segunda ronda (2026-10-22) · EN CURSO, SIN APROBAR

**Qué se mostró** (mockups en `docs/previews/b2r/`, servidos con `python -m http.server 5591` desde `docs/previews`):
- `1-piel`, `2-colab`, `3-crono`: tres heros nuevos. Francisco eligió **la estructura del 3 (cronómetro)**: el LCP real de la página medido en vivo, H1, CTA y franja con el rodillo de marcas.
- `4-home`: home completa con esa estructura. Rechazada: "obsesión por lo editorial", poco color, cortes entre secciones.
- `5-inmersiva`: la versión actual. Un solo plano continuo: el fondo se interpola entre el color de una marca y la siguiente con el scroll, sin cortes; cada caso es un capítulo fijo (sticky) con fotos reales de la marca que entran ligadas al scroll; servicios en recorrido horizontal; IA y "Sobre mí" con palabras que se encienden; contacto con el rodillo. Videos: `recorrido-1440.webm` y `recorrido-375.webm`.

**Decisiones de Francisco (contra el brief, ganan ellas):**
- Quiere **todos los bloques animados** y una experiencia **inmersiva y continua**. Esto pisa "fade-up prohibido" y "sin movimiento fuera del hero" de la Parte C. Se resolvió **sin librerías y sin scroll-jacking**: scroll nativo + CSS scroll-driven animations (`animation-timeline: view()` y `view-timeline`), con `@supports` y `prefers-reduced-motion` dejando todo estático.
- Fotos de marca **bajadas de los sitios de los clientes**, no capturas. Para Megatlon, **solo fotos de sedes Black+ (Alcorta, La Imprenta, Añelo) y Black (Belgrano, Núñez, Gonnet, Martínez, Olivos, Pilar)**, en `docs/previews/b2r/brand/megatlon-black/`.
- Quicktrade entra en el ciclo del hero.
- Leer `docs/documentacion teorica/` (Figma Resource Library + skill `ux-design-direction`). Se aplicó: storytelling por capítulos (contexto → qué hice → resultado), tendencias 2026 (scroll, paleta saturada, tipografía protagonista), un solo CTA dominante siempre visible (Von Restorff, nav fija con WhatsApp), Peak-End (cierre fuerte en contacto).

**Riesgos abiertos (no medidos todavía):**
- El fondo que cambia de color repinta el viewport en cada frame de scroll. En producción va con capas de color superpuestas y `opacity` (compositor), no con `background-color`.
- `animation-timeline` no está en Firefox estable: ahí queda estático (verificar soporte actual antes de B3).
- Peso: las fotos del mockup suman ~14 MB sin optimizar. En la app van por `next/image` (AVIF) y lazy fuera del primer viewport.
- No hay logo de Quicktrade (va el nombre en texto) ni vectoriales de La Estación y Driving Norte.
- `megatlon.com` tiene un video de 18 MB (`Feed-sin-precio-generica-con-pileta.mp4`): no se usó por peso.

### Bloque 2, tercera ronda (2026-10-22) · EN CURSO, SIN APROBAR

**Mockup:** `docs/previews/b2r/6-techno.html` (videos `6-techno-1440.webm` y `6-techno-375.webm`; hovers en `6-hover-{rave,laser,acid}.png`).

**Feedback de Francisco sobre `5-inmersiva` y cómo se resolvió:**
- Identidad propia, no la de las marcas: **base negra + neón de gom.ar** (le gusta el techno oscuro tipo Argy y la estética de Fred again..). Las marcas quedan como guiño: su logo y los puntos de su dominio en su color. Contradice la Parte B del brief y la regla "fondo negro con un único acento neón": se usan **dos neones** y se deja elegir entre 3 paletas (rave, láser, ácido) en el preview. La "ácido" se parece al sitio viejo (#92ff6b): avisado.
- Fiter nunca usa negro sobre amarillo: no hay más bloques amarillos.
- **3D:** el número del tiempo de carga es 3D (capas extruidas con CSS, sin WebGL) y sigue al cursor; también el wordmark del footer, la foto de "Sobre mí" y las cards de servicios.
- **Botones con mucha respuesta:** imán hacia el cursor, relleno que nace donde entra el mouse, rodillo de letras (el mismo del dominio), glow neón y rebote al apretar. Links con subrayado que se va y vuelve.
- **Scrollbar, selección, caret y foco** personalizados con el neón.
- **Transiciones:** se sacó la barrita de progreso. Las escenas se apilan (cada una se desliza sobre la anterior, que se achica y se apaga), así no hay saltos ni cortes.
- **Una imagen por caso** (foto de la marca, pasada primero por el filtro neón y después a color real). La app muestra sus pantallas en 3D, recortadas sin el fondo blanco. Quicktrade muestra sus landings y su mobile scrolleando dentro de pantallas en 3D. Redes mantiene el muro.
- Se sacó la nota "el feed tiene trabajo de otras personas" (pedido de Francisco; el brief pedía una nota de rol).
- La franja del hero tiene altura fija y el tamaño del dominio se calcula con el más largo.
- Servicios en mobile: deslizamiento nativo con el dedo (scroll-snap), no ligado al scroll vertical.
- Bio y textos con más animación: la bio entra palabra por palabra.

**Pendiente de decidir con Francisco:** paleta neón (rave / láser / ácido), cursor propio (el brief lo prohíbe; no se hizo).

### Bloque 2, cuarta ronda (2026-10-22) · EN CURSO, SIN APROBAR

**Mockup:** `docs/previews/b2r/7-render.html` (videos `7-render-1440.webm` y `7-render-375.webm`). Copia publicable para el celular en `docs/previews/publish/`, publicada como artifact privado: https://claude.ai/artifact/E8a6roLw9aBdRKjCVK8zQ1

**Francisco aprobó la dirección de `6-techno` ("muchísimo mejor") y pidió:**
- Paleta **láser** (rojo `#ff2b4e` + violeta UV `#7a5cff`), **sin gradientes**. El scrollbar cambia de color (sólido) a medida que se baja.
- 3D **tipo render high-res**: se pasó de capas CSS a **three.js 0.180** (materiales físicos, entorno de estudio propio con softbox y tiras láser, tipografía real convertida a geometría). Número del hero en laca roja con laterales cromados; wordmark gom.ar cromado gigante en el footer.
- App y Quicktrade como **mockups de iPhone y MacBook en 3D**: giran con el scroll, quedan de frente al llegar y después siguen al mouse. La sombra va debajo, no arriba.
- Proyectos como **mazo de cards** (le gusta), con transiciones sin cortes. Hero y resto de secciones se disuelven, sin bordes de "tarjeta encima".
- "Qué puedo hacer por tu marca" reforzada: lista que se recorre con un visual fijo que cambia según el servicio.
- Ver en mobile: por eso el artifact.

**Riesgos:** three.js (~600 KB sin gzip en módulos) y 4 contextos WebGL. El brief pide cero WebGL en el hero salvo medición con fallback: hay fallback (número plano) pero **no está medido**. En producción, el 3D se carga después de `load` y solo en pantallas que lo soporten.

### Bloque 2, implementación (2026-10-22) · EN MAIN por pedido de Francisco

Francisco pidió "implementalo en el proyecto, commiteá, pusheá y mergeá a main" (contra la regla del brief de mergear a main recién en B7: gana su pedido).

**Qué quedó en la app (`/es` y `/en`, SSG):**
- `src/app/[locale]/page.tsx`: toda la home en HTML estático (visible sin JS): hero con el tiempo de carga real, franja de marcas, mazo de 7 casos, servicios, IA, sobre mí, contacto y footer.
- `src/components/home/HomeFx.tsx`: un solo componente cliente con toda la interacción (rodillo, botones con imán/relleno/rebote, mazo, bio que se enciende con el scroll, servicios, WhatsApp flotante, scrollbar que cambia de color).
- `src/components/home/scene.ts`: 3D con three.js 0.180, **en un chunk aparte que se carga después de `load`**. Un solo canvas y un solo contexto WebGL para toda la página (cada objeto se dibuja en el rectángulo de su elemento). Estética "gelatina" (cáscara translúcida brillante + núcleo que brilla) con luz de estudio clara, como la referencia de Francisco. Objetos: número del hero, 3 iPhones (app), MacBook + iPhone + fajo de billetes de fantasía (Quicktrade), paleta de pádel (La Estación), pelota de golf (Driving Norte), disco de 20 kg (megatlon.com), logo de Instagram (redes), wordmark gom.ar (footer).
- `src/components/home/ContactForm.tsx`: arma el email y lo abre en el programa de correo (shortcut hasta B5: Server Action + Resend). El select usa `appearance: base-select` donde el navegador lo soporta.
- `src/content/home.ts`: datos de los casos en es y en, solo de las fichas.
- Assets en `public/home/` (5,8 MB): fotos de marca, pantallas de la app, landings de Quicktrade, 72 piezas de IG, logos y la tipografía para el 3D.
- Se borraron las rutas `lab/`, el hero viejo, `lib/domain.ts`, `content/casos/index.ts`, los recortes `hero.jpg` y `tests/hero.spec.ts`. `docs/previews/` queda fuera de git (161 MB de material de trabajo).

**Decisiones:**
- Sin botón "Ver caso": las páginas de caso no existen todavía (B4); un botón a ningún lado no va. Cada card linkea al sitio en vivo.
- Bug del botón blanco en hover: la variable del mazo se llamaba `--k`, igual que el color negro. Ahora es `--cov` (y `--ent` para la entrada).
- Mobile roto desde servicios: el grano (capa más ancha que la pantalla) hacía que el celular alejara el zoom. Ahora vive dentro de un contenedor fijo que recorta. Servicios en mobile: cada servicio con su visual arriba, sin nada fijo.
- La clase `inline` chocaba con la utilidad de Tailwind: se renombró a `vin`.
- Menos rojo: el rojo queda en el CTA de WhatsApp y detalles; el resto pasa a violeta.

**Medido:** build verde, tipos y lint limpios, Playwright 8/8 (lang, un H1, axe sin violaciones serias en 375 y 1440, redirect, 404 de idiomas no publicados).
**No medido:** Lighthouse, LCP, TBT y peso. El 3D y las animaciones probablemente rompen varios presupuestos de la Parte C (JS de cliente, tareas largas): pendiente medir y decidir con Francisco.

### Qué necesita el Bloque 3
1. **Medir la home nueva con números reales:** Lighthouse mobile, LCP, CLS, TBT, peso total y JS de cliente (el chunk de three.js va aparte). Comparar contra la Parte C del brief y decidir con Francisco qué se ajusta. Hay que mirar sobre todo las tareas largas al cargar el 3D y los fps del canvas en mobile.
2. **Probar en celulares reales** (iOS Safari y Android Chrome): el 3D, el mazo de cards y el select personalizable, que en Safari queda nativo.
3. Assets que faltan: `[FOTO FRANCISCO]`, el logo de Quicktrade y los vectoriales de La Estación y Driving Norte.
4. Pendientes de otros bloques que ya se ven en producción:
   - páginas de caso (B4: hoy cada card linkea solo al sitio en vivo);
   - formulario con Server Action y Resend (B5: hoy abre el programa de email);
   - eventos de analytics completos (B5).
5. `docs/copy-variantes.md` tiene arriba el copy vigente. Si se cambia el H1, actualizarlo ahí.

## 3D de producto y carga sin saltos · 2026-10-22 · EN MAIN por pedido de Francisco

Tarea de Francisco: rehacer los objetos 3D con realismo de producto y que el número del hero no salte de 2D a 3D.

### Auditoría previa (lo que había)
- Todo era three.js 0.180 modelado por código, en `scene.ts`: un canvas fijo, sin GLB, HDRI ni KTX2. Se bajaba también en mobile.
- **Pesos transferidos:**
  - three.js: 193 KB gzip (4 chunks)
  - fuente 3D: 30 KB
  - pantallas: 2,02 MB (3 PNG de 600×1314 y 2 JPG)
- **Por qué saltaba el número.** Medido con Fast 4G (9/1,5 Mbps, 60 ms), CPU 4x, 1440×900 y el server de producción local:
  - 1204 ms: el LCP es el número 2D, que muestra "0,00".
  - 1826 ms: cambia al valor real.
  - De ahí en adelante: tres tareas largas (932 ms al parsear three.js, 1436 ms al armar todos los objetos y 505 ms al compilar shaders).
  - 4541 ms: se oculta el 2D sin fundido y entra el 3D.

### Decisiones de Francisco
- Realismo de producto en lugar de gelatina.
- Calibrado sobre `#070708` y no sobre `#F3F4F2`, que es de la paleta vieja.
- Asignación de objetos:
  - smartphone → app
  - notebook → Quicktrade
  - paleta → La Estación
  - golf → Driving Norte
  - disco bumper de goma → megatlon.com
  - mancuerna → Fiter
  - redes queda sin objeto (sale el logo de IG)
- Disco y paleta sobre fotos de referencia que pasó él: bumper negro con "20 KG" impreso en blanco a los dos lados, y paleta blanca en lágrima con puente en Y. Sin marcas.
- El número aparece recién cuando se conoce el LCP.
- Pidió documentar, commitear, pushear y mergear a `main`.

### Qué se hizo
- **`design/3d/build.py`:** modela todo por código en Blender 4.5 y renderiza en Cycles.
  - Base: escala real, bisel en todas las aristas, roughness con variación, microrelieve, HDRI `studio.exr` de Blender, luz key, rim y fill, y sombra de contacto con shadow catcher.
  - `--seq 25` renderiza el giro de −15° a +15°; el cuadro del medio es el still.
  - `--mid` renderiza solo el cuadro del medio a más resolución.
  - Los `.blend` de cada objeto están en `design/3d/blend/`.
- **Número del hero:** un render por carácter (0–9, coma, punto y "s"), con la misma cámara ortográfica y la misma luz. HomeFx los arma con el valor real y los muestra cuando están todos decodificados. Fundido de 150 ms. El texto sigue en el DOM para lectores de pantalla (`#tsr`).
- **`design/3d/export.mjs`** (sharp): exporta AVIF + WebP en 1x y 2x a `public/3d/`, escribe `src/content/3d.json` y **falla si un objeto se pasa del presupuesto**.
- **`src/app/[locale]/page.tsx`:**
  - `<Obj>` (`<picture>` con `media="(min-width: 1024px)"`): en mobile no se descarga nada.
  - `<Render>` para los mockups y el wordmark del footer.
- **`HomeFx`:**
  - Sin three.js.
  - La secuencia se baja con el primer hover o foco de la card, solo con puntero fino y sin reduced motion.
  - El puntero elige el cuadro y al salir vuelve al centro de a un cuadro.
- three.js, `@types/three`, `scene.ts` y `sg-900.woff` salieron del proyecto. sharp quedó como devDependency (ya venía con Next).

### Pesos (AVIF transferido)

| Objeto | Still 2x | Secuencia (25 cuadros) |
|---|---|---|
| Paleta | 7,2 KB | 173,8 KB |
| Disco | 6,0 KB | 137,5 KB |
| Golf | 3,9 KB | 88,8 KB |
| Mancuerna | 5,7 KB | 129,6 KB |
| Smartphone (1600 px) | 27,5 KB | 268,6 KB (cuadros de 800 px) |
| Notebook (1600 px) | 27,7 KB | 246,7 KB (cuadros de 800 px) |
| Número (13 caracteres, se bajan solo los del valor) | 75,9 KB en total | — |
| Wordmark | 16,6 KB | — |

### Lighthouse mobile, antes y después (localhost, devtools throttling)

| | Antes (1 corrida) | Después (3 corridas por URL, /es) |
|---|---|---|
| Performance | 62 | 87 |
| Accesibilidad | 100 | 100 |
| Buenas prácticas | 96 | 96 |
| SEO | 100 | 100 |
| LCP | 2,6 s | 2,6 s |
| TBT | 5,4 s | 270 ms |
| CLS | 0 | 0 |
| Peso total | 2.497 KB | 345 KB |

- **Carga, con la misma traza que la auditoría:**
  - el LCP pasa a ser el H1, a los 900 ms;
  - el número aparece completo a los 2041 ms;
  - no hay ningún frame con el número en 2D.
- **Grabación:**
  - `docs/capturas/b3-3d/filmstrip-fast4g-cpu4x.jpg` (12 capturas del trace);
  - el trace completo para abrir en el panel Performance está en `docs/previews/b3-3d/trace-fast4g-cpu4x.json`, fuera de git (12 MB).
- **Capturas:** `docs/capturas/b3-3d/`, en 1440 y 375.
- Playwright 8/8, tipos y lint limpios.
- **Mobile:** se verificó que no se baja ningún objeto de `/3d/` salvo los mockups, el número y el wordmark.

### Pendientes
- **LCP 2,6 s, fuera del presupuesto (< 1,8 s).** Ahora es el H1, con 2,5 s de render delay bajo la simulación de Lighthouse. Hay una tarea larga de unos 600 ms al hidratar (CPU 4x) que no es del 3D. Es lo primero a atacar en el Bloque 3.
- **Bajo la simulación lenta, el H1 cambia el corte de líneas a los ~1,6 s** (se ve en la tira). No suma CLS, pero se nota.
- **Lo que queda sin verificar:**
  - Safari sin API de LCP: el número no se muestra, a propósito (no hay dato que inventar). Sin JS tampoco.
  - Los cuadros de la secuencia de los mockups son de 800 px: en pantallas 2x se ven un poco más blandos que el still mientras giran.
  - La paleta es el objeto con menos detalle: la cara es blanca lisa y le falta el borde gris que tiene la referencia.
  - No se probó en celulares reales.
- **Para regenerar:**
  ```
  blender -b -P design/3d/build.py -- --only paddle,plate,golf,dumbbell --seq 25 --samples 96 --out design/3d/out
  blender -b -P design/3d/build.py -- --only phone,notebook --seq 25 --res 800 --samples 96 --out design/3d/out
  blender -b -P design/3d/build.py -- --only phone,notebook --seq 25 --mid --res 1600 --samples 128 --out design/3d/out
  blender -b -P design/3d/build.py -- --only glyphs,wordmark --samples 128 --out design/3d/out
  node design/3d/export.mjs
  ```

### Ajuste: los objetos vuelven a seguir al mouse (2026-10-22)
- **Lo que reportó Francisco:** los objetos ya no seguían al mouse.
- **Causa:** la versión anterior solo giraba con el puntero dentro de la card, y recién después de bajar los 25 cuadros en el primer hover. El 3D viejo seguía al puntero en toda la ventana, en los dos ejes y con inercia.
- **Ahora:**
  - El número del hero, el wordmark y cada objeto visible siguen al puntero en toda la ventana, con inercia.
  - La inclinación se hace solo con `transform`, que no repinta.
  - Los objetos con secuencia además giran de verdad ±15° con los cuadros.
  - La secuencia se baja en idle cuando su card se acerca a la pantalla (IntersectionObserver), no en el primer hover.
  - Igual que antes: solo con puntero fino y sin reduced motion.
- **Verificado en Chromium headless a 1440:**
  - las transformaciones cambian con el mouse;
  - la paleta muestra el cuadro 23 de 25 con el puntero a la derecha;
  - clips en `docs/capturas/b3-3d/follow-*.webp`.
- **Sin verificar:** fps reales en una máquina lenta.

## SEO e indexación · 2026-10-22 · rama `seo-indexacion`

### Auditoría del sitio en vivo (curl a gom.ar)
- Bien: `/` → 301 a `/es`; robots.txt permite todo y apunta al sitemap; sitemap con `/es` y `/en` y sus hreflang; canonical, hreflang (es, en, x-default), description y Open Graph por idioma; un solo H1.
- Faltaba la imagen de Open Graph: al compartir el link no aparecía ninguna imagen.
- `www.gom.ar` no existe en DNS (los nameservers son de Cloudflare).

### Qué se hizo
- `src/app/[locale]/opengraph-image.tsx`: imagen 1200×630 estática por idioma (negro, "gom.ar" con el punto violeta, título y descripción en Schibsted Grotesk). La fuente se baja de Google Fonts en el build porque next/og no lee woff2.
- `twitter:card` pasa a `summary_large_image`.
- JSON-LD: nodo `WebSite` (para el nombre del sitio en Google), `knowsLanguage` y `alumniOf` (UCES, Digital House) en Person, `areaServed` en ProfessionalService. Solo datos del brief.
- `/presupuesto` sigue sin redirect, como se decidió en el Bloque 1.

### Pendientes (los hace Francisco)
- **Google Search Console:** dar de alta la propiedad de dominio `gom.ar` (verificación por TXT en Cloudflare) y enviar `https://gom.ar/sitemap.xml`. Después, pedir la indexación de `/es` y `/en`.
- **`www.gom.ar`:** agregar el dominio en Vercel con redirect a `gom.ar` y un CNAME `www` → `cname.vercel-dns.com` en Cloudflare (sin proxy).
- Bing Webmaster Tools: se puede importar desde Search Console.

### Ajuste: en el celular se mueven con la inclinación (2026-10-22)
- **Decisión de Francisco:** opción 1. En Android la inclinación del teléfono reemplaza al mouse. En iPhone no se pide el permiso de movimiento, para que no salga un aviso del sistema antes del CTA, y por eso ahí queda quieto.
- **Cómo funciona:**
  - Se escucha `deviceorientation` en pantallas táctiles. iOS no manda el evento sin permiso, así que no hace falta detectarlo.
  - Con ±25° de inclinación se llega al tope.
  - La postura en que se sostiene el celular se toma como "derecho" y se recentra sola.
  - En mobile solo hay inclinación por `transform`: no se baja ninguna secuencia.
  - Respeta reduced motion.
- **Verificado:** en emulación de Pixel 7 con eventos simulados, el número y el mockup cambian su transform y no se baja ningún cuadro de secuencia. Capturas: `docs/capturas/b3-3d/tilt-*.{webp,jpg}`.
- **Sin probar:**
  - en un Android real;
  - con el celular en horizontal, donde los ejes se cruzan (dejé un `shortcut:` en el código).
