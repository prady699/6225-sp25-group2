'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Map from '@/components/Map';
import ListingCard from '@/components/ListingCard';
import { HiMagnifyingGlass, HiStar, HiBuildingOffice2 } from 'react-icons/hi2';
import { mapRealtorToAppProperty, AppProperty } from '@/utils/propertyMapper';
import { trackSearchQuery } from '@/utils/autoSave';
 
const formatPriceString = (price: string | null) => {
  if (!price) return 'Any price';
  if (price.includes('-')) {
    const [min, max] = price.split('-');
    return `$${min} - $${max}`;
  }
  return `$${price}`;
};
 
const parseAmenities = (amenities: string | null): string[] => {
  return amenities ? amenities.split(',').filter(Boolean) : [];
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
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredListing, setHoveredListing] = useState<number | string | null>(null);
  const [viewedListings, setViewedListings] = useState<Record<string | number, boolean>>({});
  const [selectedListing, setSelectedListing] = useState<number | string | null>(null);
  
  // Create refs for property cards to scroll to them
  const topMatchRefs = React.useRef<Record<string | number, React.RefObject<HTMLDivElement>>>({});
  const regularListingRefs = React.useRef<Record<string | number, React.RefObject<HTMLDivElement>>>({});
 
  const location = searchParams.get('location');
  const priceStr = searchParams.get('price');
  const bedrooms = searchParams.get('bedrooms');
  const amenitiesStr = searchParams.get('amenities');
 
  const amenities = parseAmenities(amenitiesStr);
  const formattedPrice = formatPriceString(priceStr);
 
  const [minPrice, maxPrice] = (priceStr?.split('-').map(Number) ?? [1000, 3000]);
 
  const payload = {
    location: location || '',
    max_price: maxPrice,
    bedrooms: bedrooms || '',
    amenities,
    proximity_landmark: location || '',
  };
 
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('https://bo2swvmchd.execute-api.us-east-1.amazonaws.com/searchlistings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
     
        const data = await res.json();
        console.log("🔍 Lambda response:", data);
     
        // ✅ Check if it's actually an error
        if (!Array.isArray(data)) {
          throw new Error(data?.error || "Unexpected response format");
        }
     
        const mapped = data.map(mapRealtorToAppProperty);
        setListings(mapped);
        trackSearchQuery(payload, {
          resultCount: mapped.length,
          timestamp: new Date().toISOString(),
          formattedPrice,
          topMatchesCount: mapped.filter((l: AppProperty) => (l.ai_score ?? 0) >= 90).length,
        });
      } catch (error) {
        console.error('❌ Failed to load listings:', error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchListings();
  }, []);
 
  const processedListings = listings.map(listing => {
    // Check for missing coordinates and ensure we handle both lng and lon property names
    const hasValidLat = !!listing.location.lat;
    const hasValidLng = !!(listing.location.lng || (listing.location as any).lon);
    
    if (!hasValidLat || !hasValidLng) {
      console.log('Missing or invalid coordinates for listing:', listing.id);
      return {
        ...listing,
        location: {
          ...listing.location,
          // Use Washington DC as the default location if coordinates are missing
          lat: listing.location.lat || 38.8936,
          // Try to use lon if lng is not available
          lng: listing.location.lng || (listing.location as any).lon || -77.0725,
        },
      };
    }
    
    // If we have lon instead of lng, normalize it to lng for consistency
    if (!(listing.location.lng) && (listing.location as any).lon) {
      return {
        ...listing,
        location: {
          ...listing.location,
          lng: (listing.location as any).lon
        }
      };
    }
    
    return listing;
  });
 
  const listingsWithScores = processedListings
    .map(listing => ({
      ...listing,
      matchScore: listing?.ai_score || generateMatchScore(listing.id),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
 
  const topMatches = listingsWithScores.filter(l => l.matchScore >= 90);
 
  // Initialize refs for all listings
  useEffect(() => {
    // Create refs for all listings
    listingsWithScores.forEach(listing => {
      const isTopMatch = listing.matchScore >= 90;
      if (isTopMatch) {
        if (!topMatchRefs.current[listing.id]) {
          topMatchRefs.current[listing.id] = React.createRef<HTMLDivElement>();
        }
      } else {
        if (!regularListingRefs.current[listing.id]) {
          regularListingRefs.current[listing.id] = React.createRef<HTMLDivElement>();
        }
      }
    });
  }, [listingsWithScores]);

  const handleMarkerHover = (id: string | number | null) => {
    setHoveredListing(id);

    if (id && !viewedListings[id]) {
      setViewedListings(prev => ({ ...prev, [id]: true }));

      const listing = listingsWithScores.find(l => l.id === id);
      if (listing) {
        const address = typeof listing.location.address === 'string'
          ? listing.location.address
          : `${listing.location.address.line}, ${listing.location.address.city}`;
        trackSearchQuery({
          ...payload,
          interactionType: 'hover',
          listingId: id,
          listingDetails: {
            price: listing.price,
            bedrooms: listing.description.beds,
            location: address,
          },
        });
      }
    }
  };
  
  // Handle marker click to scroll to the corresponding property card
  const handleMarkerClick = (id: string | number) => {
    setSelectedListing(id);
    
    // Find if the listing is a top match or regular listing
    const listing = listingsWithScores.find(l => l.id === id);
    if (!listing) return;
    
    const isTopMatch = listing.matchScore >= 90;
    const ref = isTopMatch ? topMatchRefs.current[id] : regularListingRefs.current[id];
    
    if (ref && ref.current) {
      // Scroll to the property card with a smooth animation
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Highlight the card temporarily
      ref.current.classList.add('ring-4', 'ring-yellow-400', 'ring-opacity-100');
      setTimeout(() => {
        if (ref.current) {
          ref.current.classList.remove('ring-4', 'ring-yellow-400', 'ring-opacity-100');
        }
      }, 2000);
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
<p className="text-gray-600">Try adjusting your search criteria to find more options.</p>
</div>
</div>
    );
  }
 
  return (
<div className="min-h-screen bg-gray-50 flex">
<div className="w-1/2 h-screen sticky top-0">
<Map
          listings={processedListings}
          hoveredListing={hoveredListing}
          onMarkerHover={handleMarkerHover}
          onMarkerClick={handleMarkerClick}
        />
</div>
 
      <div className="w-1/2 p-8">
<div className="max-w-2xl mx-auto">
<h1 className="text-2xl font-bold text-gray-900 mb-2">
            {listings.length} Properties Found
</h1>
<p className="text-gray-600 mb-2">
            in {location || 'your selected area'}
</p>
 
          <div className="mb-6 flex flex-wrap gap-2">
            {formattedPrice && (
<div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {formattedPrice}
</div>
            )}
            {bedrooms && (
<div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {bedrooms === '0' ? 'Studio' : `${bedrooms} Bedroom${bedrooms !== '1' ? 's' : ''}`}
</div>
            )}
            {amenities.map(a => (
<div key={a} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {a}
</div>
            ))}
</div>
 
          {topMatches.length > 0 && (
<div className="mb-8">
<div className="flex items-center mb-4">
<HiStar className="text-yellow-400 w-6 h-6 mr-2" />
<h2 className="text-xl font-semibold">Best AI Matches</h2>
</div>
<div className="grid grid-cols-1 gap-4 mb-4">
                {topMatches.map(listing => (
<motion.div
                    key={`top-${listing.id}`}
                    ref={topMatchRefs.current[listing.id]}
                    onHoverStart={() => handleMarkerHover(listing.id)}
                    onHoverEnd={() => setHoveredListing(null)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: selectedListing === listing.id ? [1, 1.05, 1] : 1
                    }}
                    transition={{ duration: 0.3 }}
                    className={`relative transition-all duration-300 ${
                      selectedListing === listing.id ? 'shadow-xl' : ''
                    }`}
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
 
          <h2 className="text-lg font-medium text-gray-900 mb-4">All Properties</h2>
<div className="space-y-6">
            {listingsWithScores.filter(l => l.matchScore < 90).map(listing => (
<motion.div
                key={listing.id}
                ref={regularListingRefs.current[listing.id]}
                onHoverStart={() => handleMarkerHover(listing.id)}
                onHoverEnd={() => setHoveredListing(null)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: selectedListing === listing.id ? [1, 1.05, 1] : 1
                }}
                transition={{ duration: 0.3 }}
                className={`transition-all duration-300 ${
                  selectedListing === listing.id ? 'shadow-xl' : ''
                }`}
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