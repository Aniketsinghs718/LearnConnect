import React from "react";
import { BookOpen } from "lucide-react";
import VideoAccordion from "../../VideoAccordion";
import { Topic } from "./types";

interface TopicContentProps {
  topic: Topic;
  isOpen: boolean;
  topicKey: string;
  moduleKey: string;
  updateVideoProgress: (
    moduleIndex: string,
    videoIndex: string,
    topicName: string
  ) => void;
  subjectName: string;
}

export const TopicContent: React.FC<TopicContentProps> = ({
  topic,
  isOpen,
  topicKey,
  moduleKey,
  updateVideoProgress,
  subjectName,
}) => {
  return (
    <div
      className={`overflow-hidden transition-all duration-200 ease-in-out ${
        isOpen ? "opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="p-4 pt-0">
        {/* Videos Section */}
        {topic.videos && topic.videos.length > 0 ? (
          <div className="mt-4 border-t border-gray-600 pt-4">
            <h5 className="text-sm font-semibold text-white mb-3">
              Lecture Videos
            </h5>
            <VideoAccordion
              videos={topic.videos}
              topicKey={topicKey}
              moduleKey={moduleKey}
              updateVideoProgress={updateVideoProgress}
              subjectName={subjectName}
            />
          </div>
        ) : (
          <div className="mt-4 border-t border-gray-600 pt-4">
            <h5 className="text-sm font-semibold text-amber-400 mb-2">
              No videos available, We will update soon, Till then refer the notes
            </h5>
          </div>
        )}

        {/* Notes Section */}
        {topic.notes && topic.notes.length > 0 && (
          <div className="mt-4 border-t border-gray-600 pt-4">
            <h5 className="text-sm font-semibold text-white mb-3">
              Study Materials
            </h5>
            <div className="flex flex-wrap gap-3">
              {topic.notes.map((note, noteIndex) => (
                <a
                  key={noteIndex}
                  href={note.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-sm font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl border border-emerald-500"
                >
                  <BookOpen className="w-4 h-4" />
                  {note.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
