'use client';
import { BookOpen, Video, FileText } from 'lucide-react';
import { Subjects } from '@/interfaces/Subject';

interface Topic {
  title: string;
  description: string;
  videos?: Array<{ title: string; url?: string; completed?: boolean }>;
  notes?: Array<{ title: string; url: string }>;
}

interface DashboardOverviewProps {
  subjects: Subjects;
  onNavigateToSubjects: () => void;
  onNavigateToDataManager: () => void;
  onNavigateToContent: () => void;
}

export default function DashboardOverview({ 
  subjects, 
  onNavigateToSubjects, 
  onNavigateToDataManager, 
  onNavigateToContent 
}: DashboardOverviewProps) {
  const calculateStats = () => {
    const totalSubjects = Object.keys(subjects).length;
    const totalModules = Object.values(subjects).reduce((acc, subject) => {
      return acc + Object.keys(subject.modules).length;
    }, 0);

    const totalVideos = Object.values(subjects).reduce((acc: number, subject) => {
      return acc + Object.values(subject.modules).reduce((moduleAcc: number, module) => {
        return moduleAcc + module.topics.reduce((topicAcc: number, topic: Topic) => {
          return topicAcc + (topic.videos?.length || 0);
        }, 0);
      }, 0);
    }, 0);

    const totalNotes = Object.values(subjects).reduce((acc: number, subject) => {
      return acc + Object.values(subject.modules).reduce((moduleAcc: number, module) => {
        return moduleAcc + module.notesLink.length;
      }, 0);
    }, 0);

    return { totalSubjects, totalModules, totalVideos, totalNotes };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Subjects</p>
              <p className="text-2xl font-bold">{stats.totalSubjects}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Modules</p>
              <p className="text-2xl font-bold">{stats.totalModules}</p>
            </div>
            <FileText className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Videos</p>
              <p className="text-2xl font-bold">{stats.totalVideos}</p>
            </div>
            <Video className="h-8 w-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Total Notes</p>
              <p className="text-2xl font-bold">{stats.totalNotes}</p>
            </div>
            <FileText className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Data saved to local storage</p>
                <p className="text-xs text-gray-500">Just now</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Admin dashboard initialized</p>
                <p className="text-xs text-gray-500">Few seconds ago</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">            <button 
              onClick={onNavigateToSubjects}
              className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Add New Subject</div>
              <div className="text-sm text-gray-600">Create a new subject with modules</div>
            </button>
            <button 
              onClick={onNavigateToDataManager}
              className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Export Data</div>
              <div className="text-sm text-gray-600">Download your content as JSON</div>
            </button>
            <button 
              onClick={onNavigateToContent}
              className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Edit Content</div>
              <div className="text-sm text-gray-600">Manage topics, videos, and notes</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
