import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold text-purple-400">Lust66</h2>
            <p className="mt-2 text-sm text-gray-300">
              Your trusted platform for classified listings and advertisements.
              Find what you need or advertise your services to the right audience.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Navigation</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-base text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-base text-gray-300 hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-base text-gray-300 hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-base text-gray-300 hover:text-white">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/privacy" className="text-base text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-base text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-base text-gray-400 text-center">
            &copy; {currentYear} Lust66. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 