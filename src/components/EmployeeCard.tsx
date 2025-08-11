import React, { useState, useEffect, useRef } from 'react';

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  photo: string;
  birthday: string;
  hireDate: string;
}

interface EmployeeCardProps {
  employee: Employee;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employeeId: string) => void;
  showActions?: boolean;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ 
  employee, 
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
    onEdit?.(employee);
  };

  const handleDelete = () => {
    setShowDropdown(false);
    if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      onDelete?.(employee._id);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const shouldShowImage = employee.photo && employee.photo.trim() !== '' && !imageError;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 relative">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {shouldShowImage ? (
            <img
              src={employee.photo}
              alt={`${employee.name}'s photo`}
              className="w-16 h-16 rounded-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xl font-semibold">
              {(employee.name || '?').charAt(0).toUpperCase()}

              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {employee.name}
          </h3>
          <p className="text-sm text-gray-700 truncate font-medium">{employee.role}</p>
          <p className="text-sm text-gray-600 truncate">{employee.department}</p>
          <p className="text-xs text-gray-500 truncate">{employee.email}</p>
        </div>
        
        {showActions && (
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
      
      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="text-gray-600">
            <span className="font-medium text-gray-700">Birthday:</span>
            <p className="text-gray-600">{new Date(employee.birthday).toLocaleDateString()}</p>
          </div>
          <div className="text-gray-600">
            <span className="font-medium text-gray-700">Hired:</span>
            <p className="text-gray-600">{new Date(employee.hireDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard; 