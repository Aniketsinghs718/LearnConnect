
import { supabase } from '../lib/supabaseClient';
import { MarketplaceItem, MarketplaceCategory, MarketplaceFilters, CreateItemData, UserRating } from '../types/marketplace';

export class MarketplaceService {
  // Get all categories
  static async getCategories(): Promise<MarketplaceCategory[]> {
    const { data, error } = await supabase
      .from('marketplace_categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  // Get items with filters
  static async getItems(filters: MarketplaceFilters = {}): Promise<MarketplaceItem[]> {
    let query = supabase
      .from('marketplace_items')
      .select(`
        *,
        seller:users(*),
        category:marketplace_categories(*)
      `)
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (filters.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters.condition) {
      query = query.eq('condition', filters.condition);
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  // Get item by ID
  static async getItemById(id: string): Promise<MarketplaceItem | null> {
    const { data, error } = await supabase
      .from('marketplace_items')
      .select(`
        *,
        seller:users(*),
        category:marketplace_categories(*)
      `)
      .eq('id', id)
      .single();

  if (error) throw error;
    return data;
  }

  // Create new item
  static async createItem(itemData: CreateItemData, sellerId: string): Promise<string> {
    // First upload images
    const imageUrls: string[] = [];
    
    for (const image of itemData.images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `${sellerId}/${fileName}`;

      console.log('Uploading image to path:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('marketplace-images')
        .upload(filePath, image);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('marketplace-images')
        .getPublicUrl(filePath);

      imageUrls.push(publicUrl);
    }    // Create item
    console.log('Creating marketplace item with data:', {
      seller_id: sellerId,
      title: itemData.title,
      category_id: itemData.category_id,
      price: itemData.price,
      condition: itemData.condition,
      location: itemData.location,
      images: imageUrls
    });

    const { data, error } = await supabase
      .from('marketplace_items')
      .insert({
        seller_id: sellerId,
        title: itemData.title,
        description: itemData.description,
        category_id: itemData.category_id,
        price: itemData.price,
        condition: itemData.condition,
        location: itemData.location,
        images: imageUrls
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  }

  // Update item
  static async updateItem(id: string, updates: Partial<MarketplaceItem>): Promise<void> {
    const { error } = await supabase
      .from('marketplace_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }

  // Mark item as sold
  static async markAsSold(id: string): Promise<void> {
    const { error } = await supabase
      .from('marketplace_items')
      .update({ 
        is_sold: true, 
        is_available: false,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) throw error;
  }

  // Record item view
  static async recordView(itemId: string, viewerId: string): Promise<void> {
    // Check if user already viewed this item today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: existingView } = await supabase
      .from('marketplace_item_views')
      .select('id')
      .eq('item_id', itemId)
      .eq('viewer_id', viewerId)
      .gte('viewed_at', today.toISOString())
      .single();

    if (!existingView) {
      // Record new view
      await supabase
        .from('marketplace_item_views')
        .insert({ item_id: itemId, viewer_id: viewerId });

      // Increment view count
      await supabase.rpc('increment_item_views', { item_id: itemId });
    }
  }

  // Get user's items
  static async getUserItems(userId: string): Promise<MarketplaceItem[]> {
    const { data, error } = await supabase
      .from('marketplace_items')
      .select(`
        *,
        category:marketplace_categories(*)
      `)
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get user ratings
  static async getUserRatings(userId: string): Promise<UserRating[]> {
    const { data, error } = await supabase
      .from('user_ratings')
      .select(`
        *,
        rater:users(name, avatar_url)
      `)
      .eq('rated_user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Add rating
  static async addRating(ratedUserId: string, raterId: string, rating: number, review: string, itemId: string): Promise<void> {
    const { error } = await supabase
      .from('user_ratings')
      .insert({
        rated_user_id: ratedUserId,
        rater_id: raterId,
        rating,
        review,
        item_id: itemId
      });

    if (error) throw error;

    // Update user's average rating
    await this.updateUserRating(ratedUserId);
  }

  // Update user's average rating
  private static async updateUserRating(userId: string): Promise<void> {
    const { data } = await supabase
      .from('user_ratings')
      .select('rating')
      .eq('rated_user_id', userId);

    if (data && data.length > 0) {
      const averageRating = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
      
      await supabase
        .from('users')
        .update({ rating: Number(averageRating.toFixed(2)) })
        .eq('id', userId);
    }
  }

  // Generate WhatsApp URL
  static generateWhatsAppUrl(phone: string, itemTitle: string, sellerName: string): string {
    const message = `Hi ${sellerName}! I'm interested in your "${itemTitle}" listed on LearnConnect marketplace. Is it still available?`;
    const cleanPhone = phone.replace(/[^\d]/g, '');
    const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  }
}
