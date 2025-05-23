import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getListingBySlug } from '@/lib/api/listings';
import { getCityBySlug } from '@/lib/api/cities';
import { getCategoryBySlug } from '@/lib/api/categories';
import { Listing, Tag } from '@/types';
import { Metadata } from 'next';

interface ListingDetailPageProps {
  params: Promise<{
    city: string;
    category: string;
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
  const [{ city: citySlug, category: categorySlug, slug }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  
  try {
    // Verify the URL parameters match the listing data
    const [listingResponse, cityResponse, categoryResponse] = await Promise.all([
      getListingBySlug(slug),
      getCityBySlug(citySlug),
      getCategoryBySlug(categorySlug)
    ]);
    
    const listing = Array.isArray(listingResponse.data) ? listingResponse.data[0] : listingResponse.data;
    const cityData = Array.isArray(cityResponse.data) && cityResponse.data.length > 0 ? cityResponse.data[0] : cityResponse.data;
    const categoryData = Array.isArray(categoryResponse.data) && categoryResponse.data.length > 0 ? categoryResponse.data[0] : categoryResponse.data;
    
    if (!listing || !cityData || !categoryData) {
      notFound();
    }
    
    // Verify that the listing belongs to the correct city and category
    if (listing.city.slug !== citySlug || listing.category.slug !== categorySlug) {
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
              <Link href={`/${citySlug}`} className="text-purple-600 hover:text-purple-500">
                {cityName}
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link href={`/listings?city=${citySlug}&category=${categorySlug}`} className="text-purple-600 hover:text-purple-500">
                {categoryName}
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
              <Link href={`/listings?category=${categorySlug}`} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded hover:bg-purple-200">
                {categoryName}
              </Link>
              <Link href={`/${citySlug}`} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded hover:bg-gray-200">
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
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Phone</h3>
                    <a href={`tel:${phone}`} className="text-purple-600 hover:text-purple-500 font-medium">
                      {phone}
                    </a>
                  </div>
                )}
                {email && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Email</h3>
                    <a href={`mailto:${email}`} className="text-purple-600 hover:text-purple-500 font-medium">
                      {email}
                    </a>
                  </div>
                )}
                {address && (
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Address</h3>
                    <p className="text-gray-900">{address}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Back to City Listings */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href={`/${citySlug}`}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium text-center"
              >
                ← Back to {cityName}
              </Link>
              <Link 
                href={`/listings?city=${citySlug}&category=${categorySlug}`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-medium text-center"
              >
                View All {categoryName} in {cityName}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching listing data:', error);
    notFound();
  }
} 