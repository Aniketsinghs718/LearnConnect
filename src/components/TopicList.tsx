import React from "react";
import {
  useTopicState,
  StudyMaterialsSection,
  EmptyTopicState,
  TopicItem,
  Topic,
  NotesLink,
} from "./features/topics";
import { useNotesLinks } from "@/hooks/useGoogleSheets";

interface TopicListProps {
  topics: Topic[];
  moduleNumber: number;
  updateVideoProgress: (
    moduleIndex: string,
    videoIndex: string,
    topicName: string
  ) => void;
  moduleKey: string;
  subjectName: string;
  year: string;
  branch: string;
  semester: string;
}

const TopicList: React.FC<TopicListProps> = ({
  topics,
  moduleNumber,
  updateVideoProgress,
  moduleKey,
  subjectName,
  year,
  branch,
  semester,
}) => {
  const { notesLinks, loading: notesLoading } = useNotesLinks(
    year,
    branch,
    semester,
    subjectName,
    moduleNumber
  );

  const { openTopicIndex, toggleTopic } = useTopicState({
    topicsLength: topics.length,
  });

  if (!topics || topics.length === 0) {
    return <EmptyTopicState />;
  }

  return (
    <div className="space-y-4">
      <StudyMaterialsSection
        notesLink={notesLinks}
        moduleNumber={moduleNumber}
        loading={notesLoading}
      />

      {topics.length > 0 && (
        <h5 className="text-sm font-semibold text-white">Videos</h5>
      )}

      {topics.map((topic, index) => (
        <TopicItem
          key={index}
          topic={topic}
          index={index}
          isOpen={openTopicIndex === index}
          onToggle={() => toggleTopic(index)}
          moduleKey={moduleKey}
          subjectName={subjectName}
          updateVideoProgress={updateVideoProgress}
        />
      ))}
    </div>
  );
};

export default TopicList;
