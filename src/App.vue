<template>
  <div class="flex overflow-hidden flex-col bg-white">
    <header class="flex overflow-hidden flex-wrap gap-4 items-center px-6 py-2.5 w-full bg-white border-b border-zinc-300 min-h-[60px] max-md:px-5 max-md:max-w-full">
      <router-link to="/" aria-label="Go to welcome page" class="flex justify-center items-center self-stretch my-auto w-10">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/24824442aa5a6ce30384715ebcc5bd08c428c7b22bfa0c7dab7215ec74c99bf1?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" class="object-contain self-stretch my-auto w-10 aspect-square" alt="Logo" />
      </router-link>

      <nav class="flex justify-end flex-wrap flex-1 shrink gap-2 items-center self-stretch my-auto leading-none whitespace-nowrap basis-0 font-[number:var(--sds-typography-body-font-weight-regular)] min-w-[240px] text-[length:var(--sds-typography-body-size-medium)] max-md:max-w-full">
        <router-link to="/database" class="gap-2 self-stretch p-2 my-auto rounded-lg text-[color:var(--sds-color-text-brand-on-brand-secondary)]">
          Database
        </router-link>

        <form class="flex gap-2 items-center self-stretch px-4 py-2 my-auto bg-white rounded-full border border-solid border-zinc-300 min-h-[40px] text-[color:var(--sds-color-text-default-default)] w-[239px]">
          <label for="search" class="sr-only">Search</label>
          <input type="search" id="search" class="flex-1 shrink self-stretch my-auto basis-0 bg-transparent border-none outline-none" placeholder="Search" />
          <button type="submit" aria-label="Submit search">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/6a84d58b5b4d8ca5193fbdf5fb619cb016e069b7371bc4fa40ef7d5941ac53b1?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" class="object-contain shrink-0 self-stretch my-auto aspect-square w-[25px]" alt="" />
          </button>
        </form>

        <router-link to="/newpage" aria-label="Create a new page">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/a1a346bb6435f7307fd48c41414b143ec3e125a1e61bb152903251e3aecff500?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" class="object-contain shrink-0 self-stretch my-auto w-10 aspect-square" alt="" />
        </router-link>
      </nav>

      <!-- Profile Button -->
      <div class="relative">
        <img
          @click="toggleDropdown"
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/64c9bda73ca89162bc806ea1e084a3cd2dccf15193fe0e3c0e8008a485352e26?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1"
          class="object-contain shrink-0 self-stretch my-auto w-10 rounded-full aspect-square cursor-pointer"
          alt="User profile"
        />
      </div>
    </header>

    <!-- Dropdown Menu Outside Header -->
    <div v-if="showDropdown" class="absolute right-0 top-[60px] w-48 py-2 bg-white rounded-lg shadow-lg border border-zinc-300 z-50">
      <router-link to="/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</router-link>
      <router-link to="/signin" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Sign in</router-link>
      <a href="#" @click.prevent="signout" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Sign out</a>
    </div>

    <div class="relative z-0 flex-grow">
      <router-view />
    </div>

    <footer class="flex overflow-hidden flex-wrap gap-4 items-start px-8 pt-8 pb-40 w-full bg-white border-t border-zinc-300 max-md:px-5 max-md:pb-24 max-md:max-w-full">
      <div class="flex flex-col items-start min-w-[240px] w-[262px]">
        <router-link to="/" class="flex justify-center items-center w-[50px]">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/21491438aefeab829f0ffd6daf88fc794baafb8415db65c779c4539e1a152205?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" class="object-contain self-stretch my-auto aspect-[1.02] w-[50px]" alt="Footer logo" />
        </router-link>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const router = useRouter();
    const showDropdown = ref(false)

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value
    }

    const signout = async () => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        // Send API request to sign out and await response
        await axios.post('http://localhost:3000/api/signout', { refreshToken });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/');
        alert('Signed out successfully');
      } catch (error) {
        console.error('Failed to signout:', error);
        alert('Signout failed. Please try again.');
      }
    };

    const handleClickOutside = (event) => {
      const dropdown = document.querySelector('.absolute'); // Adjusted selector for dropdown
      const profileButton = document.querySelector('.relative img'); // Profile button

      if (showDropdown.value && !dropdown.contains(event.target) && !profileButton.contains(event.target)) {
        showDropdown.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      showDropdown,
      toggleDropdown,
      signout,
    }
  },
}
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
