import React from "react";
import Video from "../../Video";

interface VideoItemProps {
  video: { title: string; url?: string };
  index: number;
  checked: boolean;
  onCheckedChange: (value: boolean | ((prev: boolean) => boolean)) => void;
  toggleVideo: (index: number) => void;
  openVideoIndex: number | null;
  videoRefs: React.RefObject<(HTMLIFrameElement | null)[]>;
  videoKey: string;
  updateVideoProgress: (
    moduleIndex: string,
    videoIndex: string,
    topicName: string
  ) => void;
  moduleKey: string;
  topicKey: string;
  subjectName: string;
}

export const VideoItem: React.FC<VideoItemProps> = ({
  video,
  index,
  checked,
  onCheckedChange,
  toggleVideo,
  openVideoIndex,
  videoRefs,
  videoKey,
  updateVideoProgress,
  moduleKey,
  topicKey,
  subjectName,
}) => {
  return (
    <div className="rounded-lg justify-center overflow-hidden bg-base-300 hover:bg-base-200 p-2 w-full flex flex-col">
      <Video
        checked={checked}
        setChecked={onCheckedChange}
        toggleVideo={toggleVideo}
        openVideoIndex={openVideoIndex}
        index={index}
        video={video}
        videoRefs={videoRefs}
        videoKey={videoKey}
        updateVideoProgress={updateVideoProgress}
        moduleKey={moduleKey}
        topicKey={topicKey}
        subjectName={subjectName}
      />
    </div>
  );
};
