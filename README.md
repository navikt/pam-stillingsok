## Hva er pam-stillingsok?
`pam-stillingsok` er en frontend applikasjon for visning av stillinger på [arbeidsplassen.nav.no](https://arbeidsplassen.nav.no). Den har ansvar for filtrering av stillinger, lagring av favoritt stillinger og lagring av søk slik at brukere kan få daglige oppdateringer pr. e-post. Applikasjonen henter stillinger fra et dokumentdatabase (Elastic Search) gjennom [pam-search-api](https://github.com/navikt/pam-search-api). Lagrede søk og stillingsfavoritter, samt utsending av e-poster skjer gjennom applisjonen [pam-aduser](https://github.com/navikt/pam-aduser).

## Før kjøring av applikasjonen
Før du starter må du installere alle npm pakkene, dette kan du gjøre ved å kjøre kommandoen: 
```
$ npm install
```


## Kjøring av applikasjonen lokalt ved hjelp av dev script 
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

## Manuell kjøring av applikasjonen lokalt 
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

