import React from "react";
import { CheckSquare, Square } from "lucide-react";

interface VideoProgressCheckboxProps {
  isCompleted: boolean;
  onToggle: () => void;
}

export const VideoProgressCheckbox: React.FC<VideoProgressCheckboxProps> = ({
  isCompleted,
  onToggle,
}) => {
  return (
    <button onClick={onToggle} className="w-6 h-6 hover:scale-110 transition-transform">
      {isCompleted ? (
        <CheckSquare className="text-green-500" />
      ) : (
        <Square className="text-gray-400" />
      )}
    </button>
  );
};
