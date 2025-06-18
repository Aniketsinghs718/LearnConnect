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

    // Check localStorage immediately for faster loading
    const checkLocalStorage = () => {
      if (typeof window !== 'undefined') {
        const localProfile = localStorage.getItem('userProfile');
        if (localProfile) {
          try {
            const parsedProfile = JSON.parse(localProfile);
            setProfile(parsedProfile);
            setLoading(false); // Stop loading immediately if we have local data
            return parsedProfile;
          } catch (error) {
            localStorage.removeItem('userProfile');
          }
        }
      }
      return null;
    };

    // Initialize auth
    const initializeAuth = async () => {
      try {
        // First check localStorage for immediate response
        const localProfile = checkLocalStorage();
        
        // Then verify session with Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            
            if (!localProfile) {
              // Only load from DB if no local profile
              await loadUserProfile(session.user.id);
            }
          } else {
            // No session - clear everything
            if (localProfile) {
              localStorage.removeItem('userProfile');
              setProfile(null);
            }
            setUser(null);
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

        if (session?.user) {
          setUser(session.user);
          
          // Load profile if we don't have one
          if (!profile) {
            await loadUserProfile(session.user.id);
          }
        } else {
          // User logged out
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
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
      } else if (data) {
        setProfile(data);
        localStorage.setItem('userProfile', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Profile loading error:', error);
    } finally {
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
