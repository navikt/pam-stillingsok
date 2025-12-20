# Artikler, pageInfo, sitemap og nettstedkart

Dette er en kort forklaring på hvordan artikler under `src/app/(artikler)` fungerer, og hvordan vi bruker metadata til SEO, sitemap og nettstedkart.

## Hovedidé

Alle artikler har:

- ett `pageInfo`-objekt i `page.tsx`
- ett felles auto-generert oppslagsverk: `pageInfoConfig.generated.ts`
- felles hjelpefunksjoner for SEO og nettstedkart

Målet er at vi:

- har én kilde til sannhet for tittel, beskrivelse, språk, kategori osv.
- kan sjekke språkfordeling (bokmål/nynorsk) og når artikler sist ble oppdatert
- kan generere sitemap og nettstedkart uten ekstra manuell konfig

## Viktige typer og filer

Ligger i `src/app/(artikler)/`:

- `pageInfoTypes.ts`
    - `PageInfo` (metadata per artikkel)
    - `ArticleCategory`, `ArticleLanguage`
    - `PageInfoConfig = Record<string, PageInfo>`
- `buildPageMetadata.ts`
    - `buildPageMetadata({ meta, robots? })` lager et Next.js `Metadata`-objekt (tittel, description, open graph osv.).
- `pageInfoConfig.generated.ts` (auto-generert)
    - samler alle `PageInfo` fra artiklene. Ikke rediger denne for hånd.
- `buildSiteMap.ts`
    - `buildSiteMapGroups(...)` bygger datastruktur for nettstedkart og brukes også til sitemap.
- `siteMapCategories.ts`
    - definerer hvilke kategorier vi har i nettstedkartet.
- `workInNorwayConfig.ts`
    - config og sitemap-oppføring for sidene under `[locale]/work-in-norway/...`.
- `scripts/generate-page-info-config.ts`
    - Node/TS-script som leser alle `page.tsx` under `(artikler)` og genererer `pageInfoConfig.generated.ts`.

## Slik definerer du en artikkel

Eksempel: `src/app/(artikler)/arbeidsgivertjenester/page.tsx`

```tsx
import Arbeidsgivertjenester from "@/app/(artikler)/arbeidsgivertjenester/Arbeidsgivertjenester";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import { Metadata } from "next";

const pageInfo: PageInfo = {
    title: "Hvem kan bruke arbeidsgivertjenestene?",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description:
        "Få oversikt over arbeidsgivertjenestene på arbeidsplassen.no og hvordan du kan bruke dem i rekrutteringen.",
    updatedAt: "2025-09-15",
    // ogImagePath: "/images/arbeidsgivertjenester-open-graph.png",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <Arbeidsgivertjenester meta={pageInfo} />;
}
```

Oppskrift for ny artikkel:

1. Lag mappe under src/app/(artikler).
2. Lag page.tsx (og eventuell egen komponent).
3. Legg inn export const pageInfo: PageInfo = { ... }.
4. Bruk buildArticleMetadata som i eksemplet.
5. Kjør scriptet under.

## Generering av PageInfoConfig

Script i package.json (eksempel under). dette scriptet kjøres også med husky i pre-commit hook.
Men kjør gjerne manuelt etter å ha lagt til eller endret artikler. og test at sitemap.xml og nettstedkart-siden
er oppdatert korrekt.

```json
{
    "scripts": {
        "generate:page-info-config": "tsx scripts/generate-page-info-config.ts"
    }
}
```

Kjør i terminal:

```bash
pnpm run generate:page-info-config
```

Det vil:

- lese alle page.tsx under (artikler)
- finne pageInfo
- skrive pageInfoConfig.generated.ts

Denne fila brukes av buildSiteMap.ts og nettstedkart-siden.

## Sitemap og nettstedkart

- "Vanlige" artikler kommer fra pageInfoConfig.generated.ts.
- Sidene under [locale]/work-in-norway/... kommer fra workInNorwayConfig.ts.
- buildSiteMapGroups kombinerer disse og grupperer på ArticleCategory.
- Nettstedkartet og sitemap henter sine data via buildSiteMapGroups.
