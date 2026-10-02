# Implementeringsplan: Enklere vei til jobb

## Problem og mål

Vi skal lage en offentlig, midlertidig spike under `/ung` som prøver ut Shared Content-API-et. Første versjon bruker lokal mockdata. Den skal vise:

1. En onboarding med spørsmål og alternativer fra datakilden.
2. En delbar resultatside der valgene ligger i URL-en.
3. Innhold som API-et kobler til valgene, blant annet artikler og spørsmål med svar.
4. Kontroller øverst på resultatsida slik at valgene kan endres uten å starte på nytt.

Spiken skal gjøre overgangen til staging liten: transport, auth og rå JSON:API-schema skal kunne byttes uten å skrive om UI-et.

## Nå-situasjon

- Appen bruker Next.js 16, React 19, TypeScript, Vitest og Aksel 8.16.2.
- `/ung` rendrer `src/features/ung/ui/UngMainPage.tsx`. Siden er statisk og har eksisterende Aksel-baserte kort, illustrasjoner, Ung-tema og Umami-mønstre.
- Appen har server-side fetch-mønstre, Zod med `safeParse()`, `appLogger`, Prometheus og Nais `accessPolicy`.
- `src/server/utils/htmlSanitizer.ts` bruker allerede DOMPurify server-side.
- Eksempelrepoet viser server-side `api-key`, JSON:API-relasjoner, `included`-ressurser, artikkel-Paragraphs og mock-fixtures. Det viser ikke den nye kontrakten for onboarding eller valg-til-resultat.
- Prototypen viser tre steg: alder, jobbsituasjon og mål. Resultatsida viser de samme valgene som redigerbare filtre.

## Beslutninger

| Tema | Valg | Begrunnelse og kostnad |
|---|---|---|
| Arketype | Utvidelse av dagens offentlige Next.js-frontend/BFF | Ingen ny tjeneste eller database. Appen kaller Shared Content server-side. |
| Auth | Ingen brukerinnlogging. API-nøkkel kun server-side | Bevarer åpen tilgang. Nøkkelen skal aldri ha `NEXT_PUBLIC_`-prefiks eller sendes til nettleseren. |
| Datakilde | `mock` og `live` bak samme server-only grensesnitt | UI-et kan bygges nå. Ekstra adapterlag koster noen små filer, men isolerer den ukjente staging-kontrakten. |
| Tilstand | URL er eneste varige kilde | Delbare lenker og ingen lagring. URL-er kan havne i historikk og logger, så spørsmålene kan ikke omfatte sensitive opplysninger. |
| Datahenting | Server Components kaller serverklienten direkte | Ingen offentlig proxy-route eller klienteksponert nøkkel. Resultatfiltre utløser servernavigasjon via oppdatert URL. |
| Resultatoppdatering | Oppdater ved hvert filtervalg | Gir umiddelbar respons. URL-en erstattes med `router.replace` uten scrollhopp. |
| HTML | Valider, sanitér og render kun en brandet `SanitizedHtml`-type | Forsvar i dybden selv om API-et sanitiserer. Kan fjerne noe tillatt markup hvis allowlisten blir for streng. |
| Utrulling | Feature flag i dev. Prod-ruta og lenken er av | Spiken kan testes uten å publiseres. Direkte dypelenke skal også stoppes når flagget er av. |
| Cache | Mock leses lokalt. Første staging-pass bruker `no-store` | Gjør kontraktstesting forutsigbar. Cache og revalidering bestemmes etter at API-eier har oppgitt TTL og rate limits. |

## Omfang

### Med i første leveranse

- Ny inngang på `/ung`, kun når feature flagget er aktivt.
- Onboarding på `/ung/enklere-vei-til-jobb`.
- Resultater på `/ung/enklere-vei-til-jobb/resultat`.
- Jobbquiz på `/ung/enklere-vei-til-jobb/jobbquiz`.
- Spørsmål av typene enkeltvalg og flervalg.
- «Neste», «Tilbake», «Fullfør» og «Hopp over».
- Generisk resultat uten svar ved «Hopp over» eller «Fullfør» uten valg.
- Resultatfiltre som endrer URL-en og henter resultatet på nytt.
- Artikkelkort og spørsmål/svar fra mocken.
- Umiddelbar respons, framdrift og poengsum i jobbquizen.
- Eksplisitte loading-, tom-, ugyldig URL- og feiltilstander.
- Zod-validering, HTML-sanitering, tester og dev-konfigurasjon.

### Ikke med i første leveranse

- Cookie eller annen lagring av valg.
- Lagring eller deling av quizsvar og poengsum.
- Innlogging eller personlige data fra pam-aduser.
- Produksjonsaktivering.
- Produktsporing av alle interaksjoner.
- Nye avhengigheter eller nytt testverktøy.
- Fritekst, betingede spørsmål eller forgrening mellom steg.
- Endelig JSON:API-schema, matching-regler, språkstrategi, mediahost eller cache-policy før onboarding- og quizinnhold finnes i staging.

## Forutsetninger som må verifiseres

- API-et gir stabile ID-er for modul, spørsmål, alternativer og innhold. UI-tekst brukes aldri som ID.
- API-et bestemmer rekkefølgen på spørsmål og resultatinnhold.
- API-et gir et definert standardresultat når forespørselen ikke inneholder svar.
- Første kontrakt trenger bare `single` og `multiple`.
- Resultatmatching eies av API-et. Mockens matching er en foreløpig simulering, ikke produksjonslogikk.
- Spørsmålene beskriver brede situasjoner. API-eier må varsle før det innføres helseopplysninger, ytelser eller andre sensitive kategorier.

## Foreslått URL-kontrakt

```text
/ung/enklere-vei-til-jobb/resultat?v=1&svar=<alternativ-id>&svar=<alternativ-id>
/ung/enklere-vei-til-jobb/jobbquiz?v=1&svar=<alternativ-id>&svar=<alternativ-id>
```

- Bruk gjentatt `svar` for både enkelt- og flervalg.
- Bruk stabile alternativ-ID-er, ikke etiketter eller fritekst.
- `v=1` gjør senere migrering mulig.
- Parseren setter grenser for antall svar, lengde og tillatte tegn før verdiene brukes.
- Etter at modulen er hentet, kontrollerer parseren at hvert svar finnes og tilhører riktig spørsmål.
- Ukjente eller utgåtte ID-er gir en synlig advarsel. De sendes ikke videre til resultatkallet.
- `/resultat?v=1` uten `svar` er en gyldig URL og viser standardresultatet.
- «Hopp over» forkaster midlertidige valg og går direkte til denne URL-en.
- Hvis URL-en inneholder `svar`, men ingen er gyldige, vises en ugyldig-lenke-tilstand. Dette skal ikke behandles skjult som et bevisst tomt svarsett.
- Jobbquiz-lenka beholder onboarding-valgene slik at «Tilbake til resultater» gjenoppretter samme resultatside.
- Quizsvar finnes bare i lokal React-state. De legges ikke i URL-en.

## Dataarkitektur

### Stabil intern modell

UI-et skal bare kjenne en liten domenemodell:

- `OnboardingModule`: ID, versjon, tittel, ingress og ordnede spørsmål.
- `OnboardingQuestion`: ID, tekst, hjelpetekst, valgtype og ordnede alternativer.
- `AnswerOption`: stabil ID, etikett og eventuell beskrivelse.
- `Selection`: valgte alternativ-ID-er.
- `ResultSection`: ID, overskrift og ordnet innhold.
- `ResultContent`: artikkellenke, spørsmål/svar eller støttet HTML-blokk.
- `JobQuiz`: ordnede seksjoner, spørsmål, svaralternativer og sanitert tilbakemelding.

Dette er ikke en kopi av Drupal. Adapteren oversetter rå JSON:API til modellen.

### Server-only grensesnitt

```text
SharedContentSource
├── getOnboardingModule()
├── getResults(selection)
└── getJobQuiz()
```

- `MockSharedContentSource` leser lokale JSON:API-fixtures.
- `createLiveSharedContentSource` (`server/liveSharedContentSource.server.ts`) er en hybridkilde. `getOnboardingModule()` og `getJobQuiz()` bruker lokalt innhold fra `server/local/`. `getResults()`, `getArticle()` og `getArticleQuiz()` bruker live-API-et.
- Live-laget har samlingsadapter, artikkeladapter og Webform-quizparser. Alt går gjennom Zod `safeParse()`. Webform-YAML leses med `yaml.parse()` uten egne tags og valideres som `unknown`.
- Koden velger kilde med `SHARED_CONTENT_SOURCE=mock|live`.
- Live-modus skal feile ved manglende URL eller API-nøkkel. Den skal aldri falle skjult tilbake til mock, heller ikke ved feil i live-kall.
- Resultatsiden viser artikkelkort med lokal lenke til `/ung/enklere-vei-til-jobb/artikkel/[uuid]`. Valgene bevares i URL-en.

### Arbeidsantakelse for matching

Matching bruker term-UUID-ene som finnes i de sanerte fixturene (`server/drupal/__fixtures__/collection.json`). Tabellen ligger i `server/drupal/termMapping.server.ts`. Alder og erfaring er bekreftet mot de offentlige taxonomy-ressursene. Situation-termene er ikke bekreftet av API-teamet.

| Lokalt svar | Term-UUID |
| --- | --- |
| `age-under-18` | `5be5c5a4-c191-4f00-9ad1-cc4ac365da78` |
| `age-18-or-older` | `7d074491-7231-4c1c-aef3-bdd917776198` |
| `situation-no-experience` | `0fd8124e-edf2-459d-9986-7fb2167dd3da` |
| `situation-some-experience` | `a2dc822c-1eea-4201-bf2e-bcd61077ca05` |
| `situation-looking-for-change` | ingen term funnet |
| `goal-find-job` | `03c6bc26-0b80-42c0-95aa-d001c6e9c5e2` |
| `goal-apply` | `cb90945e-a2c4-4a50-8dcb-438c1fe69764` |
| `goal-interview` | `ccdaef9c-c649-4a1e-a6bf-3fba1ec39255` |
| `goal-support` | `e3e36196-3627-4ce9-8b35-5a7790489618` |
| `goal-rights` | ingen term funnet |

- Termnavn for situation finnes ikke i fixturene, og termene krever API-nøkkel. Koblingen for mål er derfor en arbeidsantakelse.
- Regler: AND mellom dimensjoner med valg, OR innenfor en dimensjon, manglende metadata matcher ikke et valgt filter, tom selection viser alt. Resultatet dedupliseres på `type+id` og beholder API-rekkefølgen.
- Samlingskallet bruker ikke `include`. `meta.omitted` tolereres, siden matching bare trenger relasjons-ID-ene.
- Bilder i `title_text_image` hentes via `field_tti_image.field_media_image`. Drupal returnerer relativ `uri.url`, som gjøres absolutt mot CMS-origin. `field_tti_layout` og `field_tti_style` styrer bildeplassering og farget boks.
- Ikke støttet ennå: Qbrick, Vimeo-thumbnails og opplastet video (`media--video`).
- Samlingskall pagineres via `links.next` (samme origin og path, maks 5 sider).
- Observerbarhet: `shared_content_requests_total{operation,result}` og `shared_content_request_duration_seconds{operation}` i `src/metrics.ts`. Ingen ID, query eller innhold i labels eller logger.

### Dataflyt

```text
/ung
  → feature-gated lenke
  → onboarding-side (Server Component)
  → SharedContentSource.getOnboardingModule()
  → Zod safeParse + JSON:API-adapter
  → klientkomponent håndterer steg og midlertidig state
  → Fullfør bygger versjonert resultat-URL
  → resultatside validerer URL mot modulen
  → SharedContentSource.getResults()
  → normalisert og sanitert innhold
  → resultater + redigerbare filtre
  → jobbquiz-lenke med de samme onboarding-valgene
  → SharedContentSource.getJobQuiz()
  → lokal quizstate med umiddelbar respons
  → tilbake til samme resultat-URL
```

## Lokalt innhold og mock

Onboarding-spørsmålene og jobbquizen har ingen kontrakt i Shared Content. De ligger som typede TypeScript-objekter i `server/local/` og brukes i både mock- og live-modus:

- `onboardingModule.ts` har spørsmål og svar-ID-er. Svar-ID-ene står i URL-en og i `drupal/termMapping.server.ts`.
- `jobQuiz.ts` har jobbquizen på `/jobbquiz`.

`server/mock/` brukes bare med `SHARED_CONTENT_SOURCE=mock`, for eksempel til styling når API-et er nede:

- `mockResults.ts` har artikkelkort og spørsmål/svar med synlighetsregler (`showWithoutAnswers` og `answerIds`).
- `mockArticle.ts` har én eksempelartikkel med alle blokktyper og en Webform-quiz. Resultatsida lenker til den.

Typene sikrer formen på dataene. `local/localContent.test.ts` sjekker reglene typene ikke kan uttrykke: unike ID-er, nøyaktig ett riktig svar per quizspørsmål og trygge lenker.

Designreferansen er `docs/Enklere_vei_til_jobb/enklereveitiljobb_resultat_side.svg`. Resultatsida følger den smale kolonnen, blå innholdskort, fremhevet spørsmålsseksjon og åpen første accordion. Aksel-komponentene styrer kontrollenes endelige utforming. Designreferansene for jobbquizen er `JobbQuiz uten valg.svg` og `Jobb quiz med svar.svg`.

## Foreslått filstruktur

```text
src/app/ung/
├── page.tsx
└── enklere-vei-til-jobb/
    ├── page.tsx
    ├── loading.tsx
    ├── error.tsx
    ├── jobbquiz/
    │   └── page.tsx
    └── resultat/
        ├── page.tsx
        ├── loading.tsx
        └── error.tsx

src/features/ung/onboarding/
├── domain/
│   ├── onboarding.ts
│   ├── results.ts
│   ├── article.ts
│   ├── jobQuiz.ts
│   └── selectionParams.ts
├── server/
│   ├── sharedContentSource.server.ts
│   ├── liveSharedContentSource.server.ts
│   ├── drupal/
│   │   ├── drupalClient.server.ts
│   │   ├── jsonApi.ts
│   │   ├── articleMapper.server.ts
│   │   ├── termMapping.server.ts
│   │   └── webformQuiz.server.ts
│   ├── local/
│   │   ├── onboardingModule.ts
│   │   └── jobQuiz.ts
│   └── mock/
│       ├── mockResults.ts
│       ├── mockArticle.ts
│       └── mockSharedContentSource.server.ts
└── ui/
    ├── JobQuiz.tsx
    ├── OnboardingWizard.tsx
    ├── OnboardingQuestion.tsx
    ├── ResultFilters.tsx
    ├── ResultContent.tsx
    └── SafeHtml.tsx
```

Hold rutefilene tynne. Datakall og hemmeligheter blir i `server/`. Veiviseren, resultatfiltrene og jobbquizen trenger `"use client"`.

## UI og universell utforming

- Bruk eksisterende `PageBlock`, `Box`, `VStack`, `HStack`, `Heading`, `BodyLong` og Ung-tema.
- Bruk `RadioGroup` for enkeltvalg og `CheckboxGroup` for flervalg.
- Bruk Aksel `Select` for enkeltvalg på resultatsida. Flervalg vises i en Aksel-utvidbar komponent med `CheckboxGroup`; ikke bruk et hjemmelaget select.
- Bruk `LinkCard` for artikkellenker og Aksel Accordion for spørsmål/svar når kontrakten støtter dette.
- Framdrift skal ha synlig tekst som «Steg 2 av 3» og semantisk `aria-current="step"`. Bekreft Aksel-komponenten mot installert 8.16.2 før kode skrives.
- Alle spørsmål er valgfrie. «Neste» og «Fullfør» fungerer uten valg.
- Ved stegbytte flyttes fokus til stegets overskrift. Tilbakeknappen beholder tidligere valg.
- Resultatfiltre oppdaterer URL-en med `router.replace` ved hvert valg, uten scrollhopp.
- Jobbquizen bruker kontrollerte `RadioGroup`-komponenter og annonserer responsen med en live-region.
- Framdrift vises etter første svar. Seksjons- og totalscore vises når de aktuelle spørsmålene er besvart.
- «Ta quizen på nytt» nullstiller lokal state. Tilbake-lenka bygger en kanonisk resultat-URL fra onboarding-valgene.
- Layouten er mobil først og bruker Aksel spacing-tokens. Egen CSS begrenses til Ung-profil og detaljer Aksel ikke dekker.
- Test 200 % zoom, tastaturrekkefølge, skjermlesernavn, logisk overskriftshierarki og dynamiske feil.

## Sikkerhet og personvern

- All API-respons behandles som `unknown` og valideres med `safeParse()`.
- URL-parametre valideres syntaktisk og mot modulens faktiske alternativ-ID-er.
- Sett grense på antall URL-verdier og lengden per ID for å hindre misbruk og svært lange upstream-kall.
- API-nøkkelen leses kun i `server-only` kode. Ikke returner request-headere eller rå API-feil til klienten.
- Ikke logg API-nøkkel, rå payload, HTML, URL-query eller valgte svar.
- Tillat bare relative lenker og avtalte `https:`-lenker. Avvis `javascript:`, `data:` og ukjente protokoller.
- Sanitér `rendered_html` med DOMPurify etter Zod-validering. Render bare `SanitizedHtml`.
- Lag tester som fjerner `<script>`, event-attributter og skadelige URL-er, men beholder avtalt markup.
- URL-en er synlig i historikk og kan deles. Derfor skal denne løsningen ikke brukes til sensitive eller fritekstbaserte spørsmål.
- Quizsvar og poengsum skal ikke persisteres eller logges. Bare onboarding-valgene kan følge med til quizruta.
- Cookie utsettes. En senere cookie-løsning krever egen vurdering av formål, levetid og samtykke. URL skal da vinne over cookie.

## Feilhåndtering

Bruk eksplisitte feiltyper for:

- manglende konfigurasjon
- nettverksfeil eller timeout
- HTTP-feil, inkludert 401/403, 404, 429 og 5xx
- ugyldig JSON eller schema
- ugyldige eller utgåtte URL-valg
- tom modul og tomt resultat
- innholdstype klienten ikke støtter

`error.tsx` viser en tydelig Aksel-feil med «Prøv igjen» og lenke tilbake til `/ung`. Tomt resultat er en egen tilstand med mulighet til å justere valg. Live-feil skal aldri presenteres som vellykket mockinnhold.

## Konfigurasjon og Nais

### Mockspike

- Legg `ENKLERE_VEI_TIL_JOBB_ENABLED=true` og `SHARED_CONTENT_SOURCE=mock` i `.nais/dev.yml`.
- La prod være deaktivert.
- Både lenken på `/ung` og rutene sjekker flagget server-side.
- Sett `robots: noindex, nofollow` på spike-rutene.
- Ingen secret eller outbound-regel trengs for lokal mock.

### Staging

Staging ble tilgjengelig 29. september 2026. Den publiserte testressursen er en generell `node--shared_content` med innhold under `field_sc_content`. Den inneholder ikke onboarding- eller quizkontrakten som UI-et trenger.

- `SHARED_CONTENT_API_URL` og eksakt staging-host ligger i dev-konfigurasjonen.
- Server-only-klienten bruker `api-key`, `no-store`, fem sekunders timeout, blokkerte redirects og Zod-validering.
- `pnpm probe:shared-content` skriver bare ressurstyper og feltnavn. Den skriver ikke innholdsverdier eller API-nøkkel.
- Nais-secret-en `enklere-vei-til-jobb` er koblet til dev-manifestet og injiserer `SHARED_CONTENT_API_KEY`.
- Behold `SHARED_CONTENT_SOURCE=mock` til API-et har egne ressurser eller en bekreftet mapping for onboarding og jobbquiz.
- Bekreft headernavnet `api-key`, TLS, språk og term-ID-ene i arbeidsantakelsen over før live-modus aktiveres. `SHARED_CONTENT_SOURCE=live` er ikke satt i dev ennå. Aktivering venter på bekreftelse fra API-teamet.
- Hvis API-et leverer eksterne bilder eller video, legg kun avtalte hosts i CSP og `next.config.mjs`.
- Prod-konfigurasjon endres først etter eget utrullingsvedtak.

Eksisterende reusable workflows for dev og prod beholdes. Det trengs ikke en ny CI/CD-workflow.

## Observerbarhet og sporing

### Teknisk observerbarhet i spiken

- Tell Shared Content-kall etter operasjon og resultat med lave kardinalitetsverdier.
- Mål responstid for live-kall.
- Logg feiltype, operasjon, status og URL uten query. Ikke logg svarvalg eller innhold.
- Vent med produksjonsalarm til staging gir en normalrate. Start med feilandel og responstid.

### Produktsporing etter spiken

Lag en egen endring for:

- åpning fra `/ung`
- visning av steg
- neste, tilbake, hopp over og fullføring
- åpning og bruk av resultatfiltre
- oppdatering av resultat
- klikk på resultatinnhold

Bruk eksisterende `trackEvent()`/Umami-mønster og samtykke. Spor steg-ID, kontrolltype og antall valg, men ikke valgte alternativ-ID-er eller etiketter.

## Teststrategi

### Kontrakt og adapter

- Gyldig fixture passerer rå Zod-schema.
- Manglende felt, feil ressurs-type og ødelagte relasjoner avvises.
- Relasjonsrekkefølge beholdes selv om `included` står i annen rekkefølge.
- Normalisering gir korrekt enkeltvalg, flervalg og resultatinnhold.
- Mockmatching er deterministisk, dedupliserer innhold og følger API-definert rekkefølge.
- Quizadapteren bevarer seksjonsrekkefølgen, krever nøyaktig ett riktig svar og sanitiserer tilbakemeldingen.

### URL og validering

- Encode/decode av versjonerte, gjentatte `svar`-parametre.
- Ugyldige tegn, for lange ID-er og for mange svar avvises.
- Ukjente og utgåtte svar vises som feil/advarsel og sendes ikke til datakilden.
- Delbar resultat-URL gjenoppretter filtrene.
- Quiz-URL-en gjenoppretter den samme resultatlenka uten å inneholde quizsvar.
- Tomt svarsett gir standardresultatet.
- «Hopp over» og «Fullfør» uten valg gir samme resultat-URL og innhold.
- En URL som inneholder bare ugyldige svar skilles fra et bevisst tomt svarsett.

### Sikker HTML og lenker

- Fjern script, event handlers, `javascript:` og skadelig bildeinnhold.
- Behold tillatte overskrifter, avsnitt, lister og trygge lenker.
- Eksterne lenker får trygg `rel` når de åpnes i ny fane.

### Komponenter

- Veiviseren rendrer API-rekkefølgen.
- Neste, tilbake, hopp over og fullfør fungerer også uten valgte svar.
- Fokus flyttes riktig mellom steg og ved feil.
- Resultatfiltre oppdaterer riktig URL med en gang et valg endres.
- Resultatsida dekker innhold, tomt resultat og feil.
- Jobbquizen gir umiddelbar respons, oppdaterer framdrift, viser sluttscore og nullstiller alle svar.
- Kjør `runAxeTest` på representative onboarding-, resultat- og quiztilstander.

### Verifisering

Kjør målrettede Vitest-tester underveis. Avslutt med:

```bash
pnpm test
pnpm compileTS
pnpm lint
pnpm build:no-sourcemap
```

Gjør manuell smoke-test i dev med mobilbredde, desktop, tastatur, 200 % zoom, delt resultat-URL og deaktivert feature flag.

## Implementeringsrekkefølge

1. **Lås intern kontrakt og mock:** Lag domenetyper, foreløpig JSON:API-fixture og kontrakttester.
2. **Bygg adapteren:** Valider rådata, behold relasjonsrekkefølge og normaliser til UI-modellen.
3. **Bygg kildegrensesnittet:** Legg til mockkilde, miljøvalg og eksplisitte feiltyper.
4. **Bygg URL-kontrakten:** Encode, parse, grenser, versjonering og semantisk validering.
5. **Feature-gate rutene:** Opprett onboarding- og resultatrute, metadata, loading/error og dev-only kontroll.
6. **Bygg veiviseren:** Dynamiske enkelt-/flervalg, validering, fokus, tilbake, hopp over og fullfør.
7. **Bygg resultatsida:** Server-side resultatoppslag, redigerbare filtre, tomtilstand, artikler og spørsmål/svar.
8. **Sikre HTML og lenker:** Gjenbruk/stram inn sanitizer, brand typen og legg inn XSS-tester.
9. **Koble inngangen på `/ung`:** Vis Aksel-CTA kun når flagget er aktivt.
10. **Verifiser spiken:** Komponent-, adapter-, URL- og UU-tester, deretter full repo-validering og dev-smoke-test.
11. **Bygg jobbquizen:** Legg til egen mockkontrakt, quizrute, lokal state, tilbakemelding, poengsum og trygg retur til resultatsida.
12. **Tilpass til staging:** Live transport, kontraktprobe, dev-URL og outbound-regel er på plass. Neste steg er rotert secret, faktisk onboarding-/quizinnhold og adapter mot den observerte kontrakten.
13. **Produksjonshardening senere:** Avklar cache, språk, media, tracking, alarmer, personvern og prod-flagg.

## Staging-kontrakt som må avklares

- Eksakte endpoint, ressurs-typer, `include`-stier og API-versjon.
- Om matching skjer i API-et eller i konsumenten.
- Semantikk ved flere valg: any/all, prioritet, deduplisering og sortering.
- Standardinnhold uten svar og egen tomtilstand ved null treff.
- Stabile ID-er og regler for slettede/endrede alternativer.
- Språkvalg og fallback.
- Sanitert HTML-kontrakt, tillatte tags/attributter og lenker.
- Mediahosts og bildeformat.
- Statuskoder, timeout, rate limits, paginering, cache/TTL og nøkkelrotasjon.
- Om API-kall med svar-ID-er skal være GET-query eller POST-body.
- Om quizen er en egen node, og hvilke relasjoner og felter som representerer seksjoner, spørsmål, alternativer og riktig svar.

## Utrulling og rollback

### Mockspike

1. Deploy til dev med flagget aktivt og mockkilde.
2. Verifiser lenken fra `/ung`, hele flyten, dypelenke og feiltilstander.
3. Bekreft at prod ikke viser lenken og at direkte rute gir 404.

Rollback er å sette `ENKLERE_VEI_TIL_JOBB_ENABLED=false` eller fjerne dev-verdien. Ingen data må migreres eller slettes.

### Staging

1. Legg inn secret og outbound-host.
2. Kjør livekilden bare i dev.
3. Sammenlign responsen med kontrakttestene og endre råschema/adapter, ikke UI-modellen, når mulig.
4. Verifiser at nøkkelen ikke finnes i klientbundle, logger eller nettlesertrafikk.
5. Gå tilbake til `SHARED_CONTENT_SOURCE=mock` ved kontrakt- eller driftsfeil. Dette er en eksplisitt konfigurasjonsrollback, ikke automatisk fallback.

## Ferdigkriterier for første leveranse

- Hele mockflyten kan fullføres med tastatur.
- Resultat-URL-en kan åpnes i en ny nettleser og gir samme valg og innhold.
- Valg lagres ikke i database, local storage eller cookie.
- Quizsvar nullstilles ved reload og «Ta quizen på nytt».
- Ingen API-nøkkel eller rå Shared Content-data sendes til klienten.
- Ugyldig API-data, skadelig HTML og ugyldige URL-parametre håndteres eksplisitt.
- `/ung` og spike-rutene er feature-gated i dev og utilgjengelige i prod.
- Tester, typekontroll, lint og build passerer.

## Rød og grønn sone

🔴 Rød sone, gå gjennom og forstå grundig:

- Den endelige Zod-kontrakten mot staging.
- Validering av URL-valg mot gyldige spørsmål og alternativer.
- Matching og sortering dersom dette likevel må gjøres i appen.
- HTML-sanitering, lenkevalidering og bruk av `dangerouslySetInnerHTML`.
- Nais-secret og outbound-regel.

🟢 Grønn sone:

- Aksel-layout og presentasjonskomponenter.
- Mock-fixtures etter avtalt kontrakt.
- Rutewiring, loading- og tomtilstander.
- Enhets- og komponenttester rundt avklart adferd.
- Dev-only feature flag.

Anbefalt gjennomføring er veiledet for rød sone og delegert for resten. «Full delegering» betyr at assistenten også skriver rød-sone-koden; «veiledet» betyr at vi stopper ved disse delene, går gjennom valgene og lar utvikleren eie siste implementering.

## Bekreftede avklaringer

- «Hopp over» går til resultatsida uten svar.
- «Fullfør» uten valg gir samme URL og innhold som «Hopp over».
- Resultatfiltrene oppdaterer innholdet med en gang et valg endres.
- Jobbquizsvar lagres ikke. Tilbake-lenka går til resultatsida brukeren kom fra.
- Gjennomføringen er veiledet for rød sone og delegert for resten.

## Arkitektur-review

| Perspektiv | Vurdering | Funn |
|---|---|---|
| Sikkerhet | ✅ | API-nøkkelen holdes server-side. API-data, URL-parametre, HTML og lenker valideres før bruk. Ingen svarverdier skal logges eller spores. Før produksjon må teamet kontrollere om ingress-, referrer- eller analyseverktøy registrerer hele resultat-URL-en. |
| Plattform | ⚠️ | Dev har eksakt outbound-host og en miljøavgrenset Nais-secret for staging. Prod skal ikke få en ubetinget `envFrom`-referanse til dev-secret-en. Mediahost, CSP og `remotePatterns` avklares først når staging-responsen er kjent. |
| Arkitektur | ✅ | Det server-only kildegrensesnittet og adapteren holder Drupal JSON:API ute av UI-et. Delbar URL, ingen database og eksplisitt resultatoppdatering er den enkleste løsningen som dekker behovet. Den ukjente matching-kontrakten er isolert til mock/live-kilden. |
| Endringssikkerhet | ✅ | Endringen er additiv, feature-gated og av i prod. Mock og live velges eksplisitt uten skjult fallback. Kontrakttester, URL-tester, XSS-tester og enkel rollback begrenser risikoen når staging kobles inn. |

**Konklusjon: Godkjent.** Mockspiken kan implementeres etter planen. Staging og produksjon forblir egne porter og kan ikke aktiveres før kontrakt, secret, outbound-regel og URL-personvern er verifisert.

## Status

Mockspiken er implementert med lokale JSON:API-fixtures, server-only kildegrensesnitt, URL-validering, Aksel-veiviser, resultatside, jobbquiz, ordnede svarblokker, HTML-sanitering og feature-gated inngang fra `/ung`. Jobbquizen har lokal state, umiddelbar respons, framdrift, seksjonsscore, totalscore og nullstilling. Dev bruker mockkilden. Prod-flagg er av.

Staging-transporten er implementert med server-only API-nøkkel, HTTPS-validering, timeout, `no-store`, redirect-blokkering og validering av JSON:API-responsen. Transporten har egne operasjoner for samling, artikkel og Webform, med kontrollert paginering og samme-origin-sjekk på `links.next`.

`createLiveSharedContentSource` er en hybridkilde: onboarding og jobbquiz er lokalt innhold i `server/local/`, mens samling, artikkel og Webform-quiz hentes live når `SHARED_CONTENT_SOURCE=live`. Resultatsida, den nye artikkelsida (`/ung/enklere-vei-til-jobb/artikkel/[id]`) og den innebygde quizen er bygget mot denne kilden og testet mot de sanerte fixturene.

Dev har staging-URL, outbound-host og Nais-secret, men bruker fortsatt `SHARED_CONTENT_SOURCE=mock`. Matching mellom lokale onboarding-svar og Drupal-termer bruker i dag term-UUID-ene som finnes i fixturene som en **ubekreftet arbeidsantakelse** (se avsnittet over). Live-modus aktiveres i dev først når API-teamet har bekreftet disse ID-ene og gitt tilgang til de utelatte taxonomy-termene. Produksjonsaktivering er fortsatt ikke besluttet.
