# PAM Stillingsøk

## Hvordan kjøre applikasjonen lokalt

#### 1. Start node server
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

#### 3. Starte search-api og aduser-api
* For å få data må pam-search-api kjøre lokalt
* For å få brukerdata må pam-aduser kjøre lokalt

## I miljø

Applikasjonen kjører på nais i miljø. Jenkins bygger applikasjonen med webpack, og så bygges et docker-image med en express-server. Man kan også kjøre dockerimaget lokalt, men man må da sende med adressen til pam-search-api som en miljøvariabel (`STILLINGSOKES_URL`)

Verktøystøtte | URL
--------------|------------------------------------------------------------------
Jenkins       | http://a34apvl00015.devillo.no:8080/
Fasit         | https://fasit.adeo.no/applications/edit?1&application=2372388
Kibana        | https://logs.adeo.no/app/kibana










