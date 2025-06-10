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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/90 backdrop-blur-md border-b border-gray-800' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">LearnConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-orange-400 transition-colors font-medium">
              Home
            </Link>
            <Link href="/courses" className="text-white hover:text-orange-400 transition-colors font-medium">
              Courses
            </Link>
            <Link href="/community" className="text-white hover:text-orange-400 transition-colors font-medium">
              Community
            </Link>
            <Link href="/marketplace" className="text-white hover:text-orange-400 transition-colors font-medium">
              Marketplace
            </Link>
            <Link href="/about" className="text-white hover:text-orange-400 transition-colors font-medium">
              About
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/auth/login" 
              className="text-white hover:text-orange-400 transition-colors font-medium"
            >
              Sign In
            </Link>            <Link 
              href="/auth/register" 
              className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 hover:shadow-lg transition-all duration-300"
            >
              Get Started
            </Link>
          </div>          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative z-50 md:hidden text-white hover:text-orange-400 transition-all duration-300"
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
        </div>        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-black/95 backdrop-blur-md border-t border-gray-800 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-white hover:text-orange-400 transition-colors font-medium px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/courses" 
                className="text-white hover:text-orange-400 transition-colors font-medium px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
              <Link 
                href="/community" 
                className="text-white hover:text-orange-400 transition-colors font-medium px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              <Link 
                href="/marketplace" 
                className="text-white hover:text-orange-400 transition-colors font-medium px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link 
                href="/about" 
                className="text-white hover:text-orange-400 transition-colors font-medium px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="border-t border-gray-700 pt-4 px-4">
                <Link 
                  href="/auth/login" 
                  className="block text-white hover:text-orange-400 transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>                <Link 
                  href="/auth/register" 
                  className="block bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 hover:shadow-lg transition-all duration-300 mt-2 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomepageNavbar;
