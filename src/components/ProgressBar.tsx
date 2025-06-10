import React from "react";

interface ProgressBarProps {
  total: number;
  completed: number;
}

export default function ProgressBar({ total, completed }: ProgressBarProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden shadow-inner">
      <div
        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500 rounded-full shadow-sm"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
