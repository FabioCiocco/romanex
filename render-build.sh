#!/bin/bash
set -e

echo "==> Installing pnpm..."
npm install -g pnpm@10.26.1

echo "==> Installing dependencies (ignore scripts to skip typecheck)..."
pnpm install --no-frozen-lockfile --ignore-scripts

echo "==> Building API server..."
cd artifacts/api-server
node ./build.mjs

echo "==> Build complete!"
