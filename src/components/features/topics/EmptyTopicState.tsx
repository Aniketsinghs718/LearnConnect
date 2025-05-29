import React from "react";

export const EmptyTopicState: React.FC = () => {
  return (
    <div className="p-6 text-center bg-gray-700/80 rounded-xl border border-gray-600">
      <p className="text-gray-300">No topics available</p>
    </div>
  );
};
