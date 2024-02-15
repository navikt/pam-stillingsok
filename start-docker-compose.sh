#!/usr/bin/env bash

# Start shared docker compose services (must be sourced, or DOCKER_COMPOSE_COMMAND won't be available)
. ../pam-docker-compose-shared/start-docker-compose.sh mock-oauth2-server redis

$DOCKER_COMPOSE_COMMAND up --remove-orphans