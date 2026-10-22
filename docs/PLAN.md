# gom.ar · Plan del rediseño (Bloque 0)

Estado: **borrador para aprobación de Francisco**. No hay código de la app escrito.
Fuentes: `docs/rediseno-gomar.md` (brief, manda), `REFERENCIAS-PORTFOLIOS.md` (investigación, en la raíz, ignorada por git) y el código de `main` en `44c9edc`.
Fecha: 2026-10-22.

---

## 1. Punto de partida real (difiere del brief)

El brief describe el repo como Pages Router. **Ya no es así.** En `main` ya están:

- Next 16.4.2 (es la última estable según `npm view next version`), React 19.3.1, next-intl 4.14.9 y App Router en `src/app/[locale]`.
- Routing con `localePrefix: 'always'` y `localeDetection: false`, `publishedLocales = ['es']`, la redirección `/ → /es` en `next.config.ts` y un 404 para los idiomas no publicados.
- `generateMetadata` con canonical y `alternates.languages`, además de `sitemap.ts`, `robots.ts` y JSON-LD Person + ProfessionalService.
- `@vercel/analytics` y `@vercel/speed-insights` montados, y el evento `whatsapp_click`.
- Los iframes de Behance y el cursor custom ya no están.

Todavía falta: la estética vieja (negro + #92ff6b, Arial), framer-motion con fade-up en cada sección, el formulario por formsubmit.co, el texto con clichés prohibidos y un `README` de plantilla.
**Consecuencia:** el Bloque 1 se achica. Es limpieza, tokens, fuentes y tooling, no una migración.

`node_modules` está incompleto en esta máquina (`require('react')` falla). Hay que correr `npm ci` al empezar el Bloque 1. Por ese motivo no verifiqué qué exporta React 19.3 para View Transitions.

---

## 2. Inventario

### Se borra
| Archivo | Por qué |
|---|---|
| `src/components/Reveal.tsx`, `MotionProvider.tsx` | fade-up prohibido; framer-motion sale del bundle |
| `src/components/Hero.tsx`, `SobreMi.tsx`, `Proyectos.tsx`, `Contacto.tsx`, `Footer.tsx`, `Navbar.tsx`, `NavbarMenu.tsx` | se reescriben con otra estructura; no se aprovecha nada visual |
| `src/components/ContactForm.tsx` | usa formsubmit.co desde el cliente; se reemplaza por Server Action + Resend |
| `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | boilerplate de create-next-app |
| dependencia `framer-motion` | cero librerías de animación (Parte C, principio 3) |
| textos de `messages/*.json` | clichés prohibidos ("centrado en las personas", "pienso lateral", "dejar huella") |

### Se migra (se mantiene y se adapta)
| Archivo | Cambio |
|---|---|
| `src/i18n/routing.ts` | se mantiene; `publishedLocales` pasa a `['es','en']` en B3 y suma `pt` en B6 |
| `src/i18n/request.ts`, `navigation.ts` | sin cambios |
| `src/lib/seo.ts`, `site.ts` | se suma `ogImage` y el mensaje de WhatsApp por idioma |
| `src/app/sitemap.ts`, `robots.ts` | `PATHS` pasa a incluir `/casos/{slug}` |
| `src/components/JsonLd.tsx` | se mueve a la home; se suma `CreativeWork` por caso |
| `src/components/TrackedLink.tsx` | el tipo `TrackEvent` pasa a `src/lib/track.ts` con los 6 eventos |
| `src/app/[locale]/layout.tsx` | suma `next/font`, skip link y el selector de idioma |
| `src/app/[locale]/not-found.tsx` | se reestiliza con los tokens |
| `src/app/globals.css` | se reescribe: tokens en `@theme` de Tailwind 4 |
| Tailwind 4 | **se queda**: ya está instalado, no agrega runtime y `@theme` expone los tokens como variables CSS |
| `README.md` | se reescribe (cómo correr, medir y agregar un caso) |

### Se crea
Ver el árbol de la sección 3. Las dependencias nuevas son todas `devDependencies` salvo dos: `resend` y `zod`, que corren solo en el servidor. Las de desarrollo son `@playwright/test`, `@axe-core/playwright`, `@lhci/cli` y `@next/bundle-analyzer`.

---

## 3. Árbol de archivos propuesto

```
docs/
  rediseno-gomar.md  PLAN.md  PROGRESO.md  copy-variantes.md (B2)
  casos/{slug}-ficha.md
messages/{es,en,pt,fr,zh}.json            UI
src/
  app/
    globals.css                           tokens + base + utilidades de movimiento
    sitemap.ts  robots.ts
    [locale]/
      layout.tsx  not-found.tsx  opengraph-image.tsx
      page.tsx                            home
      casos/[slug]/page.tsx               página de caso (SSG)
      casos/[slug]/opengraph-image.tsx
      lab/hero-a/page.tsx  lab/hero-b/page.tsx   (solo B2, se borran en B3)
  actions/contact.ts                      Server Action: zod + honeypot + Resend
  components/
    home/  Hero.tsx  HeroCycle.tsx(client)  CaseList.tsx  CasePreview.tsx(client)
           Services.tsx  AiSection.tsx  About.tsx  Contact.tsx
    case/  CaseHero.tsx  CaseMeta.tsx  CaseBody.tsx  NextCase.tsx
    ui/    Domain.tsx  SkipLink.tsx  LocaleSwitcher.tsx(client)
           LocaleBanner.tsx(client)  ContactForm.tsx(client)  TrackedLink.tsx(client)
           LoopVideo.tsx(client)  SiteHeader.tsx  SiteFooter.tsx
  content/
    casos/index.ts                        orden y tipo Case
    casos/{slug}/meta.ts                  datos sin idioma
    casos/{slug}/{locale}.ts              texto por idioma
    casos/{slug}/img/*                    capturas fuente (import estático)
  i18n/  routing.ts  request.ts  navigation.ts
  lib/   seo.ts  site.ts  track.ts  motion.ts
tests/   home.spec.ts  case.spec.ts  a11y.spec.ts
lighthouserc.json   playwright.config.ts
```

Slugs: `app-megatlon`, `laestacionfutbolpadel`, `fiter-uy`, `drivingnorte`, `megatlon`, `instagram-megatlon`, `quicktrade`. La ruta es `/{locale}/casos/{slug}`, con el mismo segmento en todos los idiomas (supuesto menor, anotado en PROGRESO).

---

## 4. Modelo de contenido

**Formato elegido: módulos TypeScript, no MDX.** Hay tres razones:
- No suma dependencias.
- El compilador obliga a que cada caso tenga todos los campos en cada idioma. Un placeholder faltante rompe el build en vez de pasar desapercibido.
- Los imports estáticos de las imágenes dan `width` y `height` reales, así que no hay CLS.

El costo es que escribir texto largo es menos cómodo que en MDX. Para 7 casos de alrededor de 400 palabras alcanza.

```ts
// src/content/casos/index.ts
type Locale = 'es' | 'en' | 'pt' | 'fr' | 'zh';

type CaseMeta = {
  slug: string;
  title: string;            // "laestacionfutbolpadel.com.ar" o "App Megatlon · iOS y Android"
  liveUrl?: string;         // sin liveUrl no hay "Ver online" (Quicktrade)
  liveVerified: boolean;    // false => el link en vivo no se renderiza
  liveCheckedAt: string;    // fecha ISO de la última verificación
  inHero: boolean;          // solo webs y app
  client: string;
  year: string;             // "[COMPLETAR AÑO]" mientras falte
  stack: string[];
  cover: StaticImageData;   // captura para la lista y el hero de la página
  heroScroll?: StaticImageData; // captura alta para el scroll interno del hero
  storeLinks?: { ios?: string; android?: string };
};

type Block =
  | { type: 'text'; heading?: string; body: string }
  | { type: 'image'; src: StaticImageData; alt: string; caption?: string }
  | { type: 'loop'; src: string; poster: StaticImageData; alt: string }
  | { type: 'grid'; campaign: string; items: (Image | Loop)[] }; // caso redes

type CaseCopy = {
  summary: string;          // una línea para la lista y el og:description
  role: string;             // qué hizo Francisco
  teamRole: string;         // qué hizo el equipo (no atribuir trabajo ajeno)
  problem: string;
  decisions: string[];
  ai: string;
  result: string;           // verificable o "[COMPLETAR RESULTADO]"
  body: Block[];
};

export const CASES: CaseMeta[];                           // define el orden
export const getCopy: (slug: string, locale: Locale) => CaseCopy;
```

Regla: cualquier string que empiece con `[` se renderiza con la clase `.placeholder` (fondo amarillo visible). En el build de producción, un test de Playwright lista los placeholders que quedan para que nunca pasen desapercibidos.

---

## 5. Tokens

### Color (contrastes calculados con la fórmula WCAG 2.x, en el script de esta sesión)
| Combinación | Ratio | Uso permitido |
|---|---|---|
| Papel `#F3F4F2` / Link `#2440FF` | 5,85 | texto del hero ✔ |
| Link / Papel | 5,85 | links y CTA en el cuerpo ✔ |
| Visitado `#6B2FD6` / Papel | 6,34 | `:visited` en el cuerpo ✔ |
| Tinta `#1A1C20` / Papel | 15,46 | texto ✔ |
| Gris `#6E737A` / Papel | 4,33 | **solo texto grande** (puntos y barras de los dominios) |
| Gris texto `#676C73` / Papel | 4,80 | texto chico secundario ✔ |
| Tinta / Link | 2,64 | ✘ no usar |
| **Link / Tinta** | **2,64** | ✘ **links en contacto y footer: van en papel subrayado, nunca en azul** |
| **Visitado / Link** | **1,08** | ✘ en el hero `:visited` no se distingue; ver abajo |
| **Visitado / Tinta** | 2,44 | ✘ en el footer `:visited` no cambia de color |
| **Gris texto / Tinta** | 3,22 | ✘ texto secundario sobre tinta: papel al 60 % (`#9C9E9E`, 6,34) |
| Papel 70 % sobre Link (`#B5BEF6`) | 3,59 | ✔ puntos y barras del dominio del hero (texto grande, ≥ 3:1) |
| Línea `#D5D8DC` / Papel | 1,30 | solo como divisor decorativo; los bordes de input van en Gris (4,33 ≥ 3:1, criterio 1.4.11) |

Para verificar: repetirlo con una herramienta externa (WebAIM o el panel de DevTools) en el Bloque 1.

**`:visited` en el hero.** La spec solo deja cambiar el color en `:visited`, y sobre el azul el violeta no contrasta. Por eso en el hero no se marca el estado visitado. El estado "visto" aparece en la lista de casos, que está sobre papel, con el color Visitado. Es honesto con la metáfora (el hero es la URL "seleccionada" y la lista es el historial) y no depende solo del color en un fondo donde no se ve.

### Tipografía: Schibsted Grotesk variable (400–900), latin + latin-ext
| Token | Valor | 375 | 1440 | Peso / interlineado | Uso |
|---|---|---|---|---|---|
| `--t-domain-hero` | `clamp(1.75rem, 0.4rem + 6vw, 6rem)` | ~29 px | 96 px | 850 / 0.92 | dominio cinético |
| `--t-h1` | `clamp(1.75rem, 1.2rem + 2.6vw, 4rem)` | ~29 px | 64 px | 700 / 1.02 | H1 del hero |
| `--t-domain-row` | `clamp(1.75rem, 0.8rem + 4.2vw, 5rem)` | ~28 px | 80 px | 800 / 0.95 | filas de la lista, título del caso |
| `--t-h2` | `clamp(1.75rem, 1.3rem + 1.9vw, 3rem)` | ~28 px | 48 px | 700 / 1.05 | secciones |
| `--t-h3` | `clamp(1.25rem, 1.1rem + 0.7vw, 1.75rem)` | ~21 px | 28 px | 650 / 1.15 | servicios |
| `--t-lead` | `clamp(1.125rem, 1.05rem + 0.4vw, 1.375rem)` | 18 px | 22 px | 450 / 1.4 | bajadas |
| `--t-body` | `clamp(1rem, 0.96rem + 0.2vw, 1.125rem)` | 16 px | 18 px | 400 / 1.55 | texto, máx. `68ch` |
| `--t-small` | `0.875rem` | 14 px | 14 px | 500 / 1.4 | metadatos (Gris texto) |

Contraste de escala en desktop: el dominio a 96 px contra el texto a 18 px es **5,3×**. El salto fuerte está en el peso (850 contra 400) y en el ancho de bloque, no solo en el tamaño. Esto es así porque el dominio más largo, `laestacionfutbolpadel.com.ar` (28 caracteres), limita el tamaño máximo. Ver el riesgo R1.

### Movimiento (`src/lib/motion.ts` + variables CSS). Un solo sistema; la investigación tiene razón en esto
- `--ease-out: cubic-bezier(.16, 1, .3, 1)` (expo out), `--ease-in: cubic-bezier(.7, 0, .84, 0)`, `--ease-io: cubic-bezier(.65, 0, .35, 1)`
- `--d-micro: 180ms`, `--d-ui: 260ms`, `--d-reveal: 360ms`, `--d-char: 420ms`, `--stagger-char: 24ms`
- Sin rebote (`back.out`) y sin rotación aleatoria por letra: eso es la firma de Mat Voyce, no la de Francisco, y el rodillo tiene que leerse como un sistema, no como una ilustración.

---

## 6. Plan visual de la home

### 1440 × 900 (puntero fino)
```
┌──────────────────────────────────────────────────────────────────────── #2440FF a sangre, 100svh máx ┐
│ gom.ar                                                      es · en      [Escribime por WhatsApp]   │ header: 64px
│                                                                                                    │
│ H1 (papel, 64px, 7 col)                                     ┌──────────────────────────────┐       │
│ Diseño y desarrollo sitios que [COPY B2]                     │                              │       │
│ ............................................                │   captura viva               │ 5 col │
│                                                             │   (wipe + scroll interno     │       │
│ laestacionfutbolpadel                                       │    + parallax ±12px)         │       │
│ .com.ar                       ← dominio 96px/850, 2 líneas  │                              │       │
│                                 reservadas                  └──────────────────────────────┘       │
│ [Escribime por WhatsApp]  Ver casos                                              [❚❚ Pausar]       │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
┌ papel ────────────────────────────────────────────────────────────────────────────────────────────┐
│ Casos                                                                                              │
│ ─────────────────────────────────────────────────────────────────────────────────────────── línea │
│ App Megatlon · iOS y Android              UX/UI · Producto · 2025         ┌───────────┐            │
│ ───────────────────────────────────────────────────────────────────       │ preview   │ sigue al   │
│ laestacionfutbolpadel.com.ar  ← hover/foco  Next.js · 2025                │ con lerp  │ cursor     │
│ ───────────────────────────────────────────────────────────────────       └───────────┘            │
│ fiter.com/UY · drivingnorte.com.ar · megatlon.com · instagram.com/megatlon · Quicktrade (filas)    │
│ También: Shantala · Terrazas del Gutiérrez (bloque compacto, 1 línea cada uno)                     │
├────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Servicios  (grilla 4/8: título izq., 3 servicios en filas con alcance + "desde USD [COMPLETAR]")   │
├────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Cómo trabajo con IA (2 columnas: "Qué acelera" | "Qué controlo yo")                                │
├────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Sobre mí  [FOTO FRANCISCO 4 col]  3 líneas (8 col)                                                 │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
┌ tinta ────────────────────────────────────────────────────────────────────────────────────────────┐
│ H2 contacto (papel)                          Formulario (nombre, email, tipo, presupuesto, msg)   │
│ [Escribime por WhatsApp] (botón papel)       Respondo en menos de 24 h                            │
│ email · LinkedIn · Behance (papel subrayado)                                                       │
│ footer: © gom.ar · selector de idioma                                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
La grilla es de 12 columnas con margen de `clamp(1rem, 4vw, 4rem)`. Todo va alineado a la izquierda. La asimetría sale de que el texto ocupa 7 columnas y la imagen 5, sin espejo.

### 375 × 667 (táctil)
```
┌ #2440FF, 100svh máx ─────────────┐
│ gom.ar          es ▾    [WA]     │ 56px
│ ┌──────────────────────────────┐ │
│ │ captura viva (reducida,      │ │ 16:10, ~200px de alto
│ │ sin parallax)                │ │
│ └──────────────────────────────┘ │
│ H1 (29px, 3–4 líneas)            │
│ laestacionfutbolpadel            │ dominio 29px, 2 líneas reservadas
│ .com.ar                          │
│ [Escribime por WhatsApp]         │ botón ancho completo, 48px
│ Ver casos              [❚❚]      │
└──────────────────────────────────┘
┌ papel ───────────────────────────┐
│ ┌────────────┐                   │ miniatura arriba del dominio
│ │ miniatura  │                   │ (la fila central se activa
│ └────────────┘                   │  con scroll-driven animation)
│ laestacionfutbol                 │
│ padel.com.ar                     │
│ Next.js · 2025                   │
│ ──────────────────────────────── │
│ ...                              │
│ Servicios / IA / Sobre mí        │ una columna
└──────────────────────────────────┘
┌ tinta: contacto + footer ────────┐
```
**Riesgo real a 375:** H1 + captura + dominio + CTA dentro de 667 px de alto. Si no entra, la captura del hero mobile baja a 16:9 o se sacrifica el CTA secundario, pero nunca el CTA de WhatsApp. Se mide en el Bloque 2.

---

## 7. Hero: timeline de un ciclo (T = 3000 ms)

Capas, de abajo hacia arriba:
- **L0** fondo azul (estático).
- **L1** H1 (estático).
- **L2** dominio. Un `<a>` con `aria-label` igual al dominio y `<span aria-hidden>` por carácter, dentro de una máscara (`overflow: hidden`, alto de 1 línea más el descendente).
- **L3** marco de la captura (`overflow: hidden`). Adentro: **L3a** wrapper de parallax, **L3b** imagen alta, **L3c** cortina azul para el wipe.
- **L4** controles (pausa y siguiente).

| t (ms) | Capa | Operación | Duración | Easing |
|---|---|---|---|---|
| 0 | L2 | dominio *n* asentado (de lectura) | — | — |
| 0 → 3000 | L3b | `translateY(0 → -12%)` scroll interno | 3000 | `linear` |
| siempre | L3a | `translate(±12px)` hacia el puntero, lerp 0,08 en rAF (solo `pointer: fine`) | continuo | lerp |
| 2150 | L2 | cada letra *n* sale: `translateY(0 → -105%)` | 260 + 24·i | `--ease-in` |
| 2150 | L3c | la cortina entra: `translateX(-101% → 0)` | 320 | `--ease-in` |
| 2470 | L3b | cambia a la imagen *n+1* (ya decodificada con `img.decode()`), `translateY` vuelve a 0 | 0 | — |
| 2470 | L3c | la cortina sale: `translateX(0 → 101%)` | 380 | `--ease-out` |
| 2400 | L2 | cada letra *n+1* entra: `translateY(105% → 0)` | 420 + 24·i | `--ease-out` |
| 3000 | — | arranca el ciclo *n+1* | | |

- **Hold legible por dominio:** de alrededor de 1,1 s (fin de la entrada en el dominio más largo) a 2,15 s, más 2,4 s en el estado anterior. El dominio queda quieto unos 1,7 s por ciclo. **[MEDIR en B2: si se lee mal, T sube a 3500 ms; el brief permite de 2,5 a 3 s, así que un cambio así requiere aprobación.]**
- **Cómo se implementa:** WAAPI (`el.animate`) con `composite` por defecto, solo `transform`. `will-change: transform` se pone 50 ms antes de cada transición y se saca en `finish`.
- **Arranque:** después de `load` + doble `requestAnimationFrame`. Hasta ahí el HTML muestra el dominio 1 y la captura 1, ya completos.
- **Pausa** (botón con `aria-pressed`, evento `hero_pause`): se aplica `animation.pause()` a todo y se detiene el `setTimeout` del ciclo.
- **Pausa automática:** con `IntersectionObserver` (hero fuera de vista), `visibilitychange` y `focusin` dentro del hero (no cambia el link mientras alguien lo enfoca con teclado).
- **`prefers-reduced-motion: reduce`:** no hay ciclo, parallax ni scroll interno. El botón "Siguiente caso" cambia el dominio y la captura sin animación.
- **Sin JS:** se ven el dominio 1 y la captura 1 como links estáticos. El botón de pausa no se renderiza en el HTML: se inserta desde JS.
- **Ciclo:** la app y las 4 webs (`inHero: true`). Las redes y Quicktrade no entran.
- **Lector de pantalla:** no se anuncia el cambio (no hay `aria-live`). Debajo del hero, una lista visualmente oculta "Casos en el hero" con los 5 links para que no dependan de la rotación.

### Alternativa B (solo boceto en B2): "tipografía-pantalla"
"gom.ar" gigante funciona como máscara y las capturas pasan por dentro de las letras. Hacerlo con `background-clip: text` obliga a pintar en cada frame. La vía barata es un SVG `<clipPath>` estático y mover la imagen con `transform`. Hay que medir si genera paint.

---

## 8. Riesgos de performance del hero y cómo se miden

| # | Riesgo | Mitigación | Cómo se mide |
|---|---|---|---|
| R1 | El dominio de 28 caracteres limita el tamaño del dominio (alrededor de 29 px a 375 aunque se parta en 2 líneas) | se parte en el "." antes del TLD; se reservan 2 líneas siempre (sin CLS); el tamaño se fija contra el segmento más largo; en B2 se prueba escalar con `transform` por dominio | capturas de Playwright a 375 y 1440 en cada dominio; CLS en Lighthouse |
| R2 | El LCP no es el H1 sino la captura o el dominio (el elemento más grande) | los tres están en el HTML con opacidad 1; la captura 1 con `priority` y en AVIF | `PerformanceObserver('largest-contentful-paint')` en Playwright + Lighthouse mobile |
| R3 | Las imágenes del hero pasan de 150 KB antes de `load` | solo se precarga la captura 1 (mobile ~640 px de ancho, AVIF q≈60, objetivo ≤ 70 KB); las 4 restantes se piden después de `load` con `fetchpriority="low"` | Playwright: suma de `transferSize` de las imágenes antes de `load` a 375 |
| R4 | El swap de la fuente mueve el dominio gigante | `next/font` con `adjustFontFallback` (métricas ajustadas) y `display: swap`; solo un archivo variable latin | CLS < 0,05 en Lighthouse; trace con "Layout shift" |
| R5 | Partir el dominio en spans genera layout en cada ciclo | se cambia el texto mientras está fuera de la máscara; el ancho de la fila queda fijo (2 líneas reservadas) | Performance panel con CPU 4×: ningún "Layout" ni "Paint" completo durante el ciclo |
| R6 | La imagen alta (scroll interno) es grande y repinta | se mueve solo con `transform`; capa propia con `will-change` durante el ciclo; tamaño máximo de 1200 × 2400 px | "Rendering → Paint flashing" + fps en Performance panel con 4× |
| R7 | El JS del hero pasa de 6 KB gzip | vanilla en un único componente cliente, sin estado React por frame (refs + WAAPI) | `@next/bundle-analyzer`: chunk del hero en gzip |
| R8 | Tareas largas al hidratar | el hero es el único island cliente arriba del fold; el resto es Server Components | Lighthouse TBT < 150 ms + `longtask` observer los primeros 5 s con CPU 4× |
| R9 | Decodificar la captura en el swap causa jank | `img.decode()` antes del cambio; si no resuelve a tiempo, se saltea el ciclo | frames en Performance panel durante el swap |

El presupuesto no se sube. Si algo falla, el orden es: simplificar la animación, reducir el asset y, por último, sacar el efecto.

---

## 9. Contradicciones

### Investigación (`REFERENCIAS-PORTFOLIOS.md`) contra el brief: gana el brief
| La investigación recomienda | El brief dice | Decisión |
|---|---|---|
| Lenis / smooth scroll con inercia | prohibido (INP, a11y) | no va |
| Preloader con arco y botón START | prohibido | no va |
| Cursor propio con estados y máscara que sigue al cursor | prohibido el cursor custom | no va. La idea de "foco que sigue al puntero" sobrevive como la preview de la lista, que sigue el cursor (permitida) |
| GSAP + SplitText + ScrollTrigger | cero librerías de animación en el bundle inicial | WAAPI + CSS. El rodillo por letra se arma con spans propios, que es la alternativa que la propia investigación menciona |
| Line reveal / fade al entrar en cada sección | fade-up prohibido | no va. Sin movimiento autónomo fuera del hero |
| Ease `back.out(1.7)` + rotación aleatoria ±12° | no lo prohíbe, pero el concepto es sistémico | no va (ver Tokens de movimiento) |
| `clip-path: circle()` animado en un elemento grande | no animar `clip-path` en elementos grandes | no va; las máscaras son `overflow` + `transform` |
| Micro-sonido opcional | no está en el presupuesto de movimiento | no va |
| Transición con shader (ogl) | sin WebGL en el hero | no va |
| Código para Pages Router / `_app.js` | App Router | desactualizado |

Se toma de la investigación:
- un solo sistema de movimiento (tokens);
- solo `transform` y `opacity`;
- un video a la vez con poster y `preload="none"`;
- pausar lo que no se ve;
- presets por `pointer: coarse` y `prefers-reduced-motion`;
- contraste de escala extremo y paleta restringida.

### Brief contra la realidad verificada
1. **Pages Router:** ya está en App Router (sección 1).
2. **Megatlon Shop no es WordPress:** es **Tienda Nube** y hoy está **protegida con contraseña** (`shop.megatlon.com → /password/`, `x-robots-tag: nofollow`).
3. **`fiter.com/UY` distingue mayúsculas:** `fiter.com/uy` redirige a `/AR`. El link tiene que ser exactamente `/UY`.
4. **Email de contacto:** el brief dice `frangomar8@gmail.com`; la cuenta de Francisco es `info@gom.ar`. **[DECIDIR]**
5. **Handle de Instagram:** verificado. `megatlon.com` linkea `instagram.com/megatlon`.
6. **Ramas:** git no permite `redesign` y `redesign/bN` a la vez. Se usa `redesign` + `redesign-bN-nombre`.

---

## 10. Verificación de los sitios de clientes (2026-10-22, curl)

| Caso | URL | Resultado | `liveVerified` |
|---|---|---|---|
| La Estación | `https://www.laestacionfutbolpadel.com.ar` | 200; `robots.txt` = `Disallow: /`; `<meta name="robots" content="noindex, nofollow">` | **false** |
| Fiter UY | `https://fiter.com/UY` | 200 (HubSpot); el menú sigue diciendo **"Entrenameinto"** | **false** |
| Driving Norte | `https://drivingnorte.com.ar` | 200 (WordPress); `noindex, nofollow`; "11:45" y "Lunes: 12:00 a 22:00 hs" conviven | **false** |
| megatlon.com | `https://megatlon.com` | 200; `index, follow`; robots sin bloqueo | **true** |
| Megatlon Shop | `https://shop.megatlon.com` | redirige a `/password/` (Tienda Nube cerrada) | **false** |
| Instagram | `instagram.com/megatlon` | handle confirmado desde megatlon.com; no hice fetch a Instagram | **true** (para revisar en B4) |
| App | tiendas | no encontré links a App Store ni Google Play en megatlon.com | [COMPLETAR LINKS TIENDAS] |

**Impacto:** hoy solo se renderizaría "Ver online" en megatlon.com. Los cuatro problemas los puede arreglar el equipo de Megatlon en minutos (Francisco tiene acceso a esos sitios). Es el pendiente de mayor impacto en credibilidad.

---

## 11. Plan por bloque (ajustado)
- **B1:** `npm ci`; sacar framer-motion y el boilerplate; tokens + `next/font`; skip link; layout; `track.ts`; tooling (Playwright, LHCI con los presupuestos como assertions, axe, analyzer). Se verifica la versión estable de Next y el soporte de View Transitions en React 19.3.
- **B2:** lab hero-a / hero-b, copy-variantes y mediciones. **Punto de control.**
- **B3:** home en es y en; `publishedLocales = ['es','en']`.
- **B4:** casos + view transition + `:visited`.
- **B5:** formulario, eventos, SEO.
- **B6:** pt-BR; fr y zh detrás del flag.
- **B7:** QA y PR a main.

---

## 12. Assets y datos faltantes

Mandá las capturas en **PNG sin comprimir**. El peso del archivo fuente no importa: `next/image` genera el AVIF y el WebP. Las dimensiones sí son exactas, en píxeles. Las rutas son las del repo.

### Capturas por caso web (`laestacionfutbolpadel`, `fiter-uy`, `drivingnorte`, `megatlon`)
| Archivo | Tamaño | Qué es |
|---|---|---|
| `src/content/casos/{slug}/img/cover.png` | 2880 × 1800 | primera pantalla en desktop (1440 × 900 @2x), sin barras del navegador ni banners de cookies |
| `src/content/casos/{slug}/img/hero-scroll.png` | 1440 × 2880 | página completa desde arriba, 2 pantallas de alto @1x (scroll interno del hero) |
| `src/content/casos/{slug}/img/mobile.png` | 1170 × 2532 | primera pantalla en mobile (iPhone @3x) |
| `src/content/casos/{slug}/img/detalle-01.png` … `detalle-03.png` | 2880 × 1800 | secciones que ilustran las decisiones clave |
| `src/content/casos/megatlon/img/shop-cover.png` | 2880 × 1800 | Megatlon Shop (hoy está detrás de la contraseña) |

### App Megatlon (`app-megatlon`)
| Archivo | Tamaño |
|---|---|
| `src/content/casos/app-megatlon/img/cover.png` | 2880 × 1800 (composición de pantallas sobre fondo liso) |
| `src/content/casos/app-megatlon/img/hero-scroll.png` | 1179 × 2556 (una pantalla alta para el ciclo del hero) |
| `src/content/casos/app-megatlon/img/pantalla-01.png` … `pantalla-06.png` | 1179 × 2556 (iPhone @3x), antes y después si existe |
| `src/content/casos/app-megatlon/img/plan-ia-01.png` | 1179 × 2556 (pantalla de planes generados con IA) |

### Redes (`instagram-megatlon`), agrupadas por campaña: `hotmega`, `blackmega`, `cybermega`, `mundial`, `feed`
| Archivo | Tamaño |
|---|---|
| `src/content/casos/instagram-megatlon/img/{campana}-01.png` … | 1080 × 1350 (post 4:5) |
| `src/content/casos/instagram-megatlon/img/{campana}-story-01.png` … | 1080 × 1920 |
| `public/casos/instagram-megatlon/{campana}-loop-01.mp4` | 1080 × 1350, ≤ 8 s, sin audio (yo lo bajo a 720 px y ≤ 1 MB, H.264 + poster) |
| `src/content/casos/instagram-megatlon/img/{campana}-senaletica-01.png` | 2000 × 1500 (foto o mockup de la señalética) |

### Quicktrade (`quicktrade`)
| Archivo | Tamaño |
|---|---|
| `src/content/casos/quicktrade/img/cover.png` | 2880 × 1800 |
| `src/content/casos/quicktrade/img/landing-01.png` … `landing-04.png` | 1440 × alto real (página completa @1x) |
| `src/content/casos/quicktrade/img/app-01.png` … `app-04.png` | 1170 × 2532 |

### Otros
| Archivo | Tamaño |
|---|---|
| `src/content/about/francisco.jpg` | 1600 × 2000 (4:5), luz natural, fondo neutro |
| `src/content/secundarios/shantala.png` | 2000 × 1500 (stand o packaging) |
| `src/content/secundarios/terrazas.png` | 1080 × 1350 (una pieza de redes) |
| Figmas | links con permiso de lectura: app, Quicktrade y los que tengas |

### Datos
1. Los 3 servicios, con su alcance y el "desde USD" de cada uno.
2. Los rangos de presupuesto del formulario.
3. El email de destino del formulario y el visible: `frangomar8@gmail.com` o `info@gom.ar`.
4. `RESEND_API_KEY` + el dominio `gom.ar` verificado en Resend (DNS), cargados en Vercel. Sin eso funciona el fallback mailto.
5. El año (o el rango) de cada caso.
6. El rol exacto tuyo y el del equipo en cada caso (ver las fichas): Amalgama en la app, la agencia o el equipo en redes.
7. El alcance de redes: formatos, desde cuándo y qué piezas son 100 % tuyas.
8. Cifras de sedes y socios de Megatlon, con fuente, o se omiten.
9. Links de la app en App Store y Google Play.
10. Cualquier número real de resultado: PageSpeed antes y después, plazos, indexación, Analytics de los clientes.
11. Confirmación de que se puede mostrar Quicktrade (SBS) y los freelance.
