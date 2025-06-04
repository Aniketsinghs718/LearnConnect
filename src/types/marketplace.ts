export interface MarketplaceCategory {
  id: string;
  name: string;
  icon: string;
  created_at: string;
}

export interface MarketplaceItem {
  id: string;
  seller_id: string;
  title: string;
  description?: string;
  category_id: string;
  price: number;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  images: string[];
  college_name?: string;
  size?: 'M' | 'L' | 'XL'; // For aprons only
  is_available: boolean;
  is_sold: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  seller?: User;
  category?: MarketplaceCategory;
}

export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  year: string;
  semester: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
}

export interface CreateItemData {
  title: string;
  description?: string;
  category_id: string;
  price: number;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  college_name?: string;
  size?: 'M' | 'L' | 'XL';
  images: File[];
}

export interface MarketplaceFilters {
  category?: string;
  condition?: 'new' | 'like_new' | 'good' | 'fair';
  college_name?: string;
  search?: string;
  sortBy?: 'price_low_to_high' | 'price_high_to_low' | 'newest' | 'oldest';
}
