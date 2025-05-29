import React from "react";
import { X } from "lucide-react";
import { VideoEmbed } from "./VideoEmbed";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: { title: string; url?: string };
  modalRef: React.RefObject<HTMLDivElement | null>;
  videoRef: (el: HTMLIFrameElement | null) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  video,
  modalRef,
  videoRef,
}) => {
  if (!isOpen) return null;

  const hasValidUrl = video.url && video.url !== "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center modal-overlay animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className={`relative bg-base-100 rounded-2xl shadow-2xl p-2 md:p-4 animate-scale-in w-[95vw] max-w-3xl max-h-[90vh] ${
          hasValidUrl ? "flex flex-col" : ""
        }`}
        style={{ boxShadow: "0 0 0 4px var(--color-accent)" }}
      >
        <button
          aria-label={hasValidUrl ? "Close video" : "Close"}
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition"
        >
          <X className="w-6 h-6" />
        </button>

        {hasValidUrl ? (
          <>
            <VideoEmbed
              url={video.url!}
              title={video.title}
              videoRef={videoRef}
            />
            <div className="mt-2 text-center text-base-content font-semibold text-lg">
              {video.title}
            </div>
          </>
        ) : (
          <div className="text-base-content text-center p-4">
            We couldn&apos;t find a video for this topic. Please check the notes.
          </div>
        )}
      </div>
    </div>
  );
};
