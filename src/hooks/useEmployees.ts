import useSWR from 'swr';
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
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

interface EmployeesResponse {
  success: boolean;
  data: Employee[];
  count: number;
}

interface EmployeeResponse {
  success: boolean;
  data: Employee;
}

const API_BASE_URL = `${backendURL}/api/employees`;

const fetcher = async (url: string): Promise<EmployeesResponse> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API Response:', data); // Debug log
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error('Failed to fetch employees');
  }
};

export const useEmployees = () => {
  const { data, error, isLoading, mutate } = useSWR<EmployeesResponse>(
    API_BASE_URL,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  const createEmployee = async (employeeData: Omit<Employee, '_id'>): Promise<Employee> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create employee');
      }

      const result: EmployeeResponse = await response.json();
      await mutate(); // Refresh the employee list
      return result.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  };

  const updateEmployee = async (id: string, employeeData: Omit<Employee, '_id'>): Promise<Employee> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update employee');
      }

      const result: EmployeeResponse = await response.json();
      await mutate(); // Refresh the employee list
      return result.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  };

  const deleteEmployee = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete employee');
      }

      await mutate(); // Refresh the employee list
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  };

  return {
    employees: data?.data || [],
    count: data?.count || 0,
    isLoading,
    error,
    mutate,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
}; 