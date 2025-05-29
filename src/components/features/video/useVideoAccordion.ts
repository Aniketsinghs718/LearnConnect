import { useState, useRef, useEffect } from "react";

interface UseVideoAccordionProps {
  videos: { title: string; url?: string }[];
}

export const useVideoAccordion = ({ videos }: UseVideoAccordionProps) => {
  const [openVideoIndex, setOpenVideoIndex] = useState<number | null>(null);
  const [checked, setChecked] = useState<boolean[]>(videos.map(() => false));
  const videoRefs = useRef<(HTMLIFrameElement | null)[]>([]);

  // Reset checked state when videos change
  useEffect(() => {
    setChecked(videos.map(() => false));
  }, [videos]);

  const toggleVideo = (index: number) => {
    // Stop the currently playing video if any
    if (openVideoIndex !== null && videoRefs.current[openVideoIndex]) {
      videoRefs.current[openVideoIndex]?.contentWindow?.postMessage(
        '{"event":"command","func":"stopVideo","args":""}',
        "*"
      );
    }
    setOpenVideoIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const updateCheckedState = (index: number, value: boolean | ((prev: boolean) => boolean)) => {
    const newChecked = [...checked];
    newChecked[index] = typeof value === "function" ? value(newChecked[index]) : value;
    setChecked(newChecked);
  };

  return {
    openVideoIndex,
    checked,
    videoRefs,
    toggleVideo,
    updateCheckedState,
  };
};
