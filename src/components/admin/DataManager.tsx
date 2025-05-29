'use client';
import { useState } from 'react';
import { Download, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Subjects } from '@/interfaces/Subject';

interface Video {
  title: string;
  url?: string;
  completed?: boolean;
}

interface Note {
  title: string;
  url: string;
}

interface Topic {
  title: string;
  description: string;
  videos?: Video[];
  notes?: Note[];
}

interface DataManagerProps {
  subjects: Subjects;
  onImportData: (data: Subjects) => void;
}

export default function DataManager({ subjects, onImportData }: DataManagerProps) {
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');

  const exportData = () => {
    const dataStr = JSON.stringify(subjects, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `learnconnect-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Basic validation
        if (typeof importedData === 'object' && importedData !== null) {
          onImportData(importedData);
          setImportStatus('success');
          setImportMessage('Data imported successfully!');
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        setImportStatus('error');
        setImportMessage('Failed to import data. Please check the file format.');
      }
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setImportStatus('idle');
        setImportMessage('');
      }, 3000);
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const generateDataStructureTemplate = () => {
    const template = {
      "subject_id": {
        "name": "Subject Name",
        "icon": "BookOpen",
        "color": "blue",
        "modules": {
          "1": {
            "notesLink": [
              {
                "title": "Module 1 Notes",
                "url": "https://example.com/notes-link"
              }
            ],
            "topics": [
              {
                "title": "Topic Title",
                "description": "Topic description",
                "videos": [
                  {
                    "title": "Video Title",
                    "url": "https://youtube.com/embed/video-id"
                  }
                ],
                "notes": [
                  {
                    "title": "Additional Notes",
                    "url": "https://example.com/additional-notes"
                  }
                ]
              }
            ]
          }
        }
      }
    };

    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'learnconnect-template.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Data Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Export Data */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Download className="h-5 w-5 text-blue-500" />
              <h4 className="font-medium">Export Data</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Download all your subjects and content as a JSON file
            </p>
            <button
              onClick={exportData}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Export JSON
            </button>
          </div>

          {/* Import Data */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Upload className="h-5 w-5 text-green-500" />
              <h4 className="font-medium">Import Data</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Upload a JSON file to import subjects and content
            </p>
            <label className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors cursor-pointer block text-center">
              Choose File
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          {/* Download Template */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-purple-500" />
              <h4 className="font-medium">Template</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Download a template JSON file to understand the data structure
            </p>
            <button
              onClick={generateDataStructureTemplate}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Download Template
            </button>
          </div>
        </div>

        {/* Import Status */}
        {importStatus !== 'idle' && (
          <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
            importStatus === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {importStatus === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{importMessage}</span>
          </div>
        )}
      </div>

      {/* Data Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Current Data Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Object.keys(subjects).length}
            </div>
            <div className="text-sm text-gray-600">Subjects</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Object.values(subjects).reduce((acc, subject) => 
                acc + Object.keys(subject.modules).length, 0
              )}
            </div>
            <div className="text-sm text-gray-600">Modules</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Object.values(subjects).reduce((acc, subject) => 
                acc + Object.values(subject.modules).reduce((moduleAcc, module) => 
                  moduleAcc + module.topics.length, 0
                ), 0
              )}
            </div>
            <div className="text-sm text-gray-600">Topics</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">              {Object.values(subjects).reduce((acc: number, subject) => 
                acc + Object.values(subject.modules).reduce((moduleAcc: number, module) => 
                  moduleAcc + module.topics.reduce((topicAcc: number, topic: Topic) => 
                    topicAcc + (topic.videos?.length || 0), 0
                  ), 0
                ), 0
              )}
            </div>
            <div className="text-sm text-gray-600">Videos</div>
          </div>
        </div>
      </div>

      {/* Bulk Operations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Bulk Operations</h3>
        <div className="space-y-2">
          <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-medium">Clear All Data</div>
            <div className="text-sm text-gray-600">Remove all subjects and content (use with caution)</div>
          </button>
          
          <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-medium">Validate Data Structure</div>
            <div className="text-sm text-gray-600">Check for any inconsistencies in your data</div>
          </button>
          
          <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-medium">Generate Backup</div>
            <div className="text-sm text-gray-600">Create a timestamped backup of all data</div>
          </button>
        </div>
      </div>
    </div>
  );
}
