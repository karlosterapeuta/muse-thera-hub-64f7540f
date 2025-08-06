import React, { useState, useEffect } from 'react';
import { FavoritesManager } from './components/FavoritesManager';
import { enhancedActivitiesData } from './data/enhanced-activities-data';
import { UserActivityData } from './types/user-data';
import { useToast } from '@/hooks/use-toast';

export default function FavoritesPage() {
  const { toast } = useToast();
  const [userActivityData, setUserActivityData] = useState<UserActivityData>({
    userId: 'user-123', // Placeholder - would come from auth
    favorites: [],
    completed: [],
    ratings: [],
    recentlyViewed: [],
    personalNotes: []
  });

  // Get all activities
  const allActivities = Object.values(enhancedActivitiesData).flat();

  // Load user data from localStorage (in a real app, this would come from a database)
  useEffect(() => {
    const savedData = localStorage.getItem('userActivityData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setUserActivityData(parsed);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  // Save user data to localStorage (in a real app, this would save to a database)
  const handleUpdateUserData = (data: UserActivityData) => {
    setUserActivityData(data);
    localStorage.setItem('userActivityData', JSON.stringify(data));
  };

  return (
    <div className="container mx-auto py-6">
      <FavoritesManager
        activities={allActivities}
        userActivityData={userActivityData}
        onUpdateUserData={handleUpdateUserData}
      />
    </div>
  );
}