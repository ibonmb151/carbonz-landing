-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL DEFAULT 'percentage', -- 'percentage' or 'fixed'
  value INTEGER NOT NULL, -- percentage (1-100) or cents
  min_order INTEGER DEFAULT 0, -- minimum order in cents
  max_uses INTEGER DEFAULT 0, -- 0 = unlimited
  used_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backups log
CREATE TABLE IF NOT EXISTS backups (
  id SERIAL PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'success',
  records_count INTEGER,
  file_size TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
