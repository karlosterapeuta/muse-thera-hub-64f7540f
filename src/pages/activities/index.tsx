
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ListChecks, Plus, Trash } from "lucide-react";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<{ id: number; text: string; completed: boolean }[]>([
    { id: 1, text: "Preparar material para sessão de grupo", completed: false },
    { id: 2, text: "Revisar avaliações de pacientes", completed: true },
    { id: 3, text: "Organizar instrumentos musicais", completed: false },
  ]);
  
  const [newActivity, setNewActivity] = useState("");

  const handleAddActivity = () => {
    if (newActivity.trim()) {
      setActivities([
        ...activities, 
        { 
          id: Date.now(), 
          text: newActivity, 
          completed: false 
        }
      ]);
      setNewActivity("");
    }
  };

  const toggleComplete = (id: number) => {
    setActivities(
      activities.map(activity => 
        activity.id === id 
          ? { ...activity, completed: !activity.completed } 
          : activity
      )
    );
  };

  const deleteActivity = (id: number) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <ListChecks className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Atividades</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Nova Atividade</CardTitle>
          <CardDescription>Adicione uma nova atividade à sua lista</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Digite a atividade..."
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddActivity();
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleAddActivity}>
              <Plus className="h-4 w-4 mr-2" /> Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {activities.map((activity) => (
          <Card key={activity.id} className={activity.completed ? "bg-gray-50" : ""}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id={`activity-${activity.id}`} 
                  checked={activity.completed}
                  onCheckedChange={() => toggleComplete(activity.id)}
                />
                <Label 
                  htmlFor={`activity-${activity.id}`}
                  className={`${activity.completed ? "line-through text-gray-500" : ""}`}
                >
                  {activity.text}
                </Label>
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteActivity(activity.id)}>
                <Trash className="h-4 w-4 text-gray-500" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma atividade cadastrada. Adicione uma nova atividade acima.</p>
        </div>
      )}
    </div>
  );
}
