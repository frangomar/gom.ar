# gom.ar · Registro de progreso

Leelo al empezar cada bloque y actualizalo al terminarlo. Es la única memoria entre sesiones.

---

## Bloque 0 · Auditoría y plan · 2026-10-22

**Estado:** terminado, **esperando la aprobación de Francisco**. No se escribió código de la app.
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

### Contradicciones para decidir
1. **Investigación contra brief:** Lenis, preloader, cursor custom, GSAP, line reveals y sonido. **Gana el brief**; el detalle está en PLAN.md §9. No pido cambiar nada.
2. **Brief contra realidad:**
   - el repo ya está en App Router;
   - Megatlon Shop es Tienda Nube y está cerrada con contraseña;
   - `fiter.com/UY` distingue mayúsculas;
   - el email de contacto no está definido (gmail o info@gom.ar).
3. **Tamaño del dominio del hero:** `laestacionfutbolpadel.com.ar` (28 caracteres) limita el dominio a unos 29 px en 375 y 96 px en 1440, aun partiéndolo en dos líneas. El contraste de escala lo hace el peso más que el tamaño. Se prueba en B2.

### Métricas medidas
- Contrastes WCAG calculados con un script (ver la tabla en PLAN.md §5). No los verifiqué con una herramienta externa todavía.
- No medí la performance del sitio actual: `node_modules` está incompleto (`require('react')` falla) y el sitio actual se borra de todos modos.

### Verificación de los sitios de clientes (curl, 2026-10-22)
| Caso | liveVerified | Motivo |
|---|---|---|
| laestacionfutbolpadel.com.ar | false | `robots.txt Disallow: /` + `noindex, nofollow` |
| fiter.com/UY | false | "Entrenameinto" en el menú |
| drivingnorte.com.ar | false | `noindex, nofollow`; lunes 11:45 contra 12:00 |
| megatlon.com | true | 200, index, follow |
| shop.megatlon.com | false | redirige a `/password/` |
| instagram.com/megatlon | true | el handle está linkeado desde megatlon.com (no hice fetch a IG) |
| App (tiendas) | false | faltan los links |

### Pendientes
- Francisco aprueba PLAN.md (o lo corrige).
- Assets y datos: PLAN.md §12.
- Arreglar los sitios de clientes (fuera de este repo).
- No verificado: la versión estable de Next por fuera de npm (`npm view next version` = 16.4.2), qué exporta React 19.3 para `<ViewTransition>` y el soporte actual de `animation-timeline` por navegador.

### Qué necesita el Bloque 1
- PLAN.md aprobado.
- Correr `npm ci` (node_modules roto).
- Decidir el email de contacto (afecta a `site.ts` y al JSON-LD).
- No necesita assets todavía.
