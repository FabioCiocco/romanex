#!/bin/bash
set -e
pnpm install --frozen-lockfile
bash scripts/migrate-prod.sh
pnpm --filter @workspace/db run push-force
