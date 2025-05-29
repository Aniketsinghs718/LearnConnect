'use client';
import { Home, BookOpen, FileText, Edit3, Database, Settings } from 'lucide-react';

type AdminTab = 'dashboard' | 'subjects' | 'modules' | 'content' | 'data-manager' | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const tabItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'modules', label: 'Modules', icon: FileText },
    { id: 'content', label: 'Content Editor', icon: Edit3 },
    { id: 'data-manager', label: 'Data Manager', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-center h-16 px-4 border-b">
          <h1 className="text-xl font-bold text-gray-900">LearnConnect Admin</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {tabItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as AdminTab)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t text-center">
          <p className="text-xs text-gray-500">
            Data saved locally
          </p>
        </div>
      </div>
    </div>
  );
}
