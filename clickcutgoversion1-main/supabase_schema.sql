-- Run this in the Supabase SQL Editor to set up your tables

-- FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS feedback (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  phone TEXT,
  event_type TEXT,
  event_date TEXT,
  overall_rating INTEGER,
  delivery_rating INTEGER,
  experience TEXT,
  would_recommend TEXT,
  permission INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CREATORS TABLE
CREATE TABLE IF NOT EXISTS creators (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  phone TEXT,
  portfolio_url TEXT,
  instagram_handle TEXT,
  experience_level TEXT,
  about TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Optional but recommended)
-- ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE creators ENABLE ROW LEVEL SECURITY;

-- Note: In a production app, you'd add policies to control who can read/write.
-- For now, the API key in server.js handles basic access.
