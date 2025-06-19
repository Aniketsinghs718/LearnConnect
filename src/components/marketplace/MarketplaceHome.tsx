'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MarketplaceItem, MarketplaceCategory, MarketplaceFilters } from '../../types/marketplace';
import { MarketplaceService } from '../../services/marketplace';
import { ItemCard } from './ItemCard';
import { FilterSection } from './FilterSection';
import { SafetyDisclaimer } from './SafetyDisclaimer';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import toast from 'react-hot-toast';

// Simple cache - just localStorage
const CACHE_KEY = 'marketplace_cache_v3'; // Updated version to clear old cache
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes for better performance

const getCache = () => {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const data = JSON.parse(cached);
    if (Date.now() - data.timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return data;
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
};

const setCache = (items: MarketplaceItem[], categories: MarketplaceCategory[]) => {
  if (typeof window === 'undefined') return;
  try {
    // Only cache if we have valid data
    if (items.length > 0 && categories.length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        items,
        categories,
        timestamp: Date.now()
      }));
    }
  } catch (error) {
    console.error('Cache error:', error);
    // Clear cache if there's an error storing
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (clearError) {
      console.error('Cache clear error:', clearError);
    }
  }
};

const MarketplaceHome: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [allItems, setAllItems] = useState<MarketplaceItem[]>([]); // Store all items for filtering
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  const [showSafetyDisclaimer, setShowSafetyDisclaimer] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  
  // Use useRef for timeout to avoid dependency issues
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      try {
        // Check cache immediately for fast initial load
        const cached = getCache();
        if (cached && mounted) {
          console.log('Using cached data');
          setItems(cached.items);
          setAllItems(cached.items);
          setCategories(cached.categories);
          setLoading(false);
          return;
        }

        if (mounted) {
          console.log('Loading fresh data');
          setLoading(true);
          setError(null);

          // Add timeout to prevent infinite loading
          const loadingTimeout = setTimeout(() => {
            if (mounted) {
              console.warn('Loading timeout reached');
              setError('Loading is taking too long. Please try refreshing the page.');
              setLoading(false);
            }
          }, 15000); // 15 second timeout

          try {
            // Load fresh data with error handling
            const [categoriesData, itemsData] = await Promise.all([
              MarketplaceService.getCategories().catch(err => {
                console.error('Categories load error:', err);
                return [];
              }),
              MarketplaceService.getItems({}).catch(err => {
                console.error('Items load error:', err);
                return [];
              })
            ]);

            clearTimeout(loadingTimeout);

            if (mounted) {
              setCategories(categoriesData);
              setItems(itemsData);
              setAllItems(itemsData);
              setCache(itemsData, categoriesData);
              console.log('Data loaded and cached');
            }
          } catch (error) {
            clearTimeout(loadingTimeout);
            throw error;
          }
        }

      } catch (error) {
        console.error('Loading error:', error);
        if (mounted) {
          setError('Failed to load marketplace. Please check your connection and try again.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();
    
    return () => {
      mounted = false;
    };
  }, []);  // Handle filter changes with proper debouncing
  useEffect(() => {
    // Clear any existing timeouts
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
      filterTimeoutRef.current = null;
    }
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    
    // Check if filters are empty or cleared
    const hasActiveFilters = Object.values(filters).some(value => 
      value !== undefined && value !== null && value !== ''
    );

    if (!hasActiveFilters) {
      // No filters applied - show all items immediately
      setItems(allItems);
      setFilterLoading(false);
      return;
    }

    // Show loading state immediately for better UX
    setFilterLoading(true);

    // Safety timeout to prevent stuck loading
    loadingTimeoutRef.current = setTimeout(() => {
      console.warn('Filter loading timeout - forcing stop');
      setFilterLoading(false);
      setItems(allItems); // Show all items as fallback
    }, 8000); // 8 second safety timeout

    // Debounce the actual API call
    filterTimeoutRef.current = setTimeout(async () => {
      try {
        console.log('Applying filters:', filters);
        const itemsData = await MarketplaceService.getItems(filters);
        
        // Clear the safety timeout since we got results
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        
        setItems(itemsData);
        setFilterLoading(false);
        console.log('Filter results loaded:', itemsData.length, 'items');
      } catch (error) {
        console.error('Filter error:', error);
        
        // Clear the safety timeout
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        
        // On error, show all items and stop loading
        setItems(allItems);
        setFilterLoading(false);
        console.warn('Failed to filter items, showing all items');
      }
    }, 300); // 300ms debounce
    
  }, [filters, allItems]);

  const handleFilterChange = (newFilters: MarketplaceFilters) => {
    console.log('Filter change requested:', newFilters);
    setFilters(newFilters);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const handleContactRequest = () => {
    // ItemCard handles its own logic
  };
  // Error state
  if (error && items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-500/20 backdrop-blur-sm rounded-3xl p-8 border border-red-500/30">
            <div className="text-red-400 text-7xl mb-6">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">{error}</p>
            <button
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state - only if no data
  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="text-center">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-12 border border-gray-700/50 shadow-xl">
            <LoadingSpinner />
            <p className="mt-6 text-gray-300 font-medium text-lg">Loading marketplace...</p>
            <p className="mt-2 text-gray-500 text-sm">Discovering amazing deals for you</p>
          </div>
        </div>
      </div>
    );
  }  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700/50 shadow-xl">
          <FilterSection 
            categories={categories} 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>        {/* Loading for filters */}
        {filterLoading && (
          <div className="text-center py-6">
            <div className="inline-flex items-center space-x-3 bg-gray-800/70 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-600/50">
              <LoadingSpinner />
              <span className="text-gray-300 font-medium">Updating results...</span>
            </div>
          </div>
        )}

        {/* Show error if there's one but we still have some items to show */}
        {error && items.length > 0 && (
          <div className="text-center py-4">
            <div className="inline-flex items-center space-x-3 bg-yellow-800/70 backdrop-blur-sm px-6 py-3 rounded-full border border-yellow-600/50">
              <span className="text-yellow-300 font-medium">⚠️ {error}</span>
            </div>
          </div>
        )}        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="transform hover:scale-105 transition-all duration-300 hover:z-10"
            >
              <ItemCard
                item={item}
                onContactRequest={handleContactRequest}
              />
            </div>
          ))}
        </div>        {/* Empty State */}
        {!loading && !filterLoading && items.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto border border-gray-700/30">
              <div className="text-7xl mb-6 opacity-50">📦</div>
              <h3 className="text-2xl font-bold text-white mb-4">No items found</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {Object.values(filters).some(value => value !== undefined && value !== null && value !== '')
                  ? "Try adjusting your filters to see more results." 
                  : "Be the first to list an item! Check back later for new listings."
                }
              </p>
              {Object.values(filters).some(value => value !== undefined && value !== null && value !== '') && (
                <button
                  onClick={() => setFilters({})}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Safety Disclaimer */}
        {showSafetyDisclaimer && selectedItem && (
          <SafetyDisclaimer
            isOpen={showSafetyDisclaimer}
            onClose={() => setShowSafetyDisclaimer(false)}
            onContinue={() => setShowSafetyDisclaimer(false)}
            sellerName={selectedItem.seller?.name || 'Seller'}
            itemTitle={selectedItem.title}
          />
        )}
      </div>
    </div>
  );
};

export default MarketplaceHome;