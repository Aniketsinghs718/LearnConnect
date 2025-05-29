import React from "react";
import { BookOpen, ChevronDown } from "lucide-react";

interface TopicHeaderProps {
  title: string;
  description: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const TopicHeader: React.FC<TopicHeaderProps> = ({
  title,
  description,
  isOpen,
  onToggle,
}) => {
  return (
    <div
      onClick={onToggle}
      className="p-4 cursor-pointer bg-gray-600/50 hover:bg-gray-600/70 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-600 rounded-lg">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h4 className="text-sm text-white font-bold">{title}</h4>
            <ChevronDown
              className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          <p className="text-sm text-gray-300 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};
