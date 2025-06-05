import { supabase } from '../lib/supabaseClient';
import { MarketplaceItem, User, AdminStats, AdminVerificationAction } from '../types/marketplace';

export class AdminService {
  // Check if current user is admin
  static async isAdmin(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: userData } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      return userData?.is_admin || false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }  // Get all items for admin review (including pending, approved, rejected)
  static async getAllItems(): Promise<MarketplaceItem[]> {
    const { data, error } = await supabase
      .from('marketplace_items')
      .select(`
        *,
        seller:users!marketplace_items_seller_id_fkey(*),
        category:marketplace_categories(*),
        verified_by_admin:users!marketplace_items_verified_by_fkey(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }  // Get items by verification status
  static async getItemsByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<MarketplaceItem[]> {
    const { data, error } = await supabase
      .from('marketplace_items')
      .select(`
        *,
        seller:users!marketplace_items_seller_id_fkey(*),
        category:marketplace_categories(*),
        verified_by_admin:users!marketplace_items_verified_by_fkey(*)
      `)
      .eq('verification_status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get pending items (most important for admin)
  static async getPendingItems(): Promise<MarketplaceItem[]> {
    return this.getItemsByStatus('pending');
  }

  // Get admin dashboard statistics
  static async getAdminStats(): Promise<AdminStats> {
    try {
      // Get item counts by status
      const { data: itemStats } = await supabase
        .from('marketplace_items')
        .select('verification_status')
        .neq('verification_status', null);

      // Get total users count
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get recent items
      const { data: recentItems } = await supabase
        .from('marketplace_items')
        .select(`
          *,
          seller:users!marketplace_items_seller_id_fkey(*),
          category:marketplace_categories(*)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Calculate stats
      const totalItems = itemStats?.length || 0;
      const pendingItems = itemStats?.filter(item => item.verification_status === 'pending').length || 0;
      const approvedItems = itemStats?.filter(item => item.verification_status === 'approved').length || 0;
      const rejectedItems = itemStats?.filter(item => item.verification_status === 'rejected').length || 0;

      return {
        totalItems,
        pendingItems,
        approvedItems,
        rejectedItems,
        totalUsers: totalUsers || 0,
        recentItems: recentItems || []
      };
    } catch (error) {
      console.error('Error getting admin stats:', error);
      throw error;
    }
  }

  // Approve an item
  static async approveItem(itemId: string, adminNotes?: string): Promise<void> {
    const { error } = await supabase.rpc('approve_marketplace_item', {
      item_id: itemId,
      admin_notes_text: adminNotes || null
    });

    if (error) throw error;
  }

  // Reject an item
  static async rejectItem(itemId: string, reason: string, adminNotes?: string): Promise<void> {
    const { error } = await supabase.rpc('reject_marketplace_item', {
      item_id: itemId,
      reason: reason,
      admin_notes_text: adminNotes || null
    });

    if (error) throw error;
  }

  // Perform bulk verification actions
  static async performBulkAction(
    itemIds: string[], 
    action: 'approve' | 'reject', 
    reason?: string,
    adminNotes?: string
  ): Promise<void> {
    const promises = itemIds.map(itemId => {
      if (action === 'approve') {
        return this.approveItem(itemId, adminNotes);
      } else {
        return this.rejectItem(itemId, reason || 'Bulk rejection', adminNotes);
      }
    });

    await Promise.all(promises);
  }

  // Get all users (for admin user management)
  static async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Make user admin
  static async makeUserAdmin(userId: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ is_admin: true })
      .eq('id', userId);

    if (error) throw error;
  }

  // Remove admin privileges
  static async removeAdminPrivileges(userId: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ is_admin: false })
      .eq('id', userId);

    if (error) throw error;
  }  // Search items with admin filters
  static async searchItems(searchTerm: string, status?: string): Promise<MarketplaceItem[]> {
    let query = supabase
      .from('marketplace_items')
      .select(`
        *,
        seller:users!marketplace_items_seller_id_fkey(*),
        category:marketplace_categories(*),
        verified_by_admin:users!marketplace_items_verified_by_fkey(*)
      `);    if (status && status !== 'all') {
      query = query.eq('verification_status', status);
    }

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
