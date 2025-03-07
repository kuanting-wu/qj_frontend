<template>
  <div class="flex overflow-hidden flex-col bg-white">
    <header
      class="flex overflow-hidden flex-wrap gap-4 items-center px-6 py-2.5 w-full bg-white border-b border-zinc-300 min-h-[60px] max-md:px-5 max-md:max-w-full"
    >
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
        class="flex justify-end flex-wrap flex-1 shrink gap-2 items-center self-stretch my-auto leading-none whitespace-nowrap basis-0 font-[number:var(--sds-typography-body-font-weight-regular)] min-w-[240px] text-[length:var(--sds-typography-body-size-medium)] max-md:max-w-full"
      >
        <router-link
          to="/docs"
          class="gap-2 self-stretch p-2 my-auto rounded-lg text-[color:var(--sds-color-text-brand-on-brand-secondary)]"
        >
          Documents
        </router-link>
        <router-link
          to="/database"
          class="gap-2 self-stretch p-2 my-auto rounded-lg text-[color:var(--sds-color-text-brand-on-brand-secondary)]"
        >
          Database
        </router-link>
        <router-link to="/new" aria-label="Create a new page">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a1a346bb6435f7307fd48c41414b143ec3e125a1e61bb152903251e3aecff500?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1"
            class="object-contain shrink-0 self-stretch my-auto w-10 aspect-square"
            alt=""
          />
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
    <div
      v-if="showDropdown"
      class="absolute right-0 top-[60px] w-48 py-2 bg-white rounded-lg shadow-lg border border-zinc-300 z-50"
    >
      <router-link
        :to="profileLink"
        class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
        >Profile</router-link
      >
      <router-link
        to="/signin"
        class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
        >Sign in</router-link
      >
      <a
        href="#"
        @click.prevent="signout"
        class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
        >Sign out</a
      >
    </div>

    <div class="relative z-0 flex-grow">
      <router-view />
    </div>

    <footer
      class="flex overflow-hidden flex-wrap gap-4 items-start px-8 pt-8 pb-40 w-full bg-white border-t border-zinc-300 max-md:px-5 max-md:pb-24 max-md:max-w-full"
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
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRouter } from "vue-router";
import { getUserFromToken } from "./utils/auth";

export default {
  setup() {
    const router = useRouter();
    const showDropdown = ref(false);
    const user_name = ref("example");
    const profileLink = computed(() => `/profile/${user_name.value}`);

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value;
    };

    const signout = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.push("/");
      alert("Signed out successfully");
    };

    const handleClickOutside = (event) => {
      const dropdown = document.querySelector(".absolute"); // Adjusted selector for dropdown
      const profileButton = document.querySelector(".relative img"); // Profile button

      if (
        showDropdown.value &&
        !dropdown.contains(event.target) &&
        !profileButton.contains(event.target)
      ) {
        showDropdown.value = false;
      }
    };

    onMounted(() => {
      user_name.value = getUserFromToken();
      document.addEventListener("click", handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    return {
      showDropdown,
      user_name,
      profileLink,
      toggleDropdown,
      signout,
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
