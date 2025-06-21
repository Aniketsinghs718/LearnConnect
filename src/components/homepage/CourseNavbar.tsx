"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Home, User, BookOpen, Settings, LogOut, ShoppingCart, Package, UserCircle, Shield } from "lucide-react";
import { AdminService } from "@/services/adminService";
import { supabase } from "@/lib/supabaseClient";

interface CourseNavbarProps {
  courseInfo?: {
    year: string;
    branch: string;
    semester: string;
  };
}

export default function CourseNavbar({ courseInfo }: CourseNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAdminStatus();
  }, []);

<<<<<<< HEAD
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

=======
>>>>>>> 1d031bdc30a8e64b8994ad591ed53dfe704bb50d
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

<<<<<<< HEAD
=======
    // Cleanup on unmount
>>>>>>> 1d031bdc30a8e64b8994ad591ed53dfe704bb50d
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

<<<<<<< HEAD
  const closeMenu = () => setIsMenuOpen(false);

=======
>>>>>>> 1d031bdc30a8e64b8994ad591ed53dfe704bb50d
  const checkAdminStatus = async () => {
    try {
      const adminStatus = await AdminService.isAdmin();
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear user data from localStorage
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
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      window.location.href = '/';
    }
  };

  // Determine navigation items based on current page
  const isMarketplacePage = pathname.startsWith('/marketplace');
  const isAdminPage = pathname.startsWith('/admin');
  const isContributorsPage = pathname.startsWith('/contributors');

  const getNavItems = () => {
    const baseItems = [
      { name: "Dashboard", href: "/", icon: Home },
      { name: "Profile", href: "/auth/profile", icon: User },
    ];

    if (isMarketplacePage) {
      return [
        ...baseItems,
        { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
        { name: "Sell Item", href: "/marketplace/sell", icon: Package },
        { name: "My Items", href: "/marketplace/profile", icon: UserCircle },
      ];
    }

    // Default navigation
    return [
      ...baseItems,
      { name: "Marketplace", href: "/marketplace", icon: BookOpen },
      { name: "Contributors", href: "/contributors", icon: Settings },
    ];
  };

  const navItems = getNavItems();
<<<<<<< HEAD
  
  return (
    <>
      <nav
        className={`relative z-50 bg-black/95 backdrop-blur-md border-b border-orange-500/20 shadow-lg shadow-orange-500/10`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group transform hover:scale-105 transition-transform duration-200">            <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 hover:bg-orange-600 transition-all duration-300">
              <span className="text-white font-bold text-lg md:text-xl">L</span>
            </div>
            <div>
              <span className="text-white font-bold text-xl md:text-2xl">LearnConnect</span>
              {courseInfo && (
                <div className="hidden md:block text-xs text-gray-400">
                  {courseInfo.year.toUpperCase()} • {courseInfo.branch.toUpperCase()} • {courseInfo.semester}
                </div>
              )}
            </div>
          </Link>

          {/* Course Info (Mobile) */}
          {courseInfo && (
            <div className="md:hidden flex items-center space-x-2">
              <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                {courseInfo.year.toUpperCase()}
              </span>
              <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                {courseInfo.branch.toUpperCase()}
              </span>
            </div>
          )}          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-300 hover:text-orange-400 transition-all duration-200 group transform hover:scale-105"
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center space-x-2 bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300 group transform hover:scale-105"
              >
                <Shield className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">Admin</span>
              </Link>
            )}
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-all duration-300 hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative z-60 md:hidden p-2 text-gray-300 hover:text-orange-400 transition-all duration-300 rounded-lg hover:bg-white/10 transform hover:scale-110"
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
              {courseInfo && (
                <div className="pb-4 mb-4 border-b border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-3">Current Course</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-full hover:bg-orange-500/30 transition-colors duration-200">
                      {courseInfo.year.toUpperCase()}
                    </span>
                    <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-full hover:bg-orange-500/30 transition-colors duration-200">
                      {courseInfo.branch.toUpperCase()}
                    </span>
                    <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-full hover:bg-orange-500/30 transition-colors duration-200">
                      {courseInfo.semester}
                    </span>
                  </div>
                </div>
              )}
              
=======

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="relative z-50 bg-black/95 backdrop-blur-md border-b border-orange-500/20 shadow-lg shadow-orange-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg md:text-xl">L</span>
              </div>
              <div>
                <span className="text-white font-bold text-xl md:text-2xl">LearnConnect</span>
                {courseInfo && (
                  <div className="hidden md:block text-xs text-gray-400">
                    {courseInfo.year.toUpperCase()} • {courseInfo.branch.toUpperCase()} • {courseInfo.semester}
                  </div>
                )}
              </div>
            </Link>

            {/* Course Info (Mobile) */}
            {courseInfo && (
              <div className="md:hidden flex items-center space-x-2">
                <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                  {courseInfo.year.toUpperCase()}
                </span>
                <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                  {courseInfo.branch.toUpperCase()}
                </span>
              </div>
            )}

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
>>>>>>> 1d031bdc30a8e64b8994ad591ed53dfe704bb50d
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
<<<<<<< HEAD
                    onClick={closeMenu}
                    className="flex items-center space-x-3 text-gray-300 hover:text-orange-400 hover:bg-white/10 transition-all duration-200 py-3 px-4 rounded-lg transform hover:scale-105"
=======
                    className="flex items-center space-x-2 text-gray-300 hover:text-orange-400 transition-colors duration-300 group"
>>>>>>> 1d031bdc30a8e64b8994ad591ed53dfe704bb50d
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
              
              {isAdmin && (
                <Link
                  href="/admin"
<<<<<<< HEAD
                  onClick={closeMenu}
                  className="flex items-center space-x-3 bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-all duration-300 mt-2 transform hover:scale-105"
=======
                  className="flex items-center space-x-2 bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300 group"
>>>>>>> 1d031bdc30a8e64b8994ad591ed53dfe704bb50d
                >
                  <Shield className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">Admin</span>
                </Link>
              )}
              
              <button
<<<<<<< HEAD
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="flex items-center space-x-3 w-full bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-all duration-300 mt-4 transform hover:scale-105"
=======
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-all duration-300 hover:scale-105"
>>>>>>> 1d031bdc30a8e64b8994ad591ed53dfe704bb50d
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative z-[60] p-2 text-white hover:text-orange-400 transition-colors duration-300"
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
          {/* Course Info Section */}
          {courseInfo && (
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Current Course</h2>
              <div className="flex flex-col space-y-3">
                <div className="bg-orange-500/20 text-orange-400 px-6 py-3 rounded-full border border-orange-500/30">
                  <span className="text-lg font-semibold">{courseInfo.year.toUpperCase()}</span>
                </div>
                <div className="bg-orange-500/20 text-orange-400 px-6 py-3 rounded-full border border-orange-500/30">
                  <span className="text-lg font-semibold">{courseInfo.branch.toUpperCase()}</span>
                </div>
                <div className="bg-orange-500/20 text-orange-400 px-6 py-3 rounded-full border border-orange-500/30">
                  <span className="text-lg font-semibold">{courseInfo.semester}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div className="flex flex-col items-center space-y-6 mb-12">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex items-center space-x-4 text-white hover:text-orange-400 transition-all duration-300 text-2xl font-medium group transform hover:scale-105 ${
                    isMenuOpen ? 'animate-fade-in' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Admin Link */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={closeMenu}
                className="flex items-center space-x-4 bg-orange-500 text-white px-8 py-4 rounded-2xl hover:bg-orange-600 transition-all duration-300 text-2xl font-medium group transform hover:scale-105"
              >
                <Shield className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              handleLogout();
              closeMenu();
            }}
            className="flex items-center space-x-4 bg-red-500 text-white px-8 py-4 rounded-2xl hover:bg-red-600 transition-all duration-300 text-xl font-medium group transform hover:scale-105"
          >
            <LogOut className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            <span>Logout</span>
          </button>

          {/* Close Menu Text */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">Tap anywhere to close</p>
          </div>
        </div>
      </div>
    </>
  );
}