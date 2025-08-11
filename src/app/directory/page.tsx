"use client";

import React, { useState } from 'react';
import EmployeeCard from '@/components/EmployeeCard';
import EmployeeCardSkeleton from '@/components/EmployeeCardSkeleton';
import EmployeeModal from '@/components/EmployeeModal';
import { useEmployees } from '@/hooks/useEmployees';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

const DirectoryPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    employees, 
    count, 
    isLoading, 
    error, 
    mutate, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee 
  } = useEmployees();

  const departments = ['all', ...Array.from(new Set(employees.map(emp => emp.department)))];

  const filteredEmployees = employees.filter(employee => {
    const name = employee.name || '';
    const role = employee.role || '';
    const department = employee.department || '';
  
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          department.toLowerCase().includes(searchTerm.toLowerCase());
  
    const matchesDepartment = selectedDepartment === 'all' || department === selectedDepartment;
  
    return matchesSearch && matchesDepartment;
  });
  

  const handleCreateEmployee = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await deleteEmployee(employeeId);
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee. Please try again.');
    }
  };

  const handleSubmitEmployee = async (employeeData: Omit<Employee, '_id'>) => {
    setIsSubmitting(true);
    try {
      if (selectedEmployee) {
        await updateEmployee(selectedEmployee._id, employeeData);
      } else {
        await createEmployee(employeeData);
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Failed to save employee. Please try again.');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

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
            <h1 className="text-3xl font-bold text-gray-100 mb-2">Employee Directory</h1>
            <p className="text-gray-300">Find and connect with your team members</p>
          </div>
          <button
            onClick={handleCreateEmployee}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Employee
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
        <div className="flex-1 max-w-md">
          <label htmlFor="search" className="sr-only">
            Search employees
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by name, role, or department..."
            />
          </div>
        </div>

        <div className="sm:w-48">
          <label htmlFor="department" className="sr-only">
            Filter by department
          </label>
          <select
            id="department"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-3xl font-bold text-gray-100 mb-2">
          Showing {filteredEmployees.length} of {count} employees
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <EmployeeCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load employees</h3>
          <p className="mt-1 text-sm text-gray-500">
            {error.message || 'Something went wrong while fetching employee data.'}
          </p>
          <button
            onClick={() => mutate()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Employee Grid */}
      {!isLoading && !error && filteredEmployees.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.map((employee) => (
            <EmployeeCard 
            key={employee._id || `${employee.name}-${employee.email}-${Math.random()}`}

              employee={employee}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
              showActions={true}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && filteredEmployees.length === 0 && (
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        employee={selectedEmployee}
        onSubmit={handleSubmitEmployee}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default DirectoryPage; 