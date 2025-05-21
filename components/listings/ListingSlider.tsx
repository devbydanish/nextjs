'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Listing } from '@/types';
import ListingCard from './ListingCard';

interface ListingSliderProps {
  listings: Listing[];
}

export default function ListingSlider({ listings }: ListingSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = Math.max(0, listings.length - 3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto advance slides
  useEffect(() => {
    if (listings.length <= 3) return;
    
    const startTimer = () => {
      timerRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => 
          prevIndex >= maxIndex ? 0 : prevIndex + 1
        );
      }, 5000); // Change slide every 5 seconds
    };
    
    startTimer();
    
    // Cleanup on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [listings.length, maxIndex]);

  // Pause auto-advance on hover
  const pauseTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Resume auto-advance after hover
  const resumeTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (listings.length > 3) {
      timerRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => 
          prevIndex >= maxIndex ? 0 : prevIndex + 1
        );
      }, 5000);
    }
  };

  // Manual navigation
  const goToPrev = () => {
    setCurrentIndex(prevIndex => 
      prevIndex <= 0 ? maxIndex : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex >= maxIndex ? 0 : prevIndex + 1
    );
  };

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-medium text-gray-700">No listings found</h3>
        <p className="text-gray-500 mt-2">Check back later for new listings.</p>
      </div>
    );
  }

  const visibleListings = listings.slice(currentIndex, currentIndex + 3);
  // If we don't have enough listings to fill the slider, add from the beginning
  while (visibleListings.length < 3 && listings.length > 0) {
    visibleListings.push(listings[visibleListings.length % listings.length]);
  }

  return (
    <div 
      className="relative" 
      onMouseEnter={pauseTimer} 
      onMouseLeave={resumeTimer}
    >
      {/* Navigation arrows */}
      {listings.length > 3 && (
        <>
          <button 
            onClick={goToPrev}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-4 bg-white h-10 w-10 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-purple-600"
            aria-label="Previous listings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-4 bg-white h-10 w-10 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-purple-600"
            aria-label="Next listings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Listings slider */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-all duration-500 ease-in-out"
          style={{ transform: `translateX(${currentIndex * -33.33}%)` }}
        >
          {listings.map((listing) => (
            <div key={listing.id} className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3">
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination indicators */}
      {listings.length > 3 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: Math.min(5, maxIndex + 1) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 w-2 rounded-full transition-all ${
                idx === currentIndex 
                  ? 'bg-purple-600 w-6' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
          {maxIndex > 4 && (
            <span className="text-xs text-gray-500 self-center">
              {currentIndex + 1} / {maxIndex + 1}
            </span>
          )}
        </div>
      )}

      {/* See all link (only visible on mobile) */}
      <div className="mt-4 text-center sm:hidden">
        <Link href="/listings" className="inline-block text-purple-600 hover:text-purple-700 font-medium">
          See All Listings
        </Link>
      </div>
    </div>
  );
} 