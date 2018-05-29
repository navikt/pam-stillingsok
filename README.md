# PAM Stillingsøk

## Hvordan kjøre applikasjonen lokalt

```sh 
npm install
npm start
```

Frontend kjører som default på [localhost:8080](localhost:8080). For å få data må pam-search-api kjøre lokalt på port 9000.

## I miljø

Applikasjonen kjører på nais i miljø. Jenkins bygger applikasjonen med webpack, og så bygges et docker-image med en express-server. Man kan også kjøre dockerimaget lokalt, men man må da sende med adressen til pam-search-api som en miljøvariabel (`STILLINGSOKES_URL`)

Verktøystøtte | URL
--------------|------------------------------------------------------------------
Jenkins       | http://a34apvl00015.devillo.no:8080/
Fasit         | https://fasit.adeo.no/applications/edit?1&application=2372388
Kibana        | https://logs.adeo.no/app/kibana










