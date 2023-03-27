#!/usr/bin/env bash
set -e
npm config set @navikt:registry https://npm.pkg.github.com
npm config set //npm.pkg.github.com/:_authToken=$OPTIONAL_SECRET
npm install
npm run build
