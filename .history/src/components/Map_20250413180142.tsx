'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Define types
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

export interface MapProps {
  listings: Listing[];
  hoveredListing: number | string | null;
  onMarkerHover: (id: number | string | null) => void;
}

// Use a more explicit dynamic import with proper typing
const MapWithNoSSR = dynamic(
  () => import('@/components/MapClient').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }
) as React.ComponentType<MapProps>;

export default function Map(props: MapProps) {
  return <MapWithNoSSR {...props} />;
} 