import React from "react";
import ProgressBar from "../../ProgressBar";
import { TopicHeader } from "./TopicHeader";
import { TopicContent } from "./TopicContent";
import { useTopicProgress } from "./useTopicProgress";
import { Topic } from "./types";

interface TopicItemProps {
  topic: Topic;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  moduleKey: string;
  subjectName: string;
  updateVideoProgress: (
    moduleIndex: string,
    videoIndex: string,
    topicName: string
  ) => void;
}

export const TopicItem: React.FC<TopicItemProps> = ({
  topic,
  index,
  isOpen,
  onToggle,
  moduleKey,
  subjectName,
  updateVideoProgress,
}) => {
  const { completedTopics } = useTopicProgress({
    subjectName,
    moduleKey,
    topicTitle: topic.title,
  });

  const topicKey = topic.title.replace(/\s/g, "");

  return (
    <div
      key={index}
      className="bg-gray-700/80 rounded-xl border border-gray-600 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200"
    >
      <ProgressBar
        total={topic.videos?.length ?? 0}
        completed={completedTopics}
      />
      <TopicHeader
        title={topic.title}
        description={topic.description}
        isOpen={isOpen}
        onToggle={onToggle}
      />
      <TopicContent
        topic={topic}
        isOpen={isOpen}
        topicKey={topicKey}
        moduleKey={moduleKey}
        updateVideoProgress={updateVideoProgress}
        subjectName={subjectName}
      />
    </div>
  );
};
