'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Map from '@/components/Map';
import ListingCard from '@/components/ListingCard';
import { HiBuildingOffice2, HiMagnifyingGlass, HiStar } from 'react-icons/hi2';
import { mapRealtorToAppProperty } from '@/utils/propertyMapper';
import { trackSearchQuery } from '@/utils/autoSave';

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

// Parse a price string into a readable format
const formatPriceString = (priceStr: string | null) => {
  if (!priceStr) return 'Any price';
  
  if (priceStr.includes('-')) {
    const [min, max] = priceStr.split('-');
    return `$${min} - $${max}`;
  }
  
  return `$${priceStr}`;
};

// Parse amenities from search params
const parseAmenities = (amenitiesStr: string | null) => {
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
  const [listings, setListings] = useState(mockListings.map(mapRealtorToAppProperty));
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
  const listingsWithScores = listings.map(listing => ({
    ...listing,
    matchScore: generateMatchScore(listing.id)
  })).sort((a, b) => b.matchScore - a.matchScore);
  
  // Top matches (90% and above)
  const topMatches = listingsWithScores.filter(l => l.matchScore >= 90);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // Track the search query and results
      trackSearchQuery(searchParamsObj, {
        resultCount: mockListings.length,
        timestamp: new Date().toISOString(),
        formattedPrice,
        topMatchesCount: topMatches.length
      });
    }, 1500);
  }, []);

  // Track when a listing is hovered (suggesting user interest)
  const handleMarkerHover = (id: number | string | null) => {
    setHoveredListing(id);
    
    // If this is a new listing being hovered, track it
    if (id !== null && !viewedListings[id]) {
      setViewedListings(prev => ({
        ...prev,
        [id]: true
      }));
      
      // Find the listing details
      const listing = listings.find(l => l.id === id);
      if (listing) {
        // Track the user interest in this property
        trackSearchQuery({
          ...searchParamsObj,
          interactionType: 'hover',
          listingId: id,
          listingDetails: {
            price: listing.price,
            bedrooms: listing.description.beds,
            location: listing.location.address
          }
        });
      }
    }
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
          
          {/* Best Matches Section */}
          {topMatches.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <HiStar className="text-yellow-400 w-6 h-6 mr-2" />
                <h2 className="text-xl font-semibold">Best AI Matches</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4 mb-4">
                {topMatches.slice(0, 2).map((listing) => (
                  <motion.div
                    key={`top-${listing.id}`}
                    onHoverStart={() => handleMarkerHover(listing.id)}
                    onHoverEnd={() => setHoveredListing(null)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <div className="absolute -right-2 -top-2 z-10 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg">
                      {listing.matchScore}%
                    </div>
                    <ListingCard listing={listing} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

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
          
          {/* Other Listings */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">All Properties</h2>
            <div className="space-y-6">
              {listingsWithScores.filter(l => l.matchScore < 90).map((listing) => (
                <motion.div
                  key={listing.id}
                  onHoverStart={() => handleMarkerHover(listing.id)}
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
    </div>
  );
} 