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
  isAuthenticated: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Initialize auth - Always verify session first, don't rely on localStorage
    const initializeAuth = async () => {
      try {
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
                if (parsedProfile.id === session.user.id) {
                  setProfile(parsedProfile);
                  setLoading(false);
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
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Listen for auth state changes
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
      // Use the safe profile function that creates profile if missing
      const { data, error } = await supabase
        .rpc('get_user_profile_safe', { user_id: userId });

      if (error) {
        console.error('Error loading user profile:', error);
        
        // Fallback: try direct query and manual creation if needed
        try {
          const { data: directData, error: directError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .maybeSingle(); // Use maybeSingle instead of single to avoid error on 0 rows

          if (directError) {
            console.error('Direct query also failed:', directError);
            setLoading(false);
          } else if (directData) {
            setProfile(directData);
            localStorage.setItem('userProfile', JSON.stringify(directData));
            setLoading(false);
          } else {
            // No profile exists, this shouldn't happen with the trigger
            console.warn('No profile found and safe function failed. User needs to re-register.');
            setLoading(false);
          }
        } catch (fallbackError) {
          console.error('Fallback profile loading failed:', fallbackError);
          setLoading(false);
        }
      } else if (data && data.length > 0) {
        const profileData = data[0];
        setProfile(profileData);
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        setLoading(false);
      } else {
        // No profile data returned
        console.warn('No profile data returned from safe function');
        setLoading(false);
      }
    } catch (error) {
      console.error('Profile loading error:', error);
      setLoading(false);
    }
  };

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!profile
  };
}
