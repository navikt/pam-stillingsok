#!/usr/bin/env bash

# Pull latest version
git -C ../pam-docker-compose-shared pull

# Start shared docker compose services (must be sourced, or DOCKER_COMPOSE_COMMAND won't be available)
. ../pam-docker-compose-shared/start-docker-compose.sh postgres mock-oauth2-server redis kafka pam-geografi

# Create databases
../pam-docker-compose-shared/create-database.sh "pam-aduser"

# Start the containers
$DOCKER_COMPOSE_COMMAND up --remove-orphans "$@"
