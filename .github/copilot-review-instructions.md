<!-- Architecture, patterns and security rules are in CONTEXT.md at repo root. -->

## TypeScript

- Use Aksel Design System spacing tokens (`space-16`), never Tailwind `p-*`/`m-*`
- TypeScript strict mode — no `any` without justification
- Named imports from `@navikt/ds-react`, never `import *`

## Norwegian text (all `.md` and user-facing strings)

- Use Norwegian bokmål for user-facing text
- Avoid unnecessary anglicisms when good Norwegian alternatives exist

## Over-editing

Flag changes where the diff is disproportionate to the stated goal:

- Renamed variables or parameters not related to the fix
- Restructured working code without justification
- Added refactoring outside the PR scope
