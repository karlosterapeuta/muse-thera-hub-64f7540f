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
}
