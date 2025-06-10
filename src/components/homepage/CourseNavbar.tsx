"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Home, User, BookOpen, Settings, LogOut, ShoppingCart, Package, UserCircle, Shield } from "lucide-react";
import { AdminService } from "@/services/adminService";

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

  const checkAdminStatus = async () => {
    try {
      const adminStatus = await AdminService.isAdmin();
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userProfile");
    localStorage.removeItem("selectedBranch");
    localStorage.removeItem("selectedYear");
    localStorage.removeItem("selectedSemester");
    
    // Redirect to homepage
    router.push("/");
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
  return (
    <nav
      className={`bg-black/95 backdrop-blur-md border-b border-orange-500/20 shadow-lg shadow-orange-500/10`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">            <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                  className="flex items-center space-x-2 text-gray-300 hover:text-orange-400 transition-colors duration-300 group"
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center space-x-2 bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300 group"
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
            className="md:hidden p-2 text-gray-300 hover:text-orange-400 transition-colors duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-orange-500/20 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {courseInfo && (
                <div className="pb-4 border-b border-gray-700">
                  <div className="text-sm text-gray-400 mb-2">Current Course</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
                      {courseInfo.year.toUpperCase()}
                    </span>
                    <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
                      {courseInfo.branch.toUpperCase()}
                    </span>
                    <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
                      {courseInfo.semester}
                    </span>
                  </div>
                </div>
              )}
                {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 text-gray-300 hover:text-orange-400 transition-colors duration-300 py-2"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
              
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-all duration-300"
                >
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Admin</span>
                </Link>
              )}
              
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-all duration-300 mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
