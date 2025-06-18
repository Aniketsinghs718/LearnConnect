'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Global marketplace cache that persists across route changes
export const MarketplaceCache = {
  data: null as any,
  timestamp: null as number | null,
  
  set(items: any[], categories: any[]) {
    this.data = { items, categories };
    this.timestamp = Date.now();
    
    // Also store in localStorage as backup
    try {
      localStorage.setItem('marketplace_global_cache', JSON.stringify({
        items,
        categories,
        timestamp: this.timestamp
      }));
    } catch (error) {
      console.error('Failed to set localStorage cache:', error);
    }
  },
  
  get() {
    // First try memory cache
    if (this.data && this.timestamp && (Date.now() - this.timestamp < 5 * 60 * 1000)) {
      return this.data;
    }
    
    // Then try localStorage
    try {
      const cached = localStorage.getItem('marketplace_global_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.timestamp && (Date.now() - parsed.timestamp < 5 * 60 * 1000)) {
          this.data = { items: parsed.items, categories: parsed.categories };
          this.timestamp = parsed.timestamp;
          return this.data;
        }
      }
    } catch (error) {
      console.error('Failed to get localStorage cache:', error);
    }
    
    return null;
  },
  
  clear() {
    this.data = null;
    this.timestamp = null;
    try {
      localStorage.removeItem('marketplace_global_cache');
    } catch (error) {
      console.error('Failed to clear localStorage cache:', error);
    }
  }
};

// Hook to preload marketplace data when navigating TO marketplace
export function useMarketplacePreloader() {
  const pathname = usePathname();
  
  useEffect(() => {
    // If we're on marketplace page, don't preload
    if (pathname === '/marketplace') return;
    
    // Check if we have cached data, if not, start preloading
    const cached = MarketplaceCache.get();
    if (!cached) {      // Preload marketplace data in background
      import('../services/marketplace').then(({ MarketplaceService }) => {
        Promise.all([
          MarketplaceService.getCategories(),
          MarketplaceService.getItems({})
        ]).then(([categories, items]) => {
          MarketplaceCache.set(items, categories);
        }).catch(error => {
          console.error('Background preload failed:', error);
        });
      });
    }
  }, [pathname]);
}
