'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HiOutlineMenu } from 'react-icons/hi';
import { HiOutlineUser } from 'react-icons/hi2';

const navLinks = [
  { name: 'Search', href: '/search' },
  { name: 'For Rent', href: '/for-rent' },
  { name: 'For Sale', href: '/for-sale' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/logo.svg"
                alt="RentWise Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">RentWise</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-yellow-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/profile"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <HiOutlineUser className="h-6 w-6 text-gray-600" />
            </Link>
            
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors md:hidden">
              <HiOutlineMenu className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 