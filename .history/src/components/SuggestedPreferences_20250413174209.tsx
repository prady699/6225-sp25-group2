'use client';

import React, { useEffect, useState } from 'react';
import { getStoredPreferences } from '@/utils/autoSave';
import { HiLightningBolt, HiClock } from 'react-icons/hi';

interface SuggestedPreferencesProps {
  onSelect: (data: any) => void;
}

export default function SuggestedPreferences({ onSelect }: SuggestedPreferencesProps) {
  const [previousSearch, setPreviousSearch] = useState<any>(null);
  
  useEffect(() => {
    const storedPrefs = getStoredPreferences();
    
    if (storedPrefs && (storedPrefs.location || storedPrefs.amenities?.length > 0)) {
      setPreviousSearch(storedPrefs);
    }
  }, []);
  
  // If no previous searches, don't render anything
  if (!previousSearch) return null;
  
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4">Suggested For You</h3>
      
      <div className="space-y-3">
        {previousSearch && (
          <button
            onClick={() => onSelect(previousSearch)}
            className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-yellow-400 transition-all"
          >
            <div className="flex items-center">
              <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                <HiClock className="text-yellow-600 h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {previousSearch.location || "Previous Search"}
                </p>
                <p className="text-sm text-gray-500">
                  {previousSearch.bedrooms ? 
                    (previousSearch.bedrooms === '0' ? 'Studio' : 
                     `${previousSearch.bedrooms} ${parseInt(previousSearch.bedrooms) === 1 ? 'Bedroom' : 'Bedrooms'}`) : ''}{' '}
                  {previousSearch.minPrice && previousSearch.maxPrice ? `• $${previousSearch.minPrice}-$${previousSearch.maxPrice}` : ''}
                </p>
              </div>
            </div>
            <span className="text-yellow-500 text-sm font-medium">Use</span>
          </button>
        )}
        
        <button
          onClick={() => onSelect({
            location: 'Boston University',
            minPrice: 1200,
            maxPrice: 2500,
            bedrooms: '1',
            amenities: ['laundry', 'ac', 'furnished', 'wifi']
          })}
          className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-yellow-400 transition-all"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <HiLightningBolt className="text-blue-600 h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Boston University</p>
              <p className="text-sm text-gray-500">1 Bedroom • $1,200-$2,500 • 4 amenities</p>
            </div>
          </div>
          <span className="text-yellow-500 text-sm font-medium">Use</span>
        </button>
        
        <button
          onClick={() => onSelect({
            location: 'Northeastern University',
            minPrice: 1500,
            maxPrice: 3000,
            bedrooms: '2',
            amenities: ['parking', 'gym', 'ac', 'pets']
          })}
          className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-yellow-400 transition-all"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <HiLightningBolt className="text-blue-600 h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Northeastern University</p>
              <p className="text-sm text-gray-500">2 Bedrooms • $1,500-$3,000 • 4 amenities</p>
            </div>
          </div>
          <span className="text-yellow-500 text-sm font-medium">Use</span>
        </button>
      </div>
    </div>
  );
} 