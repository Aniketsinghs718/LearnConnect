import { useState, useEffect } from "react";

interface UseTopicStateProps {
  topicsLength: number;
}

export const useTopicState = ({ topicsLength }: UseTopicStateProps) => {
  const [openTopicIndex, setOpenTopicIndex] = useState<number | null>(null);

  const toggleTopic = (index: number) => {
    setOpenTopicIndex(openTopicIndex === index ? null : index);
  };

  // Reset open topic when topics change
  useEffect(() => {
    setOpenTopicIndex(null);
  }, [topicsLength]);

  return {
    openTopicIndex,
    toggleTopic,
  };
};
