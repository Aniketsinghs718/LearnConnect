'use client';

import React from 'react';

interface AdminNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminNavigation: React.FC<AdminNavigationProps> = ({ activeTab, onTabChange }) => {  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'verification', name: 'Item Verification', icon: '🔍' },
    { id: 'users', name: 'User Management', icon: '👥' },
    { id: 'debug', name: 'Debug', icon: '🔧' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
