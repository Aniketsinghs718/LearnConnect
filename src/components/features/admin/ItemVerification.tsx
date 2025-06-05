'use client';

import React, { useState, useEffect } from 'react';
import { AdminService } from '../../../services/adminService';
import { MarketplaceItem } from '../../../types/marketplace';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import toast from 'react-hot-toast';

export const ItemVerification: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, [selectedStatus, searchTerm]);  const loadItems = async () => {
    try {
      setLoading(true);
      let itemsData: MarketplaceItem[];      if (searchTerm) {
        const statusFilter = selectedStatus === 'all' ? undefined : selectedStatus;
        itemsData = await AdminService.searchItems(searchTerm, statusFilter);
      } else if (selectedStatus === 'all') {
        itemsData = await AdminService.getAllItems();
      } else {
        itemsData = await AdminService.getItemsByStatus(selectedStatus);
      }
      
      setItems(itemsData);
    } catch (error) {
      console.error('Error loading items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (itemId: string, adminNotes?: string) => {
    try {
      setActionLoading(itemId);
      await AdminService.approveItem(itemId, adminNotes);
      toast.success('Item approved successfully');
      loadItems();
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    } catch (error: any) {
      console.error('Error approving item:', error);
      toast.error(error.message || 'Failed to approve item');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (itemId: string, reason: string, adminNotes?: string) => {
    try {
      setActionLoading(itemId);
      await AdminService.rejectItem(itemId, reason, adminNotes);
      toast.success('Item rejected successfully');
      loadItems();
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    } catch (error: any) {
      console.error('Error rejecting item:', error);
      toast.error(error.message || 'Failed to reject item');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedItems.size === 0) {
      toast.error('Please select items first');
      return;
    }    const reason = action === 'reject' ? prompt('Enter rejection reason:') : undefined;
    if (action === 'reject' && !reason) return;

    try {
      setActionLoading('bulk');
      await AdminService.performBulkAction(Array.from(selectedItems), action, reason || undefined);
      toast.success(`${selectedItems.size} items ${action}d successfully`);
      setSelectedItems(new Set());
      loadItems();
    } catch (error: any) {
      console.error(`Error ${action}ing items:`, error);
      toast.error(error.message || `Failed to ${action} items`);
    } finally {
      setActionLoading(null);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Item Verification
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Review and moderate marketplace items
            </p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="all">All Items</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.size > 0 && (
          <div className="mt-4 flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {selectedItems.size} items selected
            </span>
            <button
              onClick={() => handleBulkAction('approve')}
              disabled={actionLoading === 'bulk'}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm"
            >
              Bulk Approve
            </button>
            <button
              onClick={() => handleBulkAction('reject')}
              disabled={actionLoading === 'bulk'}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm"
            >
              Bulk Reject
            </button>
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No items found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search terms' : `No ${selectedStatus} items available`}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex items-center">
              <input
                type="checkbox"
                checked={selectedItems.size === items.length && items.length > 0}
                onChange={toggleSelectAll}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Select All
              </span>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((item) => (
                <ItemVerificationCard
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.has(item.id)}
                  onToggleSelect={() => toggleItemSelection(item.id)}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isLoading={actionLoading === item.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface ItemVerificationCardProps {
  item: MarketplaceItem;
  isSelected: boolean;
  onToggleSelect: () => void;
  onApprove: (itemId: string, adminNotes?: string) => void;
  onReject: (itemId: string, reason: string, adminNotes?: string) => void;
  isLoading: boolean;
}

const ItemVerificationCard: React.FC<ItemVerificationCardProps> = ({
  item,
  isSelected,
  onToggleSelect,
  onApprove,
  onReject,
  isLoading
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleApprove = () => {
    const adminNotes = prompt('Enter admin notes (optional):');
    onApprove(item.id, adminNotes || undefined);
  };

  const handleReject = () => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    const adminNotes = prompt('Enter admin notes (optional):');
    onReject(item.id, reason, adminNotes || undefined);
  };

  const getStatusBadge = () => {    const statusConfig = {
      pending: { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-800 dark:text-orange-200', icon: '⏳' },
      approved: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', icon: '✅' },
      rejected: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-200', icon: '❌' }
    };

    const status = item.verification_status || 'pending';
    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <span className="mr-1">{config.icon}</span>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-start space-x-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
        />

        {/* Item Image */}
        <img
          src={item.images[0] || '/placeholder.png'}
          alt={item.title}
          className="w-20 h-20 object-cover rounded-lg"
        />

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                ₹{item.price} • {item.condition} • {item.category?.name}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>🏫 {item.college_name || 'Not specified'}</span>
                <span>👤 {item.seller?.name}</span>
                <span>📧 {item.seller?.email}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {getStatusBadge()}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
              >
                {showDetails ? 'Hide Details' : 'View Details'}
              </button>
            </div>
          </div>

          {/* Expanded Details */}
          {showDetails && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Description:</strong>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    {item.description || 'No description provided'}
                  </p>
                </div>
                
                <div>
                  <strong>Seller Details:</strong>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    {item.seller?.name} ({item.seller?.branch} - {item.seller?.year})
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Phone: {item.seller?.phone || 'Not provided'}
                  </p>
                </div>

                {item.size && (
                  <div>
                    <strong>Size:</strong>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">{item.size}</p>
                  </div>
                )}

                <div>
                  <strong>Created:</strong>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    {new Date(item.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {item.verified_at && (
                  <div>
                    <strong>Verified At:</strong>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      {new Date(item.verified_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {item.verified_by_admin && (
                      <p className="text-gray-600 dark:text-gray-300">
                        by {item.verified_by_admin.name}
                      </p>
                    )}
                  </div>
                )}

                {item.rejection_reason && (
                  <div>
                    <strong>Rejection Reason:</strong>
                    <p className="mt-1 text-red-600 dark:text-red-400">{item.rejection_reason}</p>
                  </div>
                )}

                {item.admin_notes && (
                  <div>
                    <strong>Admin Notes:</strong>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">{item.admin_notes}</p>
                  </div>
                )}

                {/* Additional Images */}
                {item.images.length > 1 && (
                  <div className="md:col-span-2">
                    <strong>All Images:</strong>
                    <div className="mt-2 flex space-x-2 overflow-x-auto">
                      {item.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${item.title} - Image ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {item.verification_status === 'pending' && (
            <div className="mt-4 flex space-x-3">
              <button
                onClick={handleApprove}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : <span>✅</span>}
                <span>Approve</span>
              </button>
              <button
                onClick={handleReject}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : <span>❌</span>}
                <span>Reject</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
