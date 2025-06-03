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
      rating: 0.0,
      total_sales: 0,
      is_verified: false
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
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }

  return data;
}

export async function ensureUserProfile(userId: string, email: string) {
  try {
    // Try to get existing profile
    const profile = await getUserProfile(userId);
    return profile;
  } catch (error) {
    // If profile doesn't exist, create a minimal one
    console.log('Creating minimal user profile for existing auth user');
    
    const minimalProfile = {
      id: userId,
      name: email.split('@')[0], // Use email prefix as name
      email: email,
      college: 'Not specified',
      branch: 'Not specified', 
      year: 'Not specified',
      semester: 'Not specified'
    };

    await createUserProfile(minimalProfile);
    return await getUserProfile(userId);
  }
}
