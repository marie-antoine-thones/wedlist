# Scripts

## setup-turso.sh — One-time Turso setup for Vercel

Run this **on your machine** (where the Turso CLI is installed) to create the database, apply the schema, optionally seed, and get the env vars for Vercel.

```bash
# From the repo root (or use full path to the script)
./scripts/setup-turso.sh

# Optional: database name and region (default: wedlist, fra)
./scripts/setup-turso.sh wedlist fra

# Optional: seed without prompting
./scripts/setup-turso.sh wedlist fra --seed
```

**Requires:** [Turso CLI](https://docs.turso.tech/cli/install) installed and `turso auth login` done.

**Output:** Prints `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` to add in Vercel → Settings → Environment Variables.
