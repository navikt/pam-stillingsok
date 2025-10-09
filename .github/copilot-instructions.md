# GitHub Copilot Instructions

Disse instruksjonene gjelder for alle forslag Copilot gir i dette prosjektet.  
Målet er konsekvent, typesikker og idiomatisk kode for **Next.js 14**, **TypeScript** og **Vitest** – uten bruk av `any`.

---

## Generelle retningslinjer

- All kode skal være skrevet i **TypeScript** (ikke JavaScript).
- Bruk **`type`** fremfor `interface` når du definerer typer.
- **Aldri bruk `any`**. Dersom typer er usikre, bruk `unknown` og snevre inn via type guards eller validering (f.eks. Zod).
- Følg **strict typing** i hele koden (ingen implicit `any`, unngå løse typer).
- Bruk **beskrivende navn** for variabler og funksjoner.
    - Unngå 1–2 bokstaver eller kryptiske forkortelser (`a`, `b`, `x`, `obj`, `acc`).
    - Velg navn som gjør koden selvforklarende, også når man ser den utenfor kontekst.
    - Bruk `totalCount` fremfor `cnt`, `userPreferences` fremfor `prefs`, osv.
- Kommenter kode kun når det forklarer kompleks logikk eller begrunnelser/avvik.
- Skriv små, gjenbrukbare komponenter. Trekk ut logikk i hooks/utils når hensiktsmessig.
- Tilgjengelighet (WCAG): når du skriver UI, sørg for semantikk, labels, fokusrekkefølge og tastaturnavigasjon.

---

## Prosjektspesifikke rammer

- **Next.js 14** med **App Router**.
- **Functional components** med sterkt typede props.
- Bruk `"use client"` **kun** når nødvendig (interaksjon, state, effects, nettleser-API).
- Følg ESLint- og Prettier-regler (idiomatisk Next.js/React).
- Datahenting følger Next.js-praksis: **React Server Components** og caching der egnet.
- API-kall skal være **typeriktige** og valideres (f.eks. **Zod**). Behandle ukjente inputs som `unknown` → valider → transformer til sikre typer.

---

## Component style (React + TypeScript)

**Hovedregel**
- Bruk **funksjonsdeklarasjon** som standard for React-komponenter.
- Bruk **`const` pilfunksjon** kun når du (1) bruker `React.memo`, (2) bruker `forwardRef`, (3) skriver **generiske** komponenter, eller (4) må sette `displayName` manuelt.

**Krav**
- Bruk `type` fremfor `interface` for props og hjelpe-typer.
- **Aldri `any`**. Ved usikker type, bruk `unknown` og snevre inn via type guards/validering.
- Oppgi eksplisitt returtype: `JSX.Element` (evt. `Promise<JSX.Element>` for async server-komponenter).
- Bevar Next.js-konvensjoner for `page.tsx`, `layout.tsx` m.m. (default export).

### Standard: Funksjonsdeklarasjon
```tsx
type SectionProps = {
  title: string;
  children?: React.ReactNode;
};

export default function Section({ title, children }: SectionProps): JSX.Element {
  return <section aria-label={title}>{children}</section>;
}
```

### Unntak 1: `forwardRef` → `const` + pilfunksjon
```tsx
import { forwardRef } from "react";

type ButtonProps = {
  onClick?: () => void;
  children?: React.ReactNode;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { onClick, children }: ButtonProps,
  ref,
): JSX.Element {
  return (
    <button ref={ref} type="button" onClick={onClick}>
      {children}
    </button>
  );
});

Button.displayName = "Button";
export default Button;
```

### Unntak 2: `memo` (+ valgfritt `forwardRef`) → `const` + pilfunksjon
```tsx
import { memo } from "react";

type TagProps = {
  label: string;
};

const Tag = memo(function Tag({ label }: TagProps): JSX.Element {
  return <span>{label}</span>;
});

Tag.displayName = "Tag";
export default Tag;
```

### Unntak 3: **Generisk** komponent → `const` + pilfunksjon
```tsx
type ListProps<T> = {
  items: readonly T[];
  renderItem: (item: T, index: number) => JSX.Element;
  ariaLabel?: string;
};

const List = <T,>({ items, renderItem, ariaLabel }: ListProps<T>): JSX.Element => {
  return (
    <ul aria-label={ariaLabel}>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
};

export default List;
```

### Next.js Server Components: tillat `async` + funksjonsdeklarasjon
```tsx
// app/example/page.tsx
export default async function Page(): Promise<JSX.Element> {
  const data = await getData();
  return <main>{data.title}</main>;
}
```

### Client Components: bruk `use client` kun når nødvendig
```tsx
"use client";

import { useState } from "react";

type CounterProps = {
  initial?: number;
};

export default function Counter({ initial = 0 }: CounterProps): JSX.Element {
  const [value, setValue] = useState<number>(initial);
  return (
    <div>
      <output>{value}</output>
      <button type="button" onClick={() => setValue((v) => v + 1)}>
        +
      </button>
    </div>
  );
}
```

### Returtyper og typing
- **Returtype:** `JSX.Element` (ikke `ReactNode` som return-type); for async: `Promise<JSX.Element>`.
- **Props:** bruk `type` (ikke `interface`).
- **Null/undefined:** modeller eksplisitt i typer (f.eks. `children?: React.ReactNode`).
- **Unngå `any`:** bruk `unknown` + innsnevring eller generiske typer.

### Eksport
- **Default export** i Next.js rutefiler (`page.tsx`, `layout.tsx`, osv.).
- Ellers kan named exports brukes fritt i delte komponenter/utilities; unngå å blande stiler vilkårlig i samme mappe.

---

## Navigasjon og ruting (Next.js)

- Bruk `next/link` for lenker og `next/navigation` for programmatisk navigasjon i App Router.
- Unngå manuelle `window.location`-endringer i klientkomponenter uten god grunn.
- Følg konvensjoner for filstruktur i `app/` (ruter, layouts, loading, error, route handlers).

---

## Datahåndtering, validering og feil

- Alle eksterne data behandles som **ukjent input** (`unknown`), valideres (f.eks. Zod), og transformeres til trygge domene-typer.
- Lag egne util-funksjoner/hooks for validering og mapping (unngå validering spredt i UI).
- Feilhåndtering:
    - Bruk Next.js `error.tsx`/`not-found.tsx` der relevant.
    - Logg tekniske detaljer, vis brukervennlige feilmeldinger.
    - Returnér tidlig ved valideringsfeil; ikke la usikre data sive videre.

---

## Testing (Vitest)

- Bruk **Vitest** med Jest-lignende API (`describe`, `it`, `expect`).
- Testfiler ligger ved siden av filen de tester:
    - `Component.test.tsx` for komponenter
    - `utils.test.ts` for hjelpefunksjoner
- Test **typer, edge cases og realistiske scenarier** (unngå over-mocking).
- For React-test: bruk `@testing-library/react` ved behov; test observerbar atferd fremfor implementasjon.
- Legg til `typecheck`-skript (`tsc --noEmit`) i CI.

---

## Tilgjengelighet (WCAG)

- Bruk semantiske elementer (`<button>`, `<nav>`, `<main>`, `<header>`, `<section>` med `aria-label` der nødvendig).
- Sørg for fokusrekkefølge, fokusindikatorer og tastaturnavigasjon.
- Tekstalternativer for ikoner/bilder (`alt`, `aria-hidden`, `aria-label`).
- Skjemaer: riktig kobling mellom label og input, feilmeldinger knyttet til felt.

---

## Mappestruktur (anbefalt)

```
src/
  app/                # Next.js App Router
  components/         # Delte UI-komponenter
  lib/                # Domene/forretningslogikk, API-klienter, validering (Zod)
  hooks/              # Delte React-hooks
  utils/              # Små hjelpefunksjoner uten React
  test/               # Evt. felles testverktøy/mocks
```

---

## Pull Requests

- Følg sjekklisten i PR-malen.
- Bruk gjerne **Copilot Actions** → *"Generate summary of the changes in this pull request"* for en detaljert AI-oppsummering som supplement til din egen beskrivelse.
- Hold PR-er små og målrettede; beskriv breaking changes tydelig.

---

## Copilot—spesifikke føringer

- Generer kun **TypeScript**.
- Ikke foreslå `any`. Bruk `unknown` + innsnevring eller generics.
- Foreslå **funksjonsdeklarasjon** for komponenter som standard; bruk `const`-pilfunksjon kun i unntakene angitt over (`memo`, `forwardRef`, generics, `displayName`).
- Når inputtype er ukjent, foreslå Zod-skjema + parsing før bruk.
- Foreslå tester (Vitest) sammen med nye utils/komponenter når det er naturlig.

---
