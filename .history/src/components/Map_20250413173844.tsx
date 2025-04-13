'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface Listing {
  id: number | string;
  title: string;
  price: number;
  location: Location;
}

interface MapProps {
  listings: Listing[];
  hoveredListing: number | string | null;
  onMarkerHover: (id: number | string | null) => void;
}

// Fix for default marker icons in Next.js
const createIcon = (price: number) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-semibold shadow-lg">$${Math.floor(price / 100)}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

export default function Map({ listings, hoveredListing, onMarkerHover }: MapProps) {
  // Center map on the first listing or default to Boston
  const center = listings[0]?.location || { lat: 42.3601, lng: -71.0589 };

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
        {listings.map((listing) => (
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
                <p>{listing.location.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
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
} 