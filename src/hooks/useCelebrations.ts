import useSWR from 'swr';
const backendURL = 'https://teamhub-keah.onrender.com';
fetch(`${backendURL}/api/employees`);

interface Celebration {
  id: string;
  name: string;
  event: 'Birthday' | 'Work Anniversary' | 'Custom Celebration';
  date: string;
  photo: string;
  description?: string;
  daysUntil?: number;
  isToday?: boolean;
  isEmployeeBased?: boolean;
  isCustom?: boolean;
  yearsOfService?: number;
}

interface CelebrationsResponse {
  success: boolean;
  data: Celebration[];
  count: number;
}

interface CelebrationResponse {
  success: boolean;
  data: Celebration;
}

const API_BASE_URL = '${backendURL}/api/celebrations';

const fetcher = async (url: string): Promise<CelebrationsResponse> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error('Failed to fetch celebrations');
  }
};

export const useCelebrations = () => {
  const { data, error, isLoading, mutate } = useSWR<CelebrationsResponse>(
    API_BASE_URL,
    fetcher,
  {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 5000,  // Auto refresh every 5 sec
    dedupingInterval: 0,    // Disable deduplication (always hit API)
    revalidateOnFocus: true, 
    errorRetryCount: 3,
    errorRetryInterval: 1000,
  }
);

  const createCelebration = async (celebrationData: {
    name: string;
    event: 'Birthday' | 'Work Anniversary' | 'Custom Celebration';
    date: string;
    photo?: string;
    description?: string;
    employeeId?: string;
    isRecurring?: boolean;
  }): Promise<Celebration> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(celebrationData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create celebration');
      }

      const result: CelebrationResponse = await response.json();
      await mutate(); // Refresh the celebrations list
      return result.data;
    } catch (error) {
      console.error('Error creating celebration:', error);
      throw error;
    }
  };

  const updateCelebration = async (id: string, celebrationData: {
    name?: string;
    event?: 'Birthday' | 'Work Anniversary' | 'Custom Celebration';
    date?: string;
    photo?: string;
    description?: string;
    employeeId?: string;
    isRecurring?: boolean;
    isActive?: boolean;
  }): Promise<Celebration> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(celebrationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update celebration');
      }

      const result: CelebrationResponse = await response.json();
      await mutate(); // Refresh the celebrations list
      return result.data;
    } catch (error) {
      console.error('Error updating celebration:', error);
      throw error;
    }
  };

  const deleteCelebration = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete celebration');
      }

      await mutate(); // Refresh the celebrations list
    } catch (error) {
      console.error('Error deleting celebration:', error);
      throw error;
    }
  };

  return {
    celebrations: data?.data || [],
    count: data?.count || 0,
    isLoading,
    error,
    mutate,
    createCelebration,
    updateCelebration,
    deleteCelebration,
  };
}; 