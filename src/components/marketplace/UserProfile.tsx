
'use client';

import React, { useState, useEffect } from 'react';
import { MarketplaceItem } from '../../types/marketplace';
import { MarketplaceService } from '../../services/marketplace';
import { supabase } from '../../lib/supabaseClient';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import toast from 'react-hot-toast';

interface UserProfileProps {
  userId?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [userItems, setUserItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'items' | 'sold'>('items');

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get current user if no userId provided
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        toast.error('User not found');
        return;
      }

      // Get user info
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', targetUserId)
        .single();
      
      setCurrentUser(userData);      // Load user's items
      const items = await MarketplaceService.getUserItems(targetUserId);
      setUserItems(items);
      
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSold = async (itemId: string) => {
    try {
      await MarketplaceService.markAsSold(itemId);
      toast.success('Item marked as sold!');
      loadUserData(); // Refresh data
    } catch (error) {
      console.error('Error marking item as sold:', error);
      toast.error('Failed to mark item as sold');
    }
  };

  const activeItems = userItems.filter(item => item.is_available && !item.is_sold);
  const soldItems = userItems.filter(item => item.is_sold);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            {currentUser?.avatar_url ? (
              <img
                src={currentUser.avatar_url}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                  {currentUser?.name?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentUser?.name}
              </h1>              <p className="text-gray-600 dark:text-gray-300">
                {currentUser?.college} • {currentUser?.branch} • {currentUser?.year}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('items')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'items'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Active Items ({activeItems.length})
              </button>              <button
                onClick={() => setActiveTab('sold')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sold'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Sold Items ({soldItems.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Active Items Tab */}
            {activeTab === 'items' && (
              <div className="space-y-4">
                {activeItems.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📦</div>
                    <p className="text-gray-600 dark:text-gray-300">No active items</p>
                  </div>
                ) : (
                  activeItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <img
                        src={item.images[0] || '/placeholder.png'}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">₹{item.price}</p>
                        {item.college_name && (
                          <p className="text-xs text-gray-500">🏫 {item.college_name}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleMarkAsSold(item.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Mark as Sold
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Sold Items Tab */}
            {activeTab === 'sold' && (
              <div className="space-y-4">
                {soldItems.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">✅</div>
                    <p className="text-gray-600 dark:text-gray-300">No sold items yet</p>
                  </div>
                ) : (
                  soldItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg opacity-75">
                      <img
                        src={item.images[0] || '/placeholder.png'}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">₹{item.price}</p>
                        <p className="text-xs text-green-600">✅ Sold</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
