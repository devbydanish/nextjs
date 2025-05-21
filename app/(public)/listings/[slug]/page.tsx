import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getListingBySlug } from '@/lib/api/listings';
import { Listing, Tag } from '@/types';
import { Metadata } from 'next';

interface ListingDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: ListingDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const response = await getListingBySlug(slug);
    const listing = Array.isArray(response.data) ? response.data[0] : response.data;
    
    if (!listing) {
      return {
        title: 'Listing Not Found',
        description: 'The requested listing could not be found.'
      };
    }
    
    return {
      title: `${listing.title} | Lust66`,
      description: listing.description.substring(0, 160),
      openGraph: {
        title: listing.title,
        description: listing.description.substring(0, 160),
        images: listing.images && listing.images.length > 0 
          ? [`${process.env.NEXT_PUBLIC_API_URL}${listing.images[0].url}`] 
          : [],
      },
    };
  } catch (error) {
    return {
      title: 'Listing Not Found',
      description: 'The requested listing could not be found.'
    };
  }
}

export default async function ListingDetailPage({ params, searchParams }: ListingDetailPageProps) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  
  try {
    const response = await getListingBySlug(slug);
    const listing = Array.isArray(response.data) ? response.data[0] : response.data;
    
    if (!listing) {
      notFound();
    }
    
    const { 
      title, 
      description, 
      phone,
      email,
      price,
      address,
      images, 
      category, 
      city,
      tags,
      featured,
      createdAt
    } = listing;
    
    const categoryName = category.name;
    const cityName = city.name;
    const citySlug = city.slug;
    const categorySlug = category.slug;
    
    // Format description text with paragraphs
    const formattedDescription = description.split('\n').map((paragraph: string, i: number) => (
      <p key={i} className="mb-4">{paragraph}</p>
    ));

    // Format date
    const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Build query strings for filter links
    const buildCityQuery = () => {
      const params = new URLSearchParams();
      params.append('city', citySlug);
      return `?${params.toString()}`;
    };
    
    const buildCategoryQuery = () => {
      const params = new URLSearchParams();
      params.append('category', categorySlug);
      return `?${params.toString()}`;
    };
    
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm">
          <ol className="flex space-x-2">
            <li>
              <Link href="/" className="text-purple-600 hover:text-purple-500">
                Home
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link href="/listings" className="text-purple-600 hover:text-purple-500">
                Listings
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-500 truncate max-w-[200px]">{title}</li>
          </ol>
        </nav>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden">
              {images && images.length > 0 ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${images[0].url}`}
                  alt={title}
                  className="object-cover"
                  fill
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {images && images.slice(1).map((image: any, index: number) => (
                <div key={index} className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${image.url}`}
                    alt={`${title} - Image ${index + 2}`}
                    className="object-cover"
                    fill
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Listing Content */}
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Link href={`/listings${buildCategoryQuery()}`} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded hover:bg-purple-200">
                {categoryName}
              </Link>
              <Link href={`/listings${buildCityQuery()}`} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded hover:bg-gray-200">
                {cityName}
              </Link>
              {featured && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                  Featured
                </span>
              )}
              {tags && tags.map((tag: Tag) => (
                <span 
                  key={tag.id} 
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {tag.name}
                </span>
              ))}
              <span className="text-gray-500 text-xs ml-auto">
                Posted on {formattedDate}
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
              {price && (
                <div className="text-xl font-bold text-purple-600 whitespace-nowrap">
                  ${price.toFixed(2)}
                </div>
              )}
            </div>
            
            <div className="prose max-w-none mb-8">
              {formattedDescription}
            </div>
            
            {/* Contact Information */}
            <div className="bg-gray-50 p-6 rounded-md mb-6">
              <h2 className="text-lg font-medium mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {phone && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="text-gray-700">{phone}</span>
                  </div>
                )}
                {email && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="text-gray-700">{email}</span>
                  </div>
                )}
                {address && (
                  <div className="flex items-center col-span-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{address}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/listings"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
              >
                Back to Listings
              </Link>
              {phone && (
                <button 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                  onClick={() => window.location.href = `tel:${phone}`}
                >
                  Call Now
                </button>
              )}
              {email && (
                <button 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                  onClick={() => window.location.href = `mailto:${email}`}
                >
                  Email
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
} 