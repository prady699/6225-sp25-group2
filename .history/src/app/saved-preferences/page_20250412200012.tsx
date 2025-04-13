'use client';

import { useState, useEffect } from 'react';
import { HiRefresh, HiOutlineEmojiSad, HiExternalLink } from 'react-icons/hi';
import Link from 'next/link';

interface SavedPreference {
  id: string;
  timestamp: string;
  data: {
    location: string;
    price: string;
    bedrooms: string;
    amenities: string[];
  };
}

export default function SavedPreferencesPage() {
  const [preferences, setPreferences] = useState<SavedPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/save-preferences');
      const data = await response.json();
      
      if (data.success) {
        setPreferences(data.preferences);
      } else {
        setError('Failed to load preferences');
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setError('An error occurred while fetching preferences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatPreferenceData = (data: SavedPreference['data']) => {
    const parts = [];
    
    if (data.location) parts.push(`Location: ${data.location}`);
    if (data.price) parts.push(`Price: ${data.price}`);
    if (data.bedrooms) parts.push(`Bedrooms: ${data.bedrooms}`);
    if (data.amenities && data.amenities.length > 0) {
      parts.push(`Amenities: ${data.amenities.join(', ')}`);
    }
    
    return parts.join(' • ');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Preferences</h1>
          <button
            onClick={fetchPreferences}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            <HiRefresh className="w-5 h-5" />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-300 border-t-yellow-400 rounded-full mb-4"></div>
            <p className="text-gray-600">Loading saved preferences...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <HiOutlineEmojiSad className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{error}</p>
          </div>
        ) : preferences.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <HiOutlineEmojiSad className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No saved preferences found</p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-500 font-medium"
            >
              Go to Search
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {preferences.map((pref) => (
              <div key={pref.id} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {pref.data.location || 'Unnamed Preference'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Saved on {formatDate(pref.timestamp)}
                    </p>
                  </div>
                  <Link
                    href={`/search-results?${new URLSearchParams({
                      ...pref.data,
                      amenities: pref.data.amenities.join(','),
                    }).toString()}`}
                    className="flex items-center gap-1 text-sm text-yellow-600 hover:text-yellow-700"
                  >
                    <span>View Results</span>
                    <HiExternalLink className="w-4 h-4" />
                  </Link>
                </div>
                
                <p className="text-gray-600 text-sm">
                  {formatPreferenceData(pref.data)}
                </p>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Preference ID: {pref.id}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 