# Enklere vei til jobb

Enklere vei til jobb hjelper unge med å finne artikler om jobbsøking ut fra alder, erfaring og mål.
Dette dokumentet samler kodekart, beslutninger, Shared Content-kontrakter og gjenstående arbeid.

## Status

Første iterasjon kjører i dev mot Shared Content i staging. Produksjonsflagget er av.

Løsningen består av:

- en lokal trestegsveiviser for alder, erfaring og mål
- svaralternativer fra Drupal-taxonomy
- server-side filtrering av Shared Content-artikler
- lokale artikkelsider med strukturerte Paragraph-blokker
- artikkelquizer fra Drupal Webform
- en miljøstyrt lenke til en publisert jobbquiz-artikkel
- Umami-sporing av bruk og aktiv lesetid

Følgende deler fra spiken er fjernet:

- den hardkodede jobbquizen og `/jobbquiz`-ruta
- lokale termtabeller og lokal matching av live-artikler
- FAQ-resultatmodellen og tilhørende mockinnhold
- Qbrick-støtte i denne featuren
- komplette staging-responser som test-fixtures

## Ruter

| Rute | Innhold |
|---|---|
| `/ung/enklere-vei-til-jobb` | Trestegsveiviseren |
| `/ung/enklere-vei-til-jobb/resultat` | Filtrerte artikler og jobbquiz-CTA |
| `/ung/enklere-vei-til-jobb/artikkel/[id]` | Artikkel og eventuell Webform-quiz |

Rutene ligger i `src/app/ung/enklere-vei-til-jobb`.

## Arkitektur og dataflyt

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
  → intern domenemodell
  → Aksel-komponenter
```

`SharedContentSource` holder transport, Drupal-typer og konfigurasjon ute av rutene og UI-et.
Live-feil faller aldri skjult tilbake til mock.

## Beslutninger

### Veiviser og URL

- Tittel, spørsmålstekster, steg og kontrolltyper ligger i
  `server/local/onboardingDefinition.ts`.
- Svaralternativene hentes fra taxonomy. UUID-en er svar-ID, `name` er etikett, og `weight`
  bestemmer rekkefølgen.
- Alder og erfaring er enkeltvalg. Mål er flervalg.
- Valgene lagres i URL-en som `<dimensjon>:<term-uuid>`.
- URL-parseren begrenser antall verdier og lengde, validerer formatet og kontrollerer ID-ene mot
  den hentede modulen.
- URL-en kan deles. Spørsmålene skal derfor ikke inneholde fritekst eller sensitive opplysninger.

### Taxonomy og filtrering

| Dimensjon | Vokabular | Filterfelt |
|---|---|---|
| Alder | `shared_content_age` | `field_sc_age.id` |
| Erfaring | `shared_content_experience` | `field_sc_experience.id` |
| Mål | `situations` | `field_sc_audiences.id` |

Mål filtreres på parent-UUID-en i `SHARED_CONTENT_GOALS_PARENT_ID`, siden `situations` også brukes
av annet innhold. Drupal får ett `IN`-filter per dimensjon. Verdier innenfor samme dimensjon
kombineres med OR, mens dimensjonene kombineres med AND.

Mål skal fortsatt ligge i `situations` og avgrenses med parent-konfigurasjonen. Det skal ikke
opprettes et eget vokabular for denne featuren.

Appen sender bare UUID-er som finnes i den hentede onboarding-modulen. Filtrering er ikke
tilgangskontroll. API-nøkkelen og `field_sc_available_to` bestemmer hvilket innhold appen kan hente.

### Artikler og resultat

- Resultatsida inneholder bare artikkelkort.
- Samlingen hentes med maks 50 ressurser per side og kontrollerte `links.next`-lenker.
- `meta.count` sammenlignes med antall hentede artikler. Avvik logges, men vises ikke i UI-et.
- Teaserbilde foretrekkes. SEO-bilde brukes som reserve.
- En artikkel åpnes på `/ung/enklere-vei-til-jobb/artikkel/[id]`.
- Ukjente Paragraph-typer hoppes over med en strukturert advarsel. Kjente typer med ugyldig
  kontrakt avvises.

### Artikkelinnhold

Frontend mapper råfeltene til egne domenetyper og Aksel-komponenter. Sanitert HTML brukes bare i
avgrensede tekstfelt.

Støttede Paragraph-typer:

| JSON:API-type | Visning |
|---|---|
| `paragraph--lpp_html` | Sanitert riktekst |
| `paragraph--tip_heading` | Nummerert overskrift |
| `paragraph--accordion` | Aksel Accordion |
| `paragraph--title_text_image` | Tittel, tekst og valgfritt bilde |
| `paragraph--video` | Vimeo med klikk-for-å-laste |
| `paragraph--lpp_spacer` | Vertikal avstand |

Accordion, Title/Text/Image, tip heading og video støtter redaktørstyrt H2, H3 eller H4. Manglende
nivå blir H2. Tomme valgfrie overskrifter rendres ikke.

### Artikkelquiz og jobbquiz

Artikkelquizer hentes fra Drupal Webform. YAML-en parses med størrelsesgrenser, behandles som
`unknown` og valideres før bruk.

Quizen støtter:

- flat spørsmålsliste med hvit bakgrunn
- grupper fra `fieldset`
- seksjonstittel fra `#title`
- tema fra `content-group--rose`, `content-group--peach`, `content-group--mint` eller
  `content-group--lavender`
- quiz med fasit og selvevalueringsquiz uten fasit

Ukjent eller manglende tema gir nøytral bakgrunn. Flere forskjellige støttede tema på samme
seksjon avvises som ugyldig kontrakt.

`JOB_QUIZ_ARTICLE_ID` peker på en vanlig Shared Content-artikkel med Webform-quiz. Resultatsida
viser CTA-en bare når artikkelen er publisert og tilgjengelig for miljøets API-nøkkel.

### Vimeo

En Vimeo-video må bruke HTTPS og en støttet `vimeo.com`- eller `player.vimeo.com`-sti med numerisk
video-ID. Frontend bygger iframe-URL-en fra den validerte ID-en.

- Formatet er 9:16-portrett.
- Ingen Vimeo-ressurser lastes før brukeren starter videoen.
- Embed-URL-en bruker `dnt=1` og `autoplay=1`.
- En valgfri thumbnail hentes fra Drupals fil-proxy, ikke fra Vimeo.
- Manglende thumbnail gir gradient-placeholder.
- YouTube støttes ikke.
- Personvernsvurderingen for denne løsningen ble godkjent 14. oktober 2026.

### Sikkerhet og personvern

- API-nøkkelen leses bare i server-only kode og sendes i `api-key`-headeren.
- API-responser starter som `unknown` og valideres med Zod `safeParse()`.
- Klienten krever HTTPS, bruker fem sekunders standard-timeout og avviser redirects.
- `links.next` må beholde origin og forventet path.
- HTML saniteres før rendering.
- URL-er valideres mot tillatte protokoller og hosts.
- Logger og tracking inneholder ikke API-nøkkel, rå payload, HTML, valgte svar eller komplette
  URL-er.

🔴 Rød sone: Endringer i URL-validering, Drupal-filter, HTML-sanitering, API-nøkkel eller
host-tillatelser må gjennomgås grundig.

## Drupal JSON:API-kontrakt

Drupal returnerer en ressursgraf:

- hovedressursen ligger i `data`
- attributter ligger i `attributes`
- relasjoner ligger i `relationships`
- komplette relaterte ressurser ligger i `included`

Ressurser slås opp med kombinasjonen `type` og `id`. Rekkefølgen skal alltid leses fra relasjonen,
ikke fra plasseringen i `included`.

Viktige endepunkter:

```text
GET /jsonapi/node/shared_content
GET /jsonapi/node/shared_content/{uuid}
GET /jsonapi/taxonomy_term/shared_content_age
GET /jsonapi/taxonomy_term/shared_content_experience
GET /jsonapi/taxonomy_term/situations
```

Artikkelkallet inkluderer bare relasjonene UI-et trenger, blant annet Paragraphs, accordion-
elementer, bilder, videomedia og thumbnail. Samlinger og artikler bruker `no-store`. Taxonomy
revalideres hver time.

## Konfigurasjon

| Variabel | Bruk |
|---|---|
| `ENKLERE_VEI_TIL_JOBB_ENABLED` | Slår rutene av eller på |
| `SHARED_CONTENT_SOURCE` | Velger `mock` eller `live` |
| `SHARED_CONTENT_API_URL` | HTTPS-origin til Shared Content |
| `SHARED_CONTENT_API_KEY` | Server-side API-nøkkel |
| `SHARED_CONTENT_GOALS_PARENT_ID` | Parent-UUID for mål i `situations` |
| `JOB_QUIZ_ARTICLE_ID` | Valgfri UUID til jobbquiz-artikkelen |
| `SHARED_CONTENT_TIMEOUT_MS` | Valgfri timeout, maksimalt 30 sekunder |

Dev bruker live-kilden mot staging. Prod har feature flagget av og mangler Shared
Content-konfigurasjon.

Så lenge `ENKLERE_VEI_TIL_JOBB_ENABLED=false` i prod, skal `SHARED_CONTENT_SOURCE`,
Shared Content-host og secret-injeksjon være utelatt. Rutene stopper før datakilden opprettes.

Før prod aktiveres, må `.nais/prod.yml` ha:

- `ENKLERE_VEI_TIL_JOBB_ENABLED: "true"`
- `SHARED_CONTENT_SOURCE: "live"`
- `SHARED_CONTENT_API_URL` med prod-origin
- `SHARED_CONTENT_GOALS_PARENT_ID` med prod-UUID
- `JOB_QUIZ_ARTICLE_ID` med prod-UUID hvis jobbquiz-CTA-en skal vises
- prod-hosten i `shared_content_hosts`
- `enklere-vei-til-jobb` i `shared_content_secrets`

Secreten må finnes i `prod-gcp` for `teampam` og inneholde nøkkelen
`SHARED_CONTENT_API_KEY`. Secret-navnet alene oppretter ikke miljøvariabelen hvis nøkkelen har et
annet navn. `SHARED_CONTENT_ONBOARDING_ARTICLE_ID` brukes ikke lenger og skal ikke konfigureres.

## Kjør lokalt

Mock-kilden krever ingen Shared Content-konfigurasjon:

```bash
pnpm dev
```

Åpne `http://localhost:3003/ung/enklere-vei-til-jobb`.

For å bruke staging setter du `SHARED_CONTENT_SOURCE=live` og de nødvendige
`SHARED_CONTENT_*`-variablene i miljøet før appen startes.

## Kontroller Shared Content med probe-scriptet

`scripts/probe-shared-content.ts` er et manuelt diagnoseverktøy mot et ekte Shared Content-miljø.
Appen trenger ikke scriptet for å kjøre, bygge eller deploye. Det skal heller ikke brukes som
health check eller erstatning for automatiserte tester.

Bruk scriptet når:

- et nytt miljø kobles til
- taxonomy, artikkelfelter eller relasjoner er endret
- onboarding-valg eller filtrering gir uventede resultater
- du vil skille API-, tilgangs- og innholdsfeil fra feil i UI-et

### Konfigurer lokalt

Legg verdiene i `.env.local`, som er ignorert av Git:

```dotenv
SHARED_CONTENT_API_KEY=<api-nøkkel>
SHARED_CONTENT_GOALS_PARENT_ID=<uuid-til-jobbsøk-for-unge>

# Valgfri. Staging brukes som standard.
SHARED_CONTENT_API_URL=https://cms.staging.karriereveiledning.no

# Valgfri. Aktiverer kontroll av én artikkel med full include.
SHARED_CONTENT_PROBE_ARTICLE_ID=<artikkel-uuid>
```

API-nøkkelen skal hentes fra godkjent secret-kilde. Ikke skriv den i terminalkommandoen, logger,
dokumentasjon eller commit-historikk.

Kjør:

```bash
pnpm probe:shared-content
```

Bruk package-scriptet, ikke `tsx scripts/probe-shared-content.ts` direkte. Scriptet importerer
server-only-kode, og package-scriptet setter `NODE_OPTIONS=--conditions=react-server` slik at disse
importene fungerer utenfor Next.js.

### Dette kontrollerer scriptet

1. `.env.local` lastes. Manglende `SHARED_CONTENT_API_URL` får staging som standard.
2. Den samme server-only-klienten som appen bruker, validerer URL, API-nøkkel, timeout og
   `SHARED_CONTENT_GOALS_PARENT_ID`.
3. De tre taxonomy-vokabularene hentes. `situations` avgrenses med parent-UUID-en.
4. En ufiltrert artikkelsamling sammenlignes med en samling filtrert på første aldersterm.
5. Hvis `SHARED_CONTENT_PROBE_ARTICLE_ID` er satt, hentes artikkelen med samme `include` som appen.
6. Den lokale veiviserstrukturen kombineres med live taxonomy gjennom
   `buildOnboardingModule()`.

Artikkelkontrollen skriver bare ressurstype, ID, feltnavn, relasjonsnavn og antall inkluderte
ressurser. Den skriver ikke artikkeltekst, HTML eller API-nøkkel. Taxonomy-kontrollen skriver
termnavn, UUID og vekt fordi dette er data utvikleren skal kontrollere.

Scriptet bruker produksjonskoden for transport, paginering, Zod-validering og filterbygging. Det
oppdager derfor kontraktbrudd som en separat `curl`-kommando kan overse. Ulempen er at kjøringen
gjør flere ekte API-kall og er avhengig av staging-data.

Exit-kode `0` betyr at alle aktiverte kontroller passerte. Exit-kode `1` betyr manglende eller
ugyldig konfigurasjon, transportfeil, kontraktfeil eller at en kontroll ikke kunne fullføres.
Les den første konkrete feilmeldingen over sluttsammendraget.

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

Spørsmåls-ID-er er del av URL-kontrakten. Ved endringer i veiviseren må
`onboardingDefinition.ts`, filterdimensjonene og URL-testene oppdateres sammen.

En ny artikkelblokk krever Zod-kontrakt i `server/drupal/jsonApi.ts`, domenetype i
`domain/article.ts`, mapping i `articleMapper.server.ts`, rendering i `ArticleContent.tsx` og
tilhørende tester.

Endringer i artikkelquizen må dekke parseren i `webformQuiz.server.ts`, domenet og komponentene i
`ui/ArticleQuiz/`. Behold støtte for flate quizer så lenge Shared Content publiserer dem.

## Gjenstående arbeid

Før produksjonsaktivering:

- avklar prod-host, API-nøkkel, outbound-regel, `next/image`-host og CSP
- sett miljøspesifikke UUID-er for mål-parent og jobbquiz-artikkel
- bekreft språkstrategi og norske taxonomy-etiketter
- avklar anbefalt artikkelsortering
- avklar rate limit, retry-policy og driftsgrenser
- kontroller om ingress-, referrer- eller analyseverktøy lagrer resultat-URL-en
- fastsett alarmer for feilandel og responstid etter målinger i dev
- gjennomfør produksjonsbeslutning, smoke-test og eksplisitt aktivering

Mulige forbedringer etter første iterasjon:

- vise `meta.count` i UI-et hvis produktet trenger treffantall
- hente flere deler av veiviserstrukturen fra API-et hvis redaktørstyring blir et krav
- støtte flere Paragraph- eller Webform-typer når API-kontrakten er avklart

## Verifisering

```bash
pnpm test src/features/ung/enklere-vei-til-jobb
pnpm compileTS
pnpm lint
pnpm build:no-sourcemap
```

Ved endringer i flyten bør den også testes med tastatur, mobilbredde, desktop, 200 % zoom, delt
resultat-URL og deaktivert feature flag.

## Ekstern referanse

[utdanningno/kvno-shared-content-example](https://github.com/utdanningno/kvno-shared-content-example)
viser grunnleggende bruk av Shared Content og Drupal JSON:API. Repoet er et lærings- og
kontraktseksempel, ikke en produksjonsklient.
