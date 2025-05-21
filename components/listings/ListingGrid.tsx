import React from 'react';
import { Listing } from '@/types';
import ListingCard from './ListingCard';

interface ListingGridProps {
  listings: Listing[];
}

export default function ListingGrid({ listings }: ListingGridProps) {
  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-medium text-gray-700">No listings found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
} 