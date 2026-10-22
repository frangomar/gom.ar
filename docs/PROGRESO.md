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
