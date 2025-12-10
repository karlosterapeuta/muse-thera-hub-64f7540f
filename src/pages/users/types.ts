
export type UserRole = {
  role: 'admin' | 'professional'
}

export type Profile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  status: string;
  expires_at: string | null;
  user_roles: UserRole[];
  email?: string;
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

export type ActivityLog = {
  id: string;
  user_id: string;
  activity_type: 'login' | 'logout' | 'page_view';
  activity_data: any;
  created_at: string;
}

export type UserActivityStats = {
  lastLogin: string | null;
  monthlyLogins: number;
  topPages: { page: string; count: number }[];
}

declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    rpc<T = any>(
      fn: 'force_user_logout' | 'generate_invite_code' | 'has_role' | 'update_user_status' | 'update_user_expiration' | 'validate_and_use_invite_code',
      params?: object,
      options?: object
    ): { data: T; error: Error | null };
  }
}
