# A/B-testing (eksperimenter)

Dette er en liten rigg for A/B-testing i Next.js (App Router) som:

- velger variant på **server** (ingen flicker/layoutskift)
- gjør variant tilgjengelig i **client** (provider)
- logger **eksponering** og **konvertering** via umami `track()`

Vi bruker Math.random() ved første besøk
(når ab\_<experiment>-cookie mangler) for å avgjøre om brukeren skal få
standard eller test, og vi setter deretter cookie for alle.
Dette gjør at varianten blir “sticky” og stabil for brukeren på tvers av sidevisninger
uten å bruke en egen hashing/ID-algoritme.
Fordelingen (trafficPercent og variant-vekter) blir statistisk riktig over mange brukere,
og løsningen er enklere å forstå og vedlikeholde enn deterministisk bucketing med hash + ab_uid.

> Begreper:
>
> - `standard` = dagens løsning (baseline)
> - `test` = ny løsning vi tester

---

## Innhold i mappa

| Fil                      | Beskrivelse                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| `ClientExperiment.tsx`   | Client: presentasjons-wrapper for å vise standard/test                                      |
| `cookies.ts`             | cookie-navn + parsing (`standard/test`)                                                     |
| `Experiment.tsx`         | Server Component: velger mellom `standard/test` UI i server                                 |
| `ExperimentProvider.tsx` | Client: context/hook for å lese varianter i client                                          |
| `experiments.ts`         | hvilke tester/eksperiment som finnes                                                        |
| `getVariantMap.ts`       | Server: henter flere varianter samtidig (VariantMap)                                        |
| `middlewareAb.ts`        | setter `ab_<key>` cookie når analytics-samtykke finnes                                      |
| `useAbExposure.ts`       | Client: hook som logger eksponering én gang per session når kompnent rendres                |
| `useAbExposureOnView.ts` | Client: hook som logger eksponering én gang per session når kompnent blir synlig i viewport |

## 1. Opprette et nytt eksperiment

### Legg til i `experiments.ts`

```ts
export const experiments = [
    {
        key: "search_jobs_cta",
        status: "on",
        trafficPercent: 70,
        pathPrefixes: ["/"],
        variants: [
            { key: "standard", weightPercent: 50 },
            { key: "test", weightPercent: 50 },
        ],
    },
] as const satisfies ReadonlyArray<ExperimentDefinition>;
```

Når du legg til en ny `key` her, får du automatisk IntelliSense/TS-feil ved feil key.

---

## 2. Cookies: hva blir satt - og når?

Vi brukar cookies med prefix `ab_`:

- `ab_<experimentKey>` (t.d. `ab_search_jobs_cta`) med verdi `"standard"` eller `"test"`

Cookies blir satt i middleware når:

- brukeren har samtykket til **analytics** (`arbeidsplassen-consent.consent.analytics === true`)
- request er document-like (HTML/navigate)
- request ikkje er RSC (`_rsc`)
- dersom samtykke endres slettes cookie

> Vi setter cookie for alle (også standard), slik at variant alltid blir sticky etter første treff.

---

## 3. Middleware

`middlewareAb.ts` setter `ab_<key>` **hvis den manglar** (sticky assignment), basert på:

- `trafficPercent` (hvor mange nye brukere som skal inn)
- `variants.weightPercent` (fordeling mellom standard/test inne i eksperimentet)

---

## 4. Dersom variant på en side

### Case A: Server Component

Hvis komponenten er server, bruk `Experiment.tsx` direkte:

```tsx
<Experiment
    experiment="search_jobs_cta"
    standard={<Button>Søk etter jobber</Button>}
    test={<Button>Finn din neste jobb</Button>}
/>
```

Bruk dette når UI kan rendres på server uten `use client`.

---

### Case B: Siden har en Client Component (feks: `Home`)

Da velger vi variant på server og sender det videre i provideren.

#### `ExperimentProvider` + prop

```tsx
export default async function Page() {
    const variants = await getVariantMap(["search_jobs_cta"]);

    return (
        <ExperimentProvider variants={variants}>
            <Home />
        </ExperimentProvider>
    );
}
```

#### Flere eksperimenter: `getVariantMap` + `ExperimentProvider`

```tsx
export default function Page() {
    const variants = getVariantMap(["search_jobs_cta", "saved_search_cta_copy"]);

    return (
        <ExperimentProvider variants={variants}>
            <Home />
        </ExperimentProvider>
    );
}
```

I client-komponent:

```tsx
"use client";

const variant = useExperimentVariant("search_jobs_cta");
```

Bruk dette når du har flere eksperimenter på samme client side

---

## 5. Logging (Umami via `track()`)

## Eksponering: to hooks (rendered vs viewed)

Vi har to hooks for å logge **eksponering** (nevneren i A/B):

### `useAbExposure` (rendered)

Bruk denne når eksperiment-elementet i praksis alltid blir synlig for brukaren (feks: header/hero/over fold).

- Logger når komponenten er **rendret** (mounted i DOM)
- Dedupe med `sessionStorage` (en gang per tab/session per `dedupeKey`)
- Rask og enkel, men garanterer ikke at brukaren faktisk så elementet

**Eksempel:**

```tsx
import { usePathname } from "next/navigation";
import { useAbExposure } from "@/app/_experiments/useAbExposure";

const pathname = usePathname();

useAbExposure({
    experiment: "search_jobs_cta",
    variant,
    dedupeKey: `${pathname}:SearchJobsCta`,
    location: "forside",
});
```

### `useAbExposureOnView` (viewed)

Bruk denne når eksperiment-elementet kan ligge **langt nede på siden** eller ikke nødvendigvis er i viewport.

- Logger først når elementet faktisk er **synlig i viewport** (bruker IntersectionObserver)
- Dedupe med `sessionStorage` (en gang per tab/session per `dedupeKey`)
- Mer riktig faktisk "sett", men krever at man setter en `ref` på elementet

**Eksempel:**

```tsx
import { usePathname } from "next/navigation";
import { useAbExposureOnView } from "@/app/_experiments/useAbExposureOnView";

const pathname = usePathname();

const observeRef = useAbExposureOnView({
    experiment: "search_jobs_cta",
    variant,
    dedupeKey: `${pathname}:DeepCta`,
    location: "forside:langt-nede",
    threshold: 0.5, // 50% synleg
});

return <div ref={observeRef}>…</div>;
```

**Hva eller hvem:**

- "above the fold" / alltid synleg: `useAbExposure`
- ikke "above the fold" / ikkje alltid synleg: `useAbExposureOnView`

> Dedupe skjer med `sessionStorage`, så du ikke spammer events ved re-render.

---

### B Konvertering (telleren)

Logg viktige handlinger

```tsx
<Button
    onClick={() => {
        track("AB - konvertering", {
            experiment: "search_jobs_cta",
            variant,
            konvertering: "cta_click",
            location: "forside",
        });
    }}
>
    ...
</Button>
```

## 6. Når bruker man hva?

### `Experiment.tsx` (Server)

Bruk når du rendrar UI på server og vil bytte innhold uten client.

### `ExperimentProvider.tsx` (Client)

Har du en eller flere eksperimenter i en client-side/komponent, wrapper du denne
rundt client komponenten i server-koden, og henter variant i client med `useExperimentVariant`.

### `ClientExperiment.tsx` (Client)

Bruk som “presentational wrapper” i client-kode istedenfor ternary overalt.
