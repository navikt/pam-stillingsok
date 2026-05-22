# Copilot Instructions for pam-stillingsok

<!-- Kodestil, spacing og UU er dekket i .github/instructions/-filer som lastes automatisk ved filmatch.
     Detaljerte dataflyter, domenebegreper og auth-detaljer finnes i CONTEXT.md. -->

> Når du rapporterer informasjon til meg, vær ekstremt kortfattet og ofre grammatikk for korthetens skyld.

## Repository Overview

Stillingsøk-frontend på arbeidsplassen.no. Next.js 16, TypeScript, Vitest, pnpm, `@navikt/ds-react` (Aksel).
Lar jobbsøkere søke i stillinger (uautentisert) og lagre favoritter/søk (autentisert via ID-porten).

## Arkitektur

```
Bruker → Wonderwall (auth-proxy) → Next.js (pam-stillingsok)
                                        ├── arbeidsplassen-search-api  (stillinger via OpenSearch)
                                        ├── pam-aduser                 (favoritter, lagrede søk, brukerdata)
                                        ├── interest-api               (superrask søknad, trekk søknad)
                                        └── Redis/Valkey               (server-side cache)
```

- **Søk** er uautentisert — treffer search-api direkte.
- **Brukerdata** krever innlogging via pam-aduser med OBO-token (TokenX).
- **Wonderwall** håndterer ID-porten OIDC foran appen.

## Key Patterns

- **Server actions**: `_common/actions/`, `"use server"`. GET: `csrf: "none"`, skriving: `csrf: "required"`. Returtype: `ActionResponse<T>`.
- **Zod**: All ekstern data valideres med `safeParse()` — aldri `parse()`.
- **Tracking**: `src/app/_common/umami/` og `trackEvent()` — aldri `window.umami` direkte.
- **Logging**: `appLogger` fra `src/app/_common/logging/appLogger.ts`.

## Minimal Editing

When fixing a bug or implementing a feature, change only what is necessary.
Do not rename variables, restructure working code, or refactor beyond the task at hand.
Keep diffs small and focused so they are easy to review.

## Security

- No secrets, tokens, or credentials in code
- SQL queries must be parameterized
- GitHub Actions pinned to full SHA with version comment