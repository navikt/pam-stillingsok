# Enklere vei til jobb

Enklere vei til jobb hjelper unge med å finne artikler om jobbsøking ut fra alder, erfaring og mål.

Feature-mappa dekker hele flyten:

1. En veiviser med tre steg.
2. En filtrert resultatside.
3. Artikler fra Shared Content.
4. Quizer som redaktører knytter til artikler i Drupal.

`onboarding` brukes fortsatt som navn på veiviseren og domenet rundt spørsmål og svar. Det er bare én del av Enklere vei til jobb.

## Ruter

| Rute | Innhold |
|---|---|
| `/ung/enklere-vei-til-jobb` | Trestegsveiviseren |
| `/ung/enklere-vei-til-jobb/resultat` | Filtrerte artikler og lenke til jobbquiz-artikkelen |
| `/ung/enklere-vei-til-jobb/artikkel/[id]` | Artikkel og eventuell Webform-quiz |

Rutene ligger i [`src/app/ung/enklere-vei-til-jobb`](../../../app/ung/enklere-vei-til-jobb).

## Dataflyt

```text
Next.js-rute
  → onboardingPageLoaders.server.ts
  → SharedContentSource
      ├── mockSharedContentSource
      └── liveSharedContentSource
            ├── lokal onboarding-struktur
            └── Drupal JSON:API
                  ├── taxonomy for svaralternativer
                  ├── filtrert artikkelsamling
                  ├── artikkel med Paragraph-innhold
                  └── Webform-YAML for artikkelquiz
  → domenemodell
  → Aksel-komponenter
```

Rute-loaderne skjuler feature flag, valg av datakilde, validering av URL-parametre og rekkefølgen på kallene. Sidene forholder seg til ferdige resultattyper som `success`, `not-found`, `invalid-selection` og kildefeil.

## Veiviseren og filtreringen

Strukturen ligger i [`server/local/onboardingDefinition.ts`](server/local/onboardingDefinition.ts). Den definerer tekst, steg, spørsmål, kontrolltype og filterdimensjon.

Svaralternativene kommer fra tre taxonomy-vokabularer i Drupal:

| Dimensjon | Drupal-vokabular | Bruk |
|---|---|---|
| `age` | `shared_content_age` | Alder |
| `experience` | `shared_content_experience` | Erfaring |
| `audiences` | `situations` | Mål og situasjon |

`buildOnboardingModule.server.ts` kombinerer den lokale strukturen med publiserte taxonomy-termer. Termens UUID blir svar-ID, `name` blir etikett, og `weight` bestemmer rekkefølgen.

Valgene lagres i URL-en. Parameternavnet er spørsmåls-ID-en, mens verdien har formen:

```text
<dimensjon>:<term-uuid>
```

Eksempel:

```text
experience:550e8400-e29b-41d4-a716-446655440000
```

`selectionParams.ts` validerer lengde, format, antall verdier og at term-ID-en finnes i den hentede modulen. Resultatsida bygger deretter Drupal-filtre med `IN` innenfor hver dimensjon. Drupal kombinerer dimensjonene slik at innholdet må passe de valgte filtergruppene.

## Shared Content og Drupal JSON:API

Live-kilden bruker det felles Shared Content-API-et fra Karriereveiledning.no. API-nøkkelen brukes bare på serveren.

Klienten i [`server/drupal/drupalClient.server.ts`](server/drupal/drupalClient.server.ts) håndterer:

- HTTPS-origin og server-side `api-key`
- timeout og blokkerte redirects
- paginering og kontroll av `links.next`
- `include` for Paragraphs, bilder og media
- korttidsdata med `no-store`
- taxonomy med én times revalidering
- metrikker per operasjon og resultat

Alle eksterne svar starter som `unknown`. Zod validerer JSON:API-dokumentene med `safeParse()` før adapterne bygger interne domenemodeller. HTML saniteres før rendering, og eksterne URL-er kontrolleres før de brukes.

Les [guiden til Drupal JSON:API og Shared Content](../../../../docs/Enklere_vei_til_jobb/drupal-json-api-guide.md) for ressursgrafen, `include`, sparse fieldsets, filtrering og feilhåndtering.

## Artikler og artikkelquizer

`articleMapper.server.ts` følger relasjonene fra artikkelen til Paragraph-, media- og filressurser. Rekkefølgen hentes fra relasjonen, ikke fra plasseringen i `included`.

Accordion, Title/Text/Image, tip heading og video støtter redaktørstyrt overskriftsnivå. Shared Content leverer `h2`, `h3` eller `h4`; manglende nivå blir H2. Valgfrie accordion- og videooverskrifter rendres ikke når teksten er tom.

Resultatsida viser «Prøv jobbquizen» når artikkelen i `JOB_QUIZ_ARTICLE_ID` er publisert og tilgjengelig for API-nøkkelen. Live-kilden sjekker UUID-en med `filter[id]` og `filter[status]=1`. Manglende konfigurasjon, tom `data`, `meta.count = 0` eller en teknisk feil skjuler knappen. Et klikk åpner den vanlige artikkelsida, som henter artikkelen og Webform-quizen.

En artikkel kan peke på en Drupal Webform. Da gjør live-kilden følgende:

```text
Webform-ID
  → hent elements_combined eller elements
  → parse YAML med størrelsesgrenser
  → valider quiz, seksjoner og svaralternativer
  → sanitér feedback-HTML
  → ArticleQuiz
```

Webform-quizen støtter både flate spørsmål og `fieldset`-grupper. Disse klassene gir redaktørstyrte tema:

- `content-group--rose`
- `content-group--peach`
- `content-group--mint`
- `content-group--lavender`

Manglende eller ukjent tema gir nøytral bakgrunn. Flere forskjellige støttede tema på samme seksjon avvises som en tvetydig kontrakt.

## Tracking

Feature-koden bruker det felles Umami-oppsettet i `src/app/_common/umami`. Den sender disse hendelsene:

- `Klikk - Enklere vei til jobb` for knapper, lenker og trekkspill
- `Valg - Enklere vei til jobb` for svar og filtre
- `Fullført - Enklere vei til jobb-quiz` når en quiz er ferdig
- `Tid - Enklere vei til jobb-artikkel` med total og aktiv lesetid

Payloadene bruker stabile ID-er fra domenet eller Shared Content. De inneholder ikke bruker-ID, fritekst, komplette URL-er eller query-parametre. `ArticleEngagementTracker` gjenbruker `useEngagementTimer` og utelater besøk som både varer under tre sekunder og har under ett sekund aktiv tid.

## Mock og live

`SharedContentSource` er grensa mellom sidene og datakilden:

```ts
type SharedContentSource = {
    getOnboardingModule(): Promise<SharedContentResult<OnboardingModule>>;
    getResults(selection: Selection): Promise<SharedContentResult<OnboardingResult>>;
    isArticlePublished(articleId: string): Promise<SharedContentResult<boolean>>;
    getArticle(articleId: string): Promise<SharedContentResult<Article>>;
    getArticleQuiz(webformId: string): Promise<SharedContentResult<ArticleQuiz>>;
};
```

I utviklingsmiljø er `mock` standard. Mock-kilden bruker samme modulbygger og domenekontrakter som live-kilden, men gjør ingen nettverkskall.

Live-kilden er en hybrid:

- Onboarding-struktur og spørsmålstekst ligger lokalt.
- Svaralternativer, filtrerte artikler, artikkelinnhold og artikkelquizer kommer fra Drupal.
- Feil i live-kilden faller ikke tilbake til mock.

## Konfigurasjon

| Variabel | Beskrivelse |
|---|---|
| `ENKLERE_VEI_TIL_JOBB_ENABLED` | Slår rutene av eller på. Er på som standard utenfor produksjon. |
| `SHARED_CONTENT_SOURCE` | `mock` eller `live`. Er `mock` som standard utenfor produksjon. |
| `SHARED_CONTENT_API_URL` | HTTPS-origin til Shared Content-API-et. Kreves for `live`. |
| `SHARED_CONTENT_API_KEY` | Server-side API-nøkkel. Kreves for `live`. |
| `SHARED_CONTENT_GOALS_PARENT_ID` | UUID til «Jobbsøk for unge» i `situations`. Kreves for `live`. |
| `JOB_QUIZ_ARTICLE_ID` | Valgfri UUID til artikkelen som vises som «Prøv jobbquizen». Settes per miljø. |
| `SHARED_CONTENT_TIMEOUT_MS` | Valgfri timeout. Standard er 5 sekunder, maksimum 30 sekunder. |

Ikke bruk `NEXT_PUBLIC_` for API-nøkkelen eller andre secrets.

## Kjør lokalt

Mock-kilden krever ingen Shared Content-konfigurasjon:

```bash
pnpm dev
```

Åpne:

```text
http://localhost:3003/ung/enklere-vei-til-jobb
```

For å bruke staging setter du `SHARED_CONTENT_SOURCE=live` og de nødvendige `SHARED_CONTENT_*`-variablene i miljøet før du starter appen.

## Tester

Kjør testene for hele feature-mappa:

```bash
pnpm test src/features/ung/enklere-vei-til-jobb
```

Kjør også TypeScript og lint før commit:

```bash
pnpm compileTS
pnpm lint
```

Testene dekker blant annet URL-kontrakten, kildegrensa, Drupal-transporten, mapping, HTML-sanitering, quizparserne, tastaturnavigasjon og tilgjengelighet.

## Mappestruktur

```text
enklere-vei-til-jobb/
├── domain/            # Domenetyper, URL-koding og validering
├── server/
│   ├── drupal/        # JSON:API-klient, Zod-kontrakter og adaptere
│   ├── local/         # Lokal onboarding-struktur
│   └── mock/          # Lokal datakilde for utvikling og tester
├── ui/                # Veiviser, resultater, artikler og quizer
└── README.md
```

## Videreutvikling

### Endre veiviseren

1. Oppdater `server/local/onboardingDefinition.ts`.
2. Hvis du legger til en filterdimensjon, oppdater domenet, taxonomy-mappingen og Drupal-filteret.
3. Oppdater URL- og modulbyggertestene.

Spørsmåls-ID-er er del av URL-kontrakten. Endrer du en ID, slutter eksisterende lenker å representere det samme valget.

### Støtte en ny innholdsblokk

1. Valider Drupal-ressursen i `server/drupal/jsonApi.ts`.
2. Legg typen til domenemodellen i `domain/article.ts`.
3. Map ressursen i `server/drupal/articleMapper.server.ts`.
4. Render blokka i `ui/ArticleContent.tsx`.
5. Legg til adapter- og komponenttester.

### Endre artikkelquizen

Quizkontrakten ligger i `server/drupal/webformQuiz.server.ts`. Oppdater parser, domenetype og `ui/ArticleQuiz.tsx` sammen. Behold støtte for flate quizer hvis Shared Content fortsatt publiserer dem.

## Eksempelrepo og mer dokumentasjon

[utdanningno/kvno-shared-content-example](https://github.com/utdanningno/kvno-shared-content-example) viser hvordan eksterne nettsteder kan hente Shared Content fra Karriereveiledning.no. Repoet er laget for læring og kontraktstesting, ikke som en produksjonsklient.

Dokumentasjon i dette repoet:

- [Guide til Drupal JSON:API og Shared Content](../../../../docs/Enklere_vei_til_jobb/drupal-json-api-guide.md)
- [Implementeringsplan og beslutningshistorikk](../../../../docs/Enklere_vei_til_jobb/implementeringsplan.md)
- [Plan for filtervalg fra API-et](../../../../docs/Enklere_vei_til_jobb/plan-filtervalg-fra-api.md)
- [Videostøtte](../../../../docs/Enklere_vei_til_jobb/video-embed-plan.md)
