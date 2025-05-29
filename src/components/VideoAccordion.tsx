import React from "react";
import { useVideoAccordion, VideoItem } from "./features/video";

interface VideoAccordionProps {
  videos: { title: string; url?: string }[];
  topicKey: string;
  moduleKey: string;
  updateVideoProgress: (
    moduleIndex: string,
    videoIndex: string,
    topicName: string
  ) => void;
  subjectName: string;
}

const VideoAccordion: React.FC<VideoAccordionProps> = ({
  videos,
  topicKey,
  updateVideoProgress,
  moduleKey,
  subjectName,
}) => {
  const {
    openVideoIndex,
    checked,
    videoRefs,
    toggleVideo,
    updateCheckedState,
  } = useVideoAccordion({ videos });

  return (
    <div className="space-y-3 pl-2">
      {videos.map((video, index) => (
        <VideoItem
          key={index}
          video={video}
          index={index}
          checked={checked[index]}
          onCheckedChange={(value) => updateCheckedState(index, value)}
          toggleVideo={toggleVideo}
          openVideoIndex={openVideoIndex}
          videoRefs={videoRefs}
          videoKey={video.title.replace(/\s/g, "")}
          updateVideoProgress={updateVideoProgress}
          moduleKey={moduleKey}
          topicKey={topicKey}
          subjectName={subjectName}
        />
      ))}
    </div>
  );
};

export default VideoAccordion;
