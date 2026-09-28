#!/bin/sh
# Nieuwe versie live zetten. Op de server draaien vanuit ~/aldus: ./deploy/update.sh
# GitHub Actions roept dit ook aan na elke push naar main (.github/workflows/online-zetten.yml).
set -e
cd "$(dirname "$0")/.."
git pull --ff-only
docker compose up -d --build
docker image prune -f
