'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiOutlineUser, HiSave } from 'react-icons/hi';
import Logo from './Logo';

const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/search', label: 'Search' },
    { href: '/saved-preferences', label: 'Saved Preferences', icon: HiSave },
    { href: '/favorites', label: 'Favorites' },
    { href: '/about', label: 'About' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-yellow-500 flex items-center gap-1 ${
                  pathname === link.href ? 'text-yellow-500' : 'text-gray-600'
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <HiOutlineUser className="w-5 h-5" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-sm font-medium text-gray-900 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 