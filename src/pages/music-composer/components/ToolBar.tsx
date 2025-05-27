
import React from "react";
import { Button } from "@/components/ui/button";

interface ToolBarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  selectedDuration: string;
  onDurationSelect: (duration: string) => void;
}

const ToolBar: React.FC<ToolBarProps> = ({
  selectedTool,
  onToolSelect,
  selectedDuration,
  onDurationSelect
}) => {
  const tools = [
    { id: "select", label: "1", title: "Selecionar" },
    { id: "note", label: "2", title: "Adicionar Nota" },
    { id: "erase", label: "X", title: "Apagar" }
  ];

  const durations = [
    { id: "whole", symbol: "𝅝", title: "Semibreve" },
    { id: "half", symbol: "𝅗𝅥", title: "Mínima" },
    { id: "quarter", symbol: "𝅘𝅥", title: "Semínima" },
    { id: "eighth", symbol: "𝅘𝅥𝅮", title: "Colcheia" },
    { id: "sixteenth", symbol: "𝅘𝅥𝅯", title: "Semicolcheia" }
  ];

  const shapes = [
    { id: "triangle", symbol: "△", title: "Triângulo" },
    { id: "square", symbol: "□", title: "Quadrado" }
  ];

  return (
    <div className="flex items-center space-x-2">
      {/* Tools */}
      <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={selectedTool === tool.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onToolSelect(tool.id)}
            className={`w-8 h-8 p-0 text-sm font-bold ${
              selectedTool === tool.id 
                ? "bg-orange-500 text-white" 
                : "text-white hover:bg-gray-600"
            }`}
            title={tool.title}
          >
            {tool.label}
          </Button>
        ))}
      </div>

      {/* Shapes */}
      <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
        {shapes.map((shape) => (
          <Button
            key={shape.id}
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 text-white hover:bg-gray-600"
            title={shape.title}
          >
            {shape.symbol}
          </Button>
        ))}
      </div>

      {/* Note Durations */}
      <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
        {durations.map((duration) => (
          <Button
            key={duration.id}
            variant={selectedDuration === duration.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onDurationSelect(duration.id)}
            className={`w-8 h-8 p-0 text-lg ${
              selectedDuration === duration.id 
                ? "bg-green-500 text-white" 
                : "text-white hover:bg-gray-600"
            }`}
            title={duration.title}
          >
            {duration.symbol}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ToolBar;
