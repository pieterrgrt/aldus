#!/bin/sh
# Radar draaien op de server, in een wegwerpcontainer met Node. Vanuit ~/aldus:
#   ./radar/draai.sh            (of met --dagen 14, --droog)
# Wekelijks via cron, bijvoorbeeld zondagavond 20:00:
#   0 20 * * 0  cd ~/aldus && ./radar/draai.sh >> radar/radar.log 2>&1
set -e
cd "$(dirname "$0")"
# --network host: zo bereikt de container ook een Miniflux of Listmonk op 127.0.0.1.
docker run --rm --network host -v "$PWD:/radar" -w /radar node:22-alpine \
  sh -c "npm ci --omit=dev --silent && node radar.mjs $*"
