# Deploying TulparHub

Self-hosted on a Kazakhstan VPS (ps.kz or Yandex Cloud `kz1`). Everything runs
in Docker Compose: **Postgres + Next.js app + Caddy** (auto-HTTPS). Provider-agnostic.

## 1. First-time server setup

```bash
# On the VPS (Ubuntu):
sudo apt update && sudo apt install -y git
# Install Docker Engine + compose plugin: https://docs.docker.com/engine/install/

sudo mkdir -p /opt/tulparhub && sudo chown "$USER" /opt/tulparhub
git clone <repo-url> /opt/tulparhub
cd /opt/tulparhub

cp .env.example .env
# Edit .env — set at minimum:
#   POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_DB
#   AUTH_SECRET            (openssl rand -base64 32)
#   AUTH_URL=https://tulparhub.kz
#   AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET
#   EMAIL_SERVER / EMAIL_FROM
# NOTE: DATABASE_URL is built automatically by docker-compose from POSTGRES_*.
```

Point your domain's DNS A record at the VPS, and set the domain + email in
[`Caddyfile`](Caddyfile). Then:

```bash
docker compose up -d --build
```

The app container runs migrations on start (`lib/db/migrate.mjs`) and serves on
:3000; Caddy terminates TLS on :80/:443.

## 2. Load the catalog

Copy the vendor CSV onto the server and import it:

```bash
# CSV_PATH + VENDOR_ID come from .env
docker compose exec app node_modules/.bin/tsx scripts/import-csv.ts
# (or run from a machine with DATABASE_URL pointing at the VPS DB)
```

## 3. Continuous deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which SSHes in,
`git pull`s, and `docker compose up -d --build`. Add these repo secrets:

| Secret | Value |
|--------|-------|
| `SSH_HOST` | server IP / hostname |
| `SSH_USER` | deploy user |
| `SSH_KEY`  | deploy user's private key |

## 4. Backups

`scripts/backup-db.sh` runs `pg_dump` + gzip with retention. Add to cron:

```cron
0 3 * * * /opt/tulparhub/scripts/backup-db.sh >> /var/log/tulparhub-backup.log 2>&1
```

Set `OFFSITE_S3` in `.env` to also push dumps to object storage.
```

## Local development

```bash
docker compose -f docker-compose.dev.yml up -d   # Postgres on :5432
cp .env.example .env                             # DATABASE_URL preset for dev
yarn install
yarn db:migrate
yarn import-csv                                   # needs a CSV at CSV_PATH
yarn dev
```
