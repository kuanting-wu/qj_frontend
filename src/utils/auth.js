import { jwtDecode } from 'jwt-decode'; // Use named import and correct casing
import axios from "axios";
import { BACKEND_URL } from "./config";

// Example function using jwtDecode
export function isTokenValid() {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp > currentTime;
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
}


export function refreshAccessToken(refreshToken) {
  return new Promise((resolve, reject) => {
    axios.post(`${BACKEND_URL}/refresh-token`, { refreshToken: refreshToken })
      .then(response => {
        const { accessToken } = response.data;
        resolve(accessToken); // Resolve with the new access token
      })
      .catch(error => {
        console.log('Error refreshing access token:', error);
        reject(error); // Reject on error
      });
  });
}

export const getUserFromToken = () => {
  const token = localStorage.getItem("accessToken");
  
  if (token) {
    try {
      const decodedToken = jwtDecode(token); // Decode token without verifying
      return decodedToken.username; // Return username from decoded token
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }
  return null;
};

export const isUserLoggedIn = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;
  
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check if token is valid and not expired
    if (decodedToken.exp && decodedToken.exp > currentTime) {
      return true;
    } else {
      // Token is expired, try to use refresh token
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          // Actually use the refreshAccessToken function
          const newAccessToken = await refreshAccessToken(refreshToken);
          localStorage.setItem("accessToken", newAccessToken);
          return true;
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          return false;
        }
      }
    }
  } catch (error) {
    console.error("Invalid token:", error);
  }
  
  return false;
};