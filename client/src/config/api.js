import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens (future enhancement)
api.interceptors.request.use(
  (config) => {
    // Add auth token here when authentication is implemented
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Global error handling
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    // Log error for debugging
    console.error('API Error:', {
      message,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
    });
    
    return Promise.reject({
      message,
      status: error.response?.status,
      originalError: error,
    });
  }
);

export default api; 