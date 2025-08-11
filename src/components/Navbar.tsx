'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useKeycloak } from '@/context/KeycloakContext';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const keycloakContext = useKeycloak();

if (!keycloakContext) {
  // handle no context (return null, fallback UI, or default)
  return null; // or whatever you want
}

const { keycloak } = keycloakContext;


  const navItems = [
    { href: '/directory', label: 'Directory', icon: '👥' },
    { href: '/celebrations', label: 'Celebrations', icon: '🎉' },
    { href: '/announcements', label: 'Announcements', icon: '📢' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">TeamHub</span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            {keycloak && keycloak.authenticated ? (
              <>
                <span className="mr-4 text-sm text-gray-700">
                  {keycloak.tokenParsed?.preferred_username || keycloak.tokenParsed?.email}
                </span>
                <button
                  onClick={() => keycloak.logout()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 