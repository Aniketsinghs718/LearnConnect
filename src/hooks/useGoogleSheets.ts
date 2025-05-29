import { useState, useEffect } from 'react';
import { GoogleSheetsService } from '@/services/googleSheets';
import { NotesLink } from '@/interfaces/Subject';

interface UseNotesLinksReturn {
  notesLinks: NotesLink[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useNotesLinks = (
  year: string,
  branch: string,
  semester: string,
  subject: string,
  module: number
): UseNotesLinksReturn => {
  const [notesLinks, setNotesLinks] = useState<NotesLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotesLinks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const links = await GoogleSheetsService.getNotesLinks(
        year,
        branch,
        semester,
        subject,
        module
      );
      
      setNotesLinks(links);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes links');
      console.error('Error fetching notes links:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (year && branch && semester && subject && module) {
      fetchNotesLinks();
    }
  }, [year, branch, semester, subject, module]);

  return {
    notesLinks,
    loading,
    error,
    refetch: fetchNotesLinks
  };
};

interface UseSubjectsReturn {
  subjects: string[];
  loading: boolean;
  error: string | null;
}

export const useSubjects = (
  year: string,
  branch: string,
  semester: string
): UseSubjectsReturn => {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const subjectsList = await GoogleSheetsService.getSubjects(
          year,
          branch,
          semester
        );
        
        setSubjects(subjectsList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subjects');
        console.error('Error fetching subjects:', err);
      } finally {
        setLoading(false);
      }
    };

    if (year && branch && semester) {
      fetchSubjects();
    }
  }, [year, branch, semester]);

  return { subjects, loading, error };
};

interface UseModulesReturn {
  modules: number[];
  loading: boolean;
  error: string | null;
}

export const useModules = (
  year: string,
  branch: string,
  semester: string,
  subject: string
): UseModulesReturn => {
  const [modules, setModules] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const modulesList = await GoogleSheetsService.getModules(
          year,
          branch,
          semester,
          subject
        );
        
        setModules(modulesList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch modules');
        console.error('Error fetching modules:', err);
      } finally {
        setLoading(false);
      }
    };

    if (year && branch && semester && subject) {
      fetchModules();
    }
  }, [year, branch, semester, subject]);

  return { modules, loading, error };
};
