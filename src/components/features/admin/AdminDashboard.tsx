'use client';

import React, { useState, useEffect } from 'react';
import { AdminService } from '../../../services/adminService';
import { AdminStats } from '../../../types/marketplace';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import toast from 'react-hot-toast';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const statsData = await AdminService.getAdminStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading admin stats:', error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        Failed to load dashboard data
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Pending Review
              </p>
              <p className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
                {stats.pendingItems}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Approved Items
              </p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                {stats.approvedItems}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">❌</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Rejected Items
              </p>
              <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                {stats.rejectedItems}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Users
              </p>
              <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                {stats.totalUsers}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Items */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent Items
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {stats.recentItems.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              No recent items
            </div>
          ) : (
            stats.recentItems.map((item) => (
              <div key={item.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.images[0] || '/placeholder.png'}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      by {item.seller?.name} • ₹{item.price}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.verification_status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : item.verification_status === 'rejected'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                    }`}
                  >
                    {item.verification_status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
