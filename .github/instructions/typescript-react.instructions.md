---
applyTo: "src/**/*.{tsx,ts}"
---

# TypeScript & React – kodestil

Konvensjoner for TypeScript og React-komponenter i dette prosjektet.

## Typer

- Bruk **`type`** fremfor `interface` for props og hjelpetyper.
- **Aldri `any`** — bruk `unknown` + type guards eller Zod-validering.
- Returtype `JSX.Element` (evt. `Promise<JSX.Element>` for async server-komponenter) når det gir verdi. Enkle komponenter kan bruke inferred returtype.
- Modeller `null`/`undefined` eksplisitt i typer (`children?: React.ReactNode`).

## Komponenter

**Hovedregel**: Bruk **funksjonsdeklarasjon** som standard.

```tsx
type SectionProps = {
  title: string;
  children?: React.ReactNode;
};

export default function Section({ title, children }: SectionProps): JSX.Element {
  return <section aria-label={title}>{children}</section>;
}
```

**Unntak** — bruk `const` pilfunksjon kun ved:
1. `React.memo`
2. `forwardRef`
3. Generiske komponenter (`<T,>`)
4. Manuell `displayName`

```tsx
// memo
const Tag = memo(function Tag({ label }: TagProps): JSX.Element {
  return <span>{label}</span>;
});
Tag.displayName = "Tag";

// forwardRef
const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { onClick, children }: ButtonProps,
  ref,
): JSX.Element {
  return <button ref={ref} type="button" onClick={onClick}>{children}</button>;
});
Button.displayName = "Button";

// Generisk
const List = <T,>({ items, renderItem, ariaLabel }: ListProps<T>): JSX.Element => {
  return (
    <ul aria-label={ariaLabel}>
      {items.map((item, index) => <li key={index}>{renderItem(item, index)}</li>)}
    </ul>
  );
};
```

## Hooks

Skriv som **funksjonsdeklarasjon**:

```ts
// ✅
export function useInViewport<T extends Element>(options: UseInViewportOptions = {}): UseInViewportResult<T> { ... }

// ❌
export const useX = (...) => { ... }
```

Pilfunksjoner er OK for inline callbacks (useEffect, event handlers).

## Eksport

- **Default export** i Next.js rutefiler (`page.tsx`, `layout.tsx`).
- Named exports ellers i delte komponenter/utilities.

## Generelle regler

- All kode i **TypeScript** (aldri JavaScript).
- Bruk **beskrivende navn** — `totalCount` ikke `cnt`, `userPreferences` ikke `prefs`.
- Kommenter kun kompleks logikk eller begrunnelser/avvik.
- Skriv små, gjenbrukbare komponenter. Trekk ut logikk i hooks/utils.
- `"use client"` kun når nødvendig (interaksjon, state, effects, nettleser-API).
- Alle eksterne data er `unknown` → valider med Zod (`safeParse()`, aldri `parse()`) → transformer til sikre typer.
