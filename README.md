pam-stillingsok
===

Frontend-applikasjon for visning av stillinger på [arbeidsplassen.nav.no](https://arbeidsplassen.nav.no).

Applikasjonen har ansvar for søk og filtrering av stillinger, lagring av favorittstillinger og lagring av søk slik at 
brukere kan få daglige oppdateringer pr. e-post.

Applikasjonen henter stillinger fra en dokumentdatabase (ElasticSearch) gjennom 
[pam-search-api](https://github.com/navikt/pam-search-api). Lagrede søk og stillingsfavoritter, samt utsending av 
e-poster skjer gjennom applikasjonen [pam-aduser](https://github.com/navikt/pam-aduser).

# Teknisk dokumentasjon

## Teknologier

* React
* Node
* Microsoft Graph API

## Systemlandskap

Bildet viser en forenklet skisse av pam-stillingsok og nærmeste integrasjoner.

![Teknisk skisse](images/teknisk-skisse.png)

### Frontend

Appens frontend er skrevet i React. Den viser stillinger, favoritter og lagrede søk. Brukere kan søke etter 
stillinger uten å logge inn, mens favoritter og lagrede søk krever innlogging. 

### Backend

Appen har en backend for frontend skrevet i JavaScript (Node). Backenden står for en del logikk, blant annet 
konvertering av søkekriterier i frontend til ElasticSearch for å kunne utføre spørringer mot pam-search-api.

### Stillingsdatabase (ElasticSearch) og pam-search-api

[navikt/pam-search-api](http://github.com/navikt/pam-search-api) har en dokumentdatabase med stillinger 
(ElasticSearch) som pam-stillingsok henter stillinger fra via REST.

En index-tjeneste henter stillinger fra stillingsdatabasen og indekserer dem til ElasticSearch via  
REST.

### Lagrede favoritter, lagrede søk og pam-aduser

[navikt/pam-aduser](http://github.com/navikt/pam-aduser) har funksjonalitet for lagring av 
favorittstillinger, lagrede søk og utsending av epost med lagrede søk. Appen har et REST API som pam-stillingsok sin frontend bruker for å 
hente og editere favoritter og lagrede søk.

Favorittstillinger lagres i en Postgres-database i pam-aduser. Favorittene synces mot 
stillingsdatabasen med masterdata for stillinger via REST for å fange opp endringer i stillingannonsers status, tittel 
osv.

Lagrede søk fungerer ved at pam-stillingsok genererer en predefinert spørring som kan eksekveres mot pam-search-api. 
Denne spørringen lagres i pam-aduser. Hver natt kjøres alle lagrede spørringer mot pam-stillingsok. Nye 
stillinger sendes til brukere over epost med Microsoft Graph API.

pam-aduser autentiserer også brukere (med loginservice) så de får tilgang til favoritter og lagrede søk.

# Komme i gang

## Før kjøring av applikasjonen

Før du starter må du installere alle npm pakkene, dette kan du gjøre ved å kjøre kommandoen: 

```
$ npm install
```

## Kjøre applikasjonen lokalt

### Med dev script

Du kan enkelt kjøre applikasjonen ved hjelp av dev scripten `runDev.sh`

Denne setter følgende verdier som miljøvariabler:

```
PAMSEARCHAPI_URL=http://localhost:9000
PAMADUSER_URL=http://localhost:9017
LOGINSERVICE_URL=http://localhost:9017/aduser/local/cookie?subject=12345
LOGOUTSERVICE_URL=http://localhost:9017/aduser
PAM_STILLINGSOK_URL=http://localhost:8080/stillinger
PAM_VAR_SIDE_URL=http://localhost:8080/stillingsregistrering
PAM_INTERNAL_SEARCH_API_URL=http://localhost:9027
PAM_JOBBTREFF_API_URL=http://localhost:8088/jobbtreff-promo
AMPLITUDE_TOKEN=(Dev Token)
```

Applikasjonen vil da forsøke å koble seg til pam-search-api gjennom `localhost:9000`.
Dersom du vil få inn teststillinger kan du koble deg direkte til et kjørende instans av pam-search-api i kubernetes. Dette gjør du med følgende kommando:
```
$ kubectl config use-context dev-gcp
$ kubectl -n teampam port-forward deployment/pam-search-api 9000:9000
```

Om du får følgende output betyr det at port-forwarden funket og pam-search-api er tilgjengelig på port 9000. 
```
Forwarding from 127.0.0.1:9000 -> 9000
Forwarding from [::1]:9000 -> 9000
```

### Manuell kjøring 
Før man starter applikasjonen trenger man å sette følgende miljøvariabler:

```
PAMADUSER_URL
LOGINSERVICE_URL
LOGOUTSERVICE_URL
PAM_STILLINGSOK_URL
PAMSEARCHAPI_URL
PAM_VAR_SIDE_URL
```

Etter variablene er satt kan man kjøre applikasjonen ved å kjøre kommandoen: 
``npm start``

Applikasjonen vil da forsøke å hente inn stillinger fra addressen spesifisert på ``PAMADUSER_URL`` miljøvariabelen


## Bruk av innloggede tjenester
For å kunne bruke innloggede tjenester (dvs. favoritter og lagrede søk), må du først kjøre `pam-aduser`.

