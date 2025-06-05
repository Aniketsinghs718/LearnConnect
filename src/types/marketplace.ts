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
  original_price?: number;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  college_name: string; // Database column name
  size?: 'M' | 'L' | 'XL'; // For aprons only
  images: string[];
  tags?: string[];
  is_available: boolean;
  is_featured?: boolean;
  view_count?: number;
  favorite_count?: number;
  contact_info?: any;
  metadata?: any;
  // Admin verification fields (optional for backward compatibility)
  verification_status?: 'pending' | 'approved' | 'rejected';
  verified_at?: string;
  verified_by?: string;
  rejection_reason?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  seller?: User;
  category?: MarketplaceCategory;
  verified_by_admin?: User;
  // Computed fields for backward compatibility
  location?: string; // Mapped from college_name for legacy code
  is_sold?: boolean; // Computed from is_available
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
  is_admin?: boolean;
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

export interface AdminVerificationAction {
  itemId: string;
  action: 'approve' | 'reject';
  reason?: string;
  adminNotes?: string;
}

export interface AdminStats {
  totalItems: number;
  pendingItems: number;
  approvedItems: number;
  rejectedItems: number;
  totalUsers: number;
  recentItems: MarketplaceItem[];
}
