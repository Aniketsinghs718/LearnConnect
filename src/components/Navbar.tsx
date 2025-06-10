"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import {
  UserMenu,
  NavbarLogo
} from "@/components/features/navbar";
import { AdminService } from "@/services/adminService";

const Navbar = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const adminStatus = await AdminService.isAdmin();
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <nav className="relative z-50 bg-black/95 backdrop-blur-md border-b border-orange-500/20 shadow-lg shadow-orange-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <NavbarLogo />

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-white hover:text-orange-400 transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              href="/marketplace"
              className="text-white hover:text-orange-400 transition-colors duration-200 font-medium flex items-center space-x-1"
            >
              <span>🛒</span>
              <span>Marketplace</span>
            </Link>
            <Link
              href="/marketplace/sell"
              className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-md transition-colors duration-200 font-medium flex items-center space-x-1"
            >
              <span>📤</span>
              <span>Sell</span>
            </Link>
            <Link
              href="/marketplace/profile"
              className="text-white hover:text-orange-400 transition-colors duration-200 font-medium flex items-center space-x-1"
            >
              <span>👤</span>
              <span>My Items</span>
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-md transition-colors duration-200 font-medium flex items-center space-x-1"
              >
                <span>🛡️</span>
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* User Menu */}
            <UserMenu mounted={mounted} />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <UserMenu mounted={mounted} />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-50 p-2 text-gray-300 hover:text-orange-400 transition-all duration-300 group"
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <span 
                  className={`absolute w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
                  }`}
                />
                <span 
                  className={`absolute w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span 
                  className={`absolute w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                    isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-black/95 backdrop-blur-md border-b border-orange-500/20 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <Link
                href="/"
                className="flex py-3 text-white hover:text-orange-400 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/marketplace"
                className="flex py-3 text-white hover:text-orange-400 transition-colors duration-200 font-medium items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>🛒</span>
                <span>Marketplace</span>
              </Link>
              <Link
                href="/marketplace/sell"
                className="flex py-3 bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-lg transition-colors duration-200 font-medium items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>📤</span>
                <span>Sell</span>
              </Link>
              <Link
                href="/marketplace/profile"
                className="flex py-3 text-white hover:text-orange-400 transition-colors duration-200 font-medium items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>👤</span>
                <span>My Items</span>
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex py-3 bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-lg transition-colors duration-200 font-medium items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>🛡️</span>
                  <span>Admin</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
