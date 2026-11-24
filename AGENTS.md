# AGENTS.md — pam-stillingsok

Stillingsøk-frontend på arbeidsplassen.no.

- Regler for kode, tester, kommentarer, Git og review: `.github/copilot-instructions.md`.
- Dataflyter, autentisering og domenebegreper: `CONTEXT.md`.

## Kommandoer

```bash
pnpm test                       # Vitest
pnpm lint                       # Biome + Stylelint
pnpm compileTS                  # Typesjekk
pnpm exec biome check <filer>   # Lint og format av enkeltfiler
pnpm exec stylelint <css-filer> # Aksel-regler for CSS
```

- Kjør verktøy via `pnpm` / `pnpm exec`, aldri `npx`. `npx` laster ned pakker som ikke er i repoet.
- Vitest leser ikke `.env`-filer (`envDir: false`). Tester må sette nødvendige miljøvariabler selv.
- Husky kjører lint-staged ved commit og `compileTS` + tester ved push.
