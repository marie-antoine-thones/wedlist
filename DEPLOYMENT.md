# Deploying Wedlist to Vercel

SQLite with a local file **does not work** on Vercel (serverless has a read-only filesystem). This project uses **Turso** (SQLite-compatible, serverless-friendly) when deployed.

## 1. Create a Turso database (free)

1. Sign up at [turso.tech](https://turso.tech).
2. Install the Turso CLI:  
   `curl -sSfL https://get.turso.tech/install.sh | sh`
3. Log in:  
   `turso auth login`
4. Create a database:  
   `turso db create wedlist --region fra`  
   (Use a [region](https://turso.tech/docs/reference/database-regions) close to your users.)
5. Get the URL and token:
   ```bash
   turso db show wedlist --url
   turso db tokens create wedlist
   ```
   Save both; you’ll add them to Vercel as env vars.

## 2. Apply the schema to Turso

Migrations are generated for SQLite and applied via the Turso CLI (Prisma Migrate doesn’t run against Turso).

From the project root:

```bash
# Use your Turso DB URL (from step 1)
export TURSO_DATABASE_URL="libsql://wedlist-<your-org>.turso.io"
export TURSO_AUTH_TOKEN="<your-token>"

# Push the schema: run the migration SQL in Turso
# (One migration file; run its contents in Turso SQL shell.)
turso db shell wedlist
# In the shell, paste the contents of:
#   prisma/migrations/20260215154301_init/migration.sql
# Or from your machine (if your shell supports it):
#   turso db shell wedlist < prisma/migrations/20260215154301_init/migration.sql
```

## 3. Deploy on Vercel

1. Push your code to GitHub and [import the repo in Vercel](https://vercel.com/new).
2. In the Vercel project, go to **Settings → Environment Variables** and add:

   | Name                 | Value                    | Environment |
   |----------------------|--------------------------|-------------|
   | `TURSO_DATABASE_URL` | `libsql://wedlist-xxx.turso.io` | Production, Preview |
   | `TURSO_AUTH_TOKEN`   | (token from step 1)      | Production, Preview |
   | `ADMIN_PASSWORD`     | (optional; used if you add auth) | Production |
   | `SITE_TOKEN`         | (optional; for future use) | Production |

   Do **not** set `DATABASE_URL` for production; the app uses Turso when `TURSO_DATABASE_URL` is set.

3. Redeploy (or trigger a new deployment). The build runs `prisma generate && next build`.

## 4. Seed data (optional)

With Turso env vars set, the same seed script works against your Turso DB:

```bash
export TURSO_DATABASE_URL="libsql://wedlist-<your-org>.turso.io"
export TURSO_AUTH_TOKEN="<your-token>"
npx tsx prisma/seed.ts
```

## Troubleshooting

- **Build fails on `prisma generate`**  
  Ensure the repo has `prisma/schema.prisma` and `prisma/migrations/`. No need to set `DATABASE_URL` on Vercel; the build uses a placeholder for generate.

- **Runtime error: "Cannot find module '@libsql/client'"**  
  Ensure `@libsql/client` and `@prisma/adapter-libsql` are in `dependencies` (not only `devDependencies`) in `package.json`.

- **"Invalid or missing TURSO_AUTH_TOKEN"**  
  Check that `TURSO_AUTH_TOKEN` is set in Vercel for the same environment (Production/Preview) you’re using.

- **Database empty or tables missing**  
  Re-run the migration SQL against your Turso database (step 2). Turso doesn’t run Prisma Migrate; you apply migrations manually with the Turso CLI/shell.
