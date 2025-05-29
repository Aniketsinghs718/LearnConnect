import React from "react";
import { ChevronDown } from "lucide-react";

interface VideoTriggerProps {
  title: string;
  onClick: () => void;
}

export const VideoTrigger: React.FC<VideoTriggerProps> = ({
  title,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="p-2 cursor-pointer hover:bg-gray-600/30 flex justify-between items-center flex-1 gap-2 rounded-lg transition-colors"
    >
      <span className="text-sm font-medium text-white">{title}</span>
      <ChevronDown className="w-4 h-4 text-gray-300 transition-transform duration-200" />
    </div>
  );
};
