'use client';
import { useState } from 'react';
import { Plus, Edit3, Trash2, Download } from 'lucide-react';
import { Subjects, Subject } from '@/interfaces/Subject';
import Button from '@/components/ui/Button';

interface SubjectManagementProps {
  subjects: Subjects;
  onAddSubject: (subject: { id: string; name: string; color: string }) => void;
  onDeleteSubject: (subjectId: string) => void;
  onUpdateSubject: (subjectId: string, updates: Partial<Subject>) => void;
  onSelectSubject: (subjectId: string) => void;
  onReloadData: () => void;
}

export default function SubjectManagement({ 
  subjects, 
  onAddSubject, 
  onDeleteSubject, 
  onUpdateSubject, 
  onSelectSubject, 
  onReloadData
}: SubjectManagementProps) {
  const [subjectForm, setSubjectForm] = useState({
    id: '',
    name: '',
    color: 'blue'
  });

  const handleAddSubject = () => {
    if (!subjectForm.id || !subjectForm.name) return;
    
    onAddSubject(subjectForm);
    setSubjectForm({ id: '', name: '', color: 'blue' });
  };
  const handleEditSubject = (id: string) => {
    onSelectSubject(id);
    // Navigation will be handled by parent component
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Notes Data Management</h3>          <div className="flex gap-2">            <Button
              onClick={onReloadData}
              variant="primary"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Reload from Notes
            </Button>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This admin panel displays data from your notes folder. 
            You can edit the content here and export individual subjects as data files. 
            To make permanent changes, you'll need to update the actual data files in your notes folder.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Subject</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Subject ID (e.g., ai, ml)"
            value={subjectForm.id}
            onChange={(e) => setSubjectForm(prev => ({ ...prev, id: e.target.value }))}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Subject Name"
            value={subjectForm.name}
            onChange={(e) => setSubjectForm(prev => ({ ...prev, name: e.target.value }))}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <select
              value={subjectForm.color}
              onChange={(e) => setSubjectForm(prev => ({ ...prev, color: e.target.value }))}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            >
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="purple">Purple</option>
              <option value="red">Red</option>
              <option value="yellow">Yellow</option>
            </select>
            <Button
              onClick={handleAddSubject}
              disabled={!subjectForm.id || !subjectForm.name}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Existing Subjects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(subjects).map(([id, subject]) => (
            <div key={id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{subject.name}</h4>                <div className="flex gap-1">
                  <button 
                    onClick={() => handleEditSubject(id)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Manage modules"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDeleteSubject(id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete subject"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mb-2">
                {(() => {
                  // Parse the flattened key to show source info
                  const keyParts = id.includes('_') ? id.split('_') : ['custom', 'custom', 'custom', id];
                  const year = keyParts[0];
                  const branch = keyParts[1]; 
                  const semester = keyParts[2];

                  return (
                    <p className="text-xs text-gray-500 mb-1">
                      Source: {year.toUpperCase()} › {branch.toUpperCase()} › {semester}
                    </p>
                  );
                })()}
              </div>
              <p className="text-sm text-gray-600">ID: {id}</p>
              <p className="text-sm text-gray-600">Modules: {Object.keys(subject.modules).length}</p>
              <div className={`inline-block px-2 py-1 rounded text-xs text-white bg-${subject.color}-500 mt-2`}>
                {subject.color}
              </div>
            </div>
          ))}
        </div>
        {Object.keys(subjects).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No subjects found. Click "Reload from Notes" to load data from your notes folder.</p>
          </div>
        )}
      </div>
    </div>
  );
}
