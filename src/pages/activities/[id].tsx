
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ActivityDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Detalhes da Atividade</h1>
        <Button variant="outline" onClick={() => navigate("/activities")}>
          Voltar para lista
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-lg mb-4">ID da Atividade: {id}</p>
          <p className="text-muted-foreground">
            Detalhes completos da atividade seriam exibidos aqui. Esta é uma página de exemplo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
