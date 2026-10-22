# gom.ar

Portfolio de Francisco Gomar. Next.js 16 (App Router, SSG) + next-intl + Tailwind 4, deploy en Vercel.

El brief del rediseño está en `docs/rediseno-gomar.md`, el plan en `docs/PLAN.md` y el registro entre sesiones en `docs/PROGRESO.md`.

## Correr

```bash
npm ci
npm run dev        # http://localhost:3000 → /es
```

## Medir (siempre contra el build de producción)

```bash
npm run build
npm test           # Playwright: lang, un H1, axe y capturas en 375 y 1440 (test-results/shots)
npm run lhci       # Lighthouse CI mobile con los presupuestos de la Parte C como assertions
npm run analyze    # bundle analyzer: .next/analyze/client.html
```

`npm test` y `npm run lhci` levantan `next start` en el puerto 3100; si ya hay algo en ese puerto, cerralo antes.
Lighthouse usa el Chrome instalado en el sistema y throttling de DevTools (ver `lighthouserc.json`).

## Idiomas

`src/i18n/routing.ts`: `locales` lista todos; `publishedLocales` decide cuáles se generan, entran al sitemap y a hreflang. El resto da 404.
