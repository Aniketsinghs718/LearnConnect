import { useState, useEffect } from "react";

interface ProgressData {
  completeVideos: Record<string, boolean>;
}

interface UseVideoProgressProps {
  subjectName: string;
  moduleKey: string;
  topicKey: string;
  videoKey: string;
}

export const useVideoProgress = ({
  subjectName,
  moduleKey,
  topicKey,
  videoKey,
}: UseVideoProgressProps) => {
  const [progressData, setProgressData] = useState<ProgressData>({ completeVideos: {} });

  useEffect(() => {
    const loadProgress = () => {
      if (typeof window === "undefined") {
        return;
      }
      
      const storedProgress = localStorage.getItem(subjectName + "-progress");
      const data = storedProgress ? JSON.parse(storedProgress) : { completeVideos: {} };
      setProgressData(data);
    };

    // Load initial data
    loadProgress();

    // Listen for storage changes (when localStorage is updated from other components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === subjectName + "-progress") {
        loadProgress();
      }
    };

    // Listen for custom storage events (for same-tab updates)
    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === subjectName + "-progress") {
        loadProgress();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdate' as any, handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdate' as any, handleCustomStorageChange);
    };
  }, [subjectName]);

  const key = `${subjectName}-module${moduleKey}-topic${topicKey}-video${videoKey}`;
  const isCompleted = progressData.completeVideos[key] === true;

  return {
    isCompleted,
    progressKey: key,
  };
};
