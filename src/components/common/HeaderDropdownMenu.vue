<template>
    <div v-if="showDropdown"
      class="absolute right-0 top-[60px] w-56 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-zinc-300 dark:border-zinc-700 z-50 transition-colors duration-200">
      <!-- User profile section when logged in -->
      <template v-if="isLoggedIn">
        <router-link v-if="username" :to="profileLink"
          class="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <div class="flex items-center">
            <span>Profile</span>
          </div>
        </router-link>
        <div v-else class="block px-4 py-2 text-gray-400 dark:text-gray-500 cursor-not-allowed">
          <div class="flex items-center">
            <span>Profile (Login required)</span>
          </div>
        </div>
  
        <hr class="my-1 border-gray-200 dark:border-gray-700" />
  
        <!-- Language dropdown -->
        <div class="relative">
          <button @click="toggleLanguageDropdown"
            class="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between transition-colors duration-200">
            <span>Language: {{ getCurrentLanguageName() }}</span>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" class="inline-block text-gray-700 dark:text-gray-200"
                :class="{ 'transform rotate-180': showLanguageMenu }">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </button>
  
          <!-- Expandable language list -->
          <div v-if="showLanguageMenu" class="pl-4 bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
            <button v-for="lang in languages" :key="lang.code" @click="changeLanguage(lang.code)"
              class="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center transition-colors duration-200">
              <span>{{ lang.name }}</span>
              <span v-if="currentLanguage === lang.code" class="ml-auto">✓</span>
            </button>
          </div>
        </div>
  
        <!-- Dark Mode Toggle -->
        <hr class="my-1 border-gray-200 dark:border-gray-700" />
        <button @click="$emit('toggle-dark-mode')"
          class="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors duration-200">
          <span class="mr-2">
            <svg v-if="darkMode" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </span>
          <span>{{ darkMode ? 'Light mode' : 'Dark mode' }}</span>
        </button>
  
        <hr class="my-1 border-gray-200 dark:border-gray-700" />
  
        <a href="#" @click.prevent="$emit('signout')"
          class="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <div class="flex items-center">
            <span>Sign out</span>
          </div>
        </a>
      </template>
  
      <!-- Not logged in -->
      <template v-else>
        <router-link to="/signin"
          class="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <div class="flex items-center">
            <span>Sign in</span>
          </div>
        </router-link>
  
        <hr class="my-1 border-gray-200 dark:border-gray-700" />
  
        <!-- Language dropdown -->
        <div class="relative">
          <button @click="toggleLanguageDropdown"
            class="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between transition-colors duration-200">
            <span>Language: {{ getCurrentLanguageName() }}</span>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" class="inline-block text-gray-700 dark:text-gray-200"
                :class="{ 'transform rotate-180': showLanguageMenu }">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </button>
  
          <!-- Expandable language list -->
          <div v-if="showLanguageMenu" class="pl-4 bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
            <button v-for="lang in languages" :key="lang.code" @click="changeLanguage(lang.code)"
              class="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center transition-colors duration-200">
              <span>{{ lang.name }}</span>
              <span v-if="currentLanguage === lang.code" class="ml-auto">✓</span>
            </button>
          </div>
        </div>
  
        <!-- Dark Mode Toggle Item -->
        <hr class="my-1 border-gray-200 dark:border-gray-700" />
        <button @click="$emit('toggle-dark-mode')"
          class="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors duration-200">
          <span class="mr-2">
            <svg v-if="darkMode" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </span>
          <span>{{ darkMode ? 'Light mode' : 'Dark mode' }}</span>
        </button>
      </template>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  export default {
    name: 'HeaderDropdownMenu',
    props: {
      showDropdown: Boolean,
      username: String,
      isLoggedIn: Boolean,
      profileLink: String,
      darkMode: Boolean
    },
    emits: ['toggle-dark-mode', 'signout'],
    setup() {
      const showLanguageMenu = ref(false);
      const currentLanguage = ref("en");
  
      const languages = [
        { code: "en", name: "English" },
        { code: "ja", name: "Japanese" },
        { code: "zh", name: "Chinese" }
      ];
  
      const toggleLanguageDropdown = () => {
        showLanguageMenu.value = !showLanguageMenu.value;
      };
  
      const getCurrentLanguageName = () => {
        const lang = languages.find(l => l.code === currentLanguage.value);
        return lang ? lang.name : "English";
      };
  
      const changeLanguage = (langCode) => {
        currentLanguage.value = langCode;
        localStorage.setItem("appLanguage", langCode);
        showLanguageMenu.value = false;
      };
  
      const handleClickOutside = (event) => {
        const dropdown = document.querySelector(".absolute");
        const profileButton = document.querySelector(".relative div"); // Adjusted selector for profile button
        if (
          dropdown && !dropdown.contains(event.target) &&
          profileButton && !profileButton.contains(event.target)
        ) {
          // Note: We can't set showDropdown.value here since it's a prop; parent should handle this
        }
      };
  
      onMounted(() => {
        const savedLanguage = localStorage.getItem("appLanguage");
        if (savedLanguage) currentLanguage.value = savedLanguage;
        document.addEventListener("click", handleClickOutside);
      });
  
      onBeforeUnmount(() => {
        document.removeEventListener("click", handleClickOutside);
      });
  
      return {
        languages,
        currentLanguage,
        changeLanguage,
        showLanguageMenu,
        toggleLanguageDropdown,
        getCurrentLanguageName
      };
    }
  };
  </script>
  
  <style scoped>
  /* Add component-specific styles here if needed */
  </style>