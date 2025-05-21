import React from 'react';
import Link from 'next/link';
import { getFeaturedListings } from '@/lib/api/listings';
import ListingGrid from '@/components/listings/ListingGrid';
import { Metadata } from 'next';

interface FeaturedListingsPageProps {
  searchParams: {
    page?: string;
  };
}

export const metadata: Metadata = {
  title: 'Featured Listings | Lust66',
  description: 'Browse our selection of featured listings from across all categories and cities.',
};

export default async function FeaturedListingsPage({ 
  searchParams 
}: FeaturedListingsPageProps) {
  const page = Number(searchParams.page) || 1;
  
  // Fetch featured listings with pagination
  const listingsResponse = await getFeaturedListings(12);
  const listings = listingsResponse.data;
  const pagination = listingsResponse.meta.pagination;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Featured Listings
        </h1>
        <p className="text-gray-600">
          Browse our selection of {pagination?.total || 0} featured listings
        </p>
      </div>
      
      {/* Listings */}
      <ListingGrid listings={listings} />
      
      {/* Pagination */}
      {pagination && pagination.pageCount > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            {page > 1 && (
              <Link
                href={`/featured?page=${page - 1}`}
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Previous
              </Link>
            )}
            
            <span className="px-3 py-1 rounded-md bg-purple-100 text-purple-800 font-medium">
              {page}
            </span>
            
            {page < pagination.pageCount && (
              <Link
                href={`/featured?page=${page + 1}`}
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Next
              </Link>
            )}
            
            <span className="text-gray-500 text-sm ml-2">
              Page {page} of {pagination.pageCount}
            </span>
          </nav>
        </div>
      )}
    </div>
  );
} 