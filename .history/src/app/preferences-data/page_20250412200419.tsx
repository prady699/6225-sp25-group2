'use client';

import { useState, useEffect } from 'react';
import { HiDownload, HiRefresh, HiCode, HiOutlineClipboardCopy } from 'react-icons/hi';

interface FormattedPreference {
  id: string;
  timestamp: string;
  location: string;
  price_range: string;
  bedrooms: string;
  amenities: string[];
  query_count: number;
}

export default function PreferencesDataPage() {
  const [preferences, setPreferences] = useState<FormattedPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/preferences-export');
      const data = await response.json();
      
      if (data.success) {
        setPreferences(data.preferences);
      } else {
        setError('Failed to load preferences data');
      }
    } catch (error) {
      console.error('Error fetching preferences data:', error);
      setError('An error occurred while fetching preferences data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  const handleDownload = () => {
    const jsonString = JSON.stringify({ preferences }, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-preferences-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = () => {
    const jsonString = JSON.stringify({ preferences }, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Preferences Data for AI</h1>
            <p className="text-gray-600 mt-2">
              {preferences.length} saved preference{preferences.length !== 1 ? 's' : ''} available for AI processing
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={fetchPreferences}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              <HiRefresh className="w-5 h-5" />
              <span>Refresh</span>
            </button>
            
            <button
              onClick={handleCopyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg"
            >
              <HiOutlineClipboardCopy className="w-5 h-5" />
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>
            
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg"
            >
              <HiDownload className="w-5 h-5" />
              <span>Download JSON</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-300 border-t-yellow-400 rounded-full mb-4"></div>
            <p className="text-gray-600">Loading preferences data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchPreferences}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : preferences.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-600 mb-4">No preferences data available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden">
              <div className="flex items-center mb-4">
                <HiCode className="w-6 h-6 text-yellow-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Raw JSON Data for AI Model
                </h2>
              </div>
              
              <div className="relative">
                <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-[600px] text-sm">
                  {JSON.stringify({ preferences }, null, 2)}
                </pre>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Tabular View
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bedrooms</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amenities</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Saved</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preferences.map((pref) => (
                      <tr key={pref.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{pref.location || '—'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{pref.price_range || '—'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {pref.bedrooms === '0' ? 'Studio' : pref.bedrooms || '—'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {pref.amenities && pref.amenities.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {pref.amenities.map((amenity) => (
                                  <span key={amenity} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              '—'
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(pref.timestamp).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 