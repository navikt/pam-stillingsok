## Beskrivelse

Frontend-applikasjon for visning av stillinger på [arbeidsplassen.nav.no](https://arbeidsplassen.nav.no).

Applikasjonen har ansvar for søk og filtrering av stillinger, lagring av favorittstillinger og lagring av søk slik at
brukere kan få daglige oppdateringer pr. e-post.

Applikasjonen henter stillinger fra en dokumentdatabase (OpenSearch) gjennom
[arbeidsplassen-search-api](https://github.com/navikt/arbeidsplassen-search-api). Lagrede søk og stillingsfavoritter, samt utsending av
e-poster skjer gjennom applikasjonen [pam-aduser](https://github.com/navikt/pam-aduser).
Navnet til innlogget bruker hentes fra [pam-aduser](https://github.com/navikt/pam-aduser).

## Copilot Cheatsheet 🚀

**Prosjektregler (Next.js 14 + TypeScript + Vitest)**

- ✅ Bruk **TypeScript** (ikke JS)
- ✅ Bruk **`type`** fremfor `interface`
- ✅ **Aldri `any`** → bruk `unknown` + innsnevring/validering
- ✅ **Komponentstil:**
    - Funksjonsdeklarasjon som standard
    - `const` pilfunksjon kun ved `memo`, `forwardRef`, generiske komponenter eller `displayName`
- ✅ Next.js App Router-konvensjoner (`next/link`, `next/navigation`, `server actions`)
- ✅ Test med **Vitest**, filer skal hete `*.test.ts(x)` og ligge ved siden av koden
- ✅ Små, gjenbrukbare komponenter → del logikk i hooks/utils
- ✅ **Leselige variabelnavn** (unngå korte navn som `a`, `b`, `x`, `obj`, `acc`)
- ✅ Tilgjengelighet (WCAG) ivaretatt i UI

📌 For detaljer, se [`copilot-instructions.md`](./.github/copilot-instructions.md).

---

## Hvordan nye utviklere skal gjøre det fremover

Prosjektet bruker **pnpm** (ikke npm/yarn) og er låst til `pnpm@10.24.0` via `packageManager` i `package.json`.

### Forutsetninger

- **Node**: 20.x (vi anbefaler å bruke `nvm`)
- **Git**: vanlig CLI eller GUI-klient

Eksempel med `nvm`:

```bash
nvm install 20
nvm use 20
```

## Sett opp pnpm (første gang per maskin)

Dette trenger du normalt bare å gjøre én gang per Node-versjon:

```bash
npm install -g corepack@latest
corepack enable pnpm
```

Når du har klonet repoet:

```bash
cd pam-stillingsok

# Sjekk at pnpm-versjonen matcher packageManager i package.json (pnpm@10.24.0)
pnpm -v
```

Hvis versjonen ikke stemmer, kan du bruke:

```bash
corepack use pnpm@10.24.0
```

## Installere avhengigheter og starte appen

Fra rotmappen i repoet:

```bash
# Installer avhengigheter (bruker pnpm-lock.yaml)
pnpm install

# Start utviklingsserver
pnpm dev
```

## Viktig om pakkehåndtering

- Ikke bruk npm install eller yarn i dette prosjektet.
- Når du legger til nye avhengigheter, bruk alltid pnpm:

```bash
pnpm add <pakke>
pnpm add -D <pakke>   # devDependency
```

## Før kjøring av applikasjonen lokalt

### Hvordan få tilgang til @navikt/arbeidsplassen-react og @navikt/arbeidsplassen-css

Opprett fila `.npmrc` i hjemkatalogen din. F.eks. `~/.npmrc` Mer info: https://docs.npmjs.com/cli/v9/configuring-npm/npmrc

Legg til følgende i fila

```
@navikt:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=$TOKEN
```

Opprett et token med "read:packages" rettigheter. [https://github.com/settings/tokens](https://github.com/settings/tokens) Bytt ut \$TOKEN med tokenet du akkurat opprettet. Velg Authorize token under "Configure SSO" for å gi tokenet tilgang til @navikt.

> [!CAUTION]
> Ikke sjekk inn `.npmrc` til GitHub.

Mer informasjon om autentisering: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token

### Wonderwall

> [!TIP]
> Gå igjennom login-flyten ved å trykke login. Bruk testbruker `04010100653`

### Docker Compose

For å kjøre backend så trenger du å installere [Docker](https://docs.docker.com/engine/install/),
og for å få tilgang til images må du ha [gcloud cli](https://cloud.google.com/sdk/docs/install) installert.

For å kjøre Docker Compose lokalt, trenger du repot med fellestjenester.
Hvis du ikke har det, klone det og legg i samma mappe som `pam-stillingsok`:

```shell
git clone git@github.com:navikt/pam-docker-compose-shared.git ../pam-docker-compose-shared
```

#### Autentiser Docker repo

Autentiser `gcloud`

```shell
gcloud auth login
```

Legg in Docker repo i credentials helper

```shell
gcloud auth configure-docker europe-north1-docker.pkg.dev
```

Hent token og logg in i Docker

```shell
gcloud auth print-access-token \
  | docker login \
  -u oauth2accesstoken \
  --password-stdin https://europe-north1-docker.pkg.dev
```

Du kan nå starte Docker Compose for fellestjenestene og lokalt, med kommandoen som passer til det du trenger

```shell
$ pnpm run start:dependencies
.. eller ...
$ pnpm run start:dependencies-with-local-search
.. eller ...
$ pnpm run start:dependencies-with-update-containers
```

> [!TIP]
> Får du feil når du kjører `pnpm run start:dependencies` kan det hende du må oppdatere `pam-aduser` imaget i `docker-compose.yml`
> For å liste opp de siste 10 versjonene (docker tagsen)
>
> ```shell
> gcloud container images list-tags europe-north1-docker.pkg.dev/nais-management-233d/teampam/pam-aduser --sort-by=~tags --filter="tags:* AND NOT tags:sha256*" --limit=10 --format="value(tags)" | cut -d "," -f2
> ```

Skriptet sørger for å starte felles tjenester og lage databaser som trengs.

> [!TIP]
> Du kan også automatisk oppdatere avhengigheter med denne kommandoen
>
> ```shell
> ./update-containers.sh
> ```

## Start applikasjonen

```shell
$ pnpm install
$ pnpm run dev
```

Du kan deretter velge å kjøre applikasjonen med teststillinger fra dev- eller prod-miljøet, eller kjøre en lokal instans av opensearch.
Sistnevnte krever at du registrerer stillinger i stillingsregistrering lokalt, og er nødvendig for å enkelt kunne teste superrask søknad lokalt.

Gå til instruksjonene som passer det du vil starte opp.

Når applikasjonen er oppe, så kan du gå inn på [http://localhost:3000/stillinger](http://localhost:3000/stillinger)
(selve applikasjonen kjører på port 3003, men for å kunne benytte autentisering bruker du port 3000).

### Med teststillinger fra dev- og prod-miljøet

For å starte docker-containere for redis, mock-oauth2-server og wonderwall.

```shell
$ pnpm run start:dependencies
```

### Med teststillinger fra lokal opensearch

Bruk dette oppsettet hvis du ønsker å registrere stillinger lokalt og/eller teste superrask søknad lokalt.
Dette krever at du også kjører upp `pam-stillingsregistrering` lokalt, med tilhørende Docker-tjenester som følger med lokalt søk.

For å starte alle containrer, kjør

```shell
$ pnpm run start:dependencies-with-local-search
```

## Artikler, metadata, sitemap og nettstedkart

Artikler under `src/app/(artikler)` bruker et felles `pageInfo`-oppsett for SEO, sitemap og nettstedkart.  
For detaljer om hvordan du legger til og vedlikeholder artikler, se:

[Les mer i `src/app/(artikler)/README.md`](src/app/%28artikler%29/README.md)

## Deployment

Lyst til å teste i dev-miljøet? `feature/**` branches pushes automatisk til dev eller så kan man alternativt legge til `deploy:dev` i commit meldingen for å trigge deployment til dev. Dette vil hoppe over opprettelsen av draft release, se deploy-dev.yml fila eller [pam-deploy](https://github.com/navikt/pam-deploy/blob/master/.github/workflows/deploy-dev.yml) for mer.

## Bruk av innloggede tjenester

For å kunne bruke innloggede tjenester (dvs. favoritter og lagrede søk), må du først kjøre `pam-aduser`.

> [!TIP]
> Tjenesten `pam-aduser` startes automatisk av `pnpm run start:dependencies`

## Logging

Vi bruker `@navikt/next-logger` (Pino/JSON) for strukturert logging i Next.js. Dette gir maskinlesbare logger i produksjon (én JSON-linje per logg), som gjør det enklere å søke, filtrere og feilsøke i Grafana/Loki.

### Bruk

Importer `logger` og logg med en kort, stabil melding. Hvis du har en exception, logg den som en `Error` (evt. wrappet med `cause`).

```ts
import { logger } from "@navikt/next-logger";

logger.info("Starter opp");

try {
    // ...
} catch (caught) {
    logger.error(new Error("Kunne ikke veksle inn token", { cause: caught }));
}
```

For HTTP-feil anbefaler vi å legge relevant kontekst i `cause` (status/url/metode), fremfor å sende hele `Response`-objektet.

### Frontend-logger

`@navikt/next-logger` kan også brukes i klientkode. Klientlogger sendes til en API-route og logges server-side. Vi har derfor denne route’en:

- `app/api/logger/route.ts` (App Router)

```ts
export { POST } from "@navikt/next-logger/app-dir";
```

### Team-logs (valgfritt)

Vi bruker ikke team-logs per i dag, men `@navikt/next-logger` støtter det dersom behovet oppstår (f.eks. for å rute utvalgte logger til egne loggstrømmer).

Se dokumentasjon:

- `@navikt/pino-logger` / `@navikt/next-logger`: https://github.com/navikt/pino-logger

## Teknisk dokumentasjon

### Avhengigheter

- [arbeidsplassen-search-api](https://github.com/navikt/arbeidsplassen-search-api)
- [pam-aduser](https://github.com/navikt/pam-aduser)

### Teknologier

Stillingsøket kjører i Next.js rammeverket. Den viser stillinger, favoritter og lagrede søk. Brukere kan søke etter
stillinger uten å logge inn, mens favoritter og lagrede søk krever innlogging.

Server-side står for en del logikk, blant annet
konvertering av søkekriterier i frontend til ElasticSearch for å kunne utføre spørringer mot arbeidsplassen-search-api.

### Systemlandskap

Bildet viser en forenklet skisse av `pam-stillingsok` og nærmeste integrasjoner.

![Teknisk skisse](images/teknisk-skisse.png)

### Stillingsdatabase (ElasticSearch) og arbeidsplassen-search-api

[navikt/arbeidsplassen-search-api](http://github.com/navikt/arbeidsplassen-search-api) har en dokumentdatabase med stillinger
(ElasticSearch) som `pam-stillingsok` henter stillinger fra via REST.

En index-tjeneste henter stillinger fra stillingsdatabasen og indekserer dem til ElasticSearch via  
REST.

### Lagrede favoritter, lagrede søk og pam-aduser

[navikt/pam-aduser](http://github.com/navikt/pam-aduser) har funksjonalitet for lagring av
favorittstillinger, lagrede søk og utsending av epost med lagrede søk. Appen har et REST API som `pam-stillingsok` bruker for å
hente og editere favoritter og lagrede søk.

Favorittstillinger lagres i en Postgres-database i `pam-aduser`. Favorittene synces mot
stillingsdatabasen med masterdata for stillinger via REST for å fange opp endringer i stillingannonsers status, tittel
osv.

Lagrede søk fungerer ved at `pam-stillingsok` genererer en predefinert spørring som kan eksekveres mot `arbeidsplassen-search-api`.
Denne spørringen lagres i `pam-aduser`. Hver natt kjøres alle lagrede spørringer mot `pam-stillingsok`. Nye
stillinger sendes til brukere over epost med Microsoft Graph API.
