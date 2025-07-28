-- Fix RLS issues for tables that have policies but RLS disabled

-- Enable RLS for Account table (has policies but RLS disabled)
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;

-- Enable RLS for Session table (has policies but RLS disabled)  
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;

-- Enable RLS for User table (has policies but RLS disabled)
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Enable RLS for VerificationToken table (has policies but RLS disabled)
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;

-- Enable RLS for _prisma_migrations table (has policies but RLS disabled)
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;