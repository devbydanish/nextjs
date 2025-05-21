import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getListings } from '@/lib/api/listings';
import { getCategories } from '@/lib/api/categories';
import { getCities } from '@/lib/api/cities';
import { getPromotions } from '@/lib/api/promotions';
import ListingGrid from '@/components/listings/ListingGrid';
import ListingSlider from '@/components/listings/ListingSlider';

// Helper function to build query strings
const buildQueryString = (params: Record<string, string | undefined>) => {
  const urlParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) urlParams.append(key, value);
  });
  
  const queryString = urlParams.toString();
  return queryString ? `?${queryString}` : '';
};

export default async function HomePage() {
  // Fetch data in parallel
  const [featuredListingsResponse, latestListingsResponse, categoriesResponse, citiesResponse, promotionsResponse] = await Promise.all([
    getListings({ page: 1, pageSize: 6, featured: true }),
    getListings({ page: 1, pageSize: 10 }),
    getCategories(),
    getCities(),
    getPromotions('home')
  ]);

  const featuredListings = featuredListingsResponse.data;
  const latestListings = latestListingsResponse.data;
  const categories = categoriesResponse.data;
  const cities = citiesResponse.data;
  const promotions = promotionsResponse.data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg shadow-xl overflow-hidden mb-12">
        <div className="px-8 py-16 md:py-20 md:px-12 lg:w-3/5">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Find What You're Looking For
          </h1>
          <p className="text-lg text-purple-100 mb-8">
            Browse thousands of listings or create your own to reach the right audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/auth/register" 
              className="bg-white text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-md font-medium text-center"
            >
              Post an Ad
            </Link>
            <Link 
              href="#categories" 
              className="bg-purple-500 text-white hover:bg-purple-400 px-6 py-3 rounded-md font-medium text-center"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </div>

      {/* Latest Listings Slider */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Latest Listings</h2>
          <Link href="/listings" className="text-purple-600 hover:text-purple-500 font-medium">
            View All
          </Link>
        </div>
        <ListingSlider listings={latestListings} />
      </section>

      {/* Promotional Banner (if available) */}
      {promotions.length > 0 && (
        <div className="mb-12">
          <Link href={promotions[0].link || '#'}>
            <div className="relative h-48 md:h-64 w-full rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <Image 
                src={`${process.env.NEXT_PUBLIC_API_URL}${promotions[0].image.url}`}
                alt={promotions[0].title}
                className="object-cover"
                fill
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{promotions[0].title}</h3>
                  {promotions[0].description && (
                    <p className="text-white/90 mb-2">{promotions[0].description}</p>
                  )}
                  <span className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Learn More
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Categories Section */}
      <section id="categories" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/listings${buildQueryString({ category: category.slug })}`}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              {category.icon && (
                <div className="w-12 h-12 mb-3">
                  <Image 
                    src={`${process.env.NEXT_PUBLIC_API_URL}${category.icon.url}`}
                    alt={category.name}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              )}
              <span className="text-gray-800 font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Cities Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse by City</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cities.map((city) => (
            <Link 
              key={city.id} 
              href={`/listings${buildQueryString({ city: city.slug })}`}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <span className="text-gray-800 font-medium">{city.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Listings Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Listings</h2>
          <Link href={`/listings${buildQueryString({ featured: 'true' })}`} className="text-purple-600 hover:text-purple-500 font-medium">
            View All
          </Link>
        </div>
        <ListingGrid listings={featuredListings} />
      </section>
    </div>
  );
}
