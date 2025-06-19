'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogIn, UserPlus, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

interface UserMenuProps {
  mounted: boolean;
}

export default function UserMenu({ mounted }: UserMenuProps) {
  const { profile, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Clear localStorage first
      localStorage.removeItem("userProfile");
      localStorage.removeItem("selectedBranch");
      localStorage.removeItem("selectedYear");
      localStorage.removeItem("selectedSemester");
      localStorage.removeItem("marketplace_cache_v3");
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Force redirect to homepage
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      // Force redirect even if sign out fails
      window.location.href = '/';
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center space-x-3">
      {isAuthenticated && profile ? (
        <div className="flex items-center space-x-3">
          <Link 
            href="/auth/profile"
            className="px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600 transition-all duration-200 flex items-center space-x-2 text-gray-200 hover:text-orange-400"
          >
            <User className="w-4 h-4" />
            <span>{profile.name}</span>
          </Link>
          <button 
            onClick={handleSignOut}
            className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 hover:scale-105"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600 transition-all duration-200 flex items-center space-x-2 text-gray-200 hover:text-orange-400"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>
          <Link
            href="/auth/register"
            className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 flex items-center space-x-2 hover:scale-105"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register</span>
          </Link>
        </div>
      )}
    </div>
  );
}
