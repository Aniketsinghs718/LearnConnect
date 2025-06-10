'use client';

import React, { useState } from 'react';
import { MarketplaceItem } from '../../types/marketplace';
import { MarketplaceService } from '../../services/marketplace';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';

interface ItemCardProps {
  item: MarketplaceItem;
  onContactRequest?: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onContactRequest }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const handleContactSeller = async () => {
    if (!item.seller?.phone) {
      toast.error('Seller phone number not available');
      return;
    }

    // Use callback to show global safety disclaimer
    if (onContactRequest) {
      onContactRequest();
    }  };

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
      case 'new': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'like_new': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'good': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'fair': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  const formatCondition = (condition: string) => {
    return condition.replace('_', ' ').toUpperCase();
  };
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700 hover:border-orange-500/50 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-orange-500/20">
      {/* Image Section */}
      <div className="relative aspect-square bg-gray-800">
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
          </>        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <div className="text-4xl">{item.category?.icon || '📦'}</div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-white mb-2 line-clamp-2">
          {item.title}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-orange-400">
            ₹{item.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-400">
            {item.category?.name}
          </span>
        </div>        {item.college_name && (
          <div className="flex items-center text-sm text-gray-300 mb-3">
            <span className="mr-1">🏫</span>
            {item.college_name}
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
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-300">
                  {item.seller?.name?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-white">
                {item.seller?.name}
              </p>
              <p className="text-xs text-gray-400">
                {item.seller?.college} - {item.seller?.branch}
              </p>
            </div>
          </div>
        </div>        {/* Contact Button */}
        <button
          onClick={handleContactSeller}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <span>💬</span>
          <span>Contact on WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
