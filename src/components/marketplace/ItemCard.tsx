
'use client';

import React, { useState } from 'react';
import { MarketplaceItem } from '../../types/marketplace';
import { MarketplaceService } from '../../services/marketplace';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';

interface ItemCardProps {
  item: MarketplaceItem;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleContactSeller = async () => {
    if (!item.seller?.phone) {
      toast.error('Seller phone number not available');
      return;
    }

    // Record view
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id !== item.seller_id) {
        await MarketplaceService.recordView(item.id, user.id);
      }
    } catch (error) {
      console.error('Error recording view:', error);
    }

    // Generate WhatsApp URL
    const whatsappUrl = MarketplaceService.generateWhatsAppUrl(
      item.seller.phone,
      item.title,
      item.seller.name
    );

    window.open(whatsappUrl, '_blank');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === item.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? item.images.length - 1 : prev - 1
    );
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'like_new': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCondition = (condition: string) => {
    return condition.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Image Section */}
      <div className="relative aspect-square bg-gray-200 dark:bg-gray-700">
        {item.images.length > 0 ? (
          <>
            <img
              src={item.images[currentImageIndex]}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            
            {/* Condition Badge */}
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
                {formatCondition(item.condition)}
              </span>
            </div>

            {/* Image Navigation */}
            {item.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-all"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-all"
                >
                  ›
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {item.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-4xl">{item.category?.icon || '📦'}</div>
          </div>
        )}
        
        {/* Views Count */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          👁 {item.views_count}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
          {item.title}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
            ₹{item.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {item.category?.name}
          </span>
        </div>

        {item.location && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-3">
            <span className="mr-1">📍</span>
            {item.location}
          </div>
        )}

        {/* Seller Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {item.seller?.avatar_url ? (
              <img
                src={item.seller.avatar_url}
                alt={item.seller.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {item.seller?.name?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {item.seller?.name}
              </p>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <span className="mr-1">⭐</span>
                {item.seller?.rating?.toFixed(1) || '0.0'}
                <span className="ml-1">({item.seller?.total_sales || 0} sales)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Button */}
        <button
          onClick={handleContactSeller}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <span>💬</span>
          <span>Contact on WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
