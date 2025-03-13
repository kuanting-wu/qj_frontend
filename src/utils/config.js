// Choose the right backend URL based on environment
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname === 'dev.quantifyjiujitsu.com';

// For development environment (including local development), use the dev API
// For production, use the production API
export const BACKEND_URL = isDevelopment
  ? 'https://api-dev.quantifyjiujitsu.com' // Development environment (including local)
  : 'https://api.quantifyjiujitsu.com';    // Production environment

// Alternative URLs for debugging:
// Local backend
// export const BACKEND_URL = 'http://localhost:3000';