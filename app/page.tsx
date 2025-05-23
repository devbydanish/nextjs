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
    getListings({ page: 1, pageSize: 24, featured: true }),
    getListings({ page: 1, pageSize: 24 }),
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

  return (
    <div className="flex flex-col">
      {/* Hero Banner - Full Width */}
      <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-lg">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Find What You're Looking For
            </h1>
            <p className="text-lg text-purple-100 mb-8">
              Browse thousands of listings or create your own to reach the right audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/listings" 
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
        title="Latest Listings" 
        viewAllLink="/listings" 
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
            <h2 className="text-2xl font-bold text-gray-800">Featured Listings</h2>
            <Link href={`/listings${buildQueryString({ featured: 'true' })}`} className="text-purple-600 hover:text-purple-500 font-medium">
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

      {/* Forum Activity Section */}
      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Forum Activity</h2>
            <Link 
              href="https://bbs.lust66.com" 
              className="text-purple-600 hover:text-purple-500 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Forum
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Hot Topics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                Hot Forum Topics
              </h3>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {forumTopics.map(topic => (
                  <div key={topic.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <Link 
                      href={`https://bbs.lust66.com/t/${topic.id}`}
                      className="block hover:bg-purple-50 p-2 -mx-2 rounded"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h4 className="font-medium text-gray-800 hover:text-purple-700">{topic.title}</h4>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>By {topic.author}</span>
                        <span className="text-purple-600">{topic.replies} replies</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Column: Rankings */}
            <div className="grid grid-cols-1 gap-6">
              {/* Top Posters */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Top Posters (Last 6 Months)
                </h3>
                <div className="space-y-2">
                  {topPosters.map(user => (
                    <div key={user.rank} className="flex justify-between items-center text-sm py-1.5 border-b border-gray-100 last:border-0">
                      <div className="flex items-center">
                        <span className="bg-gray-100 text-gray-700 h-6 w-6 rounded-full flex items-center justify-center font-medium mr-3">{user.rank}</span>
                        <Link 
                          href={`https://bbs.lust66.com/u/${user.username}`}
                          className="font-medium text-gray-800 hover:text-purple-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {user.username}
                        </Link>
                      </div>
                      <span className="text-purple-600 font-medium">{user.posts} posts</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Top Point Earners */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Top Point Earners
                </h3>
                <div className="space-y-2">
                  {topPointEarners.map(user => (
                    <div key={user.rank} className="flex justify-between items-center text-sm py-1.5 border-b border-gray-100 last:border-0">
                      <div className="flex items-center">
                        <span className={`h-6 w-6 rounded-full flex items-center justify-center font-medium mr-3 ${
                          user.rank === 1 ? 'bg-yellow-100 text-yellow-700' : 
                          user.rank === 2 ? 'bg-gray-200 text-gray-700' : 
                          user.rank === 3 ? 'bg-amber-100 text-amber-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.rank}
                        </span>
                        <Link 
                          href={`https://bbs.lust66.com/u/${user.username}`}
                          className="font-medium text-gray-800 hover:text-purple-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {user.username}
                        </Link>
                      </div>
                      <span className="text-purple-600 font-medium">{user.points.toLocaleString()} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
