-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Core Identity)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Pools Table (The Circles)
CREATE TABLE IF NOT EXISTS pools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  contribution_amount NUMERIC NOT NULL,
  members TEXT[] DEFAULT '{}', -- Array of member emails
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Trust Metrics (Reputation Data)
CREATE TABLE IF NOT EXISTS trust_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER CHECK (score >= 0 AND score <= 1000),
  on_time_rate NUMERIC(5,2),
  defaults_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Pool Constitutions (Legal Accords)
CREATE TABLE IF NOT EXISTS pool_constitutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pool_id UUID REFERENCES pools(id) ON DELETE CASCADE,
  constitution_text TEXT NOT NULL,
  signer_name TEXT,
  trust_data JSONB,
  signature_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Member Signatures (Governance Participation)
CREATE TABLE IF NOT EXISTS member_signatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pool_id UUID REFERENCES pools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  constitution_id UUID REFERENCES pool_constitutions(id) ON DELETE CASCADE,
  ip_address INET,
  signed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_legal_name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(pool_id, user_id)
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_signatures_user ON member_signatures(user_id);
CREATE INDEX IF NOT EXISTS idx_signatures_pool ON member_signatures(pool_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_constitutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_signatures ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies (Fixes 'rls_enabled_no_policy' linter warnings)

-- Users: Authenticated users can read their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Pools: Members can view pools they belong to
CREATE POLICY "Members can view their pools" ON pools
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' = ANY(members));

CREATE POLICY "Authenticated users can create pools" ON pools
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Trust Metrics: Users can view their own score
CREATE POLICY "Users can view own metrics" ON trust_metrics
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Pool Constitutions: Members can read constitutions of their pools
CREATE POLICY "Members can read constitutions" ON pool_constitutions
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM pools 
    WHERE pools.id = pool_constitutions.pool_id 
    AND auth.jwt() ->> 'email' = ANY(pools.members)
  ));

-- Member Signatures: Users can see and create their own signatures
CREATE POLICY "Users can view own signatures" ON member_signatures
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can sign constitutions" ON member_signatures
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 7. Functions (Fixes 'mutable search_path' warning)
CREATE OR REPLACE FUNCTION validate_trust_scores(member_emails TEXT[])
RETURNS TABLE(email TEXT, score INTEGER) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT u.email, t.score
  FROM users u
  JOIN trust_metrics t ON u.id = t.user_id
  WHERE u.email = ANY(member_emails);
END;
$$;