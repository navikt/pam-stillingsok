#!/usr/bin/env bash

# Start shared docker compose services (must be sourced, or DOCKER_COMPOSE_COMMAND won't be available)
. ../pam-docker-compose-shared/start-docker-compose.sh postgres mock-oauth2-server redis

# Create databases
../pam-docker-compose-shared/create-database.sh "pam-aduser"

$DOCKER_COMPOSE_COMMAND up --remove-orphans