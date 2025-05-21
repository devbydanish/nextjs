'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { getCategories } from '@/lib/api/categories';
import { getCities } from '@/lib/api/cities';
import { Category, City } from '@/types';

export default function MainNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, citiesResponse] = await Promise.all([
          getCategories(),
          getCities()
        ]);
        
        setCategories(categoriesResponse.data);
        setCities(citiesResponse.data);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };
  
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Listings', href: '/listings' },
  ];
  
  const authItems = isAuthenticated
    ? [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'My Listings', href: '/dashboard' },
        { name: 'Create Listing', href: '/dashboard/create' },
        { name: 'Logout', onClick: handleLogout }
      ]
    : [
        { name: 'Login', href: '/auth/login' },
        { name: 'Register', href: '/auth/register' }
      ];
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-purple-600">
                Lust66
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href || (item.href === '/listings' && pathname.startsWith('/listings'))
                      ? 'border-purple-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                    pathname.includes('/category')
                      ? 'border-purple-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } text-sm font-medium focus:outline-none`}
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  onBlur={(e) => {
                    // Only close if focus doesn't move to another element within the dropdown
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setTimeout(() => setCategoryDropdownOpen(false), 100);
                    }
                  }}
                >
                  Categories
                  <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {categoryDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1 max-h-60 overflow-auto" role="menu" aria-orientation="vertical">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/listings?category=${category.slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => setCategoryDropdownOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Cities Dropdown */}
              <div className="relative">
                <button
                  className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                    pathname.includes('/city')
                      ? 'border-purple-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } text-sm font-medium focus:outline-none`}
                  onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                  onBlur={(e) => {
                    // Only close if focus doesn't move to another element within the dropdown
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setTimeout(() => setCityDropdownOpen(false), 100);
                    }
                  }}
                >
                  Cities
                  <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {cityDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1 max-h-60 overflow-auto" role="menu" aria-orientation="vertical">
                      {cities.map((city) => (
                        <Link
                          key={city.id}
                          href={`/listings?city=${city.slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => setCityDropdownOpen(false)}
                        >
                          {city.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex space-x-4">
              {authItems.map((item) => (
                item.onClick ? (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    className="bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-500"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium ${
                      pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                        ? 'text-purple-600'
                        : 'text-gray-700 hover:text-purple-500'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              
              {isAuthenticated && (
                <Link 
                  href="/dashboard/create"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  + Create Ad
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  pathname === item.href || (item.href === '/listings' && pathname.startsWith('/listings'))
                    ? 'bg-purple-50 border-purple-500 text-purple-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Categories */}
            <div>
              <button
                className="flex justify-between w-full pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 text-base font-medium"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              >
                <span>Categories</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {categoryDropdownOpen && (
                <div className="pl-6 pr-4 py-2 space-y-1">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/listings?category=${category.slug}`}
                      className="block py-2 text-sm text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        setCategoryDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {/* Mobile Cities */}
            <div>
              <button
                className="flex justify-between w-full pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 text-base font-medium"
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              >
                <span>Cities</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {cityDropdownOpen && (
                <div className="pl-6 pr-4 py-2 space-y-1">
                  {cities.map((city) => (
                    <Link
                      key={city.id}
                      href={`/listings?city=${city.slug}`}
                      className="block py-2 text-sm text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        setCityDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated && (
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 font-medium">{user?.username?.charAt(0) || 'U'}</span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.username}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
            )}
            <div className="mt-3 space-y-1">
              {authItems.map((item) => (
                item.onClick ? (
                  <button
                    key={item.name}
                    onClick={() => {
                      item.onClick();
                      setMobileMenuOpen(false);
                    }}
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full text-left"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-2 text-base font-medium ${
                      pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                        ? 'text-purple-600 bg-gray-50'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              
              {isAuthenticated && (
                <Link
                  href="/dashboard/create"
                  className="block w-full text-left px-4 py-2 text-base font-medium text-white bg-purple-600 hover:bg-purple-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  + Create Ad
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 