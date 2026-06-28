#!/usr/bin/env bash
# Nightly Postgres backup. Add to crontab on the VPS, e.g.:
#   0 3 * * * /opt/tulparhub/scripts/backup-db.sh >> /var/log/tulparhub-backup.log 2>&1
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

# Load POSTGRES_* from .env
set -a; [ -f .env ] && . ./.env; set +a

BACKUP_DIR="${BACKUP_DIR:-$PROJECT_DIR/backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="$BACKUP_DIR/tulparhub-$STAMP.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "[$(date -Is)] dumping database…"
docker compose exec -T db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > "$OUT"
echo "[$(date -Is)] wrote $OUT ($(du -h "$OUT" | cut -f1))"

# Prune old local backups
find "$BACKUP_DIR" -name 'tulparhub-*.sql.gz' -mtime "+$RETENTION_DAYS" -delete

# Optional offsite copy: if OFFSITE_S3 is set, push with rclone/aws (configure separately).
if [ -n "${OFFSITE_S3:-}" ]; then
  echo "[$(date -Is)] uploading to $OFFSITE_S3"
  aws s3 cp "$OUT" "$OFFSITE_S3/" || echo "WARN: offsite upload failed"
fi

echo "[$(date -Is)] done."
