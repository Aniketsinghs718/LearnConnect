
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const MobileNavigation: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="grid grid-cols-4 gap-1">
        <Link
          href="/marketplace"
          className={`flex flex-col items-center py-2 px-1 ${
            isActive('/marketplace')
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <span className="text-xl mb-1">🛒</span>
          <span className="text-xs font-medium">Browse</span>
        </Link>
        
        <Link
          href="/marketplace/sell"
          className={`flex flex-col items-center py-2 px-1 ${
            isActive('/marketplace/sell')
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <span className="text-xl mb-1">📤</span>
          <span className="text-xs font-medium">Sell</span>
        </Link>
        
        <Link
          href="/marketplace/profile"
          className={`flex flex-col items-center py-2 px-1 ${
            isActive('/marketplace/profile')
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <span className="text-xl mb-1">👤</span>
          <span className="text-xs font-medium">Profile</span>
        </Link>
        
        <Link
          href="/"
          className={`flex flex-col items-center py-2 px-1 ${
            isActive('/')
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <span className="text-xl mb-1">🏠</span>
          <span className="text-xs font-medium">Home</span>
        </Link>
      </div>
    </div>
  );
};
