import React from "react";

interface VideoEmbedProps {
  url: string;
  title: string;
  videoRef: (el: HTMLIFrameElement | null) => void;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({
  url,
  title,
  videoRef,
}) => {
  return (
    <div className="aspect-video w-full h-full flex-1">
      <iframe
        ref={videoRef}
        width="100%"
        height="100%"
        src={`${url}?autoplay=1&enablejsapi=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-xl w-full h-full min-h-[300px]"
        style={{ minHeight: 300 }}
      />
    </div>
  );
};
