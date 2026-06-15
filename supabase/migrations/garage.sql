-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ffbnagekrmwomkilyvtf/sql

CREATE TABLE IF NOT EXISTS garage (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     text NOT NULL,
  vin         text NOT NULL,
  name        text NOT NULL,
  note        text DEFAULT '',
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS garage_user_id_idx ON garage(user_id);
