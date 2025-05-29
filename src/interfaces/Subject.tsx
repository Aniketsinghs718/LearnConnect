import { LucideIcon } from 'lucide-react';

export interface Video {
  title: string;
  url?: string;
  completed?: boolean;
}

export interface Note {
  title: string;
  url: string;
}

export interface NotesLink {
  title: string;
  url: string;
}
export interface Module {
  [key: number]: {
    notesLink: NotesLink[];
    topics: Topic[];
  };
}

export interface Topic {
  title: string;
  description: string;
  videos?: Video[];
  notes?: Note[];
}

export interface Subject {
  name: string
  icon: LucideIcon
  color: string
  modules: Module
}

export interface Subjects {
  [key: string]: Subject
}

