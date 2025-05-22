'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Listing } from '@/types';
import ListingCard from './ListingCard';

interface ListingSliderProps {
  listings: Listing[];
  title: string;
  viewAllLink?: string;
  compact?: boolean;
}

export default function ListingSlider({
  listings,
  title,
  viewAllLink,
  compact = true
}: ListingSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [listings]);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.clientWidth * 0.75;
    sliderRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
    
    // Update buttons after scroll animation completes
    setTimeout(checkScroll, 300);
  };

  if (!listings || listings.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          {viewAllLink && (
            <a href={viewAllLink} className="text-purple-600 hover:text-purple-500 font-medium">
              View All
            </a>
          )}
        </div>
        
        <div className="relative">
          {/* Scroll buttons */}
          {canScrollLeft && (
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {canScrollRight && (
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          
          {/* Slider content */}
          <div 
            ref={sliderRef}
            className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar"
            onScroll={checkScroll}
          >
            {listings.map(listing => (
              <div key={listing.id} className="flex-none w-48 sm:w-56">
                <ListingCard listing={listing} compact={compact} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this CSS to globals.css
// .hide-scrollbar::-webkit-scrollbar {
//   display: none;
// }
// .hide-scrollbar {
//   -ms-overflow-style: none;
//   scrollbar-width: none;
// } 