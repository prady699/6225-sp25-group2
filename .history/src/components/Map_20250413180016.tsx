'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
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

// Dynamically import the map component with no SSR
const MapWithNoSSR = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

export default function Map(props: MapProps) {
  return <MapWithNoSSR {...props} />;
} 