'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMagnifyingGlass } from 'react-icons/hi2';

const slides = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Find Your Perfect Student Home',
    description: 'Discover AI-matched apartments near your campus',
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Smart Apartment Matching',
    description: 'Let our AI find your ideal living space based on your preferences',
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Premium Student Living',
    description: 'Quality housing that fits your student budget',
  },
];

export default function HeroCarousel() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {/* Carousel Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white px-4 max-w-4xl mx-auto">
        <motion.h1
          key={`title-${currentSlide}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-bold text-center mb-6 leading-tight"
        >
          {slides[currentSlide].title}
        </motion.h1>
        <motion.p
          key={`desc-${currentSlide}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-center mb-12 text-gray-200"
        >
          {slides[currentSlide].description}
        </motion.p>

        {/* Search Form */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex w-full max-w-lg"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter university or locality"
            className="flex-1 px-6 py-4 rounded-l-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            type="submit"
            className="px-6 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-r-full font-semibold flex items-center transition-colors"
          >
            <HiMagnifyingGlass className="w-6 h-6 mr-2" />
            Search
          </button>
        </motion.form>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 flex space-x-3 justify-center w-full">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              currentSlide === index
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}