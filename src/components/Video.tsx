"use client";
import React from "react";
import {
  useVideoProgress,
  useVideoModal,
  VideoProgressCheckbox,
  VideoTrigger,
  VideoModal,
} from "./features/video";

interface VideoProps {
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  toggleVideo: (index: number) => void;
  openVideoIndex: number | null;
  index: number;
  video: { title: string; url?: string };
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

function Video({
  toggleVideo,
  openVideoIndex,
  index,
  video,
  videoRefs,
  videoKey,
  updateVideoProgress,
  moduleKey,
  topicKey,
  subjectName,
  checked,
  setChecked,
}: VideoProps) {
  const { isCompleted } = useVideoProgress({
    subjectName,
    moduleKey,
    topicKey,
    videoKey,
  });

  const { showModal, modalRef, openModal, closeModal } = useVideoModal();

  const handleProgressToggle = () => {
    updateVideoProgress(moduleKey, videoKey, topicKey);
  };

  const handleVideoRef = (el: HTMLIFrameElement | null) => {
    videoRefs.current[index] = el;
  };

  return (
    <>
      <div className="flex items-center gap-3 hover:bg-gray-600/30 p-2 rounded-lg transition-colors">
        <VideoProgressCheckbox
          isCompleted={isCompleted}
          onToggle={handleProgressToggle}
        />
        <VideoTrigger title={video.title} onClick={openModal} />
      </div>

      <VideoModal
        isOpen={showModal}
        onClose={closeModal}
        video={video}
        modalRef={modalRef}
        videoRef={handleVideoRef}
      />
    </>
  );
}

export default Video;
