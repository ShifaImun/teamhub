"use client";

import React, { useState } from 'react';
import CelebrationCard from '@/components/CelebrationCard';
import CelebrationModal from '@/components/CelebrationModal';
import { useCelebrations } from '@/hooks/useCelebrations';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Celebration {
  id: string;
  name: string;
  event: 'Birthday' | 'Work Anniversary' | 'Custom Celebration';
  date: string;
  photo: string;
  description?: string;
  isEmployeeBased?: boolean;
  isCustom?: boolean;
}

const CelebrationsPage: React.FC = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'all' | 'Birthday' | 'Work Anniversary' | 'Custom Celebration'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCelebration, setSelectedCelebration] = useState<Celebration | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    celebrations, 
    count, 
    isLoading, 
    error, 
    mutate, 
    createCelebration, 
    updateCelebration, 
    deleteCelebration 
  } = useCelebrations();

  const filteredCelebrations = celebrations.filter(celebration => {
    if (selectedType === 'all') return true;
    return celebration.event === selectedType;
  });

  const handleCreateCelebration = () => {
    setSelectedCelebration(null);
    setIsModalOpen(true);
  };

  const handleEditCelebration = (celebration: Celebration) => {
    setSelectedCelebration(celebration);
    setIsModalOpen(true);
  };

  const handleDeleteCelebration = async (celebrationId: string) => {
    try {
      await deleteCelebration(celebrationId);
    } catch (error) {
      console.error('Error deleting celebration:', error);
      alert('Failed to delete celebration. Please try again.');
    }
  };

  const handleSubmitCelebration = async (celebrationData: Omit<Celebration, 'id'>) => {
    setIsSubmitting(true);
    try {
      if (selectedCelebration) {
        await updateCelebration(selectedCelebration.id, {
          name: celebrationData.name,
          event: celebrationData.event,
          date: celebrationData.date,
          photo: celebrationData.photo,
          description: celebrationData.description,
          employeeId: celebrationData.employeeId,
          isRecurring: celebrationData.isRecurring,
        });
      } else {
        await createCelebration(celebrationData);
      }
      handleCloseModal();
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to save celebration. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCelebration(null);
  };

  const upcomingCelebrations = filteredCelebrations
    .sort((a, b) => {
      const today = new Date();
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      // Set dates to current year for comparison
      dateA.setFullYear(today.getFullYear());
      dateB.setFullYear(today.getFullYear());
      
      // If date has passed this year, set to next year
      if (dateA < today) dateA.setFullYear(today.getFullYear() + 1);
      if (dateB < today) dateB.setFullYear(today.getFullYear() + 1);
      
      return dateA.getTime() - dateB.getTime();
    });

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const celebrationDate = new Date(dateString);
    const currentYear = today.getFullYear();
    
    celebrationDate.setFullYear(currentYear);
    if (celebrationDate < today) {
      celebrationDate.setFullYear(currentYear + 1);
    }
    
    const diffTime = celebrationDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const todayCelebrations = upcomingCelebrations.filter(celebration => 
    getDaysUntil(celebration.date) === 0
  );

  const thisWeekCelebrations = upcomingCelebrations.filter(celebration => {
    const daysUntil = getDaysUntil(celebration.date);
    return daysUntil > 0 && daysUntil <= 7;
  });

  const thisMonthCelebrations = upcomingCelebrations.filter(celebration => {
    const daysUntil = getDaysUntil(celebration.date);
    return daysUntil > 7 && daysUntil <= 30;
  });

  const allOtherCelebrations = upcomingCelebrations.filter(celebration => {
    const daysUntil = getDaysUntil(celebration.date);
    return daysUntil > 30;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load celebrations</h3>
          <p className="mt-1 text-sm text-gray-500">
            {error.message || 'Something went wrong while fetching celebration data.'}
          </p>
          <button
            onClick={() => mutate()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4 flex gap-4 items-center">
        <button onClick={() => router.back()} className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
          ← Back
        </button>
        <Link href="/" className="text-sm text-blue-600 hover:text-blue-900 transition-colors duration-200">
          🏠 Home
        </Link>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center justify-between">
        <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Celebrations and Events</h1>
        <p className="text-gray-300">Never miss a Birthday, Work Anniversary or Special Event</p>
      </div>
          <button
            onClick={handleCreateCelebration}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Celebration
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-8">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              selectedType === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            All Celebrations
          </button>
          <button
            onClick={() => setSelectedType('Birthday')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              selectedType === 'Birthday'
                ? 'bg-pink-100 text-pink-700'
                : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            🎂 Birthdays
          </button>
          <button
            onClick={() => setSelectedType('Work Anniversary')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              selectedType === 'Work Anniversary'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            🎉 Anniversaries
          </button>
          <button
            onClick={() => setSelectedType('Custom Celebration')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              selectedType === 'Custom Celebration'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            🎊 Custom
          </button>
        </div>
      </div>

      {/* Today's Celebrations */}
      {todayCelebrations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
              Today!
            </span>
            Today's Celebrations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {todayCelebrations.map((celebration) => (
              <CelebrationCard 
                key={celebration.id} 
                celebration={celebration}
                onEdit={handleEditCelebration}
                onDelete={handleDeleteCelebration}
                showActions={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* This Week's Celebrations */}
      {thisWeekCelebrations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-100 mb-2">This Week</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {thisWeekCelebrations.map((celebration) => (
              <CelebrationCard 
                key={celebration.id} 
                celebration={celebration}
                onEdit={handleEditCelebration}
                onDelete={handleDeleteCelebration}
                showActions={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* This Month's Celebrations */}
      {thisMonthCelebrations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-100 mb-2">This Month</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {thisMonthCelebrations.map((celebration) => (
              <CelebrationCard 
                key={celebration.id} 
                celebration={celebration}
                onEdit={handleEditCelebration}
                onDelete={handleDeleteCelebration}
                showActions={true}
              />
            ))}
          </div>
        </div>
      )}

      {allOtherCelebrations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-100 mb-2">All Upcoming Celebrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allOtherCelebrations.map((celebration) => (
              <CelebrationCard 
                key={celebration.id} 
                celebration={celebration}
                onEdit={handleEditCelebration}
                onDelete={handleDeleteCelebration}
                showActions={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Celebrations */}
      {upcomingCelebrations.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming celebrations</h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedType === 'all' 
              ? 'No birthdays or anniversaries coming up soon.'
              : `No ${selectedType}s coming up soon.`
            }
          </p>
        </div>
      )}

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        celebration={selectedCelebration}
        onSubmit={handleSubmitCelebration}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default CelebrationsPage; 