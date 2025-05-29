import React from "react";
import { BookOpen } from "lucide-react";
import { NotesLink } from "./types";

interface StudyMaterialsSectionProps {
  notesLink: NotesLink[];
  moduleNumber: number;
  loading?: boolean;
}

export const StudyMaterialsSection: React.FC<StudyMaterialsSectionProps> = ({
  notesLink,
  moduleNumber,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="animate-pulse">
        <h5 className="text-sm font-semibold text-white mb-3">
          Study Materials for Module {moduleNumber}
        </h5>
        <div className="flex flex-wrap gap-3">
          <div className="h-9 bg-gray-600 rounded-lg w-32"></div>
          <div className="h-9 bg-gray-600 rounded-lg w-24"></div>
          <div className="h-9 bg-gray-600 rounded-lg w-28"></div>
        </div>
      </div>
    );
  }

  if (!notesLink || notesLink.length === 0) {
    return null;
  }

  return (
    <>
      <h5 className="text-sm font-semibold text-white">
        Study Materials for Module {moduleNumber}
      </h5>
      <div className="flex flex-wrap gap-3">
        {notesLink.map((note: NotesLink, noteIndex: number) => (
          <a
            key={noteIndex}
            href={note.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl border border-green-500 font-medium"
          >
            <BookOpen className="w-4 h-4" />
            {note.title}
          </a>
        ))}
      </div>
    </>
  );
};
