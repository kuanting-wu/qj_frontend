import axios from 'axios';
import { BACKEND_URL } from './config';
import { isTokenValid, refreshAccessToken } from './auth';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: BACKEND_URL,
});

// Request interceptor to add Authorization header with JWT token
apiClient.interceptors.request.use(
  async (config) => {
    // Get the token from localStorage
    let token = localStorage.getItem('accessToken');

    // Check if token exists and is valid
    if (token && !isTokenValid()) {
      // Token exists but is expired, try to refresh it
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          // Try to get a new access token
          const newAccessToken = await refreshAccessToken(refreshToken);
          localStorage.setItem('accessToken', newAccessToken);
          token = newAccessToken;
        } catch (error) {
          console.error('Failed to refresh token in interceptor:', error);
          // Clear tokens if refresh fails
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    }

    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized responses (401)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired token (401) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          console.log('Attempting to refresh token...');
          
          // Try to refresh token
          const newAccessToken = await refreshAccessToken(refreshToken);
          console.log('Token refresh successful');
          
          // Update localStorage
          localStorage.setItem('accessToken', newAccessToken);
          
          // Update the authorization header
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          // Retry the original request with new token
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('Failed to refresh token from response interceptor:', refreshError);
          
          // If the refresh token itself is invalid or expired
          if (refreshError.response?.status === 401) {
            console.log('Refresh token is invalid or expired, redirecting to login');
            // Clear invalid tokens
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            
            // Redirect to login page if appropriate
            if (window.location.pathname !== '/signin' && window.location.pathname !== '/signup') {
              alert('Your session has expired. Please sign in again.');
              window.location.href = '/signin?session=expired';
              return Promise.reject(refreshError);
            }
          }
          
          // For other errors, just clear the tokens
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;