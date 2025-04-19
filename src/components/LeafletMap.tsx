'use client';

import React, { useEffect } from 'react';
// We need to import these only on the client side
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define types (should match the ones in Map.tsx)
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

interface LeafletMapProps {
  listings: Listing[];
  hoveredListing: number | string | null;
  onMarkerHover: (id: number | string | null) => void;
  onMarkerClick?: (id: number | string) => void;  // Add new prop for marker click handler
}

// Create custom marker icons with full price display
const createIcon = (price: string | number) => {
  // Extract numeric value from price (remove non-numeric characters)
  const priceValue = typeof price === 'string'
    ? parseInt(price.replace(/[^0-9]/g, ''))
    : price;
  
  // Display the full price amount without abbreviations
  const formattedPrice = `$${priceValue}`;
    
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="px-2 py-1 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 text-xs font-semibold shadow-lg">${formattedPrice}</div>`,
    iconSize: [40, 24], // Slightly larger to accommodate full price
    iconAnchor: [20, 24],
  });
};

const LeafletMap: React.FC<LeafletMapProps> = ({ listings, hoveredListing, onMarkerHover, onMarkerClick }) => {
  // Fix Leaflet icon issues
  useEffect(() => {
    // Fix Leaflet default icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Calculate the average center of all listings with valid coordinates
  // Default to Washington DC if no valid coordinates are found
  const defaultCenter = { lat: 38.8936, lng: -77.0725 };
  
  const validListings = listings.filter(listing => 
    listing.location.lat && listing.location.lng
  );
  
  let center = defaultCenter;
  
  if (validListings.length > 0) {
    // Calculate the average lat/lng of all listings
    const sumLat = validListings.reduce((sum, listing) => sum + (listing.location.lat || 0), 0);
    const sumLng = validListings.reduce((sum, listing) => sum + (listing.location.lng || 0), 0);
    
    center = {
      lat: sumLat / validListings.length,
      lng: sumLng / validListings.length
    };
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {listings.map((listing) => {
          if (!listing.location.lat || !listing.location.lng) return null;
          
          return (
            <Marker
              key={listing.id}
              position={[listing.location.lat, listing.location.lng]}
              icon={createIcon(listing.price)}
              eventHandlers={{
                mouseover: () => onMarkerHover(listing.id),
                mouseout: () => onMarkerHover(null),
                click: () => onMarkerClick && onMarkerClick(listing.id),  // Add click handler
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{listing.title}</h3>
                  <p>
                    {typeof listing.location.address === 'string'
                      ? listing.location.address
                      : `${(listing.location.address as any).line}, ${(listing.location.address as any).city}`}
                  </p>
                  <p className="font-bold text-yellow-600">
                    {typeof listing.price === 'string' 
                      ? listing.price 
                      : `$${listing.price}/mo`}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <style jsx global>{`
        .custom-marker {
          background: none;
          border: none;
        }
        .custom-marker > div {
          transition: transform 0.2s;
        }
        .custom-marker:hover > div {
          transform: scale(1.25);
        }
      `}</style>
    </div>
  );
};

export default LeafletMap; 