<template>
  <div
    class="pt-16 flex overflow-hidden flex-col min-h-screen bg-white dark:bg-gray-950 transition-colors duration-200">
    <header
      class="fixed top-0 left-0 right-0 z-50 flex overflow-hidden flex-wrap gap-4 items-center px-6 py-2.5 w-full bg-white dark:bg-gray-950 border-b border-zinc-300 dark:border-zinc-700 min-h-[60px] max-md:px-5 max-md:max-w-full transition-colors duration-200">
      <router-link to="/" aria-label="Go to welcome page"
        class="flex justify-center items-center self-stretch my-auto w-10">
        <img loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/24824442aa5a6ce30384715ebcc5bd08c428c7b22bfa0c7dab7215ec74c99bf1?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1"
          class="object-contain self-stretch my-auto w-10 aspect-square" alt="Logo" />
      </router-link>

      <nav
        class="flex justify-end flex-wrap flex-1 shrink gap-2 items-center self-stretch my-auto leading-none whitespace-nowrap basis-0 font-medium min-w-[240px] text-gray-800 dark:text-gray-200 max-md:max-w-full transition-colors duration-200">
        <router-link to="/docs"
          class="gap-2 self-stretch p-2 my-auto rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
          Documents
        </router-link>
        <router-link to="/gamefinder"
          class="gap-2 self-stretch p-2 my-auto rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
          Game Finder
        </router-link>
        <router-link to="/postfinder"
          class="gap-2 self-stretch p-2 my-auto rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
          Post Finder
        </router-link>
        <router-link to="/newpost" aria-label="Create a new page"
          class="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-800 dark:text-gray-200" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </router-link>
      </nav>

      <div class="relative">
        <div @click="toggleDropdown"
          class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer overflow-hidden">
          <img v-if="userAvatar" :src="userAvatar" class="object-cover w-full h-full" alt="User profile" />
          <span v-else class="text-lg font-medium text-gray-700 dark:text-gray-300">
            {{ userInitial }}
          </span>
        </div>
      </div>
    </header>

    <HeaderDropdownMenu
      :show-dropdown="showDropdown"
      :username="username"
      :is-logged-in="isLoggedIn"
      :profile-link="profileLink"
      :dark-mode="darkMode"
      @toggle-dark-mode="toggleDarkMode"
      @signout="signout"
    />

    <div class="relative z-0 flex-grow flex flex-col">
      <router-view />
    </div>

    <footer
      class="flex overflow-hidden flex-wrap gap-4 items-start px-8 py-6 w-full bg-white dark:bg-gray-900 border-t border-zinc-300 dark:border-zinc-700 max-md:px-5 max-md:py-4 max-md:max-w-full transition-colors duration-200">
      <div class="flex flex-col items-start min-w-[240px] w-[262px]">
        <router-link to="/" class="flex justify-center items-center w-[50px]">
          <img loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/21491438aefeab829f0ffd6daf88fc794baafb8415db65c779c4539e1a152205?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1"
            class="object-contain self-stretch my-auto aspect-[1.02] w-[50px]" alt="Footer logo" />
        </router-link>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRouter } from "vue-router";
import { getUserFromToken, isUserLoggedIn } from "./utils/auth";
import HeaderDropdownMenu from "./components/common/HeaderDropdownMenu.vue";

export default {
  components: {
    HeaderDropdownMenu,
  },
  setup() {
    const router = useRouter();
    const showDropdown = ref(false);
    const username = ref("");
    const isLoggedIn = ref(false);
    const userAvatar = ref(null);
    const darkMode = ref(false);

    const userInitial = computed(() => {
      return username.value ? username.value.charAt(0).toUpperCase() : "U";
    });

    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value;
      localStorage.setItem("darkMode", darkMode.value ? "dark" : "light");
      document.documentElement.classList.toggle("dark", darkMode.value);
      document.documentElement.style.backgroundColor = darkMode.value ? "#111827" : "#ffffff";
      showDropdown.value = false;
    };

    const fetchUserAvatar = () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const decodedToken = JSON.parse(atob(base64));
          if (decodedToken.avatar_url) {
            userAvatar.value = decodedToken.avatar_url;
            return;
          }
        }
        userAvatar.value = username.value
          ? `https://ui-avatars.com/api/?name=${encodeURIComponent(username.value)}&background=random`
          : null;
      } catch (error) {
        console.error("Failed to get avatar from token:", error);
        userAvatar.value = username.value
          ? `https://ui-avatars.com/api/?name=${encodeURIComponent(username.value)}&background=random`
          : null;
      }
    };

    const profileLink = computed(() => {
      return username.value ? `/viewprofile/${username.value}` : "/postfinder";
    });

    const checkLoginStatus = async () => {
      try {
        isLoggedIn.value = await isUserLoggedIn();
        username.value = getUserFromToken() || "";
        if (isLoggedIn.value && username.value) {
          fetchUserAvatar();
        } else {
          userAvatar.value = null;
        }
      } catch (error) {
        console.error("Failed to check login status:", error);
        isLoggedIn.value = false;
        username.value = "";
        userAvatar.value = null;
      }
    };

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value;
    };

    const signout = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      username.value = "";
      isLoggedIn.value = false;
      router.push("/");
      showDropdown.value = false;
    };

    const handleClickOutside = (event) => {
      const dropdown = document.querySelector(".absolute");
      const profileButton = document.querySelector(".relative div");
      if (
        showDropdown.value &&
        dropdown &&
        !dropdown.contains(event.target) &&
        profileButton &&
        !profileButton.contains(event.target)
      ) {
        showDropdown.value = false;
      }
    };

    onMounted(async () => {
      await checkLoginStatus();
      if (isLoggedIn.value && username.value) fetchUserAvatar();

      const savedDarkMode = localStorage.getItem("darkMode");
      darkMode.value = savedDarkMode
        ? savedDarkMode === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", darkMode.value);
      document.documentElement.style.backgroundColor = darkMode.value ? "#111827" : "#ffffff";

      document.addEventListener("click", handleClickOutside);
      window.addEventListener("storage", async (e) => {
        if (e.key === "accessToken") {
          await checkLoginStatus();
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
      toggleDropdown,
      username,
      isLoggedIn,
      profileLink,
      signout,
      darkMode,
      toggleDarkMode,
      userAvatar,
      userInitial,
    };
  },
};
</script>

<style scoped>
builder-component {
  max-width: none !important;
}

.absolute {
  position: absolute;
  z-index: 50;
}
</style>