export interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  instructor_name: string | null;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  modules?: CourseModule[];
  // New marketplace fields
  creator_id?: string | null;
  price_cents?: number;
  category?: string;
  creator?: CourseCreator;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
  lessons?: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  duration_minutes: number;
  order_index: number;
  is_free_preview: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCourseProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  watch_time_seconds: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CourseWithProgress extends Course {
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  lastWatchedLessonId?: string;
  totalModules: number;
  totalDurationMinutes: number;
  hasAccess?: boolean;
}

export interface CourseCreator {
  id: string;
  email: string;
  name: string;
  phone?: string;
  pix_key: string;
  pix_key_type: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  bio?: string;
  avatar_url?: string;
  commission_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CoursePurchase {
  id: string;
  course_id: string;
  user_id: string;
  creator_id: string;
  amount_cents: number;
  creator_amount_cents: number;
  platform_amount_cents: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'expired';
  payment_method: string;
  pix_code?: string;
  pix_qr_code_url?: string;
  pix_expiration?: string;
  buyer_name?: string;
  buyer_email?: string;
  paid_at?: string;
  confirmed_by_creator_at?: string;
  created_at: string;
  updated_at: string;
  course?: Course;
}

export interface CourseAccess {
  id: string;
  course_id: string;
  user_id: string;
  purchase_id?: string;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
}

// Helper to format duration
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}min`;
}

// Helper to format price
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(cents / 100);
}
