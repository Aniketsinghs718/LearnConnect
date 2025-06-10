
'use client';

import React, { useState, useEffect } from 'react';
import { MarketplaceItem } from '../../types/marketplace';
import { MarketplaceService } from '../../services/marketplace';
import { supabase } from '../../lib/supabaseClient';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { User, Package, CheckCircle, XCircle, Eye, Edit3, Trash2, Calendar, MapPin, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserProfileProps {
  userId?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [userItems, setUserItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'items' | 'sold' | 'rejected'>('items');

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
      
      setCurrentUser(userData);

      // Load user's items
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

  const activeItems = userItems.filter(item => item.is_available && !item.is_sold && item.verification_status !== 'rejected');
  const soldItems = userItems.filter(item => item.is_sold);
  const rejectedItems = userItems.filter(item => item.verification_status === 'rejected');

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Eye className="h-4 w-4 text-orange-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced User Profile Header */}
        <div className="bg-gradient-to-r from-gray-900 to-black border border-orange-600/30 rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Avatar Section */}
            <div className="relative">
              {currentUser?.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-orange-600 shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-600 to-orange-700 border-4 border-orange-500 flex items-center justify-center shadow-xl">
                  <span className="text-3xl font-bold text-white">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-orange-600 rounded-full p-2">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">
                {currentUser?.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4 text-orange-500" />
                  <span>{currentUser?.college}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <span>{currentUser?.branch} • {currentUser?.year}</span>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/50 border border-orange-600/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-500">{activeItems.length}</div>
                  <div className="text-sm text-gray-400">Active Items</div>
                </div>
                <div className="bg-black/50 border border-green-600/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-500">{soldItems.length}</div>
                  <div className="text-sm text-gray-400">Sold Items</div>
                </div>
                <div className="bg-black/50 border border-red-600/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-500">{rejectedItems.length}</div>
                  <div className="text-sm text-gray-400">Rejected</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="bg-black border border-orange-600/30 rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="flex bg-gradient-to-r from-gray-900 to-black">
            <button
              onClick={() => setActiveTab('items')}
              className={`flex-1 flex items-center justify-center space-x-3 py-6 px-8 font-semibold transition-all duration-300 ${
                activeTab === 'items'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-orange-400 hover:bg-gray-800/50'
              }`}
            >
              <Package className="h-5 w-5" />
              <span>Active Items</span>
              <span className="bg-black/30 px-2 py-1 rounded-full text-xs">{activeItems.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('sold')}
              className={`flex-1 flex items-center justify-center space-x-3 py-6 px-8 font-semibold transition-all duration-300 ${
                activeTab === 'sold'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-orange-400 hover:bg-gray-800/50'
              }`}
            >
              <CheckCircle className="h-5 w-5" />
              <span>Sold Items</span>
              <span className="bg-black/30 px-2 py-1 rounded-full text-xs">{soldItems.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`flex-1 flex items-center justify-center space-x-3 py-6 px-8 font-semibold transition-all duration-300 ${
                activeTab === 'rejected'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-orange-400 hover:bg-gray-800/50'
              }`}
            >
              <XCircle className="h-5 w-5" />
              <span>Rejected Items</span>
              <span className="bg-black/30 px-2 py-1 rounded-full text-xs">{rejectedItems.length}</span>
            </button>
          </div>
        </div>        {/* Enhanced Content Sections */}
        <div className="bg-black border border-orange-600/30 rounded-2xl shadow-xl p-8">
          {/* Active Items Tab */}
          {activeTab === 'items' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                  <Package className="h-6 w-6 text-orange-500" />
                  <span>Active Listings</span>
                </h2>
                {activeItems.length > 0 && (
                  <span className="text-gray-400 text-sm">
                    {activeItems.length} item{activeItems.length !== 1 ? 's' : ''} listed
                  </span>
                )}
              </div>

              {activeItems.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-orange-600/20 to-orange-700/20 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Package className="h-12 w-12 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Active Items</h3>
                  <p className="text-gray-400 mb-6">Start selling by listing your first item!</p>
                  <button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg">
                    List Your First Item
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {activeItems.map((item) => (
                    <div key={item.id} className="group bg-gradient-to-r from-gray-900 to-black border border-gray-700 hover:border-orange-600/50 rounded-xl p-6 transition-all duration-300 hover:shadow-xl">
                      <div className="flex items-start space-x-6">
                        {/* Image */}
                        <div className="relative">
                          <img
                            src={item.images[0] || '/placeholder.png'}
                            alt={item.title}
                            className="w-24 h-24 object-cover rounded-lg border-2 border-gray-700 group-hover:border-orange-600/50 transition-all duration-300"
                          />
                          <div className="absolute -top-2 -right-2 bg-orange-600 rounded-full p-1">
                            {getStatusIcon(item.verification_status || 'pending')}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                              {item.title}
                            </h3>
                            <div className="flex items-center space-x-2 ml-4">
                              <span className="text-2xl font-bold text-orange-500">₹{item.price}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mb-4">
                            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                              item.verification_status === 'approved' 
                                ? 'bg-green-900/30 text-green-400 border border-green-600/30'
                                : item.verification_status === 'pending'
                                ? 'bg-orange-900/30 text-orange-400 border border-orange-600/30'
                                : 'bg-red-900/30 text-red-400 border border-red-600/30'
                            }`}>
                              {getStatusIcon(item.verification_status || 'pending')}
                              <span>{getStatusText(item.verification_status || 'pending')}</span>
                            </span>
                            
                            {item.college_name && (
                              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs bg-gray-800 text-gray-300 border border-gray-600">
                                <MapPin className="h-3 w-3" />
                                <span>{item.college_name}</span>
                              </span>
                            )}

                            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs bg-gray-800 text-gray-300 border border-gray-600">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(item.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-gray-400 text-sm line-clamp-2">
                              {item.description || 'No description provided'}
                            </p>
                            
                            <div className="flex items-center space-x-3 ml-4">
                              <button 
                                onClick={() => handleMarkAsSold(item.id)}
                                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg flex items-center space-x-2"
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>Mark as Sold</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sold Items Tab */}
          {activeTab === 'sold' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span>Sold Items</span>
                </h2>
                {soldItems.length > 0 && (
                  <span className="text-gray-400 text-sm">
                    {soldItems.length} item{soldItems.length !== 1 ? 's' : ''} sold
                  </span>
                )}
              </div>

              {soldItems.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-green-600/20 to-green-700/20 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Sold Items Yet</h3>
                  <p className="text-gray-400">Your sold items will appear here once you complete sales.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {soldItems.map((item) => (
                    <div key={item.id} className="bg-gradient-to-r from-green-900/20 to-black border border-green-600/30 rounded-xl p-6 relative overflow-hidden">
                      <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        SOLD
                      </div>
                      
                      <div className="flex items-start space-x-6">
                        <img
                          src={item.images[0] || '/placeholder.png'}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg border border-green-600/50 opacity-75"
                        />
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-green-400">₹{item.price}</span>
                            <span className="text-sm text-gray-400">
                              Sold on {new Date(item.updated_at).toLocaleDateString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Rejected Items Tab */}
          {activeTab === 'rejected' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                  <XCircle className="h-6 w-6 text-red-500" />
                  <span>Rejected Items</span>
                </h2>
                {rejectedItems.length > 0 && (
                  <span className="text-gray-400 text-sm">
                    {rejectedItems.length} item{rejectedItems.length !== 1 ? 's' : ''} rejected
                  </span>
                )}
              </div>

              {rejectedItems.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-red-600/20 to-red-700/20 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <XCircle className="h-12 w-12 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Rejected Items</h3>
                  <p className="text-gray-400">Great! All your listings have been approved or are pending review.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {rejectedItems.map((item) => (
                    <div key={item.id} className="bg-gradient-to-r from-red-900/20 to-black border border-red-600/30 rounded-xl p-6 relative">
                      <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        REJECTED
                      </div>
                      
                      <div className="flex items-start space-x-6">
                        <div className="relative">
                          <img
                            src={item.images[0] || '/placeholder.png'}
                            alt={item.title}
                            className="w-24 h-24 object-cover rounded-lg border border-red-600/50 opacity-75"
                          />
                          <div className="absolute inset-0 bg-red-600/20 rounded-lg"></div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xl font-bold text-red-400">₹{item.price}</span>
                            <span className="text-sm text-gray-400">
                              Rejected on {new Date(item.verified_at || item.updated_at).toLocaleDateString('en-IN')}
                            </span>
                          </div>
                          
                          {item.rejection_reason && (
                            <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4 mt-4">
                              <div className="flex items-start space-x-3">
                                <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <h4 className="font-semibold text-red-300 mb-1">Rejection Reason</h4>
                                  <p className="text-red-200 text-sm leading-relaxed">{item.rejection_reason}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-4 flex items-center space-x-3">
                            <button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center space-x-2">
                              <Edit3 className="h-4 w-4" />
                              <span>Edit & Resubmit</span>
                            </button>
                            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center space-x-2">
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
