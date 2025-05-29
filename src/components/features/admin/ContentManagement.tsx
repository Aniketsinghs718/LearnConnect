'use client';
import { Subjects } from '@/interfaces/Subject';
import ContentEditor from '@/components/admin/ContentEditor';
import Button from '@/components/ui/Button';

interface Topic {
  title: string;
  description: string;
  videos?: Array<{ title: string; url?: string; completed?: boolean }>;
  notes?: Array<{ title: string; url: string }>;
}

interface ContentManagementProps {
  subjects: Subjects;
  selectedSubject: string;
  selectedModule: number;
  onUpdateTopics: (topics: Topic[]) => void;
  onNavigateToModules: () => void;
}

export default function ContentManagement({
  subjects,
  selectedSubject,
  selectedModule,
  onUpdateTopics,
  onNavigateToModules
}: ContentManagementProps) {
  if (!selectedSubject || !subjects[selectedSubject]?.modules[selectedModule]) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">        <p className="text-gray-500 mb-4">Please select a subject and module first.</p>
        <Button
          onClick={onNavigateToModules}
        >
          Go to Module Management
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">
              {subjects[selectedSubject].name} - Module {selectedModule}
            </h3>
            <p className="text-gray-600">
              Manage topics, videos, and notes for this module
            </p>
          </div>          <div className="flex gap-2">
            <Button
              onClick={onNavigateToModules}
              variant="secondary"
              size="sm"
            >
              Back to Modules
            </Button>
          </div>
        </div>
        
        <ContentEditor
          topics={subjects[selectedSubject].modules[selectedModule].topics}
          onUpdateTopics={onUpdateTopics}
        />
      </div>
    </div>
  );
}
