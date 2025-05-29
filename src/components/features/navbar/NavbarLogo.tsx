'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function NavbarLogo() {
  return (
    <div className="flex items-center">
      <Link
        href="/"
        className="flex items-center space-x-3 text-xl font-bold text-white hover:text-blue-400 transition-colors duration-200"
      >
        <Image 
          src="/logo.png" 
          alt="LearnConnect Logo" 
          width={32} 
          height={32} 
          className="w-8 h-8"
        />
        <span>LearnConnect</span>
      </Link>
    </div>
  );
}
