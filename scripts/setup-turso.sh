#!/usr/bin/env bash
# Run this on your machine where Turso CLI is installed.
# It creates the DB, applies the schema, seeds data, and prints Vercel env vars.
# If Turso is in ~/.turso, the script will use it.

set -e
# Use ~/.turso if present (common install path)
export PATH="${HOME}/.turso:${PATH}"

DB_NAME="${1:-wedlist}"
# Valid IDs: aws-eu-west-1, aws-us-east-1, aws-ap-northeast-1, etc. (run: turso db locations)
LOCATION="${2:-aws-eu-west-1}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MIGRATION_FILE="$REPO_ROOT/prisma/migrations/20260215154301_init/migration.sql"

echo "=== Turso setup for Wedlist ==="
echo "Database: $DB_NAME, Location: $LOCATION"
echo ""

# 0. Check logged in (whoami returns username when authenticated)
if ! turso auth whoami &>/dev/null; then
  echo "You are not logged in. Run: turso auth login"
  exit 1
fi

# 1. Create database if it doesn't exist
if ! turso db list 2>/dev/null | grep -q "^$DB_NAME$"; then
  echo "Creating database $DB_NAME..."
  turso db create "$DB_NAME" --location "$LOCATION"
else
  echo "Database $DB_NAME already exists."
fi

# 2. Get URL and token
TURSO_URL=$(turso db show "$DB_NAME" --url)
echo "Database URL: $TURSO_URL"

echo "Creating auth token..."
TURSO_TOKEN=$(turso db tokens create "$DB_NAME" 2>/dev/null | tail -1)
if [ -z "$TURSO_TOKEN" ]; then
  echo "Failed to create token. Create one manually: turso db tokens create $DB_NAME"
  exit 1
fi

# 3. Apply migration (run SQL in Turso)
echo ""
echo "Applying schema..."
if turso db shell "$DB_NAME" < "$MIGRATION_FILE" 2>/dev/null; then
  echo "Schema applied."
else
  echo "Note: If you see 'table already exists' errors, the schema was already applied."
fi

# 4. Seed (optional; skip prompt if --seed is passed)
SEED_FLAG=""
for arg in "$@"; do
  [ "$arg" = "--seed" ] && SEED_FLAG=1 && break
done

if [ -n "$SEED_FLAG" ]; then
  DO_SEED=1
else
  read -p "Seed the database with sample data? [y/N] " -n 1 -r
  echo
  [[ $REPLY =~ ^[yY]$ ]] && DO_SEED=1 || DO_SEED=0
fi

if [ "$DO_SEED" = "1" ]; then
  export TURSO_DATABASE_URL="$TURSO_URL"
  export TURSO_AUTH_TOKEN="$TURSO_TOKEN"
  cd "$REPO_ROOT" && npx tsx prisma/seed.ts
  echo "Seed done."
fi


# 5. Print Vercel env vars
echo ""
echo "=== Add these in Vercel (Settings → Environment Variables) ==="
echo ""
echo "TURSO_DATABASE_URL=$TURSO_URL"
echo "TURSO_AUTH_TOKEN=$TURSO_TOKEN"
echo ""
echo "Then redeploy your project."
