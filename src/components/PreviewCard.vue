<template>
  <article
    class="flex flex-col self-stretch p-4 my-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:translate-y-[-2px] w-full"
  >
    <!-- Video Thumbnail -->
    <div
      class="relative w-full bg-neutral-100 dark:bg-neutral-700 overflow-hidden rounded-lg"
      style="aspect-ratio: 16/9"
    >
      <router-link :to="`/viewpost/${id}`">
        <img
          :src="imageSrc"
          :alt="title"
          class="absolute top-0 left-0 w-full h-full object-cover"
        />
      </router-link>
    </div>

    <!-- Post Details -->
    <div class="flex flex-col gap-2 mt-4 w-full">
      <!-- Title -->
      <router-link :to="`/viewpost/${id}`">
        <h2
          class="leading-tight text-black dark:text-white font-bold text-lg truncate-title transition-colors duration-200"
        >
          {{ title }}
        </h2>
      </router-link>
      
      <!-- Avatar and User Info -->
      <div class="flex items-center mt-1 w-full">
        <router-link :to="`/viewprofile/${username}`" class="flex items-center">
          <img
            :src="avatarSrc"
            :alt="`${name}'s avatar`"
            class="object-cover shrink-0 w-10 h-10 rounded-full mr-3"
          />
          
          <div class="flex flex-col">
            <span class="text-gray-900 dark:text-gray-100 font-medium truncate transition-colors duration-200" :title="name">{{ name }}</span>
            <div class="flex items-center">
              <span class="text-gray-600 dark:text-gray-400 text-sm truncate transition-colors duration-200" :title="username">@{{ username }}</span>
              <span v-if="academy" class="text-gray-600 dark:text-gray-400 text-sm ml-1 truncate transition-colors duration-200" :title="academy">· {{ academy }}</span>
            </div>
          </div>
        </router-link>
        
        <!-- Belt Badge -->
        <div class="ml-auto">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                :class="getBeltColor(belt)">
            {{ belt }}
          </span>
        </div>
      </div>
      
      <!-- Date -->
      <div class="flex justify-between items-center mt-1">
        <time class="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">{{ formattedDate }}</time>
      </div>
    </div>
  </article>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import axios from "axios";
import { BACKEND_URL } from "../utils/config";

export default {
  name: "PreviewCard",
  props: {
    index: Number, // Receiving the index to verify order
    id: String,
    videoId: String,
    videoPlatform: String,
    title: String,
    username: String,
    name: String,
    belt: String,
    academy: String, // Added academy prop
    avatarSrc: String,
    createdAt: String,
  },
  setup(props) {
    // Destructure props for easier access
    const {
      id,
      videoId,
      videoPlatform,
      title,
      username,
      name,
      belt,
      academy,
      avatarSrc,
      createdAt,
    } = props;

    // Ref to store the Bilibili thumbnail URL
    const bilibiliThumbnail = ref("");

    const getThumbnail = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/proxy-image?bvid=${props.videoId}`
        );
        console.log("Response data:", response.data);

        if (response.ok) {
          const blob = await response.blob();
          bilibiliThumbnail.value = URL.createObjectURL(blob);
        } else {
          console.error("Error fetching the thumbnail:", response.statusText);
        }
      } catch (error) {
        console.error(
          "Error fetching Bilibili thumbnail through proxy:",
          error
        );
      }
    };

    // Run getThumbnail if videoPlatform is Bilibili
    onMounted(() => {
      if (videoPlatform === "Bilibili") {
        getThumbnail();
      }
    });

    // Compute image source based on video platform
    const imageSrc = computed(() => {
      if (videoPlatform === "YouTube") {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      } else if (videoPlatform === "Bilibili" && bilibiliThumbnail.value) {
        return bilibiliThumbnail.value;
      } else {
        return `https://example.com/default-image.jpg`; // Fallback image
      }
    });

    // Format createdAt to a more readable date
    const formattedDate = computed(() => {
      return new Date(createdAt).toLocaleDateString();
    });

    // Get appropriate color class based on belt rank
    const getBeltColor = (belt) => {
      const beltColors = {
        'white': 'bg-gray-100 text-gray-800',
        'blue': 'bg-blue-100 text-blue-800',
        'purple': 'bg-purple-100 text-purple-800',
        'brown': 'bg-amber-100 text-amber-800',
        'black': 'bg-black text-white'
      };
      
      // Default to white if belt is not specified or not in the list
      const beltLower = belt?.toLowerCase() || 'white';
      return beltColors[beltLower] || beltColors['white'];
    };
    
    return {
      imageSrc,
      formattedDate,
      id,
      title,
      username,
      name,
      belt,
      academy,
      avatarSrc,
      getBeltColor,
    };
  },
};
</script>

<style scoped>
.truncate-title {
  white-space: nowrap; /* Prevent wrapping */
  overflow: hidden; /* Hide the overflow text */
  text-overflow: ellipsis; /* Show ellipsis for overflowing text */
}
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

