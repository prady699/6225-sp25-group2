'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiCurrencyDollar, HiHome, HiCheck, HiPlus, HiX } from 'react-icons/hi';
import SuggestedPreferences from '@/components/SuggestedPreferences';
import { autoSavePreferences } from '@/utils/autoSave';

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

const priceRanges = {
  min: 100,
  max: 10000,
  step: 100,
  defaultMin: 1000,
  defaultMax: 3000,
};

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
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'pool', label: 'Pool' },
  { id: 'security', label: 'Security' },
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    location: searchParams.get('q') || '',
    minPrice: priceRanges.defaultMin,
    maxPrice: priceRanges.defaultMax,
    bedrooms: '',
    amenities: [] as string[],
    customAmenities: [] as string[],
  });
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [customAmenityInput, setCustomAmenityInput] = useState('');
  
  const customAmenityInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formData.location || formData.minPrice !== priceRanges.defaultMin || 
        formData.maxPrice !== priceRanges.defaultMax || formData.bedrooms || 
        formData.amenities.length > 0 || formData.customAmenities.length > 0) {
      autoSavePreferences(formData);
    }
  }, [formData]);

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      handleProceedToResults();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleProceedToResults = () => {
    const priceParam = `${formData.minPrice}-${formData.maxPrice}`;
    
    const allAmenities = [...formData.amenities, ...formData.customAmenities];
    
    autoSavePreferences({
      ...formData,
      price: priceParam,
      allAmenities,
      searchCompleted: true,
      viewedResults: true,
    });
    
    router.push(
      `/search-results?${new URLSearchParams({
        location: formData.location,
        price: priceParam,
        bedrooms: formData.bedrooms,
        amenities: allAmenities.join(','),
      }).toString()}`
    );
  };

  const handleSelectPreference = (preferenceData: any) => {
    let minPrice = priceRanges.defaultMin;
    let maxPrice = priceRanges.defaultMax;
    
    if (preferenceData.price && preferenceData.price.includes('-')) {
      const [min, max] = preferenceData.price.split('-').map(Number);
      if (!isNaN(min)) minPrice = min;
      if (!isNaN(max)) maxPrice = max;
    }
    
    const predefinedAmenityIds = amenities.map(a => a.id);
    const standardAmenities = preferenceData.amenities?.filter((a: string) => predefinedAmenityIds.includes(a)) || [];
    const customAmenities = preferenceData.amenities?.filter((a: string) => !predefinedAmenityIds.includes(a)) || [];
    
    setFormData({
      ...preferenceData,
      minPrice,
      maxPrice,
      amenities: standardAmenities,
      customAmenities,
    });
    
    setShowSuggestions(false);
    
    if (preferenceData.location) {
      setCurrentStep(1);
    }
  };

  const addCustomAmenity = () => {
    if (customAmenityInput.trim() === '') return;
    
    const formattedAmenity = customAmenityInput.trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
      
    if (!formData.customAmenities.includes(formattedAmenity)) {
      updateFormData({ 
        customAmenities: [...formData.customAmenities, formattedAmenity] 
      });
    }
    
    setCustomAmenityInput('');
    
    if (customAmenityInputRef.current) {
      customAmenityInputRef.current.focus();
    }
  };

  const removeCustomAmenity = (amenity: string) => {
    updateFormData({
      customAmenities: formData.customAmenities.filter(a => a !== amenity)
    });
  };

  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      return updated;
    });
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
                updateFormData({ location: e.target.value })
              }
              placeholder="Enter university or locality"
              className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Price Range</span>
                <span className="text-sm font-medium">
                  ${formData.minPrice} - ${formData.maxPrice === priceRanges.max ? formData.maxPrice + '+' : formData.maxPrice}
                </span>
              </div>
              
              <div className="px-2">
                <div className="relative h-2 bg-gray-200 rounded-full">
                  <div 
                    className="absolute h-2 bg-yellow-400 rounded-full"
                    style={{
                      left: `${((formData.minPrice - priceRanges.min) / (priceRanges.max - priceRanges.min)) * 100}%`,
                      right: `${100 - ((formData.maxPrice - priceRanges.min) / (priceRanges.max - priceRanges.min)) * 100}%`
                    }}
                  ></div>
                </div>
                
                <div className="relative mt-4">
                  <input 
                    type="range"
                    min={priceRanges.min}
                    max={priceRanges.max}
                    step={priceRanges.step}
                    value={formData.minPrice}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value < formData.maxPrice) {
                        updateFormData({ minPrice: value });
                      }
                    }}
                    className="absolute w-full -top-2 appearance-none bg-transparent pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <input 
                    type="range"
                    min={priceRanges.min}
                    max={priceRanges.max}
                    step={priceRanges.step}
                    value={formData.maxPrice}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > formData.minPrice) {
                        updateFormData({ maxPrice: value });
                      }
                    }}
                    className="absolute w-full -top-2 appearance-none bg-transparent pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
                
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>${priceRanges.min}</span>
                  <span>${priceRanges.max}+</span>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mt-4">
              Or select a preset range:
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => updateFormData({ minPrice: 500, maxPrice: 2000 })}
                className={`p-4 rounded-xl border ${
                  formData.minPrice === 500 && formData.maxPrice === 2000
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 hover:border-yellow-400'
                }`}
              >
                $500 - $2000
              </button>
              <button
                onClick={() => updateFormData({ minPrice: 2000, maxPrice: 4000 })}
                className={`p-4 rounded-xl border ${
                  formData.minPrice === 2000 && formData.maxPrice === 4000
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 hover:border-yellow-400'
                }`}
              >
                $2000 - $4000
              </button>
              <button
                onClick={() => updateFormData({ minPrice: 4000, maxPrice: 6000 })}
                className={`p-4 rounded-xl border ${
                  formData.minPrice === 4000 && formData.maxPrice === 6000
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 hover:border-yellow-400'
                }`}
              >
                $4000 - $6000
              </button>
              <button
                onClick={() => updateFormData({ minPrice: 6000, maxPrice: 10000 })}
                className={`p-4 rounded-xl border ${
                  formData.minPrice === 6000 && formData.maxPrice === 10000
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 hover:border-yellow-400'
                }`}
              >
                $6000+
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 gap-4">
            {bedroomOptions.map((option) => (
              <button
                key={option.id}
                onClick={() =>
                  updateFormData({ bedrooms: option.value })
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
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {amenities.map((amenity) => (
                <button
                  key={amenity.id}
                  onClick={() => {
                    const newAmenities = formData.amenities.includes(amenity.id)
                      ? formData.amenities.filter((id) => id !== amenity.id)
                      : [...formData.amenities, amenity.id];
                    
                    updateFormData({ amenities: newAmenities });
                  }}
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
            
            <div className="mt-6">
              <label className="block text-sm text-gray-700 mb-2">
                Add custom amenities
              </label>
              <div className="flex gap-2">
                <input
                  ref={customAmenityInputRef}
                  type="text"
                  value={customAmenityInput}
                  onChange={(e) => setCustomAmenityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomAmenity();
                    }
                  }}
                  placeholder="e.g. Swimming Pool, Study Room"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  onClick={addCustomAmenity}
                  className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500"
                >
                  <HiPlus className="w-5 h-5" />
                </button>
              </div>
              
              {formData.customAmenities.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm text-gray-700 mb-2">Custom amenities:</div>
                  <div className="flex flex-wrap gap-2">
                    {formData.customAmenities.map((amenity) => (
                      <div 
                        key={amenity}
                        className="flex items-center bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1"
                      >
                        <span className="text-sm">{amenity}</span>
                        <button 
                          onClick={() => removeCustomAmenity(amenity)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <HiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
              {currentStep === steps.length - 1 ? 'Show Results' : 'Next'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 