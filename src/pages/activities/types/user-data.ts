import { Activity } from '../types';

export interface UserActivityData {
  userId: string;
  favorites: string[]; // activity IDs
  completed: ActivityCompletion[];
  ratings: ActivityRating[];
  recentlyViewed: string[]; // activity IDs
  personalNotes: PersonalNote[];
}

export interface ActivityCompletion {
  activityId: string;
  completedAt: string;
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  notes?: string;
  rating?: number; // 1-5
}

export interface ActivityRating {
  activityId: string;
  rating: number; // 1-5
  review?: string;
  ratedAt: string;
}

export interface PersonalNote {
  activityId: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface MultimediaResource {
  id: string;
  type: 'audio' | 'video' | 'image' | 'document';
  title: string;
  url: string;
  thumbnail?: string;
  duration?: number; // for audio/video
  category: 'instrument' | 'nature' | 'ambient' | 'therapy' | 'voice' | 'effect';
  tags: string[];
  description?: string;
}

export interface PlaylistItem {
  id: string;
  resourceId: string;
  order: number;
  startTime?: number;
  endTime?: number;
  volume?: number;
}

export interface TherapyPlaylist {
  id: string;
  name: string;
  description?: string;
  items: PlaylistItem[];
  createdAt: string;
  isPublic: boolean;
  category: string;
  tags: string[];
}