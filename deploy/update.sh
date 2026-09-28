#!/bin/sh
# Nieuwe versie live zetten. Op de server draaien vanuit ~/aldus: ./deploy/update.sh
set -e
cd "$(dirname "$0")/.."
git pull
docker compose up -d --build
docker image prune -f
