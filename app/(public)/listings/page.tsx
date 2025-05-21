import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getListings } from '@/lib/api/listings';
import { getCities } from '@/lib/api/cities';
import { getCategories } from '@/lib/api/categories';
import ListingGrid from '@/components/listings/ListingGrid';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Listings | Lust66',
  description: 'Browse all listings on Lust66. Filter by city and category to find what you need.',
};

interface ListingsPageProps {
  searchParams: {
    city?: string;
    category?: string;
    page?: string;
    featured?: string;
  };
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const citySlug = searchParams.city;
  const categorySlug = searchParams.category;
  const page = Number(searchParams.page) || 1;
  const featured = searchParams.featured === 'true';
  
  // Fetch cities and categories for filters
  const [citiesResponse, categoriesResponse, listingsResponse] = await Promise.all([
    getCities(),
    getCategories(),
    getListings({
      page,
      pageSize: 12,
      city: citySlug,
      category: categorySlug,
      featured: featured || undefined
    })
  ]);
  
  const cities = citiesResponse.data;
  const categories = categoriesResponse.data;
  const listings = listingsResponse.data;
  const pagination = listingsResponse.meta.pagination;
  
  // Build query string for pagination links
  const buildQueryString = (params: Record<string, string | undefined>) => {
    const urlParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) urlParams.append(key, value);
    });
    
    const queryString = urlParams.toString();
    return queryString ? `?${queryString}` : '';
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          All Listings
        </h1>
        <p className="text-gray-600">
          Browse {pagination?.total || 0} listings
          {categorySlug && ' in selected category'}
          {citySlug && ' in selected city'}
        </p>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Filter Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* City Filter */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildQueryString({
                  category: categorySlug,
                  featured: featured ? 'true' : undefined
                })}
                className={`px-3 py-1 rounded-full text-sm ${
                  !citySlug 
                    ? 'bg-purple-100 text-purple-800 font-medium' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Cities
              </Link>
              {cities.map(city => (
                <Link
                  key={city.id}
                  href={buildQueryString({
                    city: city.slug,
                    category: categorySlug,
                    featured: featured ? 'true' : undefined
                  })}
                  className={`px-3 py-1 rounded-full text-sm ${
                    citySlug === city.slug
                      ? 'bg-purple-100 text-purple-800 font-medium' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildQueryString({
                  city: citySlug,
                  featured: featured ? 'true' : undefined
                })}
                className={`px-3 py-1 rounded-full text-sm ${
                  !categorySlug 
                    ? 'bg-purple-100 text-purple-800 font-medium' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Categories
              </Link>
              {categories.map(category => (
                <Link
                  key={category.id}
                  href={buildQueryString({
                    city: citySlug,
                    category: category.slug,
                    featured: featured ? 'true' : undefined
                  })}
                  className={`px-3 py-1 rounded-full text-sm ${
                    categorySlug === category.slug
                      ? 'bg-purple-100 text-purple-800 font-medium' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Featured Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured
            </label>
            <div className="flex gap-2">
              <Link
                href={buildQueryString({
                  city: citySlug,
                  category: categorySlug,
                  featured: 'true'
                })}
                className={`px-3 py-1 rounded-full text-sm ${
                  featured 
                    ? 'bg-purple-100 text-purple-800 font-medium' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Featured Only
              </Link>
              {featured && (
                <Link
                  href={buildQueryString({
                    city: citySlug,
                    category: categorySlug
                  })}
                  className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Clear
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Listings */}
      <ListingGrid listings={listings} />
      
      {/* Pagination */}
      {pagination && pagination.pageCount > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            {page > 1 && (
              <Link
                href={buildQueryString({
                  city: citySlug,
                  category: categorySlug,
                  page: String(page - 1),
                  featured: featured ? 'true' : undefined
                })}
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
                href={buildQueryString({
                  city: citySlug,
                  category: categorySlug,
                  page: String(page + 1),
                  featured: featured ? 'true' : undefined
                })}
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