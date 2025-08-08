-- Drop the existing function first
DROP FUNCTION IF EXISTS public.has_role(app_role);

-- Ensure the app_role enum exists (it already exists based on the configuration)
-- The enum is already created, so we don't need to recreate it

-- Insert admin role for the specified user
INSERT INTO public.user_roles (user_id, role)
SELECT au.id, 'admin'::app_role
FROM auth.users au
WHERE au.email = 'musicoterapeutakarlos@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Recreate the function with the correct signature
CREATE OR REPLACE FUNCTION public.has_role(_role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = _role
  )
$$;