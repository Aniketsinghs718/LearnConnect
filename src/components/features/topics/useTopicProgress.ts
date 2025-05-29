import { useMemo } from "react";
import { ProgressData } from "./types";

interface UseTopicProgressProps {
  subjectName: string;
  moduleKey: string;
  topicTitle: string;
}

export const useTopicProgress = ({
  subjectName,
  moduleKey,
  topicTitle,
}: UseTopicProgressProps) => {
  const { progressData, topicKey } = useMemo(() => {
    const key = `${subjectName}-module${moduleKey}-topic${topicTitle.replace(/\s/g, "")}`;
    
    let data: ProgressData = {
      completeVideos: {},
      topicProgress: {},
    };

    if (typeof window !== "undefined") {
      const storedProgress = localStorage.getItem(subjectName + "-progress");
      if (storedProgress) {
        try {
          const parsedData = JSON.parse(storedProgress);
          data = {
            completeVideos: parsedData.completeVideos || {},
            topicProgress: parsedData.topicProgress || {},
          };
        } catch (e) {
          console.error("Error parsing progress data:", e);
        }
      }
    }

    return { progressData: data, topicKey: key };
  }, [subjectName, moduleKey, topicTitle]);

  const completedTopics = progressData.topicProgress[topicKey] || 0;

  return {
    progressData,
    topicKey,
    completedTopics,
  };
};
