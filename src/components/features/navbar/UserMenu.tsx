'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogIn, UserPlus, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface UserMenuProps {
  mounted: boolean;
}

export default function UserMenu({ mounted }: UserMenuProps) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!mounted) return;

    // Check for user profile in localStorage
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      setUser(JSON.parse(userProfile));
    }
  }, [mounted]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("userProfile");
    setUser(null);
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center space-x-3">
      {user ? (
        <div className="flex items-center space-x-3">
          <Link 
            href="/auth/profile"
            className="px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600 transition-all duration-200 flex items-center space-x-2 text-gray-200 hover:text-orange-400"
          >
            <User className="w-4 h-4" />
            <span>{user.name}</span>
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
