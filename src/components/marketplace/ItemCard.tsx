'use client';

import React, { useState } from 'react';
import { MarketplaceItem } from '../../types/marketplace';
import { MarketplaceService } from '../../services/marketplace';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';

interface ItemCardProps {
  item: MarketplaceItem;
  onContactRequest?: () => void;
  onItemClick?: (item: MarketplaceItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onContactRequest, onItemClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleCardClick = () => {
    if (onItemClick) {
      onItemClick(item);
    }
  };
  const handleContactSeller = async () => {
    if (!item.seller?.phone) {
      toast.error('Seller phone number not available');
      return;
    }

    // Validate phone number format
    const phoneNumber = item.seller.phone.replace(/\D/g, ''); // Remove non-digits
    if (phoneNumber.length !== 10) {
      toast.error('Invalid seller phone number');
      return;
    }

    // Use callback to show global safety disclaimer
    if (onContactRequest) {
      onContactRequest();
    }

    // Create WhatsApp link with proper Indian number format
    const whatsappNumber = `91${phoneNumber}`; // Add India country code
    const message = encodeURIComponent(
      `Hi! I'm interested in your ${item.title} listed on LearnConnect for ₹${item.price}. Is it still available?`
    );
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
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
    <div 
      onClick={handleCardClick}
      className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer transform hover:scale-105 max-w-sm mx-auto"
    >
      {/* Image Section */}
      <div className="relative h-64 sm:h-70 bg-gray-800">
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

            {/* Price Badge */}
            <div className="absolute top-2 right-2">
              <span className="bg-black/70 text-white px-2 py-1 rounded-full text-sm font-bold">
                ₹{item.price.toLocaleString()}
              </span>
            </div>

            {/* Image Navigation - Only show if multiple images */}
            {item.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-black/80 transition-all"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-black/80 transition-all"
                >
                  ›
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {item.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <div className="text-3xl">{item.category?.icon || '📦'}</div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4">
        {/* Title and Category - Side by side */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-sm sm:text-base text-white line-clamp-2 leading-tight flex-1 mr-2">
            {item.title}
          </h3>
          <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
            {item.category?.name}
          </span>
        </div>

        {/* College Info */}
        {item.college_name && (
          <div className="flex items-center text-xs text-gray-300 mb-2 bg-gray-800/50 px-2 py-1 rounded-lg">
            <span className="mr-1">🏫</span>
            <span className="truncate">{item.college_name}</span>
          </div>
        )}

        {/* Seller Info - Simple */}
        <div className="flex items-center space-x-2">
          {item.seller?.avatar_url ? (
            <img
              src={item.seller.avatar_url}
              alt={item.seller.name}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-gray-300">
                {item.seller?.name?.charAt(0) || 'U'}
              </span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-white truncate">
              {item.seller?.name}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {item.seller?.branch}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
