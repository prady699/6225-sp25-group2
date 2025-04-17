'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiCurrencyDollar, HiHome, HiCheck } from 'react-icons/hi';
import SavePreferences from '@/components/SavePreferences';
import SuggestedPreferences from '@/components/SuggestedPreferences';

const steps = [
  {
    id: 'location',
    title: 'Where do you want to live?',
    icon: HiLocationMarker,
  },
  {
    id: 'price',
    title: "What's your budget?",
    icon: HiCurrencyDollar,
  },
  {
    id: 'rooms',
    title: 'How many bedrooms?',
    icon: HiHome,
  },
  {
    id: 'amenities',
    title: 'Must-have amenities',
    icon: HiCheck,
  },
];

const priceRanges = [
  { id: 1, label: '$500 - $1000', value: '500-1000' },
  { id: 2, label: '$1000 - $1500', value: '1000-1500' },
  { id: 3, label: '$1500 - $2000', value: '1500-2000' },
  { id: 4, label: '$2000+', value: '2000+' },
];

const bedroomOptions = [
  { id: 1, label: 'Studio', value: '0' },
  { id: 2, label: '1 Bedroom', value: '1' },
  { id: 3, label: '2 Bedrooms', value: '2' },
  { id: 4, label: '3+ Bedrooms', value: '3+' },
];

const amenities = [
  { id: 'parking', label: 'Parking' },
  { id: 'gym', label: 'Gym' },
  { id: 'laundry', label: 'In-unit Laundry' },
  { id: 'ac', label: 'Air Conditioning' },
  { id: 'furnished', label: 'Furnished' },
  { id: 'pets', label: 'Pet Friendly' },
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    location: searchParams.get('q') || '',
    price: '',
    bedrooms: '',
    amenities: [] as string[],
  });
  const [showSaveOption, setShowSaveOption] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      setShowSaveOption(true);
      // Continue to search results only after save option is shown
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleProceedToResults = () => {
    router.push(
      `/search-results?${new URLSearchParams({
        ...formData,
        amenities: formData.amenities.join(','),
      }).toString()}`
    );
  };

  const handleSelectPreference = (preferenceData: any) => {
    setFormData(preferenceData);
    setShowSuggestions(false);
    // If the suggestion has a location, advance to the next step
    if (preferenceData.location) {
      setCurrentStep(1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="Enter university or locality"
              className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-2 gap-4">
            {priceRanges.map((range) => (
              <button
                key={range.id}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, price: range.value }))
                }
                className={`p-4 rounded-xl border ${
                  formData.price === range.value
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 hover:border-yellow-400'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 gap-4">
            {bedroomOptions.map((option) => (
              <button
                key={option.id}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, bedrooms: option.value }))
                }
                className={`p-4 rounded-xl border ${
                  formData.bedrooms === option.value
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 hover:border-yellow-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-2 gap-4">
            {amenities.map((amenity) => (
              <button
                key={amenity.id}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    amenities: prev.amenities.includes(amenity.id)
                      ? prev.amenities.filter((id) => id !== amenity.id)
                      : [...prev.amenities, amenity.id],
                  }))
                }
                className={`p-4 rounded-xl border ${
                  formData.amenities.includes(amenity.id)
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 hover:border-yellow-400'
                }`}
              >
                {amenity.label}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-md"
        >
          {!showSaveOption ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {steps[currentStep].title}
                </h1>
                <div className="flex gap-2 mt-4">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex-1 h-1 rounded-full ${
                        index <= currentStep ? 'bg-yellow-400' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Show suggestions only on first step */}
              {currentStep === 0 && showSuggestions && (
                <SuggestedPreferences onSelectPreference={handleSelectPreference} />
              )}

              <div className="mb-8">{renderStepContent()}</div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className={`px-6 py-3 rounded-xl ${
                    currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-500 font-medium"
                >
                  {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Save Your Preferences
              </h2>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  You can save these preferences for future reference:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(formData, null, 2)}
                  </pre>
                </div>
              </div>

              <SavePreferences preferences={formData} />

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleProceedToResults}
                  className="w-full px-6 py-3 bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-500 font-medium"
                >
                  Continue to Results
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 