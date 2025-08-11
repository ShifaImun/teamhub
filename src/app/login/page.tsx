"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";  // Import useRouter
import { useKeycloak } from "@/context/KeycloakContext";

const LoginPage: React.FC = () => {
  const keycloakContext = useKeycloak();

if (!keycloakContext) {
  return null; // or a loading state, until context is ready
}

const { keycloak, initialized } = keycloakContext;

  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Ensure this runs only on client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect to Home if already authenticated
  useEffect(() => {
    if (initialized && keycloak?.authenticated) {
      router.push("/");
    }
  }, [initialized, keycloak?.authenticated, router]);

  if (!isClient) {
    // Prevent SSR mismatches
    return null;
  }

  const handleKeycloakLogin = () => {
    if (keycloak) {
      keycloak.login();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in / Sign up using Keycloak
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your employee portal
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <button
              onClick={handleKeycloakLogin}
              disabled={!initialized}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Sign in / Sign up with Keycloak
              </div>
            </button>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <Link href="#" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </p>
          </div>
          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-blue-600 hover:text-blue-900 transition-colors duration-200"
            >
              🏠 Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
