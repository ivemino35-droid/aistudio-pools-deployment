
-- Enable RLS (Row Level Security)
-- SQL Schema for VanityVault (Supabase/PostgreSQL)

-- Function to validate trust scores (RPC simulation)
CREATE OR REPLACE FUNCTION validate_trust_scores(member_emails TEXT[])
RETURNS TABLE(email TEXT, score INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT u.email, t.score
  FROM users u
  JOIN trust_metrics t ON u.id = t.user_id
  WHERE u.email = ANY(member_emails);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Table for Pool Constitutions (The templates or specific instances)
CREATE TABLE pool_constitutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pool_id UUID REFERENCES pools(id) ON DELETE CASCADE,
  template_version VARCHAR(20) NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Member Signatures/Agreements
CREATE TABLE member_signatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pool_id UUID REFERENCES pools(id),
  user_id UUID REFERENCES users(id),
  constitution_id UUID REFERENCES pool_constitutions(id),
  ip_address INET,
  signed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_legal_name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(pool_id, user_id)
);

-- Table for Trust Metrics (calculated periodically)
CREATE TABLE trust_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  score INTEGER CHECK (score >= 0 AND score <= 1000),
  on_time_rate NUMERIC(5,2),
  defaults_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing for performance
CREATE INDEX idx_signatures_user ON member_signatures(user_id);
CREATE INDEX idx_signatures_pool ON member_signatures(pool_id);
