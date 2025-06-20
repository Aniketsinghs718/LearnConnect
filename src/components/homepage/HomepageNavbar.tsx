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

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Community", href: "/community" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "About", href: "/about" }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-md border-b border-gray-800' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LearnConnect</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  className="text-white hover:text-orange-400 transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href="/auth/login" 
                className="text-white hover:text-orange-400 transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/register" 
                className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 hover:shadow-lg transition-all duration-300"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative z-[60] text-white hover:text-orange-400 transition-all duration-300"
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
          {/* Logo Section */}
          <div className="mb-16 text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">LearnConnect</h1>
            <p className="text-gray-400 mt-2">Your Academic Learning Platform</p>
          </div>

          {/* Navigation Items */}
          <div className="flex flex-col items-center space-y-8 mb-16">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className={`text-white hover:text-orange-400 transition-all duration-300 text-2xl font-medium transform hover:scale-105 ${
                  isMenuOpen ? 'animate-fade-in' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center space-y-4 mb-12">
            <Link 
              href="/auth/login" 
              onClick={closeMenu}
              className="text-white hover:text-orange-400 transition-colors font-medium text-xl"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/register" 
              onClick={closeMenu}
              className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-orange-600 hover:shadow-lg transition-all duration-300 text-xl transform hover:scale-105"
            >
              Get Started
            </Link>
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

export default HomepageNavbar;