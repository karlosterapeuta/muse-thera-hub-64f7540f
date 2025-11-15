-- Create user_activity_logs table for tracking user activities
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'login', 'logout', 'page_view'
  activity_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX idx_user_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_created_at ON public.user_activity_logs(created_at DESC);
CREATE INDEX idx_user_activity_logs_activity_type ON public.user_activity_logs(activity_type);

-- RLS Policies
CREATE POLICY "Users can view their own activity logs"
ON public.user_activity_logs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity logs"
ON public.user_activity_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'::public.app_role
  )
);

CREATE POLICY "System can insert activity logs"
ON public.user_activity_logs
FOR INSERT
WITH CHECK (true);

-- Create function to update user expires_at
CREATE OR REPLACE FUNCTION public.update_user_expiration(
  target_user_id UUID,
  new_expires_at TIMESTAMP WITH TIME ZONE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  -- Check if current user is admin
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  ) INTO is_admin;
  
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Only administrators can update user expiration';
  END IF;
  
  -- Update expiration date
  UPDATE profiles 
  SET expires_at = new_expires_at,
      updated_at = NOW()
  WHERE id = target_user_id;
  
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in update_user_expiration for user %: %', target_user_id, SQLERRM;
  RETURN FALSE;
END;
$$;