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
- `/presupuesto` (ruta vieja, ya borrada) va con un 301 a `/es` en B1.

### Decisiones de Francisco (2026-10-22)
- Aprobados los 8 puntos del resumen del Bloque 0.
- Los sitios de clientes se linkean como están. `liveVerified` pasa a significar "responde y muestra el sitio". Solo quedan en `false` la Shop (contraseña) y Quicktrade.
- El email de contacto es `info@gom.ar`.
- **Sin precios en el sitio**, nunca. Esto contradice la Parte D del brief ("desde USD") y gana Francisco.
- Años: Megatlon, Fiter, La Estación y Driving Norte, 2025–hoy. Quicktrade según el CV, jul. 2022 – dic. 2023 (Francisco había dicho 2022–24, queda para confirmar).
- Ownership: megatlon.com y la app desde feb. 2025; Fiter UY y Driving Norte desde ago. 2025; La Estación desde oct. 2026.
- Dato publicable: megatlon.com tiene ~70.000 visitas/mes (Google Analytics, revisado por Francisco).
- Francisco tiene permiso para mostrar todo.

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
