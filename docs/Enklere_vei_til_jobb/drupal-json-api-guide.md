# Guide til Drupal JSON:API og Shared Content

Denne guiden forklarer hvordan Shared Content-API-et er bygd, hvordan du spør etter data, og hvordan du leser sammenhengene i et Drupal JSON:API-svar. Eksemplene bygger på `kvno-shared-content-example` og den foreløpige onboarding-løsningen i `pam-stillingsok`.

Eksempelrepoet er laget for kontraktstesting og læring. Det er ikke en ferdig produksjonsklient. Guiden peker derfor også på hvilke deler vi må gjøre strengere i `pam-stillingsok`.

> Dette er rød sone fordi Drupal JSON:API er ny teknologi for oss, og fordi kontrakten styrer sentral innholdslogikk. Bruk staging-perioden til å følge ressursene manuelt før vi låser adapteren.

## Den korte forklaringen

Drupal returnerer innhold som en graf av ressurser:

- Hovedressursen ligger i `data`.
- Vanlige felt ligger i `attributes`.
- Koblinger til andre ressurser ligger i `relationships`.
- `relationships` inneholder som regel bare `type` og `id`.
- Query-parameteren `include` ber Drupal legge de komplette relaterte ressursene i `included`.
- Du kobler en referanse til riktig ressurs med kombinasjonen `type` og `id`.
- Rekkefølgen kommer fra relasjonen, ikke fra plasseringen i `included`.

For Shared Content ser hovedformen slik ut:

```text
node--shared_content
├── attributes
│   ├── title
│   ├── field_sc_intro
│   ├── changed
│   ├── source_url
│   ├── recommended_path_alias
│   └── translations
└── relationships
    ├── field_sc_content[]       → paragraph--*
    ├── field_sc_owner           → taxonomy_term--shared_content_sites
    ├── field_sc_available_to[]  → taxonomy_term--shared_content_sites
    ├── field_sc_audiences[]     → taxonomy_term--situations
    ├── field_sc_teaser_image    → file--file
    └── field_seo_image          → file--file
```

## Fire lag du må skille mellom

| Lag | Eksempler | Hvem bestemmer kontrakten |
|---|---|---|
| JSON:API-standarden | `data`, `attributes`, `relationships`, `included`, `links`, `errors` | JSON:API |
| Drupal-konvensjoner | `/jsonapi/node/shared_content`, UUID-er, `node--shared_content`, `paragraph--accordion` | Drupal |
| Shared Content-felter | `field_sc_content`, `rendered_html`, `translations`, tilgang via `api-key` | Shared Content-tjenesten |
| Foreløpig onboarding-kontrakt | `field_questions`, `field_options`, `field_answer_options`, `field_answer_blocks` | Mocken i `pam-stillingsok` |

Det siste laget er ikke bekreftet av staging. Ikke bygg live-klienten med antakelsen om at disse feltnavnene finnes.

## Endepunkter og ressursnavn

Drupal JSON:API bruker vanligvis denne adressestrukturen:

```text
/jsonapi/{entity-type}/{bundle}
/jsonapi/{entity-type}/{bundle}/{uuid}
```

Shared Content bruker:

```text
GET /jsonapi/node/shared_content
GET /jsonapi/node/shared_content/{uuid}
```

Den første adressen returnerer en samling. Den andre returnerer én ressurs.

I responsen blir Drupal-navnene slått sammen med to bindestreker:

| Endepunkt eller Drupal-type | `type` i JSON:API |
|---|---|
| `node/shared_content` | `node--shared_content` |
| Paragraph-bundle `accordion` | `paragraph--accordion` |
| Media-bundle `image` | `media--image` |
| Fil | `file--file` |

ID-en i et live Drupal-kall er en UUID, ikke Drupals interne numeriske node-ID. Mocken bruker lesbare ID-er som `mock-first-job`, men du bør forvente UUID-er i staging.

## Autentisering og tilgang

Send API-nøkkelen i headeren `api-key`. Nøkkelen skal bare brukes server-side.

```bash
curl --fail-with-body --silent --show-error \
  "$SHARED_CONTENT_API_URL/jsonapi/node/shared_content" \
  --header 'Accept: application/vnd.api+json' \
  --header "api-key: $SHARED_CONTENT_API_KEY"
```

Ikke legg nøkkelen i:

- URL-en eller query-parametre
- kode som kjører i nettleseren
- en variabel med `NEXT_PUBLIC_`-prefiks
- logger, feilmeldinger eller commit-historikk

### Tilgangsmodellen i Shared Content

API-nøkkelen tilhører en Drupal-bruker. Denne brukeren er koblet til ett eller flere nettsteder.

Et vanlig kall returnerer bare publisert innhold der `field_sc_available_to` overlapper nettstedene som brukeren har tilgang til. En konto med rettigheten «View all shared content» kan hente alt publisert innhold.

Klienten skal ikke sende en egen nettsteds-ID. Drupal bruker kontoen bak nøkkelen til å avgrense resultatet.

Et filter kan snevre inn resultatet, men kan ikke gi tilgang til mer innhold enn nøkkelen tillater.

## Slik er et svar bygd opp

Dette er en forkortet versjon av `mock-first-job.json`:

```json
{
  "data": {
    "type": "node--shared_content",
    "id": "mock-first-job",
    "attributes": {
      "title": "Your first job: where to start",
      "field_sc_intro": {
        "value": "A practical starting point.",
        "format": "basic_html"
      }
    },
    "relationships": {
      "field_sc_content": {
        "data": [
          {
            "type": "paragraph--lpp_html",
            "id": "mock-html"
          },
          {
            "type": "paragraph--accordion",
            "id": "mock-accordion"
          }
        ]
      }
    }
  },
  "included": [
    {
      "type": "paragraph--lpp_html",
      "id": "mock-html",
      "attributes": {
        "render_version": 2,
        "rendered_html": "<section>...</section>"
      }
    },
    {
      "type": "paragraph--accordion",
      "id": "mock-accordion",
      "attributes": {
        "render_version": 2,
        "rendered_html": "<section>...</section>"
      }
    }
  ]
}
```

### `data`

`data` er hovedresultatet:

- Et objekt når du henter én ressurs.
- Et array når du henter en samling.

### `attributes`

`attributes` inneholder verdier som tilhører ressursen selv. Eksempler er tittel, tidspunkt og tekstfelt.

Et formatert Drupal-tekstfelt er ofte et objekt:

```json
{
  "value": "<p>Tekst</p>",
  "format": "basic_html"
}
```

Valider den observerte staging-responsen. Ikke anta at alle tekstfelt har samme form.

### `relationships`

En relasjon peker på andre ressurser. `data` i relasjonen kan være:

- ett objekt for en én-til-én-relasjon
- et array for en én-til-mange-relasjon
- `null` når en valgfri én-til-én-relasjon mangler

Eksempler fra fixture:

```json
{
  "field_sc_owner": {
    "data": {
      "type": "taxonomy_term--shared_content_sites",
      "id": "mock-owner"
    }
  },
  "field_sc_audiences": {
    "data": [
      {
        "type": "taxonomy_term--situations",
        "id": "mock-audience"
      }
    ]
  },
  "field_sc_teaser_image": {
    "data": null
  }
}
```

### `included`

`included` inneholder de komplette ressursene du ba om med `include`.

Arrayet er en felles samling for alle inkluderte ressurser. Det kan inneholde Paragraphs, media, filer og taksonomitermer om hverandre. Samme ressurs legges normalt bare inn én gang, selv om flere relasjoner viser til den.

JSON:API garanterer ikke at `included` følger rekkefølgen i relasjonen.

`included` er valgfritt i JSON:API. Et schema for samlingskall uten `include` bør derfor tåle at feltet mangler. Et schema for et bestemt kall kan være strengere når spørringen alltid ber om relaterte ressurser.

### `links`, `meta` og `errors`

Live-responser kan også inneholde:

- `links.self`, `links.next` og `links.prev`
- `meta` med ekstra informasjon
- `errors` ved feil

Fixture-filene er forenklede og viser ikke alle mulige toppnivåfelter.

## Slik kobler du relasjoner til `included`

Bruk både `type` og `id` som nøkkel. Følg deretter identifikatorene i relasjonens rekkefølge.

```ts
type ResourceIdentifier = {
    type: string;
    id: string;
};

type Resource = ResourceIdentifier & {
    attributes: Record<string, unknown>;
};

function key(resource: ResourceIdentifier): string {
    return `${resource.type}:${resource.id}`;
}

function resolveInOrder(
    identifiers: readonly ResourceIdentifier[],
    included: readonly Resource[],
): Resource[] {
    const resourcesByKey = new Map(included.map((resource) => [key(resource), resource]));

    return identifiers.map((identifier) => {
        const resource = resourcesByKey.get(key(identifier));
        if (!resource) {
            throw new Error(`Mangler inkludert ressurs: ${key(identifier)}`);
        }
        return resource;
    });
}
```

Kjør denne logikken først etter at du har validert responsen.

### En viktig forenkling i eksempelrepoet

`lib/shared-content.ts` har en `related()`-funksjon som lager et sett av ønskede ID-er og filtrerer `included`. Det gjør eksempelet kort, men resultatet følger rekkefølgen i `included`, ikke nødvendigvis rekkefølgen i relasjonen.

Onboarding-adapteren i `pam-stillingsok` gjør dette strengere: Den går gjennom relasjons-ID-ene i riktig rekkefølge og slår opp hver ressurs. Bruk dette mønsteret i live-klienten.

## `include` henter relaterte ressurser

Uten `include` får du vanligvis referansene i `relationships`, men ikke hele ressursene i `included`.

Hent hovedinnhold og metadata:

```text
?include=field_sc_content,field_sc_owner,field_sc_audiences
```

Hent nøstede accordion-elementer:

```text
?include=field_sc_content,field_sc_content.field_accordion_items
```

Hent bilder gjennom media- og filrelasjoner:

```text
?include=field_sc_content,field_sc_content.field_tti_image,field_sc_content.field_tti_image.field_media_image
```

Hent video:

```text
?include=field_sc_content,field_sc_content.field_video_media,field_sc_content.field_video_media.field_media_video_file
```

Punktum betyr «følg neste relasjon». Komma skiller uavhengige include-stier.

For remote video er `field_sc_content.field_video_media` nok til å få med
`media--remote_video`. Uten denne nøstede include-stien får vi bare
ressursidentifikatoren i `paragraph--video.relationships`.

Ikke hent alle relasjoner for sikkerhets skyld. Store og dype includes øker responstiden og størrelsen på payloaden. Hent bare det UI-et trenger.

### Hvorfor eksempelrepoets include-liste er kortere

Eksempelappen rendrer hovedsakelig `rendered_html`. Da trenger den komplette toppnivå-Paragraphs, men ikke nødvendigvis rå accordion-elementer eller rå bildefiler.

Hvis vi rendrer egne Aksel-komponenter fra råfelter, må vi be om de nøstede relasjonene eksplisitt.

## Vanlige spørringer

### Hent en samling

```bash
curl --fail-with-body --silent --show-error \
  --get "$SHARED_CONTENT_API_URL/jsonapi/node/shared_content" \
  --header 'Accept: application/vnd.api+json' \
  --header "api-key: $SHARED_CONTENT_API_KEY" \
  --data-urlencode 'sort=-changed' \
  --data-urlencode 'page[limit]=20' \
  --data-urlencode 'include=field_sc_teaser_image,field_seo_image'
```

### Hent én ressurs

```bash
curl --fail-with-body --silent --show-error \
  --get "$SHARED_CONTENT_API_URL/jsonapi/node/shared_content/$SHARED_CONTENT_UUID" \
  --header 'Accept: application/vnd.api+json' \
  --header "api-key: $SHARED_CONTENT_API_KEY" \
  --data-urlencode 'include=field_sc_content,field_sc_content.field_accordion_items,field_sc_owner,field_sc_audiences'
```

Bruk `--data-urlencode` for query-parametre med hakeparenteser, komma og punktum. Da slipper du feil ved manuell URL-bygging.

### Sortering

```text
?sort=changed
?sort=-changed
?sort=-changed,title
```

- Ingen prefiks gir stigende rekkefølge.
- `-` gir synkende rekkefølge.
- Komma kombinerer flere sorteringsfelter.

Eksempelrepoet bruker `sort=-changed` for å vise sist endret innhold først.

### Enkel filtrering

Filtrer på en direkte attributt:

```text
?filter[title]=Eksempeltittel
```

Filtrer på ID-en til en relatert målgruppe:

```text
?filter[field_sc_audiences.id]=AUDIENCE_UUID
```

Punktum følger en relasjon eller en underverdi. Drupal støtter også navngitte betingelser, operatorer og AND-/OR-grupper, men vi bør først bruke dette når staging-kontrakten og behovet er kjent.

Filtrering er ikke tilgangskontroll. Drupal må alltid håndheve tilgangen server-side.

### Pagination

```text
?page[limit]=20&page[offset]=0
```

Drupal har vanligvis en øvre sidegrense. Standardinstallasjoner bruker ofte maksimalt 50, men vi må avklare Shared Content-konfigurasjonen.

Ikke regn med at `data.length` er lik `page[limit]`. Tilgangskontroll kan fjerne ressurser fra sida.

Følg `links.next` fra responsen:

```json
{
  "links": {
    "self": "https://api.example/jsonapi/node/shared_content?page[offset]=0&page[limit]=20",
    "next": "https://api.example/jsonapi/node/shared_content?page[offset]=20&page[limit]=20"
  }
}
```

Ikke bygg neste pagination-URL selv. Serveren kan endre parametre eller paging-strategi.

### Sparse fieldsets

`fields` begrenser hvilke felter Drupal returnerer:

```text
?fields[node--shared_content]=title,field_sc_intro,changed,field_sc_audiences
```

Feltnavnet i hakeparentes er JSON:API-typen, ikke endepunktet.

Hvis du både bruker `fields` og `include`, bør relasjonsfeltet være med i feltutvalget. Ellers kan koblingen forsvinne fra hovedressursen:

```text
?fields[node--shared_content]=title,changed,field_sc_teaser_image
&fields[file--file]=uri
&include=field_sc_teaser_image
```

### En kombinert listespørring

```bash
curl --fail-with-body --silent --show-error \
  --get "$SHARED_CONTENT_API_URL/jsonapi/node/shared_content" \
  --header 'Accept: application/vnd.api+json' \
  --header "api-key: $SHARED_CONTENT_API_KEY" \
  --data-urlencode 'sort=-changed' \
  --data-urlencode 'page[limit]=20' \
  --data-urlencode 'filter[field_sc_audiences.id]=AUDIENCE_UUID' \
  --data-urlencode 'fields[node--shared_content]=title,field_sc_intro,changed,field_sc_teaser_image,field_seo_image' \
  --data-urlencode 'fields[file--file]=uri' \
  --data-urlencode 'include=field_sc_teaser_image,field_seo_image'
```

## Bygg spørringen i Next.js

Bruk `URL` og `searchParams` i stedet for å sette sammen query-strengen manuelt:

```ts
import "server-only";

async function fetchSharedContent(
    apiBaseUrl: string,
    apiKey: string,
): Promise<unknown> {
    const url = new URL("/jsonapi/node/shared_content", apiBaseUrl);
    url.searchParams.set("sort", "-changed");
    url.searchParams.set("page[limit]", "20");
    url.searchParams.set(
        "include",
        "field_sc_teaser_image,field_seo_image",
    );

    const response = await fetch(url, {
        headers: {
            Accept: "application/vnd.api+json",
            "api-key": apiKey,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) {
        throw new Error(`Shared Content svarte med HTTP ${response.status}`);
    }

    return response.json();
}
```

Returtypen er `unknown` med vilje. Kalleren skal validere responsen med et Zod-schema og `safeParse()` før adapteren leser feltene.

I produksjonskoden bør HTTP-feilen ha en egen feiltype. Ikke send rå respons, HTML eller API-detaljer videre til nettleseren.

## Shared Content-feltene i eksempelrepoet

### Attributter på hovedressursen

| Felt | Betydning |
|---|---|
| `title` | Tittel for valgt språk |
| `field_sc_intro` | Formatert ingress |
| `created` | Opprettet i Drupal |
| `changed` | Sist endret i Drupal |
| `source_url` | Anbefalt URL hos redaksjonell eier |
| `recommended_path_alias` | Foreslått lokal sti hos konsumenten |
| `translations` | Publiserte språkvarianter med tittel, sti og URL |
| `field_seo_title` | SEO-tittel når den finnes |
| `field_seo_description` | SEO-beskrivelse når den finnes |
| `field_seo_keywords` | SEO-nøkkelord når de finnes |

`source_url` og `recommended_path_alias` er innholdsmetadata. De er ikke API-endepunkter.

### Relasjoner på hovedressursen

| Relasjon | Ressurstype | Bruk |
|---|---|---|
| `field_sc_content` | `paragraph--*` | Ordnet innhold |
| `field_sc_owner` | `taxonomy_term--shared_content_sites` | Redaksjonell eier |
| `field_sc_available_to` | `taxonomy_term--shared_content_sites` | Hvilke nettsteder som kan konsumere innholdet |
| `field_sc_audiences` | `taxonomy_term--situations` | Målgrupper eller situasjoner |
| `field_sc_teaser_image` | `file--file` | Foretrukket bilde i lister og kort |
| `field_seo_image` | `file--file` | Reservebilde når teaserbilde mangler |

Eksempelappen foretrekker `field_sc_teaser_image`, bruker `field_seo_image` som reserve og viser ikke bilde hvis begge mangler.

## Paragraphs er innholdsblokker

Drupal Paragraphs brukes til å bygge en ordnet side av ulike blokktyper. `field_sc_content.data` er innholdsfortegnelsen.

Eksempelrepoet dekker disse typene:

| JSON:API-type | Viktige råfelter eller relasjoner |
|---|---|
| `paragraph--tip_heading` | `field_tip_heading_number`, `field_tip_heading_text` |
| `paragraph--lpp_html` | `field_lpp_html_content` |
| `paragraph--accordion` | `field_accordion_style`, `field_accordion_items` |
| `paragraph--lpp_spacer` | Ingen eget innhold utover blokktypen |
| `paragraph--title_text_image` | `field_tti_title`, `field_tti_content`, `field_tti_layout`, `field_tti_style`, `field_tti_image` |
| `paragraph--video` | `field_video_media` |

Alle støttede toppnivå-Paragraphs i fixture har:

```json
{
  "render_version": 2,
  "rendered_html": "<section>...</section>"
}
```

En blokk som redaksjonen har skjult, kan fortsatt ligge i relasjonen. Da er `rendered_html` tom. Hvis du rendrer råfeltene, må du også respektere `field_hide_block`.

## Accordion-strukturen

Accordionen er en Paragraph som peker på ordnede accordion-elementer:

```text
paragraph--accordion
└── field_accordion_items[]
    └── paragraph--accordion_item
        ├── field_accordion_item_title
        └── field_accordion_item_content
```

Eksempel:

```json
{
  "type": "paragraph--accordion",
  "id": "mock-accordion",
  "relationships": {
    "field_accordion_items": {
      "data": [
        {
          "type": "paragraph--accordion_item",
          "id": "mock-accordion-item"
        }
      ]
    }
  }
}
```

Be om begge nivåene:

```text
include=field_sc_content,field_sc_content.field_accordion_items
```

## Bildestrukturen

Et bilde inne i en Title/Text/Image-blokk går gjennom media:

```text
paragraph--title_text_image
└── field_tti_image
    └── media--image
        └── field_media_image
            └── file--file
                └── attributes.uri.url
```

Relasjonen kan ha metadata som alt-tekst, bredde og høyde:

```json
{
  "type": "file--file",
  "id": "mock-image-file",
  "meta": {
    "alt": "En ungdom som forbereder en jobbsøknad",
    "width": 1200,
    "height": 760
  }
}
```

I staging ligger alt, bredde og høyde i `meta` på relasjonen `field_media_image`. `uri.url` er relativ (`/sites/default/files/...`) og gjøres absolutt mot CMS-origin i live-adapteren. `cms.staging.karriereveiledning.no` er tillatt i `next.config.mjs` (`images.remotePatterns`).

Før prod må vi i tillegg avklare:

- prod-host for `next/image`
- Content Security Policy
- fallback ved manglende alt-tekst eller dimensjoner

## Videostrukturen

`paragraph--video` peker på en mediaressurs:

```text
paragraph--video
└── field_video_media
    ├── media--remote_video
    │   └── field_media_oembed_video
    └── media--video
        └── field_media_video_file
            └── file--file
```

Eksempelfixturen bruker `media--remote_video` med en YouTube-URL. Staging bekrefter samme struktur med Vimeo:

```json
{
    "type": "media--remote_video",
    "attributes": {
        "name": "3 tips når du skal velge videregående",
        "field_media_oembed_video": "https://player.vimeo.com/video/1180806925?"
    }
}
```

Den lagrede collection-responsen har `paragraph--video` og relasjonen til
mediaressursen, men ikke selve `media--remote_video`-objektet. Enkeltressursen
har objektet fordi spørringen inkluderer
`field_sc_content.field_video_media`.

Staging leverer foreløpig `rendered_html` som en lenke til videoen, ikke en
iframe. En egen spiller må derfor bruke råfeltet
`field_media_oembed_video`. Parseren må tåle det tomme spørsmålstegnet etter
Vimeo-ID-en.

Responsene ligger i:

- `docs/Enklere_vei_til_jobb/json_eksempler/collection.json`
- `docs/Enklere_vei_til_jobb/json_eksempler/on_its_own.json`

Dokumentasjonen sier at API-et også støtter opplastet video gjennom
`media--video`.

Vi må avklare spiller, samtykke, CSP og tillatte videohoster før live-visning.

## To måter å rendre innholdet på

### Rendre råfelter med egne komponenter

Du leser `type`, validerer attributtene og mapper hver Paragraph til en Aksel-komponent.

Fordeler:

- full kontroll over Aksel, UU og responsiv layout
- tydelig typekontroll
- enklere å styre lenker, bilder og video
- mindre avhengighet av HTML-strukturen fra Drupal

Kostnaden er mer adapterkode og flere nøstede include-stier.

### Rendre `rendered_html`

Drupal leverer ferdig HTML med `shared-content`-klasser og `data-shared-content-type`.

Fordeler:

- færre felter å mappe
- nye redaksjonelle varianter kan bli synlige uten nye React-komponenter
- accordion-markupen bruker `<details>` og `<summary>` og fungerer uten JavaScript

Kostnaden er mindre designkontroll og tettere kobling til `render_version`.

API-et oppgir at HTML-en er sanitert og uten script. `pam-stillingsok` skal likevel sanitere den på nytt før rendering. En iframe for video krever en egen, streng vurdering. Dagens HTML-allowlist slipper ikke gjennom iframe.

### Anbefaling for onboarding

Bruk råfelter og adapter til struktur, valg og innholdstyper. Bruk sanitert HTML bare for avgrensede tekstfelt. Dette passer Aksel-designet og holder Drupal-modellen ute av UI-et.

## Språk og oversettelser

Oversettelser deler samme JSON:API-UUID. Språket gir ikke en ny ressurs-ID.

`translations` viser publiserte språk:

```json
{
  "langcode": "nb",
  "language": "Norwegian Bokmål",
  "title": "Din første jobb: hvor begynner du?",
  "path": "/shared-content/din-forste-jobb-hvor-begynner-du",
  "source_url": "https://karriereveiledning.no/shared-content/din-forste-jobb-hvor-begynner-du",
  "is_current": true
}
```

Drupal velger språk gjennom nettstedets konfigurerte språkforhandling, for eksempel et språksegment i URL-en. Vi må få det eksakte staging-mønsteret fra API-eier.

Eksempelrepoets interne mock støtter `?langcode=nb`. Dette er bare implementert i mock-route-handleren. `lib/shared-content.ts` bruker ikke `langcode` i live-grenen, så eksempelet beviser ikke hvordan live språkvalg fungerer.

## Dataflyten i eksempelrepoet

```text
Next.js-side
  → getSharedContent() eller getSharedContentArticle()
  → request()
  ├── mock: /api/shared-content
  └── live: /jsonapi/node/shared_content + api-key
  → enkel mapping til visningsmodell
  → Paragraph-komponent eller rå JSON
```

`SHARED_CONTENT_SOURCE` velger `mock` eller `live`. UI-et og mappingen er de samme.

Mock-endepunktene:

```text
GET /api/shared-content
GET /api/shared-content/mock-first-job
GET /api/shared-content/mock-first-job?langcode=nb
```

De returnerer ferdige fixture-filer. De simulerer ikke Drupal-funksjoner som filtering, sorting, pagination, sparse fieldsets eller dynamisk `include`. Disse funksjonene må testes mot staging.

## Hva vi kan kopiere fra eksempelrepoet

| Mønster | Vurdering |
|---|---|
| `import "server-only"` rundt API-klienten | Bruk |
| `api-key` bare i server-side `fetch` | Bruk |
| Samme parser for mock og live | Bruk |
| Eget grensesnitt mellom datakilde og UI | Bruk |
| `include` bygget ut fra relasjonene UI-et trenger | Bruk |
| Bytte mellom mock og live med konfigurasjon | Bruk |
| Type assertion etter `response.json()` | Ikke kopier. Valider `unknown` med Zod `safeParse()` |
| `dangerouslySetInnerHTML` direkte på API-HTML | Ikke kopier. Sanitér og bruk brandet HTML-type |
| Filtrere `included` med et sett | Ikke kopier for ordnet innhold. Følg relasjonsrekkefølgen |
| Mockens lesbare ID-er | Ikke anta at live bruker samme format. Forvent UUID |
| `?langcode=nb` | Ikke anta at live støtter dette |

## Hvordan dette passer med `pam-stillingsok`

Den eksisterende spiken har riktig lagdeling:

```text
SharedContentSource
  → transport
  → Zod-validering
  → Drupal-adapter
  → intern domenemodell
  → Aksel-UI
```

Relevante filer:

- `src/features/ung/onboarding/server/sharedContentSource.server.ts`
- `src/features/ung/onboarding/server/drupal/drupalClient.server.ts` (fetch mot API-et)
- `src/features/ung/onboarding/server/drupal/jsonApi.ts` (Zod-kontrakt og oppslag i `included`)
- `src/features/ung/onboarding/server/drupal/articleMapper.server.ts` (Drupal-artikkel til domenemodell)
- `src/features/ung/onboarding/server/local/` (onboarding og jobbquiz som TypeScript-data)
- `src/features/ung/onboarding/domain/` (`onboarding.ts`, `results.ts`, `article.ts`, `jobQuiz.ts`)
- `src/features/ung/onboarding/server/mock/` (innhold for `SHARED_CONTENT_SOURCE=mock`)
- `scripts/probe-shared-content.ts`

Live transport er implementert, men `SHARED_CONTENT_SOURCE` står fortsatt på `mock`. Den publiserte stagingressursen er generell artikkeldata og kan ikke mappes til onboarding eller jobbquiz.

### Jobbquiz og onboarding

Jobbquizen og onboarding-spørsmålene har ingen kontrakt i Shared Content. De ligger som typede TypeScript-objekter i `server/local/`, ikke som JSON:API-fixtures.

### Det eksempelrepoet ikke svarer på

Eksempelrepoet viser generell artikkelstruktur. Det viser ikke en onboarding-modul med spørsmål, alternativer og matching mot resultatinnhold.

Disse typene og feltene finnes bare i vår foreløpige mock:

- `node--shared_content_onboarding`
- `paragraph--onboarding_question`
- `paragraph--onboarding_option`
- `paragraph--result_section`
- `field_questions`
- `field_options`
- `field_result_sections`
- `field_answer_options`
- `field_show_without_answers`
- `field_answer_blocks`
- `paragraph--answer_*`
- `node--shared_content_quiz`
- `paragraph--quiz_section`
- `paragraph--quiz_question`
- `paragraph--quiz_option`
- `field_quiz_sections`
- `field_quiz_questions`
- `field_quiz_options`
- `field_is_correct`

Staging må vise om:

1. Appen henter hele modulen og matcher lokalt.
2. API-et tar imot valgte alternativ-ID-er og returnerer ferdig matchet innhold.
3. Resultatinnholdet har relasjoner til alternativer som klienten filtrerer på.
4. Standardinnhold markeres med et felt eller leveres fra et eget endepunkt.
5. Jobbquizen leveres som en egen node eller som innhold i samme modul.

Ikke bruk et vanlig JSON:API-filter som løsning før API-eier har forklart ønsket matching. Flere valgte svar krever avklart AND-/OR-semantikk og prioritering.

## Første arbeidsøkt mot staging

### Status 29. september 2026

Staging-base-URL-en og én testressurs er publisert. Ressursen bruker endepunktet:

```text
/jsonapi/node/shared_content/<uuid>
```

Den inkluderer `field_sc_content`, accordion-elementer, målgrupper, eier og tilgjengelighet. Dette bekrefter den generelle Shared Content-strukturen, men ikke feltene for onboarding, resultatmatching eller jobbquiz.

Kall uten `api-key` gir `401`. Klienten sender nøkkelen bare fra server-side miljøvariabel, avviser redirects og validerer responsen som `unknown`.

### Kjør den trygge kontraktproben

Legg en nyrotert nøkkel i `.env.local`. Fila er lokal og skal ikke committes:

```dotenv
SHARED_CONTENT_API_KEY=<nøkkel>
```

Kjør deretter:

```bash
pnpm probe:shared-content
```

Proben laster `.env.local` selv. Staging-URL-en og UUID-en til testressursen er standardverdier, men kan overstyres med `SHARED_CONTENT_API_URL` og `SHARED_CONTENT_PROBE_ID`. Proben skriver toppressursens type, ID, feltnavn og relasjonsnavn. For `included` grupperer den ressurser etter type og teller dem. Den skriver ikke attributtverdier, HTML eller API-nøkkel.

### Observert kontrakt i testressursen

Proben bekrefter denne toppressursen:

```text
node--shared_content
└── field_sc_content[]
```

Testressursen inneholder disse Paragraph-typene:

| Type | Antall | Felter og relasjoner som er relevante for visning |
|---|---:|---|
| `paragraph--tip_heading` | 1 | `field_tip_heading_number`, `field_tip_heading_text`, `rendered_html` |
| `paragraph--lpp_html` | 1 | `field_lpp_html_content`, `rendered_html` |
| `paragraph--accordion` | 1 | `field_accordion_style`, `field_accordion_items`, `rendered_html` |
| `paragraph--accordion_item` | 2 | `field_accordion_item_title`, `field_accordion_item_content`, `rendered_html` |
| `paragraph--lpp_spacer` | 1 | `rendered_html` |
| `paragraph--title_text_image` | 1 | `field_tti_title`, `field_tti_content`, `field_tti_layout`, `field_tti_style`, `field_tti_image`, `rendered_html` |

Alle Paragraph-typene har `render_version`. Innholdsblokkene har også `field_hide_block`, bortsett fra accordion-elementene. Responsen inkluderer taksonomi av typene `taxonomy_term--shared_content_sites` og `taxonomy_term--situations`.

Dette samsvarer med artikkelstrukturen i eksempelrepoet. Responsen inneholder ingen ressurser eller felter for onboarding-spørsmål, svaralternativer, resultatmatching eller jobbquiz. `field_tti_image` peker på media. Live-artikkelen inkluderer `field_sc_content.field_tti_image` og `field_sc_content.field_tti_image.field_media_image` for å hente mediaressurs og fil.

### 1. Avklar konfigurasjonen

Be API-eier om:

- base-URL: mottatt
- API-nøkkel og hvordan den roteres: Nais-secret er opprettet og koblet til dev
- UUID eller filter for onboarding-modulen
- språkstrategi
- tillatte media- og videohoster
- rate limit og forventet cache-policy

### 2. Hent samlingen uten avanserte parametre

Kontroller:

- HTTP-status
- `Content-Type`
- om `data` er et array
- hvilke `type`-verdier som finnes
- om ID-ene er UUID-er
- om pagination-lenker finnes

### 3. Hent én ressurs uten `include`

Finn relasjonsnavnene. Noter om hver relasjon inneholder ett objekt, et array eller `null`.

### 4. Legg til ett include om gangen

Start med:

```text
include=field_sc_content
```

Legg deretter til nøstede include-stier for accordion, bilde og video. Da ser du hvilken sti som faktisk gir hvilken ressurs.

### 5. Spor én blokk manuelt

For første element i `field_sc_content.data`:

1. Kopier `type` og `id`.
2. Finn samme kombinasjon i `included`.
3. Les blokkens attributter.
4. Følg eventuelle nøstede relasjoner.
5. Kontroller at rekkefølgen stemmer med redaktørens side.

### 6. Sammenlign råfelt og `rendered_html`

Finn ut:

- om begge representerer samme innhold
- hvilken `render_version` staging bruker
- hvordan skjulte blokker ser ut
- hvilke HTML-tags og attributter som forekommer
- om video-URL-er er absolutte (bilde-URL i `file--file.uri.url` er relativ)

### 7. Lag en redigert fixture

Lagre en representativ respons uten API-nøkkel, personopplysninger eller miljøspesifikke hemmeligheter. Behold:

- reelle ressurstyper og feltnavn
- relasjonsstruktur
- nullverdier
- rekkefølge
- minst én ressurs av hver støttet innholdstype
- en representativ feilrespons

### 8. Oppdater råschema og adapter

Endre Zod-schemaet og Drupal-adapteren. Ikke endre UI-modellen med mindre staging viser et reelt produktbehov som modellen ikke dekker.

## Nyttige inspeksjoner med `jq`

Vis ID, type og tittel i en samling:

```bash
jq '.data[] | { id, type, title: .attributes.title }' response.json
```

Vis innholdsrekkefølgen:

```bash
jq '.data.relationships.field_sc_content.data' response.json
```

Vis alle ressurstypene i `included`:

```bash
jq -r '.included[]?.type' response.json | sort -u
```

Finn en bestemt ressurs:

```bash
jq '
  .included[]
  | select(
      .type == "paragraph--accordion"
      and .id == "RESOURCE_UUID"
    )
' response.json
```

Vis API-feil:

```bash
jq '.errors // empty' response.json
```

## Feil du bør håndtere

| Situasjon | Forventet håndtering |
|---|---|
| `200` med tomt `data`-array | Gyldig tomt resultat, ikke automatisk en feil |
| `403` | Manglende eller ugyldig nøkkel, deaktivert konto eller manglende tilgang |
| `404` | UUID finnes ikke, eller endepunktet er feil |
| `429` | Respekter eventuell retry-informasjon og ikke skjul feilen |
| `5xx` | Vis en tydelig midlertidig feil og logg kun tekniske metadata |
| Ugyldig JSON | Returner en kontrakt- eller transportfeil |
| Uventet schema | Rapporter hvilke feltstier som ikke validerte |
| Manglende inkludert ressurs | Stopp mappingen. Ikke gjett eller dropp blokken skjult |
| Ukjent Paragraph-type | Vis en eksplisitt feil i spiken og avklar støtte |

Shared Content-dokumentasjonen bekrefter `403` for tilgangsfeil. Vi må teste de øvrige statusene i staging og avklare eventuell retry-policy.

## Sikkerhetssjekk for live-klienten

- Les API-nøkkelen bare i server-only kode.
- Send nøkkelen i header, aldri i URL.
- Ikke logg nøkkel, rå payload, HTML eller valgte onboarding-svar.
- Behandle `response.json()` som `unknown`.
- Bruk Zod `safeParse()` ved alle eksterne grenser.
- Valider `type`, `id`, relasjonsform og nødvendige felter.
- Sanitér HTML i appen selv om API-et sanitiserer.
- Tillat bare avtalte URL-protokoller og mediahosts.
- Følg relasjonsrekkefølgen.
- Sett timeout og håndter nettverksfeil eksplisitt.
- Ikke bruk filtering som tilgangskontroll.
- Ikke legg sensitive eller fritekstbaserte svar i delbare URL-er.

## Spørsmål til API-eier før vi kobler på staging

1. Hvilken ressurstype representerer onboarding-modulen?
2. Hvordan finner vi riktig modul: fast UUID, slug eller filter?
3. Hvilke typer representerer spørsmål og alternativer?
4. Hvordan uttrykkes enkeltvalg og flervalg?
5. Hvor ligger koblingen mellom alternativ og resultatinnhold?
6. Hvem utfører matchingen: API-et eller klienten?
7. Hvordan leveres standardinnhold uten valgte svar?
8. Hvordan prioriteres og sorteres resultatinnhold?
9. Hvordan leveres rikt innhold inne i et accordion-svar?
10. Hvordan velger vi bokmål i live API?
11. Hvilke media- og videohoster brukes?
12. Hvilken `render_version` gjelder?
13. Hva er maksimal include-dybde og sidestørrelse?
14. Finnes rate limit, cache-headere og anbefalt revalidering?
15. Hvordan roteres API-nøkkelen uten nedetid?

## Kilder

Filer i `kvno-shared-content-example`:

- `README.md`
- `docs/shared-content-api.md`
- `lib/shared-content.ts`
- `lib/types.ts`
- `lib/mock-api.ts`
- `scripts/mock-contract.test.mjs`
- `mock-data/shared-content.json`
- `mock-data/articles/mock-first-job.json`
- `mock-data/articles/mock-first-job.nb.json`

Offisiell Drupal-dokumentasjon:

- [Fetching resources med GET](https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/fetching-resources-get)
- [Includes](https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/includes)
- [Filtering](https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/filtering)
- [Sorting](https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/sorting)
- [Pagination](https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/pagination)
- [Sparse fieldsets i JSON:API-spesifikasjonen](https://jsonapi.org/format/#fetching-sparse-fieldsets)
