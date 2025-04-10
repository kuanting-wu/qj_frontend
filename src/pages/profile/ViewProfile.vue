<template>
  <article class="flex flex-col p-8 bg-white dark:bg-gray-900 max-w-4xl mx-auto transition-colors duration-200">
    <!-- Top Section: Avatar and Basic Info -->
    <div class="flex flex-col md:flex-row gap-6 mb-8">
      <!-- Avatar -->
      <figure class="flex-shrink-0">
        <img
          v-if="profile.avatar_url"
          loading="lazy"
          :src="profile.avatar_url"
          alt="Profile picture"
          class="rounded-full border border-solid border-zinc-300 w-[200px] h-[200px] object-cover"
        />
        <span v-else class="text-lg font-medium text-gray-700 dark:text-gray-300">
          {{ userInitial }}
        </span>
      </figure>
      
      <!-- Basic Info -->
      <div class="flex flex-col justify-center">
        <header class="flex items-center gap-2 mb-1">
          <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 leading-tight transition-colors duration-200">
            {{ profile.name || profile.username }}
          </h1>
          <router-link
            v-if="props.userName === currentUser"
            :to="editProfileLink"
            class="flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Edit profile"
            title="Edit profile"
          >
            <svg 
              class="w-5 h-5 text-gray-600 dark:text-gray-300" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </router-link>
        </header>
        <div class="text-gray-500 dark:text-gray-400 mb-3 transition-colors duration-200">@{{ profile.username }}</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div v-if="profile.belt" class="flex items-center gap-2">
            <span class="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Belt:</span>
            <span class="text-gray-600 dark:text-gray-400 transition-colors duration-200">{{ profile.belt }}</span>
          </div>
          <div v-if="profile.academy" class="flex items-center gap-2">
            <span class="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Academy:</span>
            <span class="text-gray-600 dark:text-gray-400 transition-colors duration-200">{{ profile.academy }}</span>
          </div>
          <div v-if="profile.location" class="flex items-center gap-2">
            <span class="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Location:</span>
            <span class="text-gray-600 dark:text-gray-400 transition-colors duration-200">{{ profile.location }}</span>
          </div>
          <div v-if="profile.nationality" class="flex items-center gap-2">
            <span class="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Nationality:</span>
            <span class="text-gray-600 dark:text-gray-400 transition-colors duration-200">{{ profile.nationality }}</span>
          </div>
          <div v-if="profile.weight_class" class="flex items-center gap-2">
            <span class="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Weight Class:</span>
            <span class="text-gray-600 dark:text-gray-400 transition-colors duration-200">{{ profile.weight_class }}</span>
          </div>
          <div v-if="profile.height" class="flex items-center gap-2">
            <span class="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Height:</span>
            <span class="text-gray-600 dark:text-gray-400 transition-colors duration-200">{{ profile.height }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Bio Section -->
    <div v-if="profile.bio" class="mb-8">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 transition-colors duration-200">Bio</h2>
      <p class="text-gray-600 dark:text-gray-400 whitespace-pre-line transition-colors duration-200">{{ profile.bio }}</p>
    </div>
    
    <!-- Achievements Section -->
    <div v-if="profile.achievements" class="mb-8">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 transition-colors duration-200">Achievements</h2>
      <p class="text-gray-600 dark:text-gray-400 whitespace-pre-line transition-colors duration-200">{{ profile.achievements }}</p>
    </div>
    
    <!-- Links Section -->
    <div class="flex flex-col gap-3">
      <div v-if="profile.website_url" class="flex items-center gap-2">
        <span class="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Website:</span>
        <a :href="profile.website_url" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200">{{ profile.website_url }}</a>
      </div>
      
      <!-- Social Links -->
      <div v-if="socialLinksExist" class="flex flex-wrap gap-4">
        <a 
          v-for="(link, platform) in parsedSocialLinks" 
          :key="platform" 
          :href="link" 
          target="_blank"
          class="text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200"
        >
          {{ platform }}
        </a>
      </div>
    </div>
  </article>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import { getUserFromToken } from "@/utils/auth";
import { BACKEND_URL } from "@/utils/config";

export default {
  props: ["userName"], // Keep prop name for compatibility with router
  setup(props) {
    const profile = ref({
      username: "",
      avatar_url: "",
      belt: "",
      academy: "",
      bio: "",
      location: "",
      nationality: "",
      weight_class: "",
      height: "",
      date_of_birth: "",
      social_links: "",
      achievements: "",
      website_url: ""
    });

    const editProfileLink = computed(() => `/editprofile/${props.userName}`);
    const currentUser = getUserFromToken() || "";
    
    // Parse social links from JSON string
    const parsedSocialLinks = computed(() => {
      if (!profile.value.social_links) return {};
      try {
        return typeof profile.value.social_links === 'string' 
          ? JSON.parse(profile.value.social_links) 
          : profile.value.social_links;
      } catch (e) {
        console.error("Error parsing social links:", e);
        return {};
      }
    });
    
    // Check if social links exist
    const socialLinksExist = computed(() => {
      return Object.keys(parsedSocialLinks.value).length > 0;
    });

    const fetchProfile = async () => {
      try {
        console.log("Fetching profile for:", props.userName);
        const response = await axios.get(
          `${BACKEND_URL}/viewprofile/${props.userName}`
        );
        profile.value = response.data;
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    onMounted(fetchProfile);

    watch(
      () => props.userName,
      (newUserName) => {
        if (newUserName) {
          fetchProfile();
        }
      }
    );

    return {
      editProfileLink,
      profile,
      currentUser,
      props,
      parsedSocialLinks,
      socialLinksExist
    };
  },
};
</script>