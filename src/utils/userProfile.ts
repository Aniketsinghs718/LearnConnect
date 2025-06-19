// Create or update user profile utility
import { supabase } from '@/lib/supabaseClient';

export interface CreateUserProfileData {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  year: string;
  semester: string;
}

export async function createUserProfile(data: CreateUserProfileData) {
  const { error } = await supabase.from('users').insert([
    {
      id: data.id,
      name: data.name,
      email: data.email,
      college: data.college,
      branch: data.branch,
      year: data.year,
      semester: data.semester,
      phone: '',
      avatar_url: null,
      is_verified: false,
      is_active: true,
      is_admin: false
    },
  ]);

  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle(); // Use maybeSingle instead of single to handle 0 rows gracefully

  if (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }

  if (!data) {
    throw new Error('User profile not found');
  }

  return data;
}

export async function ensureUserProfile(userId: string, email: string) {
  try {
    // Use the safe database function that creates profile if missing
    const { data, error } = await supabase
      .rpc('get_user_profile_safe', { user_id: userId });

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      return data[0];
    }

    // Fallback: try direct query
    const { data: directData, error: directError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (directError) {
      throw directError;
    }

    if (directData) {
      return directData;
    }

    // Last resort: create manually
    const minimalProfile = {
      id: userId,
      name: email.split('@')[0],
      email: email,
      college: 'Not specified',
      branch: 'Not specified', 
      year: 'Not specified',
      semester: 'Not specified'
    };

    await createUserProfile(minimalProfile);
    return await getUserProfile(userId);
    
  } catch (error) {
    console.error('ensureUserProfile error:', error);
    throw error;
  }
}
