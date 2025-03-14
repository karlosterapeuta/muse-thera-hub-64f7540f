
export type UserRole = {
  role: 'admin' | 'professional'
}

export type Profile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  status: string;
  user_roles: UserRole[];
}

export type StatusLog = {
  id: string;
  user_id: string;
  changed_by: string;
  previous_status: string;
  new_status: string;
  created_at: string;
  changer_name?: string;
}

declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    rpc<T = any>(
      fn: 'force_user_logout' | 'generate_invite_code' | 'has_role' | 'update_user_status' | 'validate_and_use_invite_code',
      params?: object,
      options?: object
    ): { data: T; error: Error | null };
  }
}
