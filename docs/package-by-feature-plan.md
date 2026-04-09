# Package-by-Feature — Omstruktureringsplan for pam-stillingsok

## Problemstilling

Koden i `pam-stillingsok` er i dag organisert primært etter **teknisk lag** (hooks, server, types) og med mye feature-spesifikk logikk gjemt i `src/app/_common/` og `src/app/stillinger/_common/`. Dette gjør det vanskelig å:

- Forstå omfanget av en feature ved å se på én mappe
- Gjøre endringer i én feature uten å risikere sideeffekter i andre
- Onboarde nye utviklere som skal jobbe på én spesifikk feature

**Mål:** Omstrukturere til **package-by-feature** slik at hver feature er selvforsynt med sin egen logikk, typer, hooks, schemas og UI-komponenter — mens genuint delt kode forblir i en tydelig `shared/`-modul.

## Scope

- **Primært:** Omstrukturere kode **utenfor** `src/app/` (hooks, server, types, features)
- **Sekundært:** Flytte feature-spesifikke komponenter **ut av** `src/app/_common/` og `src/app/stillinger/_common/` inn i `src/features/`
- **Utenfor scope:** Endre Next.js App Router-rutene (mappestruktur i `src/app/` styrer URL-er)

---

## Nåværende struktur — analyse

### Dagens mappestruktur (forenklet)

```
src/
├── app/
│   ├── _common/              ← 100+ filer: blanding av genuint delt og feature-spesifikt
│   │   ├── auth/             ← Global auth (brukt av alle)
│   │   ├── geografi/         ← Brukt av 3+ features
│   │   ├── umami/            ← Brukt av 4+ features
│   │   ├── tracking/         ← Brukt av 4+ features
│   │   ├── skyra/            ← Brukt av 3 features
│   │   ├── components/       ← Blanding: noen brukt av mange, noen av 1
│   │   ├── cookie-banner/    ← Global
│   │   ├── header/           ← Global
│   │   └── ...
│   ├── stillinger/
│   │   └── _common/          ← 80+ filer: egentlig stillinger-feature, men brukt av andre!
│   │       ├── lib/ad-model/ ← Brukt av stillinger, sommerjobb, muligheter
│   │       ├── auth/         ← Auth context brukt av Providers.tsx (global!)
│   │       ├── user/         ← User context brukt av Providers.tsx (global!)
│   │       ├── actions/      ← Server actions brukt av min-side, favoritter, lagrede-sok
│   │       ├── utils/        ← Brukt av sommerjobb, muligheter
│   │       └── types/        ← Brukt av flere features
│   ├── sommerjobb/           ← Importerer tungt fra stillinger/_common/
│   ├── muligheter/           ← Importerer fra stillinger/_common/ OG omvendt
│   ├── ung/                  ← Ryddig — bruker features/ung/
│   └── min-side/             ← Importerer fra stillinger/_common/
├── features/
│   ├── metrics/              ← Allerede package-by-feature ✓
│   └── ung/                  ← Allerede package-by-feature ✓
├── hooks/                    ← Kun 2 filer (useInViewport, useIsDebug)
├── server/
│   ├── schemas/              ← stillingSearchSchema.ts (brukt av 3 features)
│   └── utils/                ← htmlSanitizer.ts
└── types/                    ← 3 filer (routing, skyra-survey, theme)
```

### Identifiserte problemer

1. **`stillinger/_common/` er blitt en pseudo-global** — Auth, user context og ad-model brukes på tvers av features, men bor i stillinger-mappen
2. **Sirkulær kobling mellom stillinger og muligheter** — Stillinger importerer fra muligheter (access-status), muligheter importerer fra stillinger (auth, ad-model)
3. **Flat deling** — `src/hooks/`, `src/server/`, `src/types/` er teknisk-lag-mapper med få filer, ingen feature-tilknytning
4. **Uklare grenser** — Vanskelig å vite hva som tilhører én feature vs. er genuint delt

---

## Foreslått ny struktur

```
src/
├── app/                          # Beholdes — App Router (URL-ruter)
│   ├── _common/                  # ⬇ REDUSERT: kun genuint global kode
│   │   ├── components/           # UI brukt av 3+ features (ContentSection, NotFoundPage, links)
│   │   ├── article/              # Artikkel-layout (brukt av 40+ sider)
│   │   └── css/                  # Globale stylesheets
│   ├── stillinger/               # Rute: beholder page/layout/loading, men _common/ tynnes ut
│   ├── sommerjobb/               # Rute: beholder page + _components/
│   ├── muligheter/               # Rute: beholder page + _components/
│   ├── ung/                      # Rute: beholder page (allerede ryddig)
│   ├── min-side/                 # Rute: beholder page + _components/
│   ├── (artikler)/               # Rute: artikler (beholdes som i dag)
│   ├── (forside)/                # Rute: forside (beholdes som i dag)
│   ├── _experiments/             # A/B-testing (beholdes)
│   ├── api/                      # API-ruter (beholdes)
│   ├── Providers.tsx             # Root providers
│   └── layout.tsx                # Root layout
│
├── features/                     # ⬆ UTVIDET: all feature-logikk samlet her
│   ├── stillinger/               # ← NY: alt fra stillinger/_common/ + server/schemas
│   │   ├── actions/              # Server actions (auth, favoritter, lagrede søk)
│   │   ├── hooks/                # useFetchReducer, useToggle
│   │   ├── types/                # Favorite, SearchResult, FilterAggregations, FormState
│   │   ├── utils/                # Tekst, dato, lokasjon-formatering, filter-hjelp
│   │   ├── monitoring/           # Søkelogging
│   │   ├── auth/                 # Auth context + komponenter (LoginModal, etc.)
│   │   └── user/                 # UserProvider, UserContext, UserPreferenceProvider
│   │
│   ├── sommerjobb/               # ← NY: logikk fra sommerjobb/_utils/
│   │   ├── utils/                # fetchSommerjobber, queryBuilder, pagination
│   │   └── types/                # SommerjobbAd, SommerjobbQuery
│   │
│   ├── muligheter/               # ← NY: logikk fra muligheter/(sok)/_utils/ + _common/
│   │   ├── utils/                # fetchMuligheter, queryBuilder, pagination
│   │   ├── auth/                 # Muligheter-spesifikk tilgangskontroll
│   │   └── types/                # Mulighet, MulighetQuery
│   │
│   ├── min-side/                 # ← NY: logikk fra min-side/_common/
│   │   ├── components/           # MinSidePage, ErrorPage, Feedback
│   │   └── types/
│   │
│   ├── ung/                      # Allerede her ✓
│   │   └── ui/
│   │
│   └── metrics/                  # Allerede her ✓
│       ├── metrics-types.ts
│       └── trackMetricsClient.ts
│
├── shared/                       # ← NY: erstatter hooks/, server/, types/ + deler av _common/
│   ├── ad-model/                 # ← FLYTTET fra stillinger/_common/lib/ad-model/
│   │   ├── schemas/              # AdDTO, legacy schemas, primitiver
│   │   ├── transform/            # Elastic → domenemodell
│   │   ├── core/                 # Result-type, feilhåndtering
│   │   └── utils/                # Dato-parsing, tekstekstraksjon
│   │
│   ├── search/                   # ← NY: delt søkelogikk (brukt av 3 features)
│   │   ├── schemas/              # stillingSearchSchema + Sommerjobb/Muligheter-varianter
│   │   ├── fetchUtils.ts         # Delt fetch-hjelper med headers
│   │   └── queryNames.ts         # Delte query-param-konstanter
│   │
│   ├── auth/                     # ← FLYTTET fra _common/auth/
│   │   ├── auth.server.ts        # Token-validering, CSRF
│   │   ├── aduserAuth.server.ts  # OBO-token
│   │   ├── aduserClient.ts       # AD-user API-klient
│   │   ├── apiClient.ts          # Auth-status-sjekk
│   │   └── broadcast.ts          # Cross-tab auth-events
│   │
│   ├── geografi/                 # ← FLYTTET fra _common/geografi/
│   │   ├── fetchLocations.ts
│   │   ├── location.ts
│   │   ├── locationOptions.ts
│   │   └── ...
│   │
│   ├── analytics/                # ← SAMMENSLÅTT fra _common/umami + tracking + trackers
│   │   ├── umami/                # Umami-events, tracking, gate
│   │   ├── tracking/             # Engagement timer, flow ID, viewport tracker
│   │   └── trackers/             # UTM, cookie metrics
│   │
│   ├── skyra/                    # ← FLYTTET fra _common/skyra/
│   │   ├── SkyraSurvey.tsx
│   │   ├── SkyraInit.tsx
│   │   └── ...
│   │
│   ├── hooks/                    # ← Genuint globale hooks
│   │   ├── useInViewport.ts
│   │   └── useIsDebug.ts
│   │
│   ├── logging/                  # ← FLYTTET fra _common/logging/
│   │   └── appLogger.ts
│   │
│   ├── ui/                       # ← FLYTTET: genuint delte UI-komponenter
│   │   ├── cookie-banner/
│   │   ├── debug-provider/
│   │   └── header/
│   │
│   ├── seo/                      # ← FLYTTET fra _common/seo/
│   │   └── buildSeoMetadata.ts
│   │
│   ├── i18n/                     # ← FLYTTET fra _common/i18n/
│   │   └── nbPlural.ts
│   │
│   ├── text/                     # ← FLYTTET fra _common/text/
│   │   ├── htmlToPlainText.ts
│   │   ├── normalizeNbSpaces.ts
│   │   └── truncateAtWordBoundary.ts
│   │
│   ├── html/                     # ← FLYTTET fra server/utils/
│   │   └── htmlSanitizer.ts
│   │
│   ├── search-params/            # ← FLYTTET fra _common/searchParams/
│   │   └── searchParams.ts
│   │
│   ├── types/                    # ← FLYTTET fra types/
│   │   ├── routing.ts
│   │   ├── skyra-survey.d.ts
│   │   └── theme.d.ts
│   │
│   └── utils/                    # ← FLYTTET fra _common/utils/
│       ├── cn.ts
│       ├── loadFont.ts
│       ├── removeUuid.ts
│       └── requiredEnv.ts
│
├── instrumentation.ts            # Beholdes på root
├── instrumentation-client.ts     # Beholdes på root
├── metrics.ts                    # Beholdes på root
├── proxy.ts                      # Beholdes på root
└── global.d.ts                   # Beholdes på root
```

### Slettede mapper (erstattet av nye)

| Gammel plassering                          | Ny plassering                         |
| ------------------------------------------ | ------------------------------------- |
| `src/hooks/`                               | `src/shared/hooks/`                   |
| `src/server/schemas/`                      | `src/shared/search/schemas/`          |
| `src/server/utils/`                        | `src/shared/html/`                    |
| `src/types/`                               | `src/shared/types/`                   |
| `src/app/_common/auth/`                    | `src/shared/auth/`                    |
| `src/app/_common/geografi/`                | `src/shared/geografi/`                |
| `src/app/_common/umami/`                   | `src/shared/analytics/umami/`         |
| `src/app/_common/tracking/`                | `src/shared/analytics/tracking/`      |
| `src/app/_common/trackers/`                | `src/shared/analytics/trackers/`      |
| `src/app/_common/skyra/`                   | `src/shared/skyra/`                   |
| `src/app/_common/logging/`                 | `src/shared/logging/`                 |
| `src/app/_common/cookie-banner/`           | `src/shared/ui/cookie-banner/`        |
| `src/app/_common/debug-provider/`          | `src/shared/ui/debug-provider/`       |
| `src/app/_common/header/`                  | `src/shared/ui/header/`               |
| `src/app/_common/text/`                    | `src/shared/text/`                    |
| `src/app/_common/utils/`                   | `src/shared/utils/`                   |
| `src/app/_common/seo/`                     | `src/shared/seo/`                     |
| `src/app/_common/i18n/`                    | `src/shared/i18n/`                    |
| `src/app/_common/searchParams/`            | `src/shared/search-params/`           |
| `src/app/stillinger/_common/lib/ad-model/` | `src/shared/ad-model/`                |
| `src/app/stillinger/_common/auth/`         | `src/features/stillinger/auth/`       |
| `src/app/stillinger/_common/user/`         | `src/features/stillinger/user/`       |
| `src/app/stillinger/_common/actions/`      | `src/features/stillinger/actions/`    |
| `src/app/stillinger/_common/utils/`        | `src/features/stillinger/utils/`      |
| `src/app/stillinger/_common/hooks/`        | `src/features/stillinger/hooks/`      |
| `src/app/stillinger/_common/types/`        | `src/features/stillinger/types/`      |
| `src/app/stillinger/_common/monitoring/`   | `src/features/stillinger/monitoring/` |

---

## Kritiske refaktoreringer som trengs

### 1. Bryt sirkulær avhengighet: stillinger ↔ muligheter

**Problem:** `stillinger/AuthenticationProvider` importerer `muligheter/_common/auth/apiClient.ts` for å sjekke muligheter-tilgang. Samtidig importerer muligheter fra stillinger.

**Løsning:** Flytt `fetchMuligheterAccessStatus` til `src/shared/auth/` eller lag et felles access-check-grensesnitt som begge features bruker, uten direkte import mellom features.

### 2. Løft ad-model ut av stillinger

**Problem:** `stillinger/_common/lib/ad-model/` er en stor modul med Zod-schemas og transformasjoner brukt av stillinger, sommerjobb og muligheter.

**Løsning:** Flytt til `src/shared/ad-model/`. Dette er domenelogikk som ikke tilhører én feature.

### 3. Løft AuthenticationProvider og UserProvider ut av stillinger

**Problem:** Disse bor i `stillinger/_common/` men wraps **hele appen** via `Providers.tsx`.

**Løsning:** Flytt til `src/features/stillinger/auth/` og `src/features/stillinger/user/` (fordi kontekstene primært server stillinger-spesifikke behov), men la Providers.tsx importere derfra. Alternativt: flytt til `src/shared/auth/` om de virkelig er globale.

### 4. Konsolider søke-utilities

**Problem:** Query-konstanter (QueryNames), fetch-helpers og Zod-schemas for søk er spredt mellom `stillinger/(sok)/_utils/`, `sommerjobb/_utils/`, `muligheter/(sok)/_utils/` og `server/schemas/`.

**Løsning:** Felles søkekode → `src/shared/search/`. Feature-spesifikk søkekode → respektiv `src/features/X/`.

---

## Stegvis implementasjonsplan

### Fase 0: Forberedelser (lav risiko)

> **Mål:** Sett opp path-alias og verifiser at alt fungerer med ny `shared/`-mappe.

| Steg | Beskrivelse                                                                          |
| ---- | ------------------------------------------------------------------------------------ |
| 0.1  | Opprett `src/shared/` med en tom `index.ts`                                          |
| 0.2  | Legg til path-alias `@shared` → `src/shared` i `tsconfig.json` og `vitest.config.ts` |
| 0.3  | Legg til path-alias `@features` → `src/features` (om ikke allerede finnes)           |
| 0.4  | Verifiser at `pnpm build` og `pnpm test` fortsatt fungerer                           |

### Fase 1: Flytt teknisk-lag-mapper til shared (lav risiko, høy verdi)

> **Mål:** Eliminer de halv-tomme teknisk-lag-mappene (`hooks/`, `server/`, `types/`).

| Steg | Beskrivelse                                                                       | Filer            |
| ---- | --------------------------------------------------------------------------------- | ---------------- |
| 1.1  | Flytt `src/hooks/*` → `src/shared/hooks/`                                         | 2 filer          |
| 1.2  | Flytt `src/server/utils/htmlSanitizer.ts` → `src/shared/html/`                    | 2 filer (+ test) |
| 1.3  | Flytt `src/server/schemas/stillingSearchSchema.ts` → `src/shared/search/schemas/` | 1 fil            |
| 1.4  | Flytt `src/types/*` → `src/shared/types/`                                         | 3 filer          |
| 1.5  | Slett tomme mapper, oppdater alle imports                                         | —                |
| 1.6  | Kjør `pnpm build && pnpm test && pnpm lint`                                       | —                |

### Fase 2: Flytt genuint delt kode fra \_common til shared (middels risiko)

> **Mål:** Rydde i `src/app/_common/` slik at den kun inneholder App Router-spesifikke ting.

| Steg | Beskrivelse                                                                                | Filer (ca.) |
| ---- | ------------------------------------------------------------------------------------------ | ----------- |
| 2.1  | Flytt `_common/auth/` → `src/shared/auth/`                                                 | 4 filer     |
| 2.2  | Flytt `_common/geografi/` → `src/shared/geografi/`                                         | 14 filer    |
| 2.3  | Flytt `_common/logging/` → `src/shared/logging/`                                           | 2 filer     |
| 2.4  | Flytt `_common/text/` → `src/shared/text/`                                                 | 3 filer     |
| 2.5  | Flytt `_common/utils/` → `src/shared/utils/`                                               | 4 filer     |
| 2.6  | Flytt `_common/i18n/` → `src/shared/i18n/`                                                 | 1 fil       |
| 2.7  | Flytt `_common/seo/` → `src/shared/seo/`                                                   | 1 fil       |
| 2.8  | Flytt `_common/searchParams/` → `src/shared/search-params/`                                | 1 fil       |
| 2.9  | Flytt `_common/umami/` + `tracking/` + `trackers/` → `src/shared/analytics/`               | ~20 filer   |
| 2.10 | Flytt `_common/skyra/` → `src/shared/skyra/`                                               | 9 filer     |
| 2.11 | Flytt `_common/cookie-banner/` → `src/shared/ui/cookie-banner/`                            | 2 filer     |
| 2.12 | Flytt `_common/debug-provider/` → `src/shared/ui/debug-provider/`                          | 1 fil       |
| 2.13 | Flytt `_common/header/` → `src/shared/ui/header/`                                          | 2 filer     |
| 2.14 | Flytt `_common/broadcast/` → `src/shared/auth/broadcast.ts`                                | 1 fil       |
| 2.15 | Flytt `_common/actions/cookies.ts` → `src/shared/utils/cookies.ts`                         | 1 fil       |
| 2.16 | Flytt `_common/axe/` → `src/shared/axe/`                                                   | 3 filer     |
| 2.17 | Flytt `_common/googleTranslateWorkaround/` → `src/shared/utils/googleTranslateWorkaround/` | 2 filer     |
| 2.18 | Oppdater alle imports (bruk IDE refactor eller `sed`)                                      | —           |
| 2.19 | Kjør full test-suite + bygg                                                                | —           |

> **Etter fase 2:** `src/app/_common/` inneholder kun: `components/`, `article/`, `css/`, `ContentSection/`, `FeatureCard/`, `QbrickVideo/`, `ReadableWidth/`, `TipsList/` — altså rent UI og App Router-spesifikt.

### Fase 3: Løft ad-model og søke-utils til shared (middels risiko, kritisk)

> **Mål:** Bryt den hardeste avhengigheten — `stillinger/_common/lib/ad-model/` brukt av 3 features.

| Steg | Beskrivelse                                                                                        | Filer (ca.) |
| ---- | -------------------------------------------------------------------------------------------------- | ----------- |
| 3.1  | Flytt `stillinger/_common/lib/ad-model/` → `src/shared/ad-model/`                                  | 20+ filer   |
| 3.2  | Flytt delte query-konstanter (QueryNames) → `src/shared/search/queryNames.ts`                      | 1 fil       |
| 3.3  | Flytt delt fetch-hjelper (`stillinger/_common/utils/fetch.ts`) → `src/shared/search/fetchUtils.ts` | 1 fil       |
| 3.4  | Oppdater imports i stillinger, sommerjobb og muligheter                                            | —           |
| 3.5  | Kjør full test-suite + bygg                                                                        | —           |

### Fase 4: Flytt stillinger-spesifikk logikk til features/stillinger (høy risiko, høy verdi)

> **Mål:** Tøm `src/app/stillinger/_common/` og flytt logikken til `src/features/stillinger/`.

| Steg | Beskrivelse                                                                                             | Filer (ca.) |
| ---- | ------------------------------------------------------------------------------------------------------- | ----------- |
| 4.1  | Flytt `stillinger/_common/actions/` → `src/features/stillinger/actions/`                                | 9 filer     |
| 4.2  | Flytt `stillinger/_common/auth/` → `src/features/stillinger/auth/`                                      | 8 filer     |
| 4.3  | Flytt `stillinger/_common/user/` → `src/features/stillinger/user/`                                      | 4 filer     |
| 4.4  | Flytt `stillinger/_common/hooks/` → `src/features/stillinger/hooks/`                                    | 3+ filer    |
| 4.5  | Flytt `stillinger/_common/types/` → `src/features/stillinger/types/`                                    | 5+ filer    |
| 4.6  | Flytt `stillinger/_common/utils/` → `src/features/stillinger/utils/`                                    | 30+ filer   |
| 4.7  | Flytt `stillinger/_common/monitoring/` → `src/features/stillinger/monitoring/`                          | 2 filer     |
| 4.8  | Flytt `stillinger/_common/components/` → `src/features/stillinger/components/`                          | 3+ filer    |
| 4.9  | **Løs sirkulær avhengighet:** Flytt `fetchMuligheterAccessStatus` til `src/shared/auth/`                | 1 fil       |
| 4.10 | Oppdater `Providers.tsx` til å importere fra `@features/stillinger/auth` og `@features/stillinger/user` | 1 fil       |
| 4.11 | Slett `src/app/stillinger/_common/`                                                                     | —           |
| 4.12 | Kjør full test-suite + bygg                                                                             | —           |

### Fase 5: Flytt øvrige features (lav-middels risiko)

> **Mål:** Flytt logikk for sommerjobb, muligheter og min-side til egne feature-mapper.

| Steg | Beskrivelse                                                         | Filer (ca.) |
| ---- | ------------------------------------------------------------------- | ----------- |
| 5.1  | Flytt `sommerjobb/_utils/` → `src/features/sommerjobb/`             | 13 filer    |
| 5.2  | Flytt `muligheter/(sok)/_utils/` → `src/features/muligheter/utils/` | 9 filer     |
| 5.3  | Flytt `muligheter/_common/auth/` → `src/features/muligheter/auth/`  | 2 filer     |
| 5.4  | Flytt `min-side/_common/` → `src/features/min-side/`                | 4 filer     |
| 5.5  | Oppdater imports                                                    | —           |
| 5.6  | Kjør full test-suite + bygg                                         | —           |

### Fase 6: Opprydding og dokumentasjon (lav risiko)

| Steg | Beskrivelse                                                                                                 |
| ---- | ----------------------------------------------------------------------------------------------------------- |
| 6.1  | Fjern tomme `_common/`-mapper og `_utils/`-mapper                                                           |
| 6.2  | Oppdater path-alias og barrel-exports der hensiktsmessig                                                    |
| 6.3  | Oppdater `README.md` med ny mappestruktur                                                                   |
| 6.4  | Oppdater `.github/copilot-instructions.md` med ny prosjektstruktur                                          |
| 6.5  | Vurder å legge til ESLint-regler som hindrer import mellom features (via `eslint-plugin-import` boundaries) |
| 6.6  | Skriv en kort `ARCHITECTURE.md` som forklarer package-by-feature-strukturen og importreglene                |

---

## Importregler (ny konvensjon)

```
✅ features/X → shared/*            (feature bruker delt kode)
✅ features/X → features/X/*        (feature bruker sin egen kode)
✅ app/X      → features/X/*        (rute bruker sin feature)
✅ app/X      → shared/*            (rute bruker delt kode)
✅ app/_common → shared/*           (delte app-komponenter bruker delt kode)

❌ features/X → features/Y          (features skal IKKE importere fra hverandre)
❌ shared/*   → features/*          (shared skal ALDRI importere fra features)
❌ app/X      → app/Y/_common/*     (ruter skal IKKE importere fra andre ruters _common/)
```

> **Unntak:** Dersom to features trenger samme logikk, flyttes den til `shared/`.

---

## Risikomatrise

| Fase | Risiko     | Begrunnelse                               | Mitigering                                    |
| ---- | ---------- | ----------------------------------------- | --------------------------------------------- |
| 0    | 🟢 Lav     | Kun konfigurasjon                         | Test build + test                             |
| 1    | 🟢 Lav     | Få filer, ingen logikkendring             | Søk-og-erstatt imports                        |
| 2    | 🟡 Middels | Mange filer, mange imports å oppdatere    | Ta én modul om gangen, test mellom hvert steg |
| 3    | 🟡 Middels | ad-model er kompleks, brukt av 3 features | Grundig testing av søkeresultater             |
| 4    | 🔴 Høy     | Flest filer, auth/user er kritisk path    | Del opp i småPR-er, test auth-flyten manuelt  |
| 5    | 🟡 Middels | Avhenger av at fase 3 er ferdig           | Etter fase 3 er koblingene løsnet             |
| 6    | 🟢 Lav     | Dokumentasjon og opprydding               | —                                             |

---

## Anbefalinger

1. **Gjør én fase per PR** — hold PR-ene review-bare og enkle å rulle tilbake
2. **Bruk IDE refactoring** — «Move file» i VS Code/IntelliJ oppdaterer imports automatisk
3. **Start med fase 0–1** — gir tidlig gevinst med lav risiko
4. **Fase 3 og 4 kan parallelliseres delvis** — ad-model (fase 3) er uavhengig av auth-flytt (fase 4.1–4.3)
5. **Legg til import-boundary-lint tidlig** (fase 6.5) for å hindre at nye kryss-imports sniker seg inn
6. **Ikke omskriv logikk** — dette er en _flytt_, ikke en _rewrite_. Behold all eksisterende kode uendret og endre kun import-paths
