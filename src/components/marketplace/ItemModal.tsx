'use client';

import React, { useState, useEffect } from 'react';
import { MarketplaceItem } from '../../types/marketplace';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface ItemModalProps {
  item: MarketplaceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onContactRequest?: () => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, isOpen, onClose, onContactRequest }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !item) return null;

  // Handle click outside to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
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
  };  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">Item Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          {/* Image Section */}
          <div className="lg:w-3/5 relative bg-gray-800 flex-shrink-0">
            {item.images.length > 0 ? (
              <>
                <div className="w-full h-64 sm:h-80 lg:h-full flex items-center justify-center bg-gray-800">
                  <img
                    src={item.images[currentImageIndex]}
                    alt={item.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                
                {/* Image Navigation */}
                {item.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/80 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/80 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {item.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Image counter */}
                {item.images.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {item.images.length}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-64 sm:h-80 lg:h-full flex items-center justify-center text-gray-500">
                <div className="text-6xl">{item.category?.icon || '📦'}</div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="lg:w-2/5 flex flex-col min-h-0">
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {/* Title and Price */}
              <div className="mb-4">
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-tight">{item.title}</h1>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold text-orange-400">
                    ₹{item.price.toLocaleString()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(item.condition)}`}>
                    {formatCondition(item.condition)}
                  </span>
                </div>
                <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                  {item.category?.name}
                </span>
              </div>

              {/* Description */}
              {item.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{item.description}</p>
                </div>
              )}

              {/* College Info */}
              {item.college_name && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Location</h3>
                  <div className="flex items-center text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg">
                    <span className="mr-2">🏫</span>
                    <span className="text-sm sm:text-base">{item.college_name}</span>
                  </div>
                </div>
              )}

              {/* Seller Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Seller Information</h3>
                <div className="flex items-center space-x-3 bg-gray-800/50 p-4 rounded-lg">
                  {item.seller?.avatar_url ? (
                    <img
                      src={item.seller.avatar_url}
                      alt={item.seller.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm sm:text-lg font-medium text-gray-300">
                        {item.seller?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-base sm:text-lg font-medium text-white truncate">{item.seller?.name}</p>
                    <p className="text-sm text-gray-400 truncate">{item.seller?.branch}</p>
                    {item.seller?.phone && (
                      <p className="text-sm text-green-400 flex items-center space-x-1 mt-1">
                        <span>📱</span>
                        <span>{item.seller.phone.slice(0, 6)}****</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Size info for aprons */}
              {item.size && (
                <div className="mb-4 text-center">
                  <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                    Size: {item.size}
                  </span>
                </div>
              )}
            </div>

            {/* Contact Button - Fixed at bottom */}
            <div className="p-4 sm:p-6 border-t border-gray-700 flex-shrink-0">
              <button
                onClick={handleContactSeller}
                disabled={!item.seller?.phone}
                className={`w-full font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  item.seller?.phone 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>💬</span>
                <span>
                  {item.seller?.phone ? 'Contact Seller on WhatsApp' : 'No Phone Number Available'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
