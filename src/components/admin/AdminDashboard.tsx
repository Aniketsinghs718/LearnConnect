'use client';
import { useState, useEffect } from 'react';
import { BookOpen, BarChart3, Settings, FileText, Users, Database } from 'lucide-react';
import { Subjects, Subject } from '@/interfaces/Subject';
import DataManager from './DataManager';
import {
  AdminSidebar,
  DashboardOverview,
  SubjectManagement,
  ModuleManagement,
  ContentManagement,
  SettingsPanel
} from '@/components/features/admin';

// Import the actual notes data
import NotesData from '@/notes/data';

// Helper function to flatten the nested NotesData structure
const flattenNotesData = (): Subjects => {
  const flattened: Subjects = {};
  
  // Iterate through years (fy, sy, ty)
  Object.entries(NotesData).forEach(([year, yearData]) => {
    if (typeof yearData === 'object' && yearData !== null) {
      // Iterate through branches (comps, it, aids, etc.)
      Object.entries(yearData).forEach(([branch, branchData]) => {
        if (typeof branchData === 'object' && branchData !== null) {
          // Iterate through semesters (odd, even)
          Object.entries(branchData).forEach(([semester, semesterData]) => {
            if (typeof semesterData === 'object' && semesterData !== null) {
              // Add each subject with a unique key
              Object.entries(semesterData).forEach(([subjectKey, subjectData]) => {
                const uniqueKey = `${year}_${branch}_${semester}_${subjectKey}`;
                flattened[uniqueKey] = subjectData as Subject;
              });
            }
          });
        }
      });
    }
  });
  
  return flattened;
};

type AdminTab = 'dashboard' | 'subjects' | 'modules' | 'content' | 'data-manager' | 'settings';

interface Topic {
  title: string;
  description: string;
  videos?: Array<{ title: string; url?: string; completed?: boolean }>;
  notes?: Array<{ title: string; url: string }>;
}

const tabItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
  { id: 'modules', label: 'Modules', icon: FileText },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'data-manager', label: 'Data Manager', icon: Database },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [subjects, setSubjects] = useState<Subjects>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('learnconnect-admin-data');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    // Load actual notes data as fallback
    return flattenNotesData();
  });
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<number>(1);

  // Save to localStorage whenever subjects change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('learnconnect-admin-data', JSON.stringify(subjects));
    }
  }, [subjects]);

  // Helper functions for data management
  const addSubject = (subjectData: { id: string; name: string; color: string }) => {
    setSubjects(prev => ({
      ...prev,
      [subjectData.id]: {
        name: subjectData.name,
        icon: BookOpen,
        color: subjectData.color,
        modules: {}
      }
    }));
  };

  const deleteSubject = (subjectId: string) => {
    const { [subjectId]: deleted, ...rest } = subjects;
    setSubjects(rest);
    if (selectedSubject === subjectId) {
      setSelectedSubject('');
    }
  };

  const updateSubject = (subjectId: string, updates: Partial<Subject>) => {
    setSubjects(prev => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        ...updates
      }
    }));
  };

  const addModule = (moduleNumber: number) => {
    if (!selectedSubject) return;
    
    setSubjects(prev => ({
      ...prev,
      [selectedSubject]: {
        ...prev[selectedSubject],
        modules: {
          ...prev[selectedSubject].modules,
          [moduleNumber]: {
            notesLink: [],
            topics: []
          }
        }
      }
    }));
  };

  const deleteModule = (moduleNum: number) => {
    if (!selectedSubject) return;
    
    setSubjects(prev => {
      const { [moduleNum]: deleted, ...restModules } = prev[selectedSubject].modules;
      return {
        ...prev,
        [selectedSubject]: {
          ...prev[selectedSubject],
          modules: restModules
        }
      };
    });
  };

  const handleImportData = (importedData: Subjects) => {
    setSubjects(importedData);
    setSelectedSubject('');
    setSelectedModule(1);
  };

  const updateModuleTopics = (topics: Topic[]) => {
    if (!selectedSubject) return;
    
    setSubjects(prev => ({
      ...prev,
      [selectedSubject]: {
        ...prev[selectedSubject],
        modules: {
          ...prev[selectedSubject].modules,
          [selectedModule]: {
            ...prev[selectedSubject].modules[selectedModule],
            topics
          }
        }
      }
    }));
  };

  // Function to load fresh data from the notes folder
  const reloadFromNotesData = () => {
    const freshData = flattenNotesData();
    setSubjects(freshData);
    localStorage.setItem('learnconnect-admin-data', JSON.stringify(freshData));
  };

  const clearAllData = () => {
    setSubjects({});
    setSelectedSubject('');
    setSelectedModule(1);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('learnconnect-admin-data');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview 
            subjects={subjects}
            onNavigateToSubjects={() => setActiveTab('subjects')}
            onNavigateToDataManager={() => setActiveTab('data-manager')}
            onNavigateToContent={() => setActiveTab('content')}
          />
        );
      case 'subjects':
        return (
          <SubjectManagement
            subjects={subjects}
            onAddSubject={addSubject}
            onDeleteSubject={deleteSubject}
            onUpdateSubject={updateSubject}
            onSelectSubject={(subjectId) => {
              setSelectedSubject(subjectId);
              setActiveTab('modules');
            }}
            onReloadData={reloadFromNotesData}
          />
        );
      case 'modules':
        return (
          <ModuleManagement
            subjects={subjects}
            selectedSubject={selectedSubject}
            selectedModule={selectedModule}
            onSelectSubject={setSelectedSubject}
            onSelectModule={setSelectedModule}
            onAddModule={addModule}
            onDeleteModule={deleteModule}
            onNavigateToContent={() => setActiveTab('content')}
          />
        );
      case 'content':
        return (
          <ContentManagement
            subjects={subjects}
            selectedSubject={selectedSubject}
            selectedModule={selectedModule}
            onUpdateTopics={updateModuleTopics}
            onNavigateToModules={() => setActiveTab('modules')}
          />
        );
      case 'data-manager':
        return <DataManager subjects={subjects} onImportData={handleImportData} />;
      case 'settings':
        return (
          <SettingsPanel 
            onClearAllData={clearAllData}
            onReloadData={reloadFromNotesData}
          />
        );
      default:
        return (
          <DashboardOverview 
            subjects={subjects}
            onNavigateToSubjects={() => setActiveTab('subjects')}
            onNavigateToDataManager={() => setActiveTab('data-manager')}
            onNavigateToContent={() => setActiveTab('content')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}      <AdminSidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <div className="pl-64">
        <div className="px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
            <p className="text-gray-600">
              Manage your academic content with ease
            </p>
          </div>
          
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}