<template>
  <main class="flex flex-col min-h-screen px-8 py-8 bg-white dark:bg-gray-900 transition-colors duration-200">
    <!-- Resizable container -->
    <div class="flex flex-col lg:flex-row h-full overflow-hidden">
      <!-- Left Section: Video and Metadata with resizable width -->
      <section 
        class="flex flex-col gap-6 h-full overflow-auto"
        :style="{ width: videoWidth + '%' }"
      >
        <!-- Video -->
        <iframe
          id="video-iframe"
          v-if="post.video_id"
          :src="
            getEmbedUrl(
              post.video_id,
              post.video_platform,
              post.sequence_start_time
            )
          "
          width="100%"
          height="auto"
          scrolling="no"
          border="0"
          frameborder="no"
          framespacing="0"
          allowfullscreen="true"
          class="aspect-video rounded-lg shadow-sm"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
        ></iframe>

        <img
          v-else
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/2f69a4548ace8090c05433e11f57f205ac0b85a8b70f1642dc2ef2de05544a72?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1"
          alt="Video thumbnail"
          class="object-contain aspect-video w-full"
        />

      <!-- Metadata -->
      <div class="flex flex-col gap-4">
        <header class="flex items-center gap-2 justify-between">
          <h1
            class="text-2xl font-semibold text-gray-800 dark:text-gray-100 leading-tight truncate-title transition-colors duration-200"
          >
            {{ post.title || "Title Unavailable" }}
          </h1>
          <router-link
            v-if="isCurrentUserOwner"
            :to="editPageLink"
            class="flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Edit"
            title="Edit post"
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

        <div class="flex flex-col gap-4">
          <!-- User Info -->
          <div class="flex items-center justify-between gap-4">
            <router-link
              v-if="profileLink"
              :to="profileLink"
              class="flex gap-4 items-center"
            >
              <img
                :src="post.avatar_url"
                alt="User avatar"
                class="w-12 h-12 rounded-full"
              />
              <div>
                <div class="font-medium text-gray-600 dark:text-gray-300 transition-colors duration-200">
                  {{ post.name || "Anonymous" }}
                </div>
                <div class="text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  {{ post.belt || "No rank" }}
                </div>
              </div>
            </router-link>
            <button
              class="flex items-center justify-center w-6 h-6 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200 lg:hidden"
              @click="isExpanded = !isExpanded"
              aria-label="Toggle Filters"
            >
              <svg 
                v-if="!isExpanded"
                class="w-5 h-5" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
              <svg 
                v-if="isExpanded"
                class="w-5 h-5" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>

          <!-- Metadata in Three Columns -->
          <div
            v-if="isExpanded || !isMobile"
            class="flex flex-col lg:flex-row gap-x-2 lg:gap-x-6"
            :class="{
              'h-auto': isExpanded,
              'h-12 overflow-hidden': !isExpanded,
            }"
          >
            <!-- Column 1: Movement Type, Gi/No-Gi, Practitioner -->
            <div class="flex flex-1 flex-col">
              <div class="flex justify-between mb-2">
                <span class="font-semibold truncate text-gray-700 dark:text-gray-300 transition-colors duration-200">Movement Type</span>
                <span class="text-gray-600 dark:text-gray-400 transition-colors duration-200">{{ post.movement_type || "Not specified" }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="font-semibold truncate text-gray-700 dark:text-gray-300 transition-colors duration-200">Gi / No-Gi</span>
                <span class="text-gray-600 dark:text-gray-400 transition-colors duration-200">{{ post.gi_nogi || "Not specified" }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="font-semibold truncate text-gray-700 dark:text-gray-300 transition-colors duration-200">Practitioner</span>
                <span class="text-gray-600 dark:text-gray-400 transition-colors duration-200">{{ post.practitioner || "Not specified" }}</span>
              </div>
            </div>
            
            <!-- Column 2: Starting and Ending Positions -->
            <div class="flex flex-1 flex-col">
              <div class="flex justify-between mb-2">
                <span class="font-semibold truncate text-gray-700 dark:text-gray-300 transition-colors duration-200">Starting Position</span>
                <span class="text-gray-600 dark:text-gray-400 transition-colors duration-200">{{ post.starting_position || "Not specified" }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="font-semibold truncate text-gray-700 dark:text-gray-300 transition-colors duration-200">Starting Position Type</span>
                <span class="text-gray-600 dark:text-gray-400 transition-colors duration-200">{{ formatPositionType(post.starting_top_bottom) || "Not specified" }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="font-semibold truncate text-gray-700 dark:text-gray-300 transition-colors duration-200">Ending Position</span>
                <span class="text-gray-600 dark:text-gray-400 transition-colors duration-200">{{ post.ending_position || "Not specified" }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="font-semibold truncate text-gray-700 dark:text-gray-300 transition-colors duration-200">Ending Position Type</span>
                <span class="text-gray-600 dark:text-gray-400 transition-colors duration-200">{{ formatPositionType(post.ending_top_bottom) || "Not specified" }}</span>
              </div>
            </div>
            
            <!-- Column 3: Sequence Time, Public Status, Language -->
            <div class="flex flex-1 flex-col">
              <div class="flex justify-between mb-2">
                <span class="font-semibold truncate text-gray-700 dark:text-gray-300 transition-colors duration-200">Sequence Start Time</span>
                <span class="text-gray-600 dark:text-gray-400 transition-colors duration-200">{{ post.sequence_start_time || "Not specified" }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="font-semibold truncate text-gray-700 dark:text-gray-300 transition-colors duration-200">Public Status</span>
                <span class="text-gray-600 dark:text-gray-400 transition-colors duration-200">{{ post.public_status || "Not specified" }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="font-semibold truncate text-gray-700 dark:text-gray-300 transition-colors duration-200">Language</span>
                <span class="text-gray-600 dark:text-gray-400 transition-colors duration-200">{{ post.language || "Not specified" }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>

      <!-- Resizable Divider -->
      <div 
        class="hidden lg:block w-1 h-full cursor-col-resize hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150"
        @mousedown="startResize"
      ></div>

      <!-- Right Section: Notes with responsive width -->
      <section 
        class="flex flex-col bg-gray-50 dark:bg-gray-800 h-full overflow-auto transition-colors duration-200"
        :style="{ width: (100 - videoWidth) + '%' }"
      >
        <!-- Show Markdown content if available -->
        <div v-if="post.markdown_url" class="p-4">
          <MarkdownViewer :markdownUrl="post.markdown_url" />
        </div>
        
        <!-- Legacy notes with timestamps for backward compatibility -->
        <ul v-else-if="parsedNotes.length" class="list-none p-4 mt-0">
          <li
            class="flex items-start gap-2 mt-1 lg:mt-4"
            v-for="(note, index) in parsedNotes"
            :key="index"
          >
            <time
              class="text-blue-600 dark:text-blue-400 cursor-pointer font-medium transition-colors duration-200"
              @click="seekToTimestamp(note.timestamp)"
            >
              {{ note.timestamp }}
            </time>
            <p class="text-gray-700 dark:text-gray-300 transition-colors duration-200">{{ note.text }}</p>
          </li>
        </ul>
        
        <!-- No notes available message -->
        <p v-else class="text-gray-500 dark:text-gray-400 italic p-4 transition-colors duration-200">No notes available for this post.</p>
      </section>
    </div>
  </main>
</template>


<script>
import axios from "axios";
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from "vue";
import { getUserFromToken } from "../utils/auth";
import { BACKEND_URL } from "@/utils/config";
import { convertToSeconds } from "@/utils/time";
import MarkdownViewer from "./MarkdownViewer.vue";
import { jwtDecode } from "jwt-decode";

export default {
  name: "PostDetail",
  components: {
    MarkdownViewer
  },
  props: ["postId"],
  setup(props) {
    const post = ref({
      id: "",
      title: "",
      video_id: "",
      video_platform: "",
      movement_type: "",
      starting_position: "",
      starting_top_bottom: "",
      ending_position: "",
      ending_top_bottom: "",
      gi_nogi: "",
      practitioner: "",
      sequence_start_time: "",
      public_status: "",
      language: "",
      notes: "",
      notes_path: "",
      markdown_url: "",
      username: "",
      avatar_url: "",
      name: "",
      belt: "",
    });
    const player = ref(null);
    const isExpanded = ref(true);
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    
    // Resizable layout state
    const videoWidth = ref(65); // Default video section width (%)
    const isResizing = ref(false);
    
    // Handler for starting resize
    const startResize = (e) => {
      isResizing.value = true;
      
      // Add event listeners for mouse movement and mouse up
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResize);
      
      // Prevent selection during resize
      e.preventDefault();
    };
    
    // Handler for resizing
    const handleResize = (e) => {
      if (!isResizing.value) return;
      
      // Calculate percentage based on mouse position
      const container = document.querySelector('main');
      const containerWidth = container.clientWidth;
      const newWidth = (e.clientX / containerWidth) * 100;
      
      // Restrict width to reasonable limits (20% to 80%)
      videoWidth.value = Math.min(Math.max(newWidth, 20), 80);
    };
    
    // Handler for stopping resize
    const stopResize = () => {
      isResizing.value = false;
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResize);
    };
    
    // Clean up event listeners when component is destroyed
    onUnmounted(() => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResize);
    });

    const profileLink = computed(() => {
      return post.value.username ? `/viewprofile/${post.value.username}` : null;
    });
    const editPageLink = computed(() => `/editpost/${props.postId}`);
    const currentUser = getUserFromToken();
    
    // Create a computed property for ownership check
    const isCurrentUserOwner = computed(() => {
      // First check: use the result of our backend permission check
      if (canEditPost.value === false) return false;
      
      // Make sure we have post data and user is authenticated
      if (!props.postId || !localStorage.getItem("accessToken")) return false;
      
      // Check if canEdit field is provided directly from backend
      if (post.value.hasOwnProperty('canEdit')) {
        return post.value.canEdit === true;
      }
      
      // If post has owner_name, check against currentUser
      if (post.value.owner_name && currentUser) {
        if (post.value.owner_name === currentUser) return true;
        if (post.value.owner_name.toLowerCase() === currentUser.toLowerCase()) return true;
      }
      
      // Check any name-based owner field
      const fields = ['username', 'owner_username', 'author', 'creator'];
      for (const field of fields) {
        if (post.value[field] && currentUser && 
            post.value[field].toLowerCase() === currentUser.toLowerCase()) {
          return true;
        }
      }
      
      // Check any ID-based owner field
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const idFields = ['user_id', 'author_id', 'owner_id', 'creator_id'];
          for (const field of idFields) {
            if (post.value[field] && decodedToken.sub && post.value[field] === decodedToken.sub) {
              return true;
            }
          }
        } catch (e) {
          console.error("Error checking token sub:", e);
        }
      }
      
      // Fallback to canEditPost which comes from our backend check
      return canEditPost.value;
    });

    const fetchPostData = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/viewpost/${props.postId}`
        );
        post.value = response.data;
        
        // Clear debug log for better visibility
        console.clear();
        
        // Log post data structure for debugging
        console.log("POST DATA FIELDS:");
        console.log("=====================================");
        const owner_fields = ['username', 'owner_name', 'owner_username', 'author', 'creator', 'user_id', 'author_id', 'owner_id', 'creator_id'];
        
        // Log all fields
        for (const [key, value] of Object.entries(post.value)) {
          const isOwnerField = owner_fields.includes(key);
          console.log(`${key}: ${value}${isOwnerField ? ' 👈 POTENTIAL OWNER FIELD' : ''}`);
        }
        
        console.log("=====================================");
        console.log("Current user from token:", currentUser);
        
        // Get full token data
        const token = localStorage.getItem("accessToken");
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            console.log("Token data:", decodedToken);
          } catch (e) {
            console.error("Failed to decode token for debugging", e);
          }
        }
        
        // Probe to see if this post is editable by the current user
        checkPostEditability();
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };
    
    // Reference to store the result of the edit permission check
    const canEditPost = ref(true); // Default to true until we know otherwise
    
    // Function to check if the current user can edit this post
    const checkPostEditability = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token || !props.postId) {
        canEditPost.value = false;
        return;
      }
      
      try {
        // Make a HEAD request to the edit endpoint to see if we're authorized
        // This is a lightweight way to check permissions without actually modifying data
        await axios.head(`${BACKEND_URL}/editpost/${props.postId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // If the request succeeds (no 401/403), we can edit the post
        console.log("✅ Current user can edit this post");
        canEditPost.value = true;
      } catch (error) {
        // If we get a 401 or 403, we can't edit the post
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.log("❌ Current user cannot edit this post");
          canEditPost.value = false;
        } else {
          console.error("Error checking edit permissions:", error);
          // If there's an unexpected error, default to allowing edit
          // The backend will still enforce permissions when they try to save
          canEditPost.value = true;
        }
      }
    };

    watch(() => props.postId, fetchPostData);

    const getEmbedUrl = (videoId, platform, startTime) => {
      const startSeconds = convertToSeconds(startTime);
      if (platform === "YouTube") {
        return `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&rel=0&enablejsapi=1`;
      } else if (platform === "Bilibili") {
        return `https://player.bilibili.com/player.html?bvid=${videoId}&t=${startSeconds}&no_related=1`;
      }
      return "";
    };

    const parsedNotes = computed(() => {
      const notesArray = [];
      if (post.value && post.value.notes) {
        const regex = /(\d{2}:\d{2}:\d{2})\s+([^0-9]*)/g;
        let match;
        while ((match = regex.exec(post.value.notes)) !== null) {
          notesArray.push({
            timestamp: match[1],
            text: match[2].trim(),
          });
        }
      }
      return notesArray;
    });

    const loadYouTubeIframeAPI = () => {
      return new Promise((resolve) => {
        if (window.YT) {
          resolve(); // If the API is already loaded
        } else {
          const script = document.createElement("script");
          script.src = "https://www.youtube.com/iframe_api";
          script.onload = resolve;
          document.head.appendChild(script);
        }
      });
    };

    const initializePlayer = async () => {
      const iframeElement = document.getElementById("video-iframe");
      await loadYouTubeIframeAPI(); // Wait for the API to load
      if (window.YT && iframeElement) {
        player.value = new window.YT.Player("video-iframe", {
          videoId: post.value.video_id,
          playerVars: {
            rel: 0, // Disable related videos
            // Other player parameters you might need
          },
          events: {
            onReady: () => {
              console.log("YouTube player is ready");
            },
            onError: (error) => {
              console.error("Error initializing YouTube player:", error);
            },
          },
        });
      } else {
        console.error("YT.Player or iframe not found.");
      }
    };

    watch(
      () => post.value.video_id,
      (newVideoId) => {
        if (newVideoId) {
          nextTick(() => {
            const iframe = document.getElementById("video-iframe");
            if (iframe) {
              initializePlayer();
            } else {
              console.error("Iframe not found.");
            }
          });
        }
      }
    );

    const seekToTimestamp = (timestamp) => {
      const seconds = convertToSeconds(timestamp);

      if (post.value.video_platform === "YouTube") {
        // Use the YouTube API to seek
        if (player.value && typeof player.value.seekTo === "function") {
          player.value.seekTo(seconds, true); // Seek to the time
          player.value.playVideo(); // Optionally play the video
        } else {
          console.error("YouTube Player is not initialized.");
        }
      } else if (post.value.video_platform === "Bilibili") {
        // Fallback to the old method for Bilibili
        const iframe = document.getElementById("video-iframe");
        if (iframe) {
          const platform = post.value.video_platform;
          iframe.src = getEmbedUrl(post.value.video_id, platform, timestamp);
        }
      } else {
        console.error("Unsupported platform:", post.value.video_platform);
      }
    };

    onMounted(() => {
      fetchPostData();
    });

    // Helper function to format position type values for display
    const formatPositionType = (positionType) => {
      if (!positionType) return null;
      
      const formatted = {
        'TOP': 'Top',
        'BOTTOM': 'Bottom',
        'NEUTRAL': 'Neutral'
      };
      
      return formatted[positionType] || positionType;
    };

    return {
      post,
      getEmbedUrl,
      profileLink,
      editPageLink,
      parsedNotes,
      seekToTimestamp,
      currentUser,
      isExpanded,
      isMobile,
      isCurrentUserOwner,
      formatPositionType,
      videoWidth,
      startResize
    };
  },
};
</script>
<style scoped>
/* Hide scrollbar for various browsers while maintaining functionality */
.overflow-y-auto::-webkit-scrollbar,
section::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

section, 
.overflow-y-auto {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

@media (max-width: 768px) {
  #video-iframe {
    width: 100%; /* Full width on smaller screens */
    height: auto; /* Maintain aspect ratio */
    border-radius: 8px; /* Optional: Add rounded corners */
  }
}
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