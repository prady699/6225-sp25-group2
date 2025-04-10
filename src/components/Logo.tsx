import React from 'react';
import { HiBuildingOffice2 } from 'react-icons/hi2';
import Link from 'next/link';

interface LogoProps {
  className?: string;
}

const Logo = ({ className = '' }: LogoProps) => {
  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center justify-center w-8 h-8 bg-yellow-400 rounded-lg shadow-sm">
        <HiBuildingOffice2 className="w-5 h-5 text-gray-900" />
      </div>
      <div className="flex items-baseline">
        <span className="text-xl font-bold text-gray-900">StudentHousingAI</span>
        {/* <span className="text-sm font-semibold text-yellow-500 ml-1">AI</span> */}
      </div>
    </Link>
  );
};

export default Logo; 