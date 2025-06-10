
'use client';

import React from 'react';
import { MarketplaceCategory, MarketplaceFilters } from '../../types/marketplace';

interface FilterSectionProps {
  categories: MarketplaceCategory[];
  filters: MarketplaceFilters;
  onFilterChange: (filters: MarketplaceFilters) => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  categories,
  filters,
  onFilterChange,
}) => {
  const handleFilterChange = (key: keyof MarketplaceFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    if (value === '' || value === undefined) {
      delete newFilters[key];
    }
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;
  return (
    <div className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search items..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}        <div className="flex flex-wrap gap-4 items-center">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('category', '')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                !filters.category
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleFilterChange('category', category.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center space-x-1 ${
                  filters.category === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Sort By Filter */}
          <select
            value={filters.sortBy || 'newest'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="px-3 py-1 text-sm border border-gray-600 rounded bg-gray-800 text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_low_to_high">Price: Low to High</option>
            <option value="price_high_to_low">Price: High to Low</option>
          </select>

          {/* Condition Filter */}
          <select
            value={filters.condition || ''}
            onChange={(e) => handleFilterChange('condition', e.target.value)}
            className="px-3 py-1 text-sm border border-gray-600 rounded bg-gray-800 text-white"
          >
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="like_new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>

          {/* College Name Filter */}
          <input
            type="text"
            placeholder="College Name"
            value={filters.college_name || ''}
            onChange={(e) => handleFilterChange('college_name', e.target.value)}
            className="px-3 py-1 text-sm border border-gray-600 rounded bg-gray-800 text-white placeholder-gray-400"
          />

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-sm text-orange-400 hover:text-orange-300 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
