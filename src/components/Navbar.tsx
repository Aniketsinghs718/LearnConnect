"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserMenu,
  NavbarLogo
} from "@/components/features/navbar";

const Navbar = () => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-gray-900/90 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavbarLogo />

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-white hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              href="/marketplace"
              className="text-white hover:text-blue-400 transition-colors duration-200 font-medium flex items-center space-x-1"
            >
              <span>🛒</span>
              <span>Marketplace</span>
            </Link>
            <Link
              href="/marketplace/sell"
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition-colors duration-200 font-medium flex items-center space-x-1"
            >
              <span>📤</span>
              <span>Sell</span>
            </Link>
            <Link
              href="/marketplace/profile"
              className="text-white hover:text-blue-400 transition-colors duration-200 font-medium flex items-center space-x-1"
            >
              <span>👤</span>
              <span>My Items</span>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            <UserMenu mounted={mounted} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
