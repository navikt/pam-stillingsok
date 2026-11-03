# A/B-testing

Deterministisk A/B-rigg for stillingsøk. Variant velges ut fra en tilfeldig ID i en cookie, ikke av en tilfeldig terning per request.

Kode: `config.ts` (register), `core/` (ren kjerne), `next/` (proxy og server), `react/` (provider og hendelser).

## 1. Hva riggen gjør og ikke gjør

- Gir hver samtykkende bruker `standard` eller `test` per eksperiment, stabilt over tid.
- `standard` er kontrollen. Den brukes også uten samtykke, ved ukjent eller ugyldig tildeling, når eksperimentet er `off` og når det er utløpt.
- Sender `AB - eksponering` automatisk én gang per ny tildeling, og `AB - konvertering` når koden ber om det.
- Gjør ikke statistikk, dashboards eller alarmer.
- Støtter ikke variantavhengig innhold i `unstable_cache` eller Valkey. En delt servercache kan servere én brukers variant til alle.

## 2. Forutsetninger og samtykke

- Alt krever analytics-samtykke. Uten samtykke slettes `ab_uid` og `ab_<nøkkel>`, og brukeren får `standard`.
- `ab_uid` opprettes bare med samtykke og minst ett aktivt eksperiment (`status: "on"`, ikke utløpt). Med tomt register opprettes ingen `ab_`-cookie.
- En ny tildeling opprettes bare på sideforespørsler (dokument eller RSC, ikke prefetch) innenfor `eligiblePathPrefixes`.
- Bare `GET` behandles. Next.js skjuler RSC-headere for proxyen, så A/B-adapteren behandler også GET til registrerte eksperimentsider uten disse headerne. Dette inkluderer programmatiske GET-kall til samme side.
- Proxyens matcher filtrerer prefetch før Next.js fjerner headerne. Behold filtrene for `next-router-prefetch`, `next-router-segment-prefetch` og `purpose: prefetch`. Lenker til eksperimentsider må bruke `prefetch={false}` slik at første besøk ikke gjenbruker innhold uten tildeling fra klientcache.
- Ny bruker får ID på første dokumentrequest og tildeling på neste request.
- Sjekken av samtykke er fail-closed: en ugyldig samtykke-cookie tolkes som uten samtykke.

## 3. Opprett et eksperiment

Eksempelet bruker `ny-cta` gjennom hele livsløpet.

1. Legg til i `experiments` i `config.ts`:

   ```ts
   {
       key: "ny-cta",
       status: "on",
       assignmentVersion: 1,
       owner: "team-arbeidsplassen",
       endsAt: "2026-12-31T23:59:59Z",
       eligiblePathPrefixes: ["/stillinger/stilling"],
   }
   ```

2. Nøkkelen må matche `^[a-z][a-z0-9-]{2,39}$`. Nøkkelen `uid` er reservert.
3. Legg nye konverteringsnavn til i `experimentConversions`.
4. `config.test.ts` validerer registeret: unik nøkkel, gyldig versjon, eier, `endsAt` og at aktive eksperimenter ikke er utløpt.
5. Øk `assignmentVersion` for å tilordne alle på nytt.

## 4. Bruk varianten i en Server Component

Eksempelet viser en knapp for testgruppen, og ingenting for standard. Siden monterer provideren (se punkt 5), og `Experiment` velger variant på serveren.

```tsx
// src/app/stillinger/stilling/[id]/page.tsx (Server Component)
import { Button } from "@navikt/ds-react";
import { Experiment } from "@/app/_experiments/next/Experiment";
import { getExperimentAssignments, getExperimentVariant } from "@/app/_experiments/next/experiments";
import { ExperimentsProvider } from "@/app/_experiments/react/Experiments";

export default async function Page() {
    const assignments = await getExperimentAssignments();

    return (
        <ExperimentsProvider assignments={assignments}>
            <Experiment experiment="ny-cta" standard={null} test={<Button>Ny knapp</Button>} />
            <Annonse />
        </ExperimentsProvider>
    );
}

// Trenger du variant som verdi, for eksempel til data eller props:
const variant = await getExperimentVariant("ny-cta"); // "standard" | "test"
```

Server-API-et validerer samtykke, ID og cookie selv, og stoler ikke på proxy. Bucketing-ID-en returneres aldri.

## 5. Bruk varianten i en Client Component

Hver side som matcher `eligiblePathPrefixes` må montere `ExperimentsProvider`, som i punkt 4. Uten provider får brukeren en tildeling uten eksponeringshendelse. Provideren sender `AB - eksponering` med `{ experiment, assignmentVersion, variant }` for nye tildelinger.

```tsx
"use client";

import { Button } from "@navikt/ds-react";
import { ClientExperiment, useExperiment } from "@/app/_experiments/react/Experiments";

export function Handlinger() {
    return (
        <>
            {/* Samme prinsipp som Experiment: null gir ingenting i standard. */}
            <ClientExperiment experiment="ny-cta" standard={null} test={<Button>Ny knapp</Button>} />
            <ErStor />
        </>
    );
}

// Trenger du variant som verdi:
function ErStor() {
    const variant = useExperiment("ny-cta");
    return <div data-variant={variant} />;
}
```

## 6. Spor en konvertering

Hooken må brukes under `ExperimentsProvider`.

```tsx
"use client";

import { Button } from "@navikt/ds-react";
import { useExperimentConversion } from "@/app/_experiments/react/Experiments";

export function NyKnapp() {
    const trackConversion = useExperimentConversion();

    return <Button onClick={() => trackConversion("ny-cta", "cta_click", "annonse")}>Ny knapp</Button>;
}
```

Det sendes bare `AB - konvertering` hvis brukeren har en gyldig tildeling. Konverteringer uten tildeling teller ikke. Konverteringsnavnet må finnes i `experimentConversions` i `config.ts`.

## 7. Verifiser fordelingen før resultatanalyse

- Eksponering betyr ny tildeling. Grupper `AB - eksponering` på `experiment`, `assignmentVersion` og `variant`.
- Sjekk sample ratio mismatch (SRM) på eksponeringshendelsene med tosidig eksakt binomisk test. Flagg `p < 0,001`.
- Kjente begrensninger, som rammer begge varianter likt:
  - Forlater brukeren siden før trackeren fyrer, er cookien satt og hendelsen sendes aldri på nytt.
  - `track()` køer maks 5 events i maks 5 sekunder før Umami er lastet. Sent lastet Umami kan gi tapte hendelser.
  - Parallelle requests kan gi dupliserte hendelser.

## 8. Slå av og slett et eksperiment

- `status: "off"` gir `standard` og sletter tildelingscookien.
- Utløpt `endsAt` gir det samme.
- Fjern eksperimentet fra registeret når det er ferdig. Legg cookienavnet i `retiredCookieNames` i `config.ts` slik at samtykkeendring sletter det hos brukere som fortsatt har det. Fjern ikke navnet før cookien er utløpt (maks 90 dager, gamle cookies 120 dager).
- Sletting gjelder bare navn appen eier. Det finnes ingen wildcard `ab_*`, fordi andre apper på samme host kan eie `ab_`-cookies.

## 9. Cookieformat, levetid og personvern

| Cookie        | Verdi                                              | Levetid  | Flagg                                                       |
| ------------- | -------------------------------------------------- | -------- | ----------------------------------------------------------- |
| `ab_uid`      | 32 hex-tegn (16 byte fra `crypto.getRandomValues`) | 90 dager | `HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure` i produksjon |
| `ab_<nøkkel>` | `<assignmentVersion>.<standard\|test>`             | 90 dager | som over                                                    |

- Variant: første bit i SHA-256 av `JSON.stringify(["v1", nøkkel, assignmentVersion, id])`. 0 gir `standard`, 1 gir `test`. Endre algoritmen bare ved å bytte `"v1"`.
- Tildelingscookien er en «allerede sporet»-markør og cache, aldri kilden til varianten. Den er gyldig bare hvis versjon og variant stemmer med det kjernen beregner.
- ID-en er pseudonym. Den forlater aldri cookien: ikke i logg, event, respons eller klient-JS.
- `/api/consent/ab` oppretter og sletter cookies ved samtykkeendring, og svarer 403 ved cross-site POST (`Sec-Fetch-Site`).
- Cookie-teksten ligger i `src/app/(artikler)/informasjonskapsler/` og er på nynorsk.
- Sentry sender cookie-headeren med feilrapporter. Det gjelder alle cookies og fjernes sammen med Sentry.

## 10. Grensen for senere uttrekk til `arbeidsplassen-react`

`core/` importerer ikke `next`, `react` eller umami og kan trekkes ut uendret. Adapterne i `next/` og `react/` følger med eller skrives om per rammeverk. Registeret i `config.ts` og cookie-flaggene er app-spesifikke.
