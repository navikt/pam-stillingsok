# AGENTS.md — pam-stillingsok

<!-- Full architecture, auth, patterns and security rules are in CONTEXT.md at repo root. -->

Stillingsøk-frontend på arbeidsplassen.no. Se `CONTEXT.md` for arkitektur og key patterns.

## Build & Test Commands

```bash
pnpm test           # Run tests
pnpm build          # Build
pnpm lint           # Lint
pnpm compileTS      # Kompiler TypeScript
pnpm exec biome check <filer>   # Lint og formatsjekk av enkeltfiler
```

- Lint og formatering gjøres med Biome. Repoet bruker ikke Prettier eller ESLint.
- Kjør verktøy via `pnpm` / `pnpm exec`, aldri `npx`. `npx` laster ned pakker som ikke er i repoet.
- Vitest leser ikke `.env`-filer (`envDir: false`). Tester må sette nødvendige miljøvariabler selv.

## Project Structure

```text
docs/
images/
public/
scripts/
src/
```

## Boundaries

### ✅ Always

- Run tests after changes
- Follow existing code patterns in the project
- Preserve existing code structure — do not reorganize or refactor beyond the task
- Validate all external input

### ⚠️ Ask First

- Changing authentication mechanisms
- Adding new dependencies
- Modifying database schema

### 🚫 Never

- Commit secrets or credentials
- Skip input validation on external boundaries
