<template>
  <div class="flex overflow-hidden flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
    <header
      class="flex overflow-hidden flex-wrap gap-4 items-center px-6 py-2.5 w-full bg-white dark:bg-gray-900 border-b border-zinc-300 dark:border-zinc-700 min-h-[60px] max-md:px-5 max-md:max-w-full transition-colors duration-200"
    >
      <!-- Sidebar toggle button for database page -->
      <button
        v-if="$route.path === '/database'" 
        @click="toggleSidebar"
        class="p-1.5 mr-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200 focus:outline-none"
        aria-label="Toggle Sidebar"
      >
        <svg 
          class="w-5 h-5" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <router-link
        to="/"
        aria-label="Go to welcome page"
        class="flex justify-center items-center self-stretch my-auto w-10"
      >
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/24824442aa5a6ce30384715ebcc5bd08c428c7b22bfa0c7dab7215ec74c99bf1?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1"
          class="object-contain self-stretch my-auto w-10 aspect-square"
          alt="Logo"
        />
      </router-link>

      <nav
        class="flex justify-end flex-wrap flex-1 shrink gap-2 items-center self-stretch my-auto leading-none whitespace-nowrap basis-0 font-medium min-w-[240px] text-gray-800 dark:text-gray-200 max-md:max-w-full transition-colors duration-200"
      >
        <router-link
          to="/docs"
          class="gap-2 self-stretch p-2 my-auto rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          Documents
        </router-link>
        <router-link
          to="/gameplan"
          class="gap-2 self-stretch p-2 my-auto rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          Game Plan
        </router-link>
        <router-link
          to="/database"
          class="gap-2 self-stretch p-2 my-auto rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          Database
        </router-link>
        <router-link to="/newpost" aria-label="Create a new page" class="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-800 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </router-link>
      </nav>

      <!-- Profile Button -->
      <div class="relative">
        <!-- Avatar Button -->
        <div 
          @click="toggleDropdown"
          class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer overflow-hidden"
        >
          <img
            v-if="userAvatar"
            :src="userAvatar"
            class="object-cover w-full h-full"
            alt="User profile"
          />
          <span v-else class="text-lg font-medium text-gray-700 dark:text-gray-300">
            {{ userInitial }}
          </span>
        </div>
      </div>
    </header>

    <!-- Dropdown Menu Outside Header -->
    <div
      v-if="showDropdown"
      class="absolute right-0 top-[60px] w-56 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-zinc-300 dark:border-zinc-700 z-50 transition-colors duration-200"
    >
      <!-- User profile section when logged in -->
      <template v-if="isLoggedIn">
        <router-link
          v-if="username"
          :to="profileLink"
          class="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <div class="flex items-center">
            <span>Profile</span>
          </div>
        </router-link>
        <div 
          v-else
          class="block px-4 py-2 text-gray-400 dark:text-gray-500 cursor-not-allowed"
        >
          <div class="flex items-center">
            <span>Profile (Login required)</span>
          </div>
        </div>
        
        <hr class="my-1 border-gray-200 dark:border-gray-700" />
        
        <!-- Language dropdown -->
        <div class="relative">
          <button 
            @click="toggleLanguageDropdown"
            class="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between transition-colors duration-200"
          >
            <span>Language: {{ getCurrentLanguageName() }}</span>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-block text-gray-700 dark:text-gray-200" :class="{'transform rotate-180': showLanguageMenu}">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </span>
          </button>
          
          <!-- Expandable language list -->
          <div v-if="showLanguageMenu" class="pl-4 bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
            <button
              v-for="lang in languages"
              :key="lang.code"
              @click="changeLanguage(lang.code)"
              class="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center transition-colors duration-200"
            >
              <span>{{ lang.name }}</span>
              <span v-if="currentLanguage === lang.code" class="ml-auto">✓</span>
            </button>
          </div>
        </div>
        
        <!-- Dark Mode Toggle -->
        <hr class="my-1 border-gray-200 dark:border-gray-700" />
        <button 
          @click="toggleDarkMode"
          class="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors duration-200"
        >
          <span class="mr-2">
            <svg v-if="darkMode" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </span>
          <span>{{ darkMode ? 'Light mode' : 'Dark mode' }}</span>
        </button>
        
        <hr class="my-1 border-gray-200 dark:border-gray-700" />
        
        <a
          href="#"
          @click.prevent="signout"
          class="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <div class="flex items-center">
            <span>Sign out</span>
          </div>
        </a>
      </template>
      
      <!-- Not logged in -->
      <template v-else>
        <router-link
          to="/signin"
          class="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <div class="flex items-center">
            <span>Sign in</span>
          </div>
        </router-link>
        
        <hr class="my-1 border-gray-200 dark:border-gray-700" />
        
        <!-- Language dropdown -->
        <div class="relative">
          <button 
            @click="toggleLanguageDropdown"
            class="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between transition-colors duration-200"
          >
            <span>Language: {{ getCurrentLanguageName() }}</span>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-block text-gray-700 dark:text-gray-200" :class="{'transform rotate-180': showLanguageMenu}">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </span>
          </button>
          
          <!-- Expandable language list -->
          <div v-if="showLanguageMenu" class="pl-4 bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
            <button
              v-for="lang in languages"
              :key="lang.code"
              @click="changeLanguage(lang.code)"
              class="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center transition-colors duration-200"
            >
              <span>{{ lang.name }}</span>
              <span v-if="currentLanguage === lang.code" class="ml-auto">✓</span>
            </button>
          </div>
        </div>

        <!-- Dark Mode Toggle Item -->
        <hr class="my-1 border-gray-200 dark:border-gray-700" />
        <button 
          @click="toggleDarkMode"
          class="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors duration-200"
        >
          <span class="mr-2">
            <svg v-if="darkMode" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </span>
          <span>{{ darkMode ? 'Light mode' : 'Dark mode' }}</span>
        </button>
      </template>
    </div>

    <div class="relative z-0 flex-grow flex flex-col">
      <router-view />
    </div>

    <footer
      class="flex overflow-hidden flex-wrap gap-4 items-start px-8 py-6 w-full bg-white dark:bg-gray-900 border-t border-zinc-300 dark:border-zinc-700 max-md:px-5 max-md:py-4 max-md:max-w-full transition-colors duration-200"
    >
      <div class="flex flex-col items-start min-w-[240px] w-[262px]">
        <router-link to="/" class="flex justify-center items-center w-[50px]">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/21491438aefeab829f0ffd6daf88fc794baafb8415db65c779c4539e1a152205?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1"
            class="object-contain self-stretch my-auto aspect-[1.02] w-[50px]"
            alt="Footer logo"
          />
        </router-link>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed, watch, provide } from "vue";
import { useRouter } from "vue-router";
import { getUserFromToken, isUserLoggedIn } from "./utils/auth";

export default {
  setup() {
    const router = useRouter();
    const showDropdown = ref(false);
    const username = ref("");
    const isLoggedIn = ref(false);
    const currentLanguage = ref("en");
    const userAvatar = ref(null);
    const darkMode = ref(false);
    const sidebarExpanded = ref(true);
    
    // Toggle sidebar function that will be accessible by Database component
    const toggleSidebar = () => {
      sidebarExpanded.value = !sidebarExpanded.value;
      // Provide this state to child components
      window.dispatchEvent(new CustomEvent('toggle-sidebar', { 
        detail: { expanded: sidebarExpanded.value }
      }));
    };
    
    // Provide sidebar state to child components
    provide('sidebarExpanded', sidebarExpanded);
    
    // Available languages for the UI
    const languages = [
      { code: "en", name: "English" },
      { code: "ja", name: "Japanese" },
      { code: "zh", name: "Chinese" }
    ];
    
    // State for language dropdown
    const showLanguageMenu = ref(false);
    
    // Computed to get user's initial for avatar placeholder
    const userInitial = computed(() => {
      if (username.value && username.value.length > 0) {
        return username.value.charAt(0).toUpperCase();
      }
      return "U"; // Default initial
    });
    
    // Toggle dark mode for the entire application
    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value;
      localStorage.setItem("darkMode", darkMode.value ? "dark" : "light");
      
      // Apply dark mode to HTML element to affect the entire app
      if (darkMode.value) {
        document.documentElement.classList.add('dark');
        // Set explicit background color for overscroll in dark mode
        document.documentElement.style.backgroundColor = '#111827'; // Tailwind gray-900
      } else {
        document.documentElement.classList.remove('dark');
        // Set explicit background color for overscroll in light mode
        document.documentElement.style.backgroundColor = '#ffffff'; // White
      }
      
      // Close dropdown after toggling
      showDropdown.value = false;
    };
    
    // Fetch user avatar
    const fetchUserAvatar = () => {
      try {
        // Get the JWT token from local storage
        const token = localStorage.getItem('accessToken');
        
        if (token) {
          // Decode the JWT token (it's base64-encoded)
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const decodedToken = JSON.parse(atob(base64));
          
          // Check if avatar_url exists in the token
          if (decodedToken.avatar_url) {
            userAvatar.value = decodedToken.avatar_url;
            return;
          }
        }
        
        // Fallback if no token or no avatar in token
        if (username.value) {
          userAvatar.value = `https://ui-avatars.com/api/?name=${encodeURIComponent(username.value)}&background=random`;
        } else {
          userAvatar.value = null;
        }
      } catch (error) {
        console.error("Failed to get avatar from token:", error);
        
        // Fallback to generated avatar
        if (username.value) {
          userAvatar.value = `https://ui-avatars.com/api/?name=${encodeURIComponent(username.value)}&background=random`;
        } else {
          userAvatar.value = null;
        }
      }
    };
    
    // Link to user profile
    const profileLink = computed(() => {
      return username.value ? `/viewprofile/${username.value}` : '/database';
    });
    
    // Check login status
    const checkLoginStatus = () => {
      isLoggedIn.value = isUserLoggedIn();
      username.value = getUserFromToken() || "";
      if (isLoggedIn.value && username.value) {
        fetchUserAvatar();
      } else {
        userAvatar.value = null;
      }
    };
    
    // Toggle dropdown menu
    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value;
    };

    // Sign out
    const signout = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      username.value = "";
      isLoggedIn.value = false;
      router.push("/");
      showDropdown.value = false;
    };
    
    // Toggle language dropdown
    const toggleLanguageDropdown = () => {
      showLanguageMenu.value = !showLanguageMenu.value;
    };
    
    // Get current language name
    const getCurrentLanguageName = () => {
      const lang = languages.find(l => l.code === currentLanguage.value);
      return lang ? lang.name : "English";
    };
    
    // Change UI language
    const changeLanguage = (langCode) => {
      currentLanguage.value = langCode;
      localStorage.setItem("appLanguage", langCode);
      showLanguageMenu.value = false;
      
      // Add translation logic here when implementing i18n
      // This is a placeholder for future implementation
    };

    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector(".absolute"); // Dropdown element
      const profileButton = document.querySelector(".relative img"); // Profile button
      
      // Close main dropdown when clicking outside
      if (
        showDropdown.value &&
        dropdown && !dropdown.contains(event.target) &&
        profileButton && !profileButton.contains(event.target)
      ) {
        showDropdown.value = false;
        // Also close language menu when main dropdown is closed
        showLanguageMenu.value = false;
      }
    };

    onMounted(() => {
      // Check login status on mount
      checkLoginStatus();
      
      // Fetch user avatar if logged in
      if (isLoggedIn.value && username.value) {
        fetchUserAvatar();
      }
      
      // Load saved language preference
      const savedLanguage = localStorage.getItem("appLanguage");
      if (savedLanguage) {
        currentLanguage.value = savedLanguage;
      }
      
      // Load saved dark mode preference (synchronize with what's already applied in main.js)
      const savedDarkMode = localStorage.getItem("darkMode");
      if (savedDarkMode) {
        darkMode.value = savedDarkMode === "dark";
      } else {
        // Check if user prefers dark mode
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkMode) {
          darkMode.value = true;
        } else {
          darkMode.value = false;
        }
      }
      
      // Add click outside listener
      document.addEventListener("click", handleClickOutside);
      
      // Set up event listener for auth changes
      window.addEventListener("storage", (e) => {
        if (e.key === "accessToken") {
          checkLoginStatus();
          fetchUserAvatar();
        }
      });
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("storage", checkLoginStatus);
    });

    return {
      showDropdown,
      username,
      isLoggedIn,
      profileLink,
      toggleDropdown,
      signout,
      languages,
      currentLanguage,
      changeLanguage,
      showLanguageMenu,
      toggleLanguageDropdown,
      getCurrentLanguageName,
      darkMode,
      toggleDarkMode,
      userAvatar,
      userInitial,
      sidebarExpanded,
      toggleSidebar
    };
  },
};
</script>

<style scoped>
builder-component {
  max-width: none !important;
}

/* Ensure the dropdown menu is always above the main content */
.absolute {
  position: absolute; /* Dropdown position */
  z-index: 50; /* Higher than router-view */
}
</style>
