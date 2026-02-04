# Performance Budget

## Target pages
- `/`
- `/gallery`
- `/exhibit`

## Budgets
- Mobile LCP: <= 2.5s
- INP: <= 200ms
- CLS: <= 0.1
- Gallery interaction: smooth drag/drop with frame time mostly < 16ms

## Baseline and regression workflow
1. Open Chrome DevTools Performance + Lighthouse.
2. Capture metrics for each target page.
3. Record:
   - LCP, INP, CLS
   - Total JS transferred
   - Total image bytes
   - Drag/drop frame consistency on `/gallery`
4. Compare against this budget before each production deploy.
