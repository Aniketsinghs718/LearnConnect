"use client";
import { useState, useEffect } from "react";
import {
  PWAInstaller,
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

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* PWA Install Button */}
            <PWAInstaller mounted={mounted} />

            {/* User Menu */}
            <UserMenu mounted={mounted} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
