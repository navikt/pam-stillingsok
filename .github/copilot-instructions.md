# Copilot Instructions for pam-stillingsok

<!-- Single source of repo rules for all Copilot surfaces, including code review.
     Generic Nav, Aksel, and accessibility guidance comes from the global nav-pilot setup.
     Data flows, domain terms, and auth details are in CONTEXT.md. -->

> Når du rapporterer informasjon til meg, vær ekstremt kortfattet og ofre grammatikk for korthetens skyld.

## Repository Overview

Stillingsøk-frontend på arbeidsplassen.no. Next.js 16 (App Router), TypeScript, Vitest, Testing Library, pnpm, Biome, Aksel (`@navikt/ds-react` v8).
Lar jobbsøkere søke i stillinger (uautentisert) og lagre favoritter/søk (autentisert via ID-porten).

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
- **Zod**: All external data is `unknown` until validated with `safeParse()`.
- **Server-only code**: modules with secrets, tokens, or backend calls import `server-only`.
- **Tracking**: `trackEvent()` from `src/app/_common/umami/`.
- **Logging**: `appLogger` from `src/app/_common/logging/appLogger.ts`.

## Code Style

- Components and hooks are function declarations. Use `const` arrows only for `memo`, `forwardRef`, or generic components.
- Default exports only in Next.js route files (`page.tsx`, `layout.tsx`, etc.); named exports elsewhere.
- Use Aksel layout primitives and `space-*` tokens over custom CSS; CSS Modules when needed.
- `"use client"` only for interaction, state, effects, or browser APIs.
- User-facing text in Norwegian bokmål, without unnecessary anglicisms.

## Scope

Match the solution's complexity to the problem. For straightforward changes, implement directly without lengthy plans or step-by-step narration.

- Make the smallest change that fully solves the task. Do not rename, restructure, or refactor unrelated code.
- Reuse existing components, hooks, utilities, and Aksel components before creating new ones.
- No abstractions, options, or flexibility for hypothetical needs. Some duplication beats a premature abstraction.
- No new state, effects, context, `useMemo`, `useCallback`, or `React.memo` without a concrete need.
- No defensive code for states excluded by types or Zod-validated data: no redundant `?.`, fallbacks, null checks, or `try/catch` without real recovery. Never swallow errors.
- Do not add docs, examples, or files unless asked. Remove code made obsolete by the change.
- Ask before adding dependencies (including test tools like axe or Lighthouse) or changing authentication.

## Comments

Write only absolutely necessary comments — self-explaining code over comments, per Clean Code. When one is truly needed, explain *why*, not *what*, and keep it short:

- Never restate a name, type, prop, or what the next line does — rename instead.
- Document a rationale once, at the site it constrains — not again in callers, tests, or related components.
- Keep it to a line or two; a multi-paragraph comment usually means the design needs the work, not the documentation.
- No JSDoc on self-explanatory components, hooks, functions, or types. No section-marker comments.
- Keep existing comments that explain decisions, workarounds, or non-obvious behavior.

## Testing

Each test must protect against a realistic regression not already covered at the same layer. Test every business rule and deliberate product decision, and name the behavior it protects.

Different inputs, boundaries, or branches aren't necessarily different behaviors. Prefer representative cases; add more only to catch distinct regressions.

- **Read existing tests first:** extend them instead of duplicating cases or files.
- **Rules, not constants:** test a value or config only when it encodes a rule or contract. Skip tests that only restate a default, debounce value, CSS class, copy text, or config.
- **Our code, not the framework:** skip TypeScript, Zod, React, Next.js, and built-in Aksel guarantees, and trivial pass-through props or wrappers. Examples: Zod rejecting a wrong type, an Aksel `Button` rendering its label, Next.js `redirect()` navigating.
- **Lowest proving layer:** unit tests for logic, component tests for interaction. Do not repeat a behavior across layers.
- **Behavior, not implementation:** assert what the user sees or the function returns, not internal state, hook calls, or markup. Query by role, label, or accessible name with `userEvent`; avoid snapshots and `data-testid`.
- **Mock boundaries only:** mock network and external services, not the code under test.
- **Avoid speculative tests:** test realistic failures and boundaries, not impossible states or hypothetical changes.
- Presentational, copy, and pure refactoring changes usually need no new tests. Never weaken assertions to make tests pass.
- Name tests as a sentence: subject, behavior, condition — e.g. `shows error summary when email is invalid`.

## Git

- Branch: `<type>/<jira-id>_<short-description>`, e.g. `feat/ARB-123_lagre-sok-varsel`. Without a Jira ID: `<type>/<short-description>`.
- `<type>` matches the commit type: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`. `<short-description>` is lowercase kebab-case, a few words, no æøå.
- If the user hasn't given a Jira ID (`ARB-<number>`), ask for it before creating the branch. Create it without an ID if they have none.
- Commits follow Conventional Commits with a scope and a Norwegian imperative description, e.g. `fix(favoritter): skill URL-håndtering fra stillingssøket`.

## Before Finishing

- Re-read the diff and remove unnecessary changes, comments, abstractions, and tests.
- Run focused checks: `pnpm exec biome check <files>`, `pnpm exec stylelint <css files>` for CSS, `pnpm test <path>`, and `pnpm compileTS` when types change.
- Report skipped or failing checks. Never claim a check passed without running it.

## Code Review

- Prioritize incorrect behavior, security issues, and data loss. Describe the failing scenario, its consequence, and the affected code.
- Check callers when shared code changes, not just the changed function.
- Check authorization in Server Actions and Route Handlers; hiding UI is not access control.
- Flag personal data or credentials passed from Server Components to Client Components, logs, or error responses without need.
- When caching changes (Next.js cache or Redis/Valkey), check whether one user's data can reach another user.
- Flag server-only code, secrets, or tokens that can end up in the client bundle.
- For form changes, check labels, keyboard access, and that validation errors are tied to their fields.
- Flag violations of Scope, Comments, and Testing above, including diffs disproportionate to the stated goal.
- When a regression test is missing, describe the case it should cover.
- Distinguish confirmed defects from concerns that need verification. Skip formatting and import order; Biome checks them.

## Security

- No secrets, tokens, or credentials in code.
- GitHub Actions pinned to full SHA with version comment.
