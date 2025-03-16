<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
    <div class="max-w-md w-full px-6 py-8 bg-white dark:bg-gray-800 shadow-md rounded-lg transition-colors duration-200">
      <div v-if="loading" class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-200">
          Connecting to YouTube...
        </h2>
        <p class="text-gray-600 dark:text-gray-400 transition-colors duration-200">
          Please wait while we connect your YouTube account.
        </p>
      </div>
      
      <div v-else-if="error" class="text-center">
        <div class="bg-red-100 dark:bg-red-900/30 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-200">
          Connection Failed
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-200">
          {{ errorMessage }}
        </p>
        <button @click="returnToApp" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-150">
          Return to App
        </button>
      </div>
      
      <div v-else class="text-center">
        <div class="bg-green-100 dark:bg-green-900/30 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
          <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-200">
          Connected Successfully
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-200">
          Your YouTube account has been connected successfully.
        </p>
        <button @click="returnToApp" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-500 text-white rounded-lg transition duration-150">
          Return to App
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { BACKEND_URL } from '../utils/config';

export default {
  setup() {
    const loading = ref(true);
    const error = ref(false);
    const errorMessage = ref('');
    
    // Function to return to main app
    const returnToApp = () => {
      window.location.href = '/newpost';
    };
    
    // Handle the OAuth callback
    onMounted(async () => {
      try {
        // Get the authorization code from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          throw new Error('No authorization code found in the URL');
        }
        
        // Exchange the code for tokens - no auth needed for this public endpoint
        const response = await axios.get(
          `${BACKEND_URL}/auth/youtube/callback?code=${code}`
        );
        
        // Log the full response for debugging
        console.log('Full YouTube response data:', JSON.stringify(response.data));
        
        // Extract token from response data
        let accessToken = null;
        let expiresIn = null;
        
        // Handle different response formats
        if (response.data.accessToken) {
          accessToken = response.data.accessToken;
          expiresIn = response.data.expiresIn;
        } 
        else if (response.data.access_token) {
          accessToken = response.data.access_token;
          expiresIn = response.data.expires_in;
        }
        else if (typeof response.data === 'string') {
          try {
            const parsedData = JSON.parse(response.data);
            if (parsedData.accessToken) {
              accessToken = parsedData.accessToken;
              expiresIn = parsedData.expiresIn;
            } else if (parsedData.access_token) {
              accessToken = parsedData.access_token;
              expiresIn = parsedData.expires_in;
            }
          } catch (e) {
            console.error('Failed to parse response data as JSON:', e);
          }
        }
        
        // Store in localStorage (this time it will be in the main app's localStorage)
        if (accessToken) {
          localStorage.setItem('youtubeAuthenticated', 'true');
          localStorage.setItem('youtubeAccessToken', accessToken);
          
          if (expiresIn) {
            const expirationTime = Date.now() + (expiresIn * 1000);
            localStorage.setItem('youtubeTokenExpires', expirationTime.toString());
          }
          
          // Success state
          loading.value = false;
          
          // Store the full response as a backup
          localStorage.setItem('youtubeAuthResponse', JSON.stringify(response.data));
          
          // Always redirect to the new post page
          // Set a flag in session storage to indicate we're returning from auth
          window.sessionStorage.setItem('returningFromYouTubeAuth', 'true');
          
          // Clean up
          localStorage.removeItem('returnToNewPostAfterAuth');
          
          // Log the redirect attempt
          console.log('Redirecting to /newpost immediately');
          
          // Force immediate redirect - don't wait
          window.location.replace('/newpost');
        } else {
          throw new Error('No access token found in response');
        }
      } catch (err) {
        // Show error UI
        loading.value = false;
        error.value = true;
        errorMessage.value = err.response?.data?.error || err.message || 'Failed to connect YouTube account';
      }
    });
    
    return {
      loading,
      error,
      errorMessage,
      returnToApp
    };
  }
};
</script>