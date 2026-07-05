#!/bin/bash
set -e

echo "✅ Sidfree Migration Script"
echo "================================"

# Step 1: Validate environment
echo "✓ Validating environment..."
if [[ -z "$DATABASE_URL" && -z "$CLOUD_SQL_CONNECTION_NAME" && -z "$SQL_HOST" ]]; then
  echo "❌ DATABASE_URL or CLOUD_SQL_CONNECTION_NAME or SQL_HOST not set"
  echo "⚠️ Set DATABASE_URL environment variable first"
  exit 1
fi

# Step 2: Install dependencies
echo "✓ Installing dependencies..."
npm install

# Step 3: Build all workspaces
echo "✓ Building workspaces..."
npm run build
