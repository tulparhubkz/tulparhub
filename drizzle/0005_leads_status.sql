-- Idempotent: this migration shipped earlier as 0003_leads-status and was
-- renumbered during a merge, so databases that already ran it have the column
-- but no ledger row for 0005.
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'new' NOT NULL;
