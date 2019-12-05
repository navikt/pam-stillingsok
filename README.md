# PAM Stillingsøk

:-)

## Hvordan kjøre applikasjonen lokalt

Før man starter applikasjonen trenger man å sette følgende miljøvariabler:

```
PAMADUSER_URL
LOGINSERVICE_URL
LOGOUTSERVICE_URL
PAM_STILLINGSOK_URL
PAMSEARCHAPI_URL
PAM_VAR_SIDE_URL
```

Man kan for eksempel kan man lage et script `run.sh`, dersom man kjører pam-aduser, pam-search-api og
pam-stillingsok lokalt, med følgende innhold:

```sh
#!/bin/bash
export PAMSEARCHAPI_URL=http://localhost:9000
export PAMADUSER_URL=http://localhost:9017
export LOGINSERVICE_URL=http://localhost:9017/aduser/local/cookie?subject=12345
export LOGOUTSERVICE_URL=http://localhost:9017/aduser
export PAM_STILLINGSOK_URL=http://localhost:8080/stillinger
export PAM_VAR_SIDE_URL=http://localhost:8080/stillingsregistrering
exec npm start
```

Generelle byggetrinn:

```sh 
npm install
npm run build
npm start
```

Bruk docker-compose:
```sh
docker-compose up --build 
```
--build kjøres kun ved første bygging, og ved endring i docker images.

Frontend kjører som default på [localhost:8080](localhost:8080). 

---

Eventuelt kan man kjøre server og automatisk bygging av frontend separat:

```sh
# Start node server:
npm run start-express

# Start automatisk bygging av frontend:
npm run start-webpack
```

## I miljø

Applikasjonen kjører på nais i miljø. Jenkins bygger applikasjonen med webpack,
og så bygges et docker-image med en express-server. Man kan også kjøre
dockerimaget lokalt, men man må da sende med adressen til pam-search-api som en
miljøvariabel (`STILLINGSOKES_URL`)

Verktøystøtte | URL
--------------|------------------------------------------------------------------
Jenkins       | http://a34apvl00015.devillo.no:8080/
Fasit         | https://fasit.adeo.no/applications/edit?1&application=2372388
Kibana        | https://logs.adeo.no/app/kibana

## Komme i gang med Sauce Labs

Sauce Labs brukes til å kjøre Nightwatch/Cucumber-tester.
Logg inn i Sauce Labs her: www.saucelabs.com.
For å kunne kjøre tester fra egen maskin må man installere og kjøre Sauce Connect.
Sauce Connect oppretter en secure tunnel mellom maskinen og Sauce Labs.
Sauce Connect kan finnes her: https://wiki.saucelabs.com/display/DOCS/Sauce+Connect+Proxy.
Åpne mappen hvor Sauce Connect ligger og kjør med følgende kommando:
#####Windows
```
bin\sc.exe -u username -k ddacfe7c-43e7-4973-1a25-140534f18636 -i tunnel-name
```
#####Linux/Mac
```
bin/sc -u username -k ddacfe7c-43e7-4973-1a25-140534f18636 -i tunnel-name
```
-k er parameter for user key og kan finnes under User Settings etter å ha logget inn i Sauce Labs.
Sauce Connect vil starte en selenium listener på port 4445, som er default.
For å kjøre tester på Sauce Labs må man spesifisere samme port i configen til Nightwatch.
Man må også legge til følgende Environment Variables på maskinen med brukernavn og key:
```
SAUCE_ACCESS_KEY=key
SAUCE_USERNAME=username
```
####Kjøre tester
Først må man installere pakker med ``npm install`` i qa-mappen.
For å kjøre tester må man kjøre script fra qa/package.json.
Ex:
```
npm run sauce-chrome -- --skiptags ignore
```
Kommando for å generere rapport:
```
npm run cucumber-report
```
Rapporten finnes her ``qa/reports/cucumber_report.html``
