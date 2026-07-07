-- =====================================================
-- CarbonZ - Initial Database Schema for Supabase
-- Run this in the Supabase SQL Editor
-- =====================================================

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  stripe_session_id TEXT UNIQUE,
  customer_name TEXT,
  customer_email TEXT,
  customer_address TEXT,
  customer_city TEXT,
  customer_postal TEXT,
  customer_country TEXT,
  items JSONB,
  total INTEGER,
  status TEXT DEFAULT 'pending',
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default admin (password: carbonz2026)
-- Base64 hash matches the original SQLite seed
INSERT INTO admins (email, password_hash)
VALUES ('admin@carbonz.com', 'Y2FyYm9uejIwMjY=')
ON CONFLICT (email) DO NOTHING;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_stripe ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- Function to automatically update updated_at on row changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Migration complete!
-- Next: Copy your Supabase URL and Service Role Key
-- to .env.local (see SUPABASE_SETUP.md)
-- =====================================================
