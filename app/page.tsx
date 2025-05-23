import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getListings } from '@/lib/api/listings';
import { getCategories } from '@/lib/api/categories';
import { getCities } from '@/lib/api/cities';
import { getPromotions } from '@/lib/api/promotions';
import ListingGrid from '@/components/listings/ListingGrid';
import ListingSlider from '@/components/listings/ListingSlider';
import { Listing } from '@/types';
import { useRouter } from 'next/navigation';

// Helper function to build query strings
const buildQueryString = (params: Record<string, string | undefined>) => {
  const urlParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) urlParams.append(key, value);
  });
  
  const queryString = urlParams.toString();
  return queryString ? `?${queryString}` : '';
};

// Mock forum data - replace with actual API calls when available
const getForumTopics = async () => {
  // This would be replaced with an actual API call to Discourse
  return [
    { id: 1, title: "Where to find best massage in NYC?", replies: 142, author: "JohnDoe" },
    { id: 2, title: "Rate your recent experience", replies: 89, author: "JaneSmith" },
    { id: 3, title: "New to the forum, need recommendations", replies: 67, author: "NewUser22" },
    { id: 4, title: "Best places in Chicago?", replies: 58, author: "ChiTown" },
    { id: 5, title: "Looking for recommendations in LA", replies: 45, author: "LALover" },
  ];
};

const getTopPosters = async () => {
  // This would be replaced with an actual API call to Discourse
  return [
    { rank: 1, username: "JohnDoe", posts: 346 },
    { rank: 2, username: "SuperUser", posts: 289 },
    { rank: 3, username: "ActivePoster", posts: 234 },
    { rank: 4, username: "RegularGuy", posts: 187 },
    { rank: 5, username: "TopContributor", posts: 156 },
  ];
};

const getTopPointEarners = async () => {
  // This would be replaced with an actual API call to Discourse
  return [
    { rank: 1, username: "ExpertUser", points: 4890 },
    { rank: 2, username: "JohnDoe", points: 3560 },
    { rank: 3, username: "HelpfulGuy", points: 2780 },
    { rank: 4, username: "TopHelper", points: 2340 },
    { rank: 5, username: "CommunityFan", points: 2120 },
  ];
};

export default async function HomePage() {
  // Default to NYC listings, fallback to all listings if NYC doesn't exist
  const defaultCitySlug = 'nyc';
  
  // Fetch data in parallel
  const [
    featuredListingsResponse, 
    latestListingsResponse, 
    categoriesResponse, 
    citiesResponse, 
    promotionsResponse,
    forumTopics,
    topPosters,
    topPointEarners
  ] = await Promise.all([
    getListings({ page: 1, pageSize: 24, featured: true, city: defaultCitySlug }).catch(() => 
      getListings({ page: 1, pageSize: 24, featured: true })
    ),
    getListings({ page: 1, pageSize: 24, city: defaultCitySlug }).catch(() => 
      getListings({ page: 1, pageSize: 24 })
    ),
    getCategories(),
    getCities(),
    getPromotions('home'),
    getForumTopics(),
    getTopPosters(),
    getTopPointEarners()
  ]);

  const featuredListings = featuredListingsResponse.data;
  const latestListings = latestListingsResponse.data;
  const categories = categoriesResponse.data;
  const cities = citiesResponse.data;
  const promotions = promotionsResponse.data;
  
  // Check if the default city exists
  const defaultCity = cities.find(city => city.slug === defaultCitySlug);
  const cityName = defaultCity ? defaultCity.name : 'the area';
  const isDefaultCityAvailable = !!defaultCity;

  return (
    <div className="flex flex-col">
      {/* Hero Banner - Full Width */}
      <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-lg">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Find What You're Looking For{isDefaultCityAvailable ? ` in ${cityName}` : ''}
            </h1>
            <p className="text-lg text-purple-100 mb-8">
              Browse thousands of listings{isDefaultCityAvailable ? ` in ${cityName}` : ''} or create your own to reach the right audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href={isDefaultCityAvailable ? `/listings?city=${defaultCitySlug}` : '/listings'} 
                className="bg-white text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-md font-medium text-center"
              >
                Browse Now
              </Link>
              <Link 
                href="/auth/register" 
                className="bg-purple-500 bg-opacity-60 text-white border border-purple-300 hover:bg-purple-400 px-6 py-3 rounded-md font-medium text-center"
              >
                Post an Ad
              </Link>
            </div>
          </div>
        </div>
        {/* Optional background image */}
        
      </div>

      {/* Latest Listings Section - Full Width with Slider */}
      <ListingSlider 
        listings={latestListings} 
        title={`Latest Listings${isDefaultCityAvailable ? ` in ${cityName}` : ''}`} 
        viewAllLink={isDefaultCityAvailable ? `/listings?city=${defaultCitySlug}` : '/listings'} 
        compact={true}
      />

      {/* Promotional Banner (if available) */}
      {promotions.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

      {/* Featured Listings Section - Full Width */}
      <div className="w-full bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Featured Listings{isDefaultCityAvailable ? ` in ${cityName}` : ''}</h2>
            <Link href={isDefaultCityAvailable ? `/listings${buildQueryString({ city: defaultCitySlug, featured: 'true' })}` : `/listings${buildQueryString({ featured: 'true' })}`} className="text-purple-600 hover:text-purple-500 font-medium">
              View All
            </Link>
          </div>
          <ListingGrid 
            listings={featuredListings} 
            compact={true} 
            columns={6}
          />
        </div>
      </div>

      {/* Other Cities Section */}
      {isDefaultCityAvailable && cities.length > 1 && (
        <div className="w-full py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Explore Other Cities</h2>
              <p className="text-gray-600">Browse listings in other available cities</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {cities.filter(city => city.slug !== defaultCitySlug).map(city => (
                <Link
                  key={city.id}
                  href={`/${city.slug}`}
                  className="bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all px-6 py-3 rounded-lg text-gray-700 hover:text-purple-600 font-medium"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Cities Section - fallback when default city not available */}
      {!isDefaultCityAvailable && cities.length > 0 && (
        <div className="w-full py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Browse by City</h2>
              <p className="text-gray-600">Select a city to view its listings</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {cities.map(city => (
                <Link
                  key={city.id}
                  href={`/${city.slug}`}
                  className="bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all px-6 py-3 rounded-lg text-gray-700 hover:text-purple-600 font-medium"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Forum Activity Section */}
      
    </div>
  );
}
