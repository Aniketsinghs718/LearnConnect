import { supabase } from '../lib/supabaseClient';
import { MarketplaceItem, MarketplaceCategory, MarketplaceFilters, CreateItemData } from '../types/marketplace';

export class MarketplaceService {
  // Get all categories
  static async getCategories(): Promise<MarketplaceCategory[]> {
    const { data, error } = await supabase
      .from('marketplace_categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }  // Get items with filters
  static async getItems(filters: MarketplaceFilters = {}): Promise<MarketplaceItem[]> {
    let query = supabase
      .from('marketplace_items')
      .select(`
        *,
        seller:users(*),
        category:marketplace_categories(*)
      `)
      .eq('is_available', true);

    // Apply filters
    if (filters.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters.condition) {
      query = query.eq('condition', filters.condition);
    }

    if (filters.college_name) {
      query = query.ilike('college_name', `%${filters.college_name}%`);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    switch (filters.sortBy) {
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'price_low_to_high':
        query = query.order('price', { ascending: true });
        break;
      case 'price_high_to_low':
        query = query.order('price', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
        break;
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
    }

    // Create item
    const { data, error } = await supabase
      .from('marketplace_items')
      .insert({
        seller_id: sellerId,
        title: itemData.title,
        description: itemData.description,
        category_id: itemData.category_id,
        price: itemData.price,
        condition: itemData.condition,
        college_name: itemData.college_name,
        size: itemData.size,
        images: imageUrls
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  }

  // Update item
  static async updateItem(id: string, updates: Partial<CreateItemData>): Promise<void> {
    const { error } = await supabase
      .from('marketplace_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }

  // Mark item as sold using the database function
  static async markAsSold(id: string): Promise<void> {
    const { error } = await supabase.rpc('mark_item_as_sold', {
      item_id: id
    });

    if (error) throw error;
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

  // Delete item
  static async deleteItem(id: string): Promise<void> {
    // First get the item to access images for cleanup
    const { data: item } = await supabase
      .from('marketplace_items')
      .select('images')
      .eq('id', id)
      .single();

    // Delete the item
    const { error } = await supabase
      .from('marketplace_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Clean up images from storage
    if (item?.images && item.images.length > 0) {
      const filePaths = item.images.map((url: string) => {
        const urlParts = url.split('/');
        return urlParts.slice(-2).join('/'); // Get seller_id/filename
      });

      await supabase.storage
        .from('marketplace-images')
        .remove(filePaths);
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
