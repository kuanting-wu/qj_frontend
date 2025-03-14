<template>
  <main class="flex flex-col min-h-screen px-8 py-8 bg-white dark:bg-gray-900 transition-colors duration-200">
    <!-- Resizable container -->
    <div class="flex flex-col lg:flex-row h-full overflow-hidden">
      <!-- Left Section: Video and Metadata with resizable width -->
      <section 
        ref="leftSection" 
        class="flex flex-col gap-6 h-full overflow-auto"
        :style="{ width: videoWidth + '%' }"
      >
        <!-- Video -->
        <iframe
          id="video-iframe"
          v-if="formData.video_id"
          :src="
            getEmbedUrl(
              formData.video_id,
              formData.video_platform,
              formData.sequence_start_time
            )
          "
          scrolling="no"
          allowfullscreen
          sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"
          class="aspect-video w-full rounded-lg shadow-sm"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-4">
            <label
              for="title"
              class="text-lg font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap transition-colors duration-200"
            >
              Title:
            </label>
            <input
              id="title"
              type="text"
              v-model="formData.title"
              required
              class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              placeholder="Enter title"
            />
          </div>
          <div class="flex items-center gap-2 ml-2">
            <!-- Save Button -->
            <button
              type="button"
              class="flex items-center rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200"
              @click="savePost"
              title="Save post"
            >
              <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </button>
            
            <!-- Delete Button -->
            <button
              type="button"
              class="flex items-center rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200"
              @click="deletePost"
              title="Delete post"
            >
              <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            
            <!-- Toggle Fields Button -->
            <button
              class="flex items-center justify-center w-6 h-6 rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200"
              @click="isExpanded = !isExpanded"
              aria-label="Toggle Fields"
              title="Toggle fields visibility"
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
        </div>

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
            <div class="mb-4">
              <label for="movementType" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
                >Movement Type</label
              >
              <select
                id="movementType"
                v-model="formData.movement_type"
                required
                class="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm"
              >
                <option value="Pass">Pass</option>
                <option value="Sweep">Sweep</option>
                <option value="Escape">Escape</option>
                <option value="Transition">Transition</option>
                <option value="Re-Guard">Re-Guard</option>
                <option value="Submission">Submission</option>
                <option value="Submission Escape">Submission Escape</option>
                <option value="Takedown">Takedown</option>
                <option value="Takedown Defense">Takedown Defense</option>
                <option value="Guard Pull">Guard Pull</option>
                <option value="Scramble">Scramble</option>
              </select>
            </div>
            
            <div class="mb-4">
              <label for="giNogi" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
                >Gi / No-Gi</label
              >
              <select
                id="giNogi"
                v-model="formData.gi_nogi"
                required
                class="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm"
              >
                <option value="Gi">Gi</option>
                <option value="No-Gi">No-Gi</option>
                <option value="Both">Both</option>
              </select>
            </div>
            
            <div class="mb-4">
              <label for="practitioner" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
                >Practitioner / Instructor</label
              >
              <input
                id="practitioner"
                type="text"
                v-model="formData.practitioner"
                placeholder="Enter name of instructor or practitioner"
                class="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm"
              />
            </div>
          </div>
          
          <!-- Column 2: Starting/Ending Positions -->
          <div class="flex flex-1 flex-col">
            <div class="mb-4">
              <label for="startingPosition" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
                >Starting Position</label
              >
              <select
                id="startingPosition"
                v-model="formData.starting_position"
                required
                class="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm"
              >
                <option value="Standing">Standing</option>
                <option value="Closed Guard">Closed Guard</option>
                <option value="Open Guard">Open Guard</option>
                <option value="Half Guard">Half Guard</option>
                <option value="Deep Half Guard">Deep Half Guard</option>
                <option value="Side Control">Side Control</option>
                <option value="Knee on Belly">Knee on Belly</option>
                <option value="North-South">North-South</option>
                <option value="Mount">Mount</option>
                <option value="Back Control">Back Control</option>
                <option value="Turtle">Turtle</option>
              </select>
            </div>
            
            <div class="mb-4">
              <label for="startingTopBottom" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
                >Starting Position Type</label
              >
              <select
                id="startingTopBottom"
                v-model="formData.starting_top_bottom"
                required
                class="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm"
              >
                <option value="TOP">Top</option>
                <option value="BOTTOM">Bottom</option>
                <option value="NEUTRAL">Neutral</option>
              </select>
            </div>
            
            <div class="mb-4">
              <label for="endingPosition" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
                >Ending Position</label
              >
              <select
                id="endingPosition"
                v-model="formData.ending_position"
                required
                class="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm"
              >
                <option value="Standing">Standing</option>
                <option value="Closed Guard">Closed Guard</option>
                <option value="Open Guard">Open Guard</option>
                <option value="Half Guard">Half Guard</option>
                <option value="Deep Half Guard">Deep Half Guard</option>
                <option value="Side Control">Side Control</option>
                <option value="Knee on Belly">Knee on Belly</option>
                <option value="North-South">North-South</option>
                <option value="Mount">Mount</option>
                <option value="Back Control">Back Control</option>
                <option value="Turtle">Turtle</option>
                <option value="Submission Finish">Submission Finish</option>
              </select>
            </div>
            
            <div class="mb-4">
              <label for="endingTopBottom" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
                >Ending Position Type</label
              >
              <select
                id="endingTopBottom"
                v-model="formData.ending_top_bottom"
                required
                class="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm"
              >
                <option value="TOP">Top</option>
                <option value="BOTTOM">Bottom</option>
                <option value="NEUTRAL">Neutral</option>
              </select>
            </div>
          </div>
          
          <!-- Column 3: Sequence Time, Public Status, Language -->
          <div class="flex flex-1 flex-col">
            <div class="mb-4">
              <label for="sequenceStartTime" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
                >Sequence Start Time</label
              >
              <div class="flex items-center">
                <input
                  id="sequenceStartTime"
                  type="text"
                  v-model="formData.sequence_start_time"
                  class="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm"
                  placeholder="hh:mm:ss"
                  maxlength="8"
                  required
                />
                <button
                  type="button"
                  class="px-3 py-2 bg-black dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white rounded-r-md border border-black dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                  @click="setCurrentTimeAsStartTime"
                  title="Use current video time"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="mb-4">
              <label for="publicStatus" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
                >Public Status</label
              >
              <select
                id="publicStatus"
                v-model="formData.public_status"
                required
                class="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm"
              >
                <option value="public">Public</option>
                <option value="subscribers">Subscribers Only</option>
                <option value="private">Private</option>
              </select>
            </div>
            
            <div class="mb-4">
              <label for="language" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
                >Language</label
              >
              <select
                id="language"
                v-model="formData.language"
                required
                class="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm"
              >
                <option value="English">English</option>
                <option value="Japanese">Japanese</option>
                <option value="Traditional Chinese">Traditional Chinese</option>
              </select>
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
        <!-- New Markdown Editor -->
        <div class="flex-grow p-4 overflow-auto">
          <div v-if="loadingMarkdown" class="flex justify-center items-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
          <div v-else-if="markdownError" class="text-red-500 py-2">
            {{ markdownError }}
          </div>
          <MarkdownEditor
            v-else
            ref="markdownEditor"
            v-model="formData.notes"
            label=""
            placeholder="Enter your notes in Markdown format. You can add headings, lists, code blocks, and more."
            hint="Use the toolbar to format your text or insert the current video timestamp."
            :videoTime="formattedCurrentTime"
            @request-time="getCurrentTime"
          />
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { BACKEND_URL } from "@/utils/config";
import { convertToSeconds, formatSecondsToHMS } from "@/utils/time";
import MarkdownEditor from "./MarkdownEditor.vue";
import apiClient from "@/utils/apiClient";

export default {
  components: {
    MarkdownEditor
  },
  props: ["postId"], // Define props to receive postId
  setup(props) {
    const player = ref(null);
    const currentTime = ref(0);
    const router = useRouter(); // Initialize the router
    const formattedTime = ref("");
    const formattedCurrentTime = ref("");
    const isExpanded = ref(true);
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    
    // Markdown loading state
    const loadingMarkdown = ref(false);
    const markdownError = ref("");
    
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
    const formData = ref({
      title: "",
      video_id: "",
      video_platform: "",
      movement_type: "",
      starting_position: "",
      starting_top_bottom: "NEUTRAL",
      ending_position: "",
      ending_top_bottom: "NEUTRAL",
      gi_nogi: "Gi",
      practitioner: "",
      sequence_start_time: "",
      public_status: "public",
      language: "English",
      notes: "",
      notes_path: ""
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
      () => formData.value.video_id,
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

    const fetchPostData = async () => {
      try {
        const response = await apiClient.get(`/viewpost/${props.postId}`);
        formData.value = response.data;
        
        // If post has notes_path or markdown_url, fetch the markdown content
        if (formData.value.notes_path || formData.value.markdown_url) {
          await fetchMarkdownContent();
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };
    
    const fetchMarkdownContent = async () => {
      // Skip if no markdown path is available
      if (!formData.value.notes_path && !formData.value.markdown_url) {
        console.log('No markdown path available, skipping fetch');
        return;
      }
      
      loadingMarkdown.value = true;
      markdownError.value = "";
      
      try {
        // Determine which URL to use - prefer markdown_url if available
        const markdownUrl = formData.value.markdown_url || formData.value.notes_path;
        console.log(`Fetching markdown from: ${markdownUrl}`);
        
        // Save the original URL for debugging
        formData.value.original_markdown_url = markdownUrl;
        
        // Add cache buster to prevent browser caching
        const urlWithCacheBuster = `${markdownUrl}?t=${new Date().getTime()}`;
        
        // Fetch the markdown content
        const response = await axios.get(urlWithCacheBuster);
        
        // Update the notes field with the markdown content
        formData.value.notes = response.data;
        console.log('Markdown content loaded successfully');
      } catch (error) {
        console.error("Error fetching markdown:", error);
        if (error.response) {
          console.error(`Status: ${error.response.status}`);
          console.error('Headers:', error.response.headers);
          console.error('Data:', error.response.data);
        }
        markdownError.value = "Failed to load markdown content. Please try again.";
      } finally {
        loadingMarkdown.value = false;
      }
    };

    const getEmbedUrl = (videoId, platform, startTime = "0:00") => {
      const startSeconds = convertToSeconds(startTime);

      switch (platform) {
        case "YouTube":
          return `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&rel=0&enablejsapi=1`;

        case "Bilibili":
          return `https://player.bilibili.com/player.html?bvid=${videoId}&t=${startSeconds}&no_related=1&enable_api=1&high_quality=1&danmaku=0`;

        default:
          console.warn("Unsupported platform:", platform);
          return "";
      }
    };

    // Watch the formattedTime ref for changes and update it accordingly
    watch(formattedTime, (newValue) => {
      formData.value.sequence_start_time = formatSecondsToHMS(newValue);
      formattedTime.value = formatSecondsToHMS(newValue);
    });

    const getCurrentTime = () => {
      const iframeElement = document.getElementById("video-iframe");
      
      // First clear any existing value to ensure the watcher triggers
      formattedCurrentTime.value = "";
      
      // Handle Bilibili platform
      if (iframeElement && formData.value.video_platform === "Bilibili") {
        // Send message to iframe to get current time
        iframeElement.contentWindow.postMessage(
          {
            event: "getCurrentTime",
          },
          "http://api.bilibili.com/"
        );

        // Add global listener, ensure it's not bound multiple times
        const messageHandler = (event) => {
          if (event.origin === "https://player.bilibili.com") {
            if (event.data && event.data.event === "timeupdate") {
              currentTime.value = event.data.currentTime;
              formattedCurrentTime.value = formatSecondsToHMS(event.data.currentTime);
            }
          }
        };

        // Remove previous listener if exists
        window.removeEventListener("message", messageHandler);
        // Add new listener
        window.addEventListener("message", messageHandler);
      }

      // Handle YouTube platform
      else if (formData.value.video_platform === "YouTube") {
        if (player.value && typeof player.value.getCurrentTime === "function") {
          const timeInSeconds = player.value.getCurrentTime();
          currentTime.value = timeInSeconds;
          // Set this after a slight delay to ensure it's seen as a new value
          setTimeout(() => {
            formattedCurrentTime.value = formatSecondsToHMS(timeInSeconds);
          }, 10);
        } else {
          console.error("YouTube player instance or getCurrentTime method not found.");
        }
      }
      // Unsupported platform or error
      else {
        console.error("Unsupported platform or iframe/player element unavailable.");
      }
    };

    // No longer using EasyMDE editor options or code mode toggle

    const deletePost = async () => {
      try {
        const response = await apiClient.delete(`/deletepost/${props.postId}`);

        alert(response.data.message); // Display a success message
        // Navigate back to the home page or another relevant page
        router.push(`/`);
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete the post.");
      }
    };

    const savePost = async () => {
      try {
        // Create a copy of the form data to ensure we don't modify the original
        const postData = { ...formData.value };
        
        // If there's a markdown_url or notes_path, explicitly flag that we're updating the markdown
        // This helps backend know it needs to update the S3 file
        if (postData.markdown_url || postData.notes_path) {
          postData.update_markdown = true;
        }
        
        console.log(`Sending save request to: /editpost/${props.postId}`);
        
        // Modified to use axios directly for better CORS handling
        const accessToken = localStorage.getItem("accessToken");
        const endpoint = `${BACKEND_URL}/editpost/${props.postId}`;
        
        console.log(`Request URL: ${endpoint}`);
        
        const response = await axios({
          method: 'put',
          url: endpoint,
          data: postData,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        });

        console.log("Save response:", response.data);
        
        // Check if the response includes a new markdown_url
        if (response.data.markdown_url) {
          console.log(`New markdown URL: ${response.data.markdown_url}`);
          formData.value.markdown_url = response.data.markdown_url;
        }
        
        // Check if the response includes a new notes_path
        if (response.data.notes_path) {
          console.log(`New notes path: ${response.data.notes_path}`);
          formData.value.notes_path = response.data.notes_path;
        }
        
        alert(response.data.message);
        
        // Navigate to the view page for the new post
        router.push(`/viewpost/${formData.value.id}`);
      } catch (error) {
        console.error("Error submitting form:", error);
        
        // More detailed error handling
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Response error:", error.response.status);
          console.error("Response data:", error.response.data);
          
          if (error.response.status === 0 || error.message.includes('CORS')) {
            alert("CORS Error: Your request was blocked due to cross-origin restrictions. Please contact the administrator.");
          } else if (error.response.status === 401) {
            alert("Authentication error: Please sign in again.");
            router.push('/signin');
          } else {
            alert(`Error (${error.response.status}): ${error.response.data.message || "Failed to update the post."}`);
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
          alert("Network error: No response received from server. Please check your internet connection.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Request error:", error.message);
          alert("Failed to update the post: " + error.message);
        }
      }
    };

    onMounted(async () => {
      fetchPostData();
    });

    // Function to set the current video time as the sequence start time
    const setCurrentTimeAsStartTime = () => {
      const iframeElement = document.getElementById("video-iframe");
      
      // Handle Bilibili platform
      if (iframeElement && formData.value.video_platform === "Bilibili") {
        iframeElement.contentWindow.postMessage(
          { event: "getCurrentTime" },
          "http://api.bilibili.com/"
        );
        
        // Add listener to get the response
        const messageHandler = (event) => {
          if (event.origin === "https://player.bilibili.com") {
            if (event.data && event.data.event === "timeupdate") {
              const time = event.data.currentTime;
              formData.value.sequence_start_time = formatSecondsToHMS(time);
              // Remove listener after use
              window.removeEventListener("message", messageHandler);
            }
          }
        };
        
        window.addEventListener("message", messageHandler);
      }
      // Handle YouTube platform
      else if (formData.value.video_platform === "YouTube") {
        if (player.value && typeof player.value.getCurrentTime === "function") {
          const timeInSeconds = player.value.getCurrentTime();
          formData.value.sequence_start_time = formatSecondsToHMS(timeInSeconds);
        } else {
          console.error("YouTube player instance or getCurrentTime method not found.");
        }
      }
      else {
        console.error("Unsupported platform or iframe/player element unavailable.");
      }
    };

    return {
      formattedTime,
      formattedCurrentTime,
      formData,
      isExpanded,
      isMobile,
      deletePost,
      savePost,
      getEmbedUrl,
      getCurrentTime,
      setCurrentTimeAsStartTime,
      videoWidth,
      startResize,
      loadingMarkdown,
      markdownError
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

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
