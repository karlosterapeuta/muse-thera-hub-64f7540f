-- Fix remaining critical security issues

-- 1. Enable RLS on _prisma_migrations table (required by linter)
ALTER TABLE public._prisma_migrations ENABLE ROW LEVEL SECURITY;

-- Add a restrictive policy for prisma migrations (system table)
CREATE POLICY "Only system can access migrations"
ON public._prisma_migrations
FOR ALL
TO authenticated
USING (false); -- No user should access this table directly

-- 2. Update extensions to recommended versions
-- Update uuid-ossp to latest version
ALTER EXTENSION "uuid-ossp" UPDATE;

-- Update pgcrypto to latest version if exists
ALTER EXTENSION "pgcrypto" UPDATE;