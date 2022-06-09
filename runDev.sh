#!/bin/bash
export PAMSEARCHAPI_URL=http://localhost:9000
export PAMADUSER_URL=http://localhost:9017
export LOGINSERVICE_URL=http://localhost:9017/aduser/local/cookie?subject=12345
export LOGOUTSERVICE_URL=http://localhost:9017/aduser
export PAM_STILLINGSOK_URL=http://localhost:8080/stillinger
export PAM_VAR_SIDE_URL=http://localhost:8080/stillingsregistrering
export PAM_INTERNAL_SEARCH_API_URL=http://localhost:9027
export PAM_JOBBTREFF_API_URL=http://localhost:8088/jobbtreff-promo
export AMPLITUDE_TOKEN=b6143dedf1d17c3e73d3ad440bf54e8b
export NAIS_CLUSTER_NAME=local-dev
exec npm start
