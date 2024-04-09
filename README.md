## Beskrivelse

Frontend-applikasjon for visning av stillinger på [arbeidsplassen.nav.no](https://arbeidsplassen.nav.no).

Applikasjonen har ansvar for søk og filtrering av stillinger, lagring av favorittstillinger og lagring av søk slik at
brukere kan få daglige oppdateringer pr. e-post.

Applikasjonen henter stillinger fra en dokumentdatabase (ElasticSearch) gjennom
[pam-search-api](https://github.com/navikt/pam-search-api). Lagrede søk og stillingsfavoritter, samt utsending av
e-poster skjer gjennom applikasjonen [pam-aduser](https://github.com/navikt/pam-aduser).
Navnet til innlogget bruker hentes fra [pam-aduser](https://github.com/navikt/pam-aduser).

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

[Wonderwall](https://github.com/nais/wonderwall) brukes for å håndtere login med ID-porten.
Lokalt brukes også wonderwall, men her kjører vi mot en OIDC-provider i Docker.

#### Go

Go er nødvendig for å bygge wonderwall binaries. Wonderwall brukes for lokal OIDC-flyt.

```shell
brew install go
```

Installer Wonderwall:

```shell
make install
```

Når applikasjonen er oppe, så kan du gå inn på [http://localhost:3000/stillinger](http://localhost:3000/stillinger)

Hvis du ønsker å teste innlogget flyt, så må pam-aduser også kjøre. Denne kan startes i [pam-aduser](http://github.com/navikt/pam-aduser)
med å kjøre `no.nav.pam.aduser.Application` som en Spring Boot applikasjon, f.eks. fra IntelliJ med Spring-profilen _dev_ satt.

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

[//]: # "Docker compose setupen benytter seg av de bygde images for `pam-stillingsregistrering-api` og `pam-interesse-api`."

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

Du kan nå starte Docker Compose for fellestjenestene og lokalt

```shell
$ npm run start:dependencies
```

Skriptet sørger for å starte felles tjenester og lage databaser som trengs.

## Start applikasjonen

```shell
$ npm install
$ npm run dev
```

For å starte docker-containere for redis, mock-oauth2-server og wonderwall.

```shell
$ npm run start:dependencies
```

Når applikasjonen er oppe, så kan du gå inn på [http://localhost:3000/stillinger](http://localhost:3000/stillinger)

### Med teststillinger fra dev-miljøet

Dersom du vil få inn teststillinger kan du koble deg direkte til et kjørende instans av `pam-search-api` i kubernetes.

1. Koble til [naisedevice](https://docs.nais.io/explanation/naisdevice/).
2. Kjør port-forwarding. Dette gjør du med følgende kommando:

```shell
$ kubectl config use-context dev-gcp
$ kubectl -n teampam port-forward deployment/pam-search-api 9000:9000
```

### Med teststillinger fra prod-miljøet

Dersom du vil få inn teststillinger kan du koble deg direkte til et kjørende instans av `pam-search-api` i kubernetes.

1. Koble til [naisedevice](https://docs.nais.io/explanation/naisdevice/).
2. Kjør port-forwarding. Dette gjør du med følgende kommando:

```shell
$ kubectl -n teampam port-forward deployment/pam-search-api 9000:9000 --context prod-gcp
```

> [!TIP]
> Dersom du får får feilmelding ved kjøring av kommandoene over kan du prøve å logge inn i gcloud med følgende kommando.
>
> ```shell
> gcloud auth login
> ```

Om du får følgende output betyr det at port-forwarden funket og `pam-search-api` er tilgjengelig på port 9000:

```
Forwarding from 127.0.0.1:9000 -> 9000
Forwarding from [::1]:9000 -> 9000
```

### Deployment

Lyst til å teste i dev-miljøet? `feature/**` branches pushes automatisk til dev eller så kan man alternativt legge til `deploy:dev` i commit meldingen for å trigge deployment til dev. Dette vil hoppe over opprettelsen av draft release, se deploy-dev.yml fila eller [pam-deploy](https://github.com/navikt/pam-deploy/blob/master/.github/workflows/deploy-dev.yml) for mer.

## Bruk av innloggede tjenester

For å kunne bruke innloggede tjenester (dvs. favoritter og lagrede søk), må du først kjøre `pam-aduser`.

## Teknisk dokumentasjon

### Avhengigheter

-   [pam-search-api](https://github.com/navikt/pam-search-api)
-   [pam-aduser](https://github.com/navikt/pam-aduser)

### Teknologier

Stillingsøket kjører i Next.js rammeverket. Den viser stillinger, favoritter og lagrede søk. Brukere kan søke etter
stillinger uten å logge inn, mens favoritter og lagrede søk krever innlogging.

Server-side står for en del logikk, blant annet
konvertering av søkekriterier i frontend til ElasticSearch for å kunne utføre spørringer mot pam-search-api.

### Systemlandskap

Bildet viser en forenklet skisse av `pam-stillingsok` og nærmeste integrasjoner.

![Teknisk skisse](images/teknisk-skisse.png)

### Stillingsdatabase (ElasticSearch) og pam-search-api

[navikt/pam-search-api](http://github.com/navikt/pam-search-api) har en dokumentdatabase med stillinger
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

Lagrede søk fungerer ved at `pam-stillingsok` genererer en predefinert spørring som kan eksekveres mot `pam-search-api`.
Denne spørringen lagres i `pam-aduser`. Hver natt kjøres alle lagrede spørringer mot `pam-stillingsok`. Nye
stillinger sendes til brukere over epost med Microsoft Graph API.
