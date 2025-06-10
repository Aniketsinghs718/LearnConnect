'use client';

import React, { useState, useEffect } from 'react';
import { MarketplaceItem, MarketplaceCategory, MarketplaceFilters } from '../../types/marketplace';
import { MarketplaceService } from '../../services/marketplace';
import { ItemCard } from './ItemCard';
import { FilterSection } from './FilterSection';
import { SafetyDisclaimer } from './SafetyDisclaimer';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import toast from 'react-hot-toast';

export const MarketplaceHome: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  const [showSafetyDisclaimer, setShowSafetyDisclaimer] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadItems();
  }, [filters]);

  const loadCategories = async () => {
    try {
      const categoriesData = await MarketplaceService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const loadItems = async () => {
    try {
      setLoading(true);
      const itemsData = await MarketplaceService.getItems(filters);
      setItems(itemsData);
    } catch (error) {
      console.error('Error loading items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };
  const handleFilterChange = (newFilters: MarketplaceFilters) => {
    setFilters(newFilters);
  };

  const handleContactRequest = (item: MarketplaceItem) => {
    setSelectedItem(item);
    setShowSafetyDisclaimer(true);
  };

  const handleProceedToWhatsApp = () => {
    if (selectedItem?.seller?.phone) {
      const message = `Hi! I'm interested in your "${selectedItem.title}" listed on LearnConnect for ₹${selectedItem.price}. Is it still available?`;
      const whatsappUrl = `https://wa.me/91${selectedItem.seller.phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
    setShowSafetyDisclaimer(false);
    setSelectedItem(null);
  };

  const handleCloseDisclaimer = () => {
    setShowSafetyDisclaimer(false);
    setSelectedItem(null);
  };
  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              📚 Student Marketplace
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Buy and sell stationary items with fellow students from your college
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterSection 
        categories={categories}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Items Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No items found
            </h3>
            <p className="text-gray-400">
              Try adjusting your filters or be the first to list an item!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard 
                key={item.id} 
                item={item} 
                onContactRequest={() => handleContactRequest(item)}
              />
            ))}          </div>        )}
      </div>

      {/* Global Safety Disclaimer Modal */}
      <SafetyDisclaimer
        isOpen={showSafetyDisclaimer}
        onClose={handleCloseDisclaimer}
        onContinue={handleProceedToWhatsApp}
        sellerName={selectedItem?.seller?.name || 'Seller'}
        itemTitle={selectedItem?.title || 'Item'}
      />
    </div>
  );
};
