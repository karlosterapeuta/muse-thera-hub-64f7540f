
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Star, 
  Gift, 
  Trophy, 
  Award,
  Rocket
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { Reward, UserProgress } from "./types";

interface RewardSystemProps {
  rewards: Reward[];
  userProgress: UserProgress;
  onClaimReward?: (rewardId: string) => void;
}

export default function RewardSystem({ 
  rewards, 
  userProgress, 
  onClaimReward 
}: RewardSystemProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const { width, height } = useWindowSize();
  
  const unlockedRewards = rewards.filter(reward => 
    userProgress.totalPoints >= reward.requiredPoints
  );
  
  const nextReward = rewards.find(reward => 
    !userProgress.unlockedRewards.includes(reward.id) && 
    userProgress.totalPoints < reward.requiredPoints
  );
  
  const progressPercentage = nextReward 
    ? (userProgress.totalPoints / nextReward.requiredPoints) * 100
    : 100;
  
  const handleClaimReward = (reward: Reward) => {
    setSelectedReward(reward);
    setShowConfetti(true);
    
    if (onClaimReward) {
      onClaimReward(reward.id);
    }
    
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };
  
  const closeRewardDialog = () => {
    setSelectedReward(null);
  };
  
  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-100 rounded-xl shadow-lg p-6">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />}
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-amber-800 flex items-center">
          <Trophy className="mr-2 text-yellow-500" /> Mini-Mundo da Fala
        </h3>
        
        <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-sm">
          <Star className="text-yellow-500" size={18} />
          <span className="font-bold text-amber-700">{userProgress.totalPoints} pontos</span>
        </div>
      </div>
      
      {nextReward ? (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-amber-700">Progresso para próxima recompensa:</span>
            <span className="text-sm font-medium text-amber-700">
              {userProgress.totalPoints} / {nextReward.requiredPoints}
            </span>
          </div>
          
          <Progress value={progressPercentage} className="h-3" />
          
          <div className="mt-2 flex items-center">
            <Rocket size={16} className="text-amber-600 mr-2" />
            <span className="text-sm text-amber-700">
              Próxima recompensa: <span className="font-medium">{nextReward.name}</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-200 text-amber-800 p-3 rounded-lg mb-6 text-center">
          <Trophy className="inline-block mr-2 text-amber-600" />
          Você desbloqueou todas as recompensas!
        </div>
      )}
      
      <h4 className="text-lg font-semibold text-amber-800 mb-3">
        <Gift className="inline-block mr-2 text-amber-600" /> Minhas Recompensas
      </h4>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {rewards.map((reward) => {
          const isUnlocked = userProgress.totalPoints >= reward.requiredPoints;
          
          return (
            <div 
              key={reward.id}
              className={`relative border rounded-lg p-3 text-center transition-all ${
                isUnlocked 
                  ? 'bg-white border-yellow-300 shadow-md' 
                  : 'bg-muted border-border opacity-70'
              }`}
            >
              <div className="h-20 flex items-center justify-center mb-2">
                {isUnlocked ? (
                  <img 
                    src={reward.imageUrl} 
                    alt={reward.name}
                    className="max-h-full max-w-full object-contain" 
                  />
                ) : (
                  <div className="bg-muted rounded-full w-12 h-12 flex items-center justify-center">
                    <Award size={24} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <h5 className={`text-sm font-medium mb-1 ${isUnlocked ? 'text-amber-700' : 'text-muted-foreground'}`}>
                {reward.name}
              </h5>
              
              {isUnlocked ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                  onClick={() => handleClaimReward(reward)}
                >
                  Ver Recompensa
                </Button>
              ) : (
                <div className="text-xs text-muted-foreground">
                  Faltam {reward.requiredPoints - userProgress.totalPoints} pontos
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="text-center pt-3 border-t border-amber-200">
        <p className="text-sm text-amber-700">
          Continue falando e participando das atividades para ganhar pontos!
        </p>
      </div>
      
      <Dialog open={!!selectedReward} onOpenChange={() => setSelectedReward(null)}>
        <DialogContent className="bg-gradient-to-b from-amber-50 to-white">
          <DialogHeader>
            <DialogTitle className="text-center text-amber-800">
              <Award className="inline-block mr-2 text-yellow-500" /> 
              {selectedReward?.name}
            </DialogTitle>
            <DialogDescription className="text-center text-amber-700">
              Parabéns! Você desbloqueou esta recompensa!
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center py-6">
            <div className="relative w-40 h-40">
              {selectedReward && (
                <img 
                  src={selectedReward.imageUrl}
                  alt={selectedReward.name}
                  className="w-full h-full object-contain" 
                />
              )}
              
              <div className="absolute -top-4 -right-4">
                <Star size={32} className="text-yellow-500 drop-shadow-md" />
              </div>
            </div>
          </div>
          
          <div className="bg-amber-100 p-4 rounded-lg text-center text-amber-800 mb-4">
            <p>Continue falando e participando para desbloquear mais recompensas!</p>
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={closeRewardDialog}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              Continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
