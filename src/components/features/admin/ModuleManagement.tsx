'use client';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Subjects } from '@/interfaces/Subject';
import Button from '@/components/ui/Button';

interface ModuleManagementProps {
  subjects: Subjects;
  selectedSubject: string;
  selectedModule: number;
  onSelectSubject: React.Dispatch<React.SetStateAction<string>>;
  onSelectModule: React.Dispatch<React.SetStateAction<number>>;
  onAddModule: (moduleNumber: number) => void;
  onDeleteModule: (moduleNumber: number) => void;
  onNavigateToContent: () => void;
}

export default function ModuleManagement({
  subjects,
  selectedSubject,
  selectedModule,
  onSelectSubject,
  onSelectModule,
  onAddModule,
  onDeleteModule,
  onNavigateToContent
}: ModuleManagementProps) {
  const [moduleNumber, setModuleNumber] = useState(selectedModule);

  const handleAddModule = () => {
    if (!selectedSubject) return;
    onAddModule(moduleNumber);
  };

  const handleDeleteModule = (moduleNum: number) => {
    onDeleteModule(moduleNum);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Module Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            value={selectedSubject}
            onChange={(e) => onSelectSubject(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Subject</option>
            {Object.entries(subjects).map(([id, subject]) => (
              <option key={id} value={id}>{subject.name}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Module Number"
            value={moduleNumber}
            onChange={(e) => setModuleNumber(parseInt(e.target.value) || 1)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleAddModule}
            disabled={!selectedSubject}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Module
          </Button>
        </div>
        
        {selectedSubject && subjects[selectedSubject] && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Modules for {subjects[selectedSubject].name}</h4>              <Button
                onClick={onNavigateToContent}
                disabled={!subjects[selectedSubject].modules[selectedModule]}
                variant="primary"
                size="sm"
              >
                Edit Content
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.keys(subjects[selectedSubject].modules).map(moduleNum => (
                <div
                  key={moduleNum}
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-colors relative ${
                    selectedModule === parseInt(moduleNum)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onSelectModule(parseInt(moduleNum))}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteModule(parseInt(moduleNum));
                    }}
                    className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <p className="font-medium">Module {moduleNum}</p>
                  <p className="text-sm text-gray-600">
                    {subjects[selectedSubject].modules[parseInt(moduleNum)].topics.length} topics
                  </p>
                  <p className="text-sm text-gray-600">
                    {subjects[selectedSubject].modules[parseInt(moduleNum)].notesLink.length} note links
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
