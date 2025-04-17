'use client';

import React, { useState, useEffect } from 'react';
import { HiStar, HiOutlineStar, HiArrowCircleRight, HiRefresh } from 'react-icons/hi';

interface Preference {
  id: string;
  timestamp: string;
  data: {
    location: string;
    price: string;
    bedrooms: string;
    amenities: string[];
  };
}

interface SuggestedPreferencesProps {
  onSelectPreference: (preferenceData: Preference['data']) => void;
}

export default function SuggestedPreferences({ onSelectPreference }: SuggestedPreferencesProps) {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/save-preferences');
      const data = await response.json();
      
      if (data.success) {
        // Get only the 5 most recent preferences
        const recentPreferences = data.preferences.slice(0, 5);
        setPreferences(recentPreferences);
      } else {
        setError('Failed to load suggestions');
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setError('Could not load suggestions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  const formatPreferenceData = (data: Preference['data']) => {
    const parts = [];
    
    if (data.location) parts.push(data.location);
    if (data.price) {
      const priceText = data.price.includes('-') 
        ? `$${data.price.split('-').join('-$')}`
        : `$${data.price}+`;
      parts.push(priceText);
    }
    
    if (data.bedrooms) {
      const beds = data.bedrooms === '0' 
        ? 'Studio' 
        : `${data.bedrooms} ${parseInt(data.bedrooms) === 1 ? 'bed' : 'beds'}`;
      parts.push(beds);
    }
    
    return parts.join(' • ');
  };

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg animate-pulse">
        <div className="h-5 w-3/4 bg-gray-200 rounded mb-3"></div>
        <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error || preferences.length === 0) {
    return null; // Don't show anything if there are no suggestions
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-900">Suggested Preferences</h3>
        <button 
          onClick={fetchPreferences}
          className="text-yellow-600 hover:text-yellow-800 text-sm flex items-center gap-1"
        >
          <HiRefresh className="w-4 h-4" /> Refresh
        </button>
      </div>
      <div className="space-y-2">
        {preferences.map((pref) => (
          <button
            key={pref.id}
            onClick={() => onSelectPreference(pref.data)}
            className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-yellow-400 transition-colors"
          >
            <div className="flex items-center gap-2">
              <HiOutlineStar className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-800">{formatPreferenceData(pref.data)}</span>
            </div>
            <HiArrowCircleRight className="w-5 h-5 text-yellow-500" />
          </button>
        ))}
      </div>
    </div>
  );
} 