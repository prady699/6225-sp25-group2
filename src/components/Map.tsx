'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Define types
interface Location {
  lat?: number;
  lng?: number;
  address: string | {
    line: string;
    city: string;
    state: string;
    postal_code: string;
  };
}

interface Listing {
  id: number | string;
  title: string;
  price: string | number;
  location: Location;
}

interface MapProps {
  listings: Listing[];
  hoveredListing: number | string | null;
  onMarkerHover: (id: number | string | null) => void;
}

// Simplified map component that works without requiring browser-specific APIs
const Map = ({ listings, hoveredListing, onMarkerHover }: MapProps) => {
  return (
    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-md w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Map View</h3>
        <p className="text-gray-600 mb-4">Showing {listings.length} properties in this area</p>
        
        {/* Simulated map with clickable listings */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <p className="text-gray-500 text-sm mb-3">Click a property to view details:</p>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {listings.map(listing => (
              <div 
                key={listing.id}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  hoveredListing === listing.id 
                    ? 'bg-yellow-100 border border-yellow-300' 
                    : 'bg-white border border-gray-200 hover:bg-gray-100'
                }`}
                onMouseEnter={() => onMarkerHover(listing.id)}
                onMouseLeave={() => onMarkerHover(null)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{listing.title}</span>
                  <span className="text-yellow-600 font-bold">
                    {typeof listing.price === 'string' 
                      ? listing.price 
                      : `$${listing.price}/mo`}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {typeof listing.location.address === 'string'
                    ? listing.location.address
                    : `${listing.location.address.line}, ${listing.location.address.city}`}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-4 text-center">
          Interactive map view requires client-side rendering
        </p>
      </div>
    </div>
  );
};

export default Map; 