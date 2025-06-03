
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
  location?: string;
  is_available: boolean;
  is_sold: boolean;
  views_count: number;
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
  rating: number;
  total_sales: number;
  created_at: string;
}

export interface UserRating {
  id: string;
  rated_user_id: string;
  rater_id: string;
  rating: number;
  review?: string;
  item_id: string;
  created_at: string;
  rater?: User;
}

export interface MarketplaceFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  location?: string;
  search?: string;
}

export interface CreateItemData {
  title: string;
  description?: string;
  category_id: string;
  price: number;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  location?: string;
  images: File[];
}
