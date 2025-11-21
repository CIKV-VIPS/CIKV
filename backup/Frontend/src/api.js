const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = {
  async fetch(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    
    // Automatically set Content-Type for POST/PUT requests if not set
    if ((options.method === 'POST' || options.method === 'PUT') && !options.headers?.['Content-Type']) {
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
      };
    }

    // Add authorization header if a token exists
    const token = localStorage.getItem('access_token');
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // For 204 No Content, return a success indicator
    if (response.status === 204) {
      return { success: true };
    }
    
    return response.json();
  }
};

export default api;
