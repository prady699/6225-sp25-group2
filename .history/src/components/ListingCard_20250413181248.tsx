import React from 'react';
import { HiHomeModern, HiBuildingOffice2, HiSquaresPlus, HiMapPin, HiStar } from 'react-icons/hi2';
import Image from './Image';
import Link from 'next/link';

interface AppProperty {
  id: number | string;
  title: string;
  image: string;
  price: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  description: {
    type: string;
    beds: number;
    baths: number;
    sqft: number;
  };
  tags: string[];
  href: string;
}

interface ListingCardProps {
  listing: AppProperty;
}

// Generate a random match score between 85-98%
const generateMatchScore = (listingId: number | string): number => {
  // Use the listing ID to generate a consistent random score
  const seed = listingId.toString().split('').reduce((a, b) => a + parseInt(b, 10), 0);
  // Generate a score between 85 and 98
  return Math.floor(85 + (seed % 14));
};

export default function ListingCard({ listing }: ListingCardProps) {
  // Generate a consistent match score for this listing
  const matchScore = generateMatchScore(listing.id);
  
  // Determine if the URL is external
  const isExternalUrl = listing.href.startsWith('http');
  
  // For non-external URLs, ensure they have a leading slash
  const formattedUrl = !isExternalUrl && !listing.href.startsWith('/') 
    ? `/${listing.href}` 
    : listing.href;
  
  // Use the provided URL directly
  const linkUrl = isExternalUrl ? listing.href : formattedUrl;
  
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      {/* Image */}
      <div className="relative h-48">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
          {listing.description.type}
        </div>
        
        {/* AI Match Score */}
        <div className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center shadow-lg">
          <HiStar className="w-4 h-4 mr-1 text-yellow-300" />
          <span>{matchScore}% Match</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
          <p className="text-xl font-bold text-yellow-500">${listing.price}/mo</p>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <HiMapPin className="w-4 h-4 mr-1" />
          <p>{listing.location.address}</p>
        </div>
        
        {/* Features */}
        <div className="flex items-center gap-4 mb-3 text-gray-600 text-sm">
          <div className="flex items-center">
            <HiBuildingOffice2 className="w-4 h-4 mr-1" />
            {listing.description.beds} {listing.description.beds === 1 ? 'bed' : 'beds'}
          </div>
          <div className="flex items-center">
            <HiHomeModern className="w-4 h-4 mr-1" />
            {listing.description.baths} {listing.description.baths === 1 ? 'bath' : 'baths'}
          </div>
          <div className="flex items-center">
            <HiSquaresPlus className="w-4 h-4 mr-1" />
            {listing.description.sqft} sqft
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {listing.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* View Details Button */}
        {isExternalUrl ? (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-2 bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-500 transition-colors font-medium"
          >
            View on Realtor.com
          </a>
        ) : (
          <Link 
            href={formattedUrl}
            className="block w-full text-center py-2 bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-500 transition-colors font-medium"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
} 