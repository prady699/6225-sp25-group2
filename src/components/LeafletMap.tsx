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
}

// Fix for default marker icons in Next.js
const createIcon = (price: string | number) => {
  const priceValue = typeof price === 'string' 
    ? parseInt(price.replace(/[^0-9]/g, '')) 
    : price;
    
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-semibold shadow-lg">$${Math.floor(priceValue / 100)}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const LeafletMap: React.FC<LeafletMapProps> = ({ listings, hoveredListing, onMarkerHover }) => {
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

  // Center map on the first listing or default to Boston
  const defaultCenter = { lat: 42.3601, lng: -71.0589 };
  const firstListing = listings[0];
  const center = firstListing?.location?.lat && firstListing?.location?.lng
    ? { lat: firstListing.location.lat, lng: firstListing.location.lng }
    : defaultCenter;

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