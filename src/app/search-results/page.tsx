'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Map from '@/components/Map';
import ListingCard from '@/components/ListingCard';
import { HiBuildingOffice2, HiMagnifyingGlass } from 'react-icons/hi2';
import { mapRealtorToAppProperty } from '@/utils/propertyMapper';

// Mock data using realtor.com format
const mockListings = [
  {
    primary_photo: {
      href: "https://ap.rdcpix.com/d25e5e762e833137dbb39d0214539e3al-m2064909868s.jpg"
    },
    tags: [
      "central_air",
      "forced_air",
      "pets_allowed",
      "recreation_facilities",
      "garage_1_or_more"
    ],
    status: "for_rent",
    list_price: 4000,
    href: "https://www.realtor.com/rentals/details/1451-Belmont-St-NW-Apt-113_Washington_DC_20009_M69298-13321",
    property_id: "6929813321",
    description: {
      beds: 2,
      baths: 3,
      baths_full: 2,
      baths_half: 1,
      sqft: 1353,
      type: "condos",
      text: "Welcome to The Fedora..."
    },
    location: {
      address: {
        line: "1451 Belmont St NW Apt 113",
        city: "Washington",
        state_code: "DC",
        postal_code: "20009"
      },
      lat: 38.9186,
      lng: -77.0340
    }
  },
  // Add more mock listings in realtor.com format...
];

export default function SearchResults() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState(mockListings.map(mapRealtorToAppProperty));
  const [hoveredListing, setHoveredListing] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <HiMagnifyingGlass className="w-12 h-12 text-yellow-400 animate-bounce mx-auto mb-4" />
          <p className="text-gray-600">Finding your perfect home...</p>
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <HiBuildingOffice2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
          <p className="text-gray-600">
            Try adjusting your search criteria to find more options
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Map Section */}
      <div className="w-1/2 h-screen sticky top-0">
        <Map
          listings={listings}
          hoveredListing={hoveredListing}
          onMarkerHover={setHoveredListing}
        />
      </div>

      {/* Listings Section */}
      <div className="w-1/2 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {listings.length} Properties Found
          </h1>
          <p className="text-gray-600 mb-8">
            in {searchParams.get('location') || 'your selected area'}
          </p>

          {/* Filters */}
          <div className="mb-8 flex flex-wrap gap-4">
            <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400">
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
            <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400">
              <option>All Types</option>
              <option>Apartment</option>
              <option>Condo</option>
              <option>Studio</option>
            </select>
            <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400">
              <option>Any Beds</option>
              <option>Studio</option>
              <option>1+ Beds</option>
              <option>2+ Beds</option>
              <option>3+ Beds</option>
            </select>
          </div>

          {/* Listings */}
          <div className="space-y-6">
            {listings.map((listing) => (
              <motion.div
                key={listing.id}
                onHoverStart={() => setHoveredListing(listing.id)}
                onHoverEnd={() => setHoveredListing(null)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 