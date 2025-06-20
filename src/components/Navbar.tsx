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

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const checkAdminStatus = async () => {
    try {
      const adminStatus = await AdminService.isAdmin();
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Marketplace", href: "/marketplace", icon: "🛒" },
    { name: "Sell", href: "/marketplace/sell", icon: "📤", highlight: true },
    { name: "My Items", href: "/marketplace/profile", icon: "👤" }
  ];

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
                className="relative z-[60] p-2 text-gray-300 hover:text-orange-400 transition-all duration-300 group"
                aria-label="Toggle mobile menu"
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <span 
                    className={`absolute w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                      isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
                    }`}
                  />
                  <span 
                    className={`absolute w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                      isMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <span 
                    className={`absolute w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                      isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-Screen Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 z-[55] transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* Background Overlay */}
        <div 
          className={`absolute inset-0 bg-black/95 backdrop-blur-md transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMenu}
        />
        
        {/* Menu Content */}
        <div className={`relative z-[56] h-full flex flex-col justify-center items-center transform transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {/* Logo Section */}
          <div className="mb-16 text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">L</span>
            </div>
            <h1 className="text-3xl font-bold text-white">LearnConnect</h1>
            <p className="text-gray-400 mt-2">Student Marketplace</p>
          </div>

          {/* Navigation Items */}
          <div className="flex flex-col items-center space-y-8 mb-16">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className={`flex items-center space-x-3 transition-all duration-300 text-2xl font-medium transform hover:scale-105 ${
                  item.highlight 
                    ? 'bg-orange-500 text-white px-8 py-4 rounded-2xl hover:bg-orange-600' 
                    : 'text-white hover:text-orange-400'
                } ${isMenuOpen ? 'animate-fade-in' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.icon && <span className="text-2xl">{item.icon}</span>}
                <span>{item.name}</span>
              </Link>
            ))}
            
            {/* Admin Link */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={closeMenu}
                className="flex items-center space-x-3 bg-orange-500 text-white px-8 py-4 rounded-2xl hover:bg-orange-600 transition-all duration-300 text-2xl font-medium transform hover:scale-105"
              >
                <span className="text-2xl">🛡️</span>
                <span>Admin Panel</span>
              </Link>
            )}
          </div>

          {/* Close Menu Text */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">Tap anywhere to close</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;