'use client';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function NavbarLogo() {
  return (
    <div className="flex items-center">
      <Link
        href="/"
        className="flex items-center space-x-3 group"
      >
        <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <span className="text-white font-bold text-xl md:text-2xl">LearnConnect</span>
      </Link>
    </div>
  );
}
