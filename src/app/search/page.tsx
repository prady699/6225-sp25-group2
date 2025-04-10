'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiCurrencyDollar, HiHome, HiCheck } from 'react-icons/hi';

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

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      router.push(
        `/search-results?${new URLSearchParams({
          ...formData,
          amenities: formData.amenities.join(','),
        }).toString()}`
      );
    } else {
      setCurrentStep((prev) => prev + 1);
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
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.id}
                className={`flex items-center ${
                  index < steps.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    index <= currentStep
                      ? 'bg-yellow-400 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <StepIcon className="w-6 h-6" />
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      index < currentStep ? 'bg-yellow-400' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl p-8 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {steps[currentStep].title}
          </h2>
          {renderStepContent()}
        </motion.div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-xl ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-900 hover:bg-gray-50'
            }`}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-500"
          >
            {currentStep === steps.length - 1 ? 'Show Results' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
} 