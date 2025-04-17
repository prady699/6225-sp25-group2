'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiMagnifyingGlass, HiBuildingOffice2 } from 'react-icons/hi2';
import Map from '@/components/Map';
import ListingCard from '@/components/ListingCard';
import mockListings from '@/data/mockListings';

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

interface ListingWithScore extends AppProperty {
  matchScore: number;
}

// Map data from mock API to app format
const mapRealtorToAppProperty = (listing: any): AppProperty => {
  return {
    id: listing.property_id,
    title: listing.description.title || 'Beautiful Property',
    image: listing.primary_photo?.href || 'https://via.placeholder.com/500',
    price: listing.list_price || 1500,
    location: {
      lat: listing.location.address.coordinate?.lat || 42.3601,
      lng: listing.location.address.coordinate?.lon || -71.0589,
      address: `${listing.location.address.line}, ${listing.location.address.city}, ${listing.location.address.state_code}`,
    },
    description: {
      type: listing.description.type || 'Apartment',
      beds: listing.description.beds || 2,
      baths: listing.description.baths || 1,
      sqft: listing.description.sqft || 900,
    },
    tags: (listing.tags || ['Modern', 'Updated']).slice(0, 5),
    href: `/property/${listing.property_id}`,
  };
};

// Parse a price string into a readable format
const formatPriceString = (priceStr: string | null): string => {
  if (!priceStr) return 'Any price';
  
  if (priceStr.includes('-')) {
    const [min, max] = priceStr.split('-');
    return `$${min} - $${max}`;
  }
  
  return `$${priceStr}`;
};

// Parse amenities from search params
const parseAmenities = (amenitiesStr: string | null): string[] => {
  if (!amenitiesStr) return [];
  return amenitiesStr.split(',').filter(Boolean);
};

// Generate a random match score between 85-98%
const generateMatchScore = (listingId: number | string): number => {
  // Use the listing ID to generate a consistent random score
  const seed = listingId.toString().split('').reduce((a, b) => {
    const num = parseInt(b, 10);
    return a + (isNaN(num) ? 0 : num);
  }, 0);
  // Generate a score between 85 and 98
  return Math.floor(85 + (seed % 14));
};

export default function SearchResults() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<AppProperty[]>(mockListings.map(mapRealtorToAppProperty));
  const [hoveredListing, setHoveredListing] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Track when properties are viewed or interacted with
  const [viewedListings, setViewedListings] = useState<Record<string | number, boolean>>({});

  // Parse search params for tracking
  const searchParamsObj = {
    location: searchParams.get('location') || '',
    price: searchParams.get('price') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    amenities: parseAmenities(searchParams.get('amenities')),
  };
  
  // Format price for display
  const formattedPrice = formatPriceString(searchParamsObj.price);
  
  // Add match scores to listings
  const listingsWithScores: ListingWithScore[] = listings.map(listing => ({
    ...listing,
    matchScore: generateMatchScore(listing.id)
  })).sort((a, b) => b.matchScore - a.matchScore);
  
  // Top matches (90% and above)
  const topMatches = listingsWithScores.filter(l => l.matchScore >= 90);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Handle hovering over a property card
  const handlePropertyHover = (id: number | string | null) => {
    setHoveredListing(id);
    
    if (id && !viewedListings[id]) {
      setViewedListings(prev => ({
        ...prev,
        [id]: true
      }));
    }
  };
  
  // Handle hovering over a map marker
  const handleMarkerHover = (id: number | string | null) => {
    setHoveredListing(id);
  };

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
          onMarkerHover={handleMarkerHover}
        />
      </div>

      {/* Listings Section */}
      <div className="w-1/2 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {listings.length} Properties Found
          </h1>
          <p className="text-gray-600 mb-2">
            in {searchParamsObj.location || 'your selected area'}
          </p>
          
          {/* Display search parameters */}
          <div className="mb-6 flex flex-wrap gap-2">
            {formattedPrice && (
              <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {formattedPrice}
              </div>
            )}
            
            {searchParamsObj.bedrooms && (
              <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {searchParamsObj.bedrooms === '0' ? 'Studio' : 
                 `${searchParamsObj.bedrooms} ${parseInt(searchParamsObj.bedrooms) === 1 ? 'Bedroom' : 'Bedrooms'}`}
              </div>
            )}
            
            {searchParamsObj.amenities.map((amenity) => (
              <div key={amenity} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {amenity}
              </div>
            ))}
          </div>

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
          
          {/* Best Matches Section */}
          {topMatches.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Best Matches for You</h2>
              <div className="space-y-6">
                {topMatches.map((listing) => (
                  <motion.div
                    key={listing.id}
                    onHoverStart={() => handlePropertyHover(listing.id)}
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
          )}

          {/* All Listings */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Properties</h2>
            {listingsWithScores
              .filter(l => l.matchScore < 90)
              .map((listing) => (
                <motion.div
                  key={listing.id}
                  onHoverStart={() => handlePropertyHover(listing.id)}
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