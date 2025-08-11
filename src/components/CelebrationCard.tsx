import React, { useState, useEffect, useRef } from 'react';

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

interface CelebrationCardProps {
  celebration: Celebration;
  onEdit?: (celebration: Celebration) => void;
  onDelete?: (celebrationId: string) => void;
  showActions?: boolean;
}

const CelebrationCard: React.FC<CelebrationCardProps> = ({ 
  celebration, 
  onEdit, 
  onDelete, 
  showActions = false 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    setShowDropdown(false);
    onEdit?.(celebration);
  };

  const handleDelete = () => {
    setShowDropdown(false);
    if (window.confirm(`Are you sure you want to delete ${celebration.name}'s celebration?`)) {
      onDelete?.(celebration.id);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const celebrationDate = new Date(dateString);
    const currentYear = today.getFullYear();
    
    // Set the celebration date to current year
    celebrationDate.setFullYear(currentYear);
    
    // If the date has passed this year, set to next year
    if (celebrationDate < today) {
      celebrationDate.setFullYear(currentYear + 1);
    }
    
    const diffTime = celebrationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysUntil = getDaysUntil(celebration.date);
  const isToday = daysUntil === 0;
  const shouldShowImage = celebration.photo && celebration.photo.trim() !== '' && !imageError;
  
  // Show actions for custom celebrations or if event is 'Custom Celebration'
  const canEdit = (celebration.isCustom || celebration.event === 'Custom Celebration') && showActions;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 relative">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {shouldShowImage ? (
            <img
              src={celebration.photo}
              alt={`${celebration.name}'s photo`}
              className="w-16 h-16 rounded-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xl font-semibold">
                {celebration.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              celebration.event === 'Birthday' 
                ? 'bg-pink-100 text-pink-800' 
                : celebration.event === 'Work Anniversary'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {celebration.event === 'Birthday' ? '🎂' : 
               celebration.event === 'Work Anniversary' ? '🎉' : '🎊'} {celebration.event}
            </span>
            {isToday && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Today!
              </span>
            )}
            {celebration.isCustom && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Custom
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {celebration.name}
          </h3>
          
          <p className="text-sm text-gray-600">
            {formatDate(celebration.date)}
          </p>
          
          {celebration.description && (
            <p className="text-sm text-gray-500 mt-1">
              {celebration.description}
            </p>
          )}
          
          {!isToday && (
            <p className="text-sm text-gray-500">
              {daysUntil} day{daysUntil !== 1 ? 's' : ''} away
            </p>
          )}
        </div>
        
        {canEdit && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={handleEdit}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CelebrationCard; 