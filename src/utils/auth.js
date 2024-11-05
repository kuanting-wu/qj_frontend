import { jwtDecode } from 'jwt-decode'; // Use named import and correct casing

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
    axios.post('http://localhost:3000/api/refresh-token', { refreshToken })
      .then(response => {
        const { accessToken } = response.data;
        resolve(accessToken); // Resolve with the new access token
      })
      .catch(error => {
        console.error('Error refreshing access token:', error);
        reject(error); // Reject on error
      });
  });
}