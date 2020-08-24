#!/bin/bash
export PAMSEARCHAPI_URL=http://localhost:9000
export PAMADUSER_URL=http://localhost:9017
export LOGINSERVICE_URL=http://localhost:9017/aduser/local/cookie?subject=12345
export LOGOUTSERVICE_URL=http://localhost:9017/aduser
export PAM_STILLINGSOK_URL=http://localhost:8080/stillinger
export PAM_VAR_SIDE_URL=http://localhost:8080/stillingsregistrering
exec npm start
