"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, BookOpen } from "lucide-react";

const HomepageNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-md border-b border-gray-800' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 transform hover:scale-105 transition-transform duration-200">            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors duration-200">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LearnConnect</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-white hover:text-orange-400 transition-all duration-200 font-medium transform hover:scale-105">
                Home
              </Link>
              <Link href="/courses" className="text-white hover:text-orange-400 transition-all duration-200 font-medium transform hover:scale-105">
                Courses
              </Link>
              <Link href="/community" className="text-white hover:text-orange-400 transition-all duration-200 font-medium transform hover:scale-105">
                Community
              </Link>
              <Link href="/marketplace" className="text-white hover:text-orange-400 transition-all duration-200 font-medium transform hover:scale-105">
                Marketplace
              </Link>
              <Link href="/about" className="text-white hover:text-orange-400 transition-all duration-200 font-medium transform hover:scale-105">
                About
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href="/auth/login" 
                className="text-white hover:text-orange-400 transition-all duration-200 font-medium transform hover:scale-105"
              >
                Sign In
              </Link>            <Link 
                href="/auth/register" 
                className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>          {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-60 md:hidden text-white hover:text-orange-400 transition-all duration-300 p-2 rounded-lg hover:bg-white/10 transform hover:scale-110"
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

      {/* Mobile Menu */}
      <div className={`fixed top-16 left-0 right-0 z-50 md:hidden transition-all duration-300 ease-in-out transform ${
        isMenuOpen 
          ? 'translate-y-0 opacity-100 visible' 
          : '-translate-y-full opacity-0 invisible'
      }`}>
        <div className="bg-black/95 backdrop-blur-md border-b border-gray-800 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col space-y-1">
              <Link 
                href="/" 
                className="text-white hover:text-orange-400 hover:bg-white/10 transition-all duration-200 font-medium px-4 py-3 rounded-lg transform hover:scale-105"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link 
                href="/courses" 
                className="text-white hover:text-orange-400 hover:bg-white/10 transition-all duration-200 font-medium px-4 py-3 rounded-lg transform hover:scale-105"
                onClick={closeMenu}
              >
                Courses
              </Link>
              <Link 
                href="/community" 
                className="text-white hover:text-orange-400 hover:bg-white/10 transition-all duration-200 font-medium px-4 py-3 rounded-lg transform hover:scale-105"
                onClick={closeMenu}
              >
                Community
              </Link>
              <Link 
                href="/marketplace" 
                className="text-white hover:text-orange-400 hover:bg-white/10 transition-all duration-200 font-medium px-4 py-3 rounded-lg transform hover:scale-105"
                onClick={closeMenu}
              >
                Marketplace
              </Link>
              <Link 
                href="/about" 
                className="text-white hover:text-orange-400 hover:bg-white/10 transition-all duration-200 font-medium px-4 py-3 rounded-lg transform hover:scale-105"
                onClick={closeMenu}
              >
                About
              </Link>
              
              {/* Mobile Auth Actions */}
              <div className="border-t border-gray-700/50 pt-4 mt-4 space-y-2">
                <Link 
                  href="/auth/login" 
                  className="block text-white hover:text-orange-400 hover:bg-white/10 transition-all duration-200 font-medium px-4 py-3 rounded-lg transform hover:scale-105"
                  onClick={closeMenu}
                >
                  Sign In
                </Link>                <Link 
                  href="/auth/register" 
                  className="block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 hover:shadow-lg transition-all duration-300 text-center transform hover:scale-105 mx-2"
                  onClick={closeMenu}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomepageNavbar;
