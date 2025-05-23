import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Listing } from '@/types';

interface ListingCardProps {
  listing: Listing;
  compact?: boolean;
}

export default function ListingCard({ listing, compact = false }: ListingCardProps) {
  const { title, subtitle, slug, phone, featured, images, category, city } = listing;
  
  // Get first image or use placeholder
  const firstImage = images && images.length > 0 
    ? images[0] 
    : null;
    
  const imageUrl = firstImage 
    ? process.env.NEXT_PUBLIC_API_URL + firstImage?.url
    : '/placeholder-image.jpg';
    
  const categorySlug = category?.slug;
  const citySlug = city?.slug;
  
  // Build the new URL structure: /city/category/slug
  const listingUrl = `/${citySlug}/${categorySlug}/${slug}`;
  
  if (compact) {
    return (
      <div className="overflow-hidden bg-white hover:shadow-md transition-shadow rounded border border-gray-100">
        <Link href={listingUrl} className="block h-full">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={imageUrl}
              alt={title}
              className="object-cover"
              fill
            />
            {featured && (
              <span className="absolute top-1 right-1 bg-amber-500 text-white text-xs px-1 py-0.5 rounded">
                ★
              </span>
            )}
          </div>
          <div className="p-2">
            <h3 className="text-sm font-medium truncate text-gray-800">{title}</h3>
            {subtitle && (
              <p className="text-xs text-gray-600 mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow border border-gray-100">
      <Link href={listingUrl} className="block h-full">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={imageUrl}
            alt={title}
            className="object-cover"
            fill
          />
          {featured && (
            <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-md">
              Featured
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium truncate text-gray-800">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{subtitle}</p>
          )}
          {phone && (
            <div className="mt-3 text-sm text-gray-700">
              <span className="font-medium">Contact: </span>
              {phone}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
} 