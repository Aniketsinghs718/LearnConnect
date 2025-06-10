'use client';

import React, { useState, useEffect } from 'react';
import { AdminService } from '../../../services/adminService';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { AdminNavigation } from './AdminNavigation';
import { AdminDashboard } from './AdminDashboard';
import { ItemVerification } from './ItemVerification';
import { UserManagement } from './UserManagement';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAdminStatus();
  }, []);  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      const adminStatus = await AdminService.isAdmin();
      setIsAdmin(adminStatus);
      
      if (!adminStatus) {
        toast.error('Access denied. Admin privileges required.');
        router.push('/marketplace');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      toast.error('Failed to verify admin status');
      router.push('/marketplace');
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You don't have admin privileges to access this page.
          </p>
          <button
            onClick={() => router.push('/marketplace')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Go to Marketplace
          </button>
        </div>
      </div>
    );
  }  const renderActiveTab = () => {
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
