export interface Topic {
  title: string;
  description: string;
  videos?: {
    title: string;
    url?: string;
  }[];
  notes?: {
    title: string;
    url: string;
  }[];
}

export interface NotesLink {
  title: string;
  url: string;
}

export interface ProgressData {
  completeVideos: Record<string, boolean>;
  topicProgress: Record<string, number>;
}
