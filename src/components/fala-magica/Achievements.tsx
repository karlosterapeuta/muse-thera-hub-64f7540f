
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Medal, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'star' | 'medal' | 'crown';
  unlocked: boolean;
}

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements = ({ achievements }: AchievementsProps) => {
  const getIcon = (icon: Achievement['icon']) => {
    switch (icon) {
      case 'trophy': return <Trophy className="text-yellow-500" />;
      case 'star': return <Star className="text-purple-500" />;
      case 'medal': return <Medal className="text-blue-500" />;
      case 'crown': return <Crown className="text-amber-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          Conquistas Mágicas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              className={`p-4 rounded-lg ${
                achievement.unlocked 
                  ? 'bg-gradient-to-r from-purple-50 to-indigo-50' 
                  : 'bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  achievement.unlocked ? 'bg-white' : 'bg-gray-100'
                }`}>
                  {getIcon(achievement.icon)}
                </div>
                <div>
                  <h4 className={`font-medium ${
                    achievement.unlocked ? 'text-purple-700' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-sm ${
                    achievement.unlocked ? 'text-purple-600' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Achievements;
