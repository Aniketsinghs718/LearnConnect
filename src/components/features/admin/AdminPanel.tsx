'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminNavigation } from './AdminNavigation';
import { AdminDashboard } from './AdminDashboard';
import { ItemVerification } from './ItemVerification';
import { UserManagement } from './UserManagement';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'verification':
        return <ItemVerification />;
      case 'users':
        return <UserManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                🛡️ Admin Panel
              </h1>
              <p className="text-gray-400">
                Manage marketplace items and users
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>Admin Access</span>
              </div>
              
              <button
                onClick={() => router.push('/marketplace')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Back to Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <AdminNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveTab()}
      </div>
    </div>
  );
};
