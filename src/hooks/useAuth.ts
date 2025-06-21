'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  year: string;
  semester: string;
  is_admin?: boolean;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;    // Initialize auth - Always verify session first, don't rely on localStorage
    const initializeAuth = async () => {
      try {
        setIsAuthLoading(true);
        
        // Always check session first to prevent auto-login from stale localStorage
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            
            // Check localStorage only if we have a valid session
            const localProfile = localStorage.getItem('userProfile');
            if (localProfile) {
              try {
                const parsedProfile = JSON.parse(localProfile);
                // Verify the localStorage profile matches the current user
                if (parsedProfile && parsedProfile.id === session.user.id) {
                  setProfile(parsedProfile);
                  setLoading(false);
                  setIsAuthLoading(false);
                } else {
                  // Profile doesn't match current user, clear and reload
                  localStorage.removeItem('userProfile');
                  await loadUserProfile(session.user.id);
                }
              } catch (error) {
                localStorage.removeItem('userProfile');
                await loadUserProfile(session.user.id);
              }
            } else {
              // No local profile, load from DB
              await loadUserProfile(session.user.id);
            }
          } else {
            // No session - clear everything
            localStorage.removeItem('userProfile');
            setUser(null);
            setProfile(null);
            setLoading(false);
            setIsAuthLoading(false);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
          setIsAuthLoading(false);
        }
      }
    };    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, !!session?.user);

        if (session?.user) {
          setUser(session.user);
          
          // Always reload profile on auth state change to ensure consistency
          // This prevents stale profile data issues
          await loadUserProfile(session.user.id);
        } else {
          // User logged out - clear everything immediately
          setUser(null);
          setProfile(null);
          localStorage.removeItem('userProfile');
          setLoading(false);
          setIsAuthLoading(false);
        }
      }
    );

    initializeAuth();

    // Cleanup
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      // First try direct query (more reliable)
      const { data: directData, error: directError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();      if (!directError && directData) {
        setProfile(directData);
        localStorage.setItem('userProfile', JSON.stringify(directData));
        setLoading(false);
        setIsAuthLoading(false);
        return;
      }

      // If direct query fails, try the safe function (if it exists)
      try {
        const { data, error } = await supabase
          .rpc('get_user_profile_safe', { user_id: userId });        if (!error && data && data.length > 0) {
          setProfile(data[0]);
          localStorage.setItem('userProfile', JSON.stringify(data[0]));
          setLoading(false);
          setIsAuthLoading(false);
          return;
        }
      } catch (rpcError) {
        console.warn('get_user_profile_safe function not available:', rpcError);
      }

      // If both fail, try to create a minimal profile
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const minimalProfile = {
          id: userId,
          name: userData.user.user_metadata?.name || userData.user.email?.split('@')[0] || 'User',
          email: userData.user.email || '',
          college: userData.user.user_metadata?.college || 'Not specified',
          branch: userData.user.user_metadata?.branch || 'Not specified',
          year: userData.user.user_metadata?.year || 'Not specified',
          semester: userData.user.user_metadata?.semester || 'Not specified',
          phone: '',
          avatar_url: null,
          bio: null,
          preferences: {},
          is_verified: false,
          is_active: true,
          is_admin: false
        };

        // Try to create the profile
        const { data: createdData, error: createError } = await supabase
          .from('users')
          .insert([minimalProfile])
          .select()
          .single();        if (!createError && createdData) {
          setProfile(createdData);
          localStorage.setItem('userProfile', JSON.stringify(createdData));
          setLoading(false);
          setIsAuthLoading(false);
          return;
        } else {
          console.error('Failed to create profile:', createError);
        }
      }      // If everything fails
      console.warn('Could not load or create user profile. User may need to re-register.');
      setLoading(false);
      setIsAuthLoading(false);
      
    } catch (error) {
      console.error('Error loading user profile:', error);
      setLoading(false);
      setIsAuthLoading(false);
    }
  };
  return {
    user,
    profile,
    loading,
    isAuthLoading,
    isAuthenticated: !!profile
  };
}
