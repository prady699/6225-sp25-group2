'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from './Image';
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
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

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

        {/* Search Button */}
        <motion.button
          onClick={() => router.push('/search')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center space-x-3 px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full font-semibold text-lg shadow-lg transition-all hover:scale-105"
        >
          <HiMagnifyingGlass className="w-6 h-6" />
          <span>Search Available Properties</span>
        </motion.button>
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