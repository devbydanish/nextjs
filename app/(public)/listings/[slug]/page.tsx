import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getListingBySlug } from '@/lib/api/listings';
import { Metadata } from 'next';

interface ListingPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  try {
    const { data: listing } = await getListingBySlug(params.slug);
    
    return {
      title: `${listing.title} | Lust66`,
      description: listing.description,
    };
  } catch {
    return {
      title: 'Listing Not Found | Lust66',
      description: 'The requested listing could not be found.',
    };
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  try {
    const { data: listing } = await getListingBySlug(params.slug);
    
    // Get first image or use placeholder
    const firstImage = listing.images && listing.images.length > 0 
      ? listing.images[0] 
      : null;
      
    const imageUrl = firstImage 
      ? process.env.NEXT_PUBLIC_API_URL + firstImage.formats?.medium?.url || process.env.NEXT_PUBLIC_API_URL + firstImage.url 
      : '/placeholder-image.jpg';
    
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link 
            href="/listings" 
            className="text-purple-600 hover:text-purple-500 font-medium"
          >
            ← Back to Listings
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src={imageUrl}
              alt={listing.title}
              className="object-cover"
              fill
              priority
            />
            {listing.featured && (
              <span className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                Featured
              </span>
            )}
          </div>
          
          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.title}</h1>
            
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span>{listing.city.name}</span>
              <span className="mx-2">•</span>
              <span>{listing.category.name}</span>
              {listing.tags && listing.tags.length > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <div className="flex flex-wrap gap-2">
                    {listing.tags.map(tag => (
                      <span 
                        key={tag.id}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                {listing.phone && (
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-700">{listing.phone}</span>
                  </div>
                )}
                
                {listing.email && (
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a 
                      href={`mailto:${listing.email}`}
                      className="text-purple-600 hover:text-purple-500"
                    >
                      {listing.email}
                    </a>
                  </div>
                )}
                
                {listing.address && (
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-gray-400 mr-3 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">{listing.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Listing Not Found</h1>
          <p className="text-gray-600 mb-8">
            The listing you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link 
            href="/listings" 
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-md font-medium hover:bg-purple-700"
          >
            Browse All Listings
          </Link>
        </div>
      </div>
    );
  }
} 