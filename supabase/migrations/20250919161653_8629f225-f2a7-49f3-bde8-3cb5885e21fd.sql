-- Add expires_at column to profiles table for access limits
ALTER TABLE public.profiles 
ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add an index for better performance when checking expired users
CREATE INDEX idx_profiles_expires_at ON public.profiles(expires_at);

-- Create a function to check if a user's access has expired
CREATE OR REPLACE FUNCTION public.is_user_access_expired(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id
      AND expires_at IS NOT NULL
      AND expires_at < NOW()
  );
$$;