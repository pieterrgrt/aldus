#!/bin/sh
# Nieuwe versie live zetten. Op de server draaien vanuit ~/aldus: ./deploy/update.sh
# Nieuwe commits op main zet de server zelf online; dit is voor de hand, bijv. na een wijziging aan Dockerfile of docker-compose.yml.
set -e
cd "$(dirname "$0")/.."
git pull --ff-only
docker compose up -d --build
docker image prune -f
