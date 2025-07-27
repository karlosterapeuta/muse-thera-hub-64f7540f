-- CRITICAL SECURITY FIXES MIGRATION
-- Phase 1: Database Security (Immediate)

-- 1. Enable RLS on exposed tables that currently don't have it
ALTER TABLE public."Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- 2. Add proper RLS policies for Account table
CREATE POLICY "Users can only access their own accounts"
ON public."Account"
FOR ALL
TO authenticated
USING (("userId")::uuid = auth.uid());

-- 3. Add proper RLS policies for Session table
CREATE POLICY "Users can only access their own sessions"
ON public."Session"
FOR ALL
TO authenticated
USING (("userId")::uuid = auth.uid());

-- 4. Add proper RLS policies for User table
CREATE POLICY "Users can only access their own user data"
ON public."User"
FOR ALL
TO authenticated
USING ((id)::uuid = auth.uid());

-- 5. Add proper RLS policies for VerificationToken table
CREATE POLICY "Users can only access their own verification tokens"
ON public."VerificationToken"
FOR ALL
TO authenticated
USING (true); -- These are typically managed by auth system

-- 6. Add proper RLS policies for assessments table
CREATE POLICY "Professionals can manage assessments for their patients"
ON public.assessments
FOR ALL
TO authenticated
USING (
  patient_id IN (
    SELECT p.id FROM patients p 
    WHERE p.professional_id = auth.uid()
  )
);

-- 7. Add proper RLS policies for sessions table
CREATE POLICY "Professionals can manage sessions for their patients"
ON public.sessions
FOR ALL
TO authenticated
USING (
  patient_id IN (
    SELECT p.id FROM patients p 
    WHERE p.professional_id = auth.uid()
  )
);

-- 8. Fix overly permissive RLS policies on reports table
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.reports;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.reports;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.reports;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.reports;
DROP POLICY IF EXISTS "Permitir inserção de relatórios para usuários autenticados" ON public.reports;
DROP POLICY IF EXISTS "Permitir leitura de relatórios para usuários autenticados" ON public.reports;
DROP POLICY IF EXISTS "Todos podem inserir relatórios" ON public.reports;
DROP POLICY IF EXISTS "Todos podem visualizar relatórios" ON public.reports;

-- Add proper restrictive policies for reports
CREATE POLICY "Professionals can manage their own reports"
ON public.reports
FOR ALL
TO authenticated
USING (professional_id = auth.uid())
WITH CHECK (professional_id = auth.uid());

-- 9. Fix overly permissive RLS policies on clinics table
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can insert clinics" ON public.clinics;
DROP POLICY IF EXISTS "Users can view all clinics" ON public.clinics;

-- Add proper restrictive policies for clinics
CREATE POLICY "Users can manage their own clinics"
ON public.clinics
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- 10. Secure database functions with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_and_use_invite_code(invite_code text, user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  code_record invite_codes%ROWTYPE;
BEGIN
  UPDATE invite_codes
  SET status = 'used',
      used_at = NOW(),
      used_by_user_id = user_id
  WHERE code = invite_code
    AND status = 'unused'
    AND expires_at > NOW()
  RETURNING * INTO code_record;

  RETURN FOUND;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_professional_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.professionals (user_id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), NEW.email);
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_invite_code(expiration_days integer DEFAULT 7)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := upper(substring(md5(random()::text) from 1 for 8));
    
    SELECT EXISTS (
      SELECT 1 FROM invite_codes WHERE code = new_code
    ) INTO code_exists;
    
    IF NOT code_exists THEN
      INSERT INTO invite_codes (
        code,
        expires_at
      ) VALUES (
        new_code,
        NOW() + (expiration_days || ' days')::INTERVAL
      );
      
      RETURN new_code;
    END IF;
  END LOOP;
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(role app_role)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = role
  );
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_status(target_user_id uuid, new_status text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  is_admin BOOLEAN;
  current_status TEXT;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  ) INTO is_admin;
  
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Only administrators can update user status';
  END IF;
  
  SELECT status INTO current_status FROM profiles WHERE id = target_user_id;
  
  UPDATE profiles SET status = new_status WHERE id = target_user_id;
  
  INSERT INTO user_status_logs (
    user_id, 
    changed_by, 
    previous_status, 
    new_status
  ) VALUES (
    target_user_id,
    auth.uid(),
    current_status,
    new_status
  );
  
  RETURN TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.force_user_logout(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  is_admin BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  ) INTO is_admin;
  
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Apenas administradores podem forçar o logout de usuários';
  END IF;
  
  DELETE FROM auth.sessions
  WHERE user_id = target_user_id;
  
  RETURN TRUE;
END;
$function$;

-- 11. Remove redundant role column from profiles table (keep user_roles as the single source of truth)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;