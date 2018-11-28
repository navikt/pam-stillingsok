# PAM Stillingsøk

## Hvordan kjøre applikasjonen lokalt

#### 1. Start node server
For å starte `server.js` lokalt trenger du å sette følgende miljøvariabler:
```
PAMADUSER_URL
LOGINSERVICE_URL
LOGOUTSERVICE_URL
PAM_STILLINGSOK_URL
```

Dersom du kjører en lokal instanse av pam-search-api kan du også sette `DEV_PROFILE=true` for at kall mot søkeapiet skal rettes mot denne. For eksempel kan man lage et script `run.sh`, dersom man kjører pam-aduser, pam-search-api og pam-stillingsok lokalt, med følgende innhold:
```sh
#!/bin/bash
export DEV_PROFILE=true
export PAMADUSER_URL=http://localhost:9017
export LOGINSERVICE_URL=http://localhost:9017/aduser/local/cookie?subject=12345
export LOGOUTSERVICE_URL=http://localhost:9017/aduser
export PAM_STILLINGSOK_URL=http://localhost:8080
exec npm start
```

Generelle byggetrinn:
```sh 
npm install
npm run build
npm start
```
Frontend kjører som default på [localhost:8080](localhost:8080). 

#### 2. Starte automatisk bygging av frontendkoden
```sh 
webpack --watch  --config webpack.config.dev.js
```


## I miljø

Applikasjonen kjører på nais i miljø. Jenkins bygger applikasjonen med webpack, og så bygges et docker-image med en express-server. Man kan også kjøre dockerimaget lokalt, men man må da sende med adressen til pam-search-api som en miljøvariabel (`STILLINGSOKES_URL`)

Verktøystøtte | URL
--------------|------------------------------------------------------------------
Jenkins       | http://a34apvl00015.devillo.no:8080/
Fasit         | https://fasit.adeo.no/applications/edit?1&application=2372388
Kibana        | https://logs.adeo.no/app/kibana
