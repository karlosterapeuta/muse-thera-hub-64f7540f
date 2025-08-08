-- Simply insert admin role for the specified user
-- The user_roles table and has_role function already exist
INSERT INTO public.user_roles (user_id, role)
SELECT au.id, 'admin'::app_role
FROM auth.users au
WHERE au.email = 'musicoterapeutakarlos@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;