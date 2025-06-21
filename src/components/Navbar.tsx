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

  // Close menu on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

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
    <>
      <nav className="relative z-50 bg-black/95 backdrop-blur-md border-b border-orange-500/20 shadow-lg shadow-orange-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <NavbarLogo />

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-white hover:text-orange-400 transition-all duration-200 font-medium transform hover:scale-105"
              >
                Home
              </Link>
              <Link
                href="/marketplace"
                className="text-white hover:text-orange-400 transition-all duration-200 font-medium flex items-center space-x-1 transform hover:scale-105"
              >
                <span>🛒</span>
                <span>Marketplace</span>
              </Link>
              <Link
                href="/marketplace/sell"
                className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-md transition-all duration-200 font-medium flex items-center space-x-1 transform hover:scale-105"
              >
                <span>📤</span>
                <span>Sell</span>
              </Link>
              <Link
                href="/marketplace/profile"
                className="text-white hover:text-orange-400 transition-all duration-200 font-medium flex items-center space-x-1 transform hover:scale-105"
              >
                <span>👤</span>
                <span>My Items</span>
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-md transition-all duration-200 font-medium flex items-center space-x-1 transform hover:scale-105"
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
                className="relative z-60 p-2 text-gray-300 hover:text-orange-400 transition-all duration-300 rounded-lg hover:bg-white/10 transform hover:scale-110"
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
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation */}
      <div className={`fixed top-16 md:top-20 left-0 right-0 z-50 md:hidden transition-all duration-300 ease-in-out transform ${
        isMenuOpen 
          ? 'translate-y-0 opacity-100 visible' 
          : '-translate-y-full opacity-0 invisible'
      }`}>
        <div className="bg-black/95 backdrop-blur-md border-b border-orange-500/20 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="space-y-1">
              <Link
                href="/"
                className="flex py-3 px-4 text-white hover:text-orange-400 hover:bg-white/10 transition-all duration-200 font-medium rounded-lg transform hover:scale-105"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                href="/marketplace"
                className="flex py-3 px-4 text-white hover:text-orange-400 hover:bg-white/10 transition-all duration-200 font-medium items-center space-x-2 rounded-lg transform hover:scale-105"
                onClick={closeMenu}
              >
                <span>🛒</span>
                <span>Marketplace</span>
              </Link>
              <Link
                href="/marketplace/sell"
                className="flex py-3 bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-lg transition-all duration-200 font-medium items-center space-x-2 mt-2 transform hover:scale-105"
                onClick={closeMenu}
              >
                <span>📤</span>
                <span>Sell</span>
              </Link>
              <Link
                href="/marketplace/profile"
                className="flex py-3 px-4 text-white hover:text-orange-400 hover:bg-white/10 transition-all duration-200 font-medium items-center space-x-2 rounded-lg transform hover:scale-105"
                onClick={closeMenu}
              >
                <span>👤</span>
                <span>My Items</span>
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex py-3 bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-lg transition-all duration-200 font-medium items-center space-x-2 mt-2 transform hover:scale-105"
                  onClick={closeMenu}
                >
                  <span>🛡️</span>
                  <span>Admin</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
