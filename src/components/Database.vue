<template>
  <div
    class="flex min-h-screen bg-gray-50 dark:bg-gray-900 relative transition-colors duration-200 pt-[0px]"
  >
    <!-- Mobile menu toggle -->
    <button
      class="md:hidden fixed top-4 left-4 z-20 flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
      @click="isSidebarOpen = !isSidebarOpen"
      aria-label="Toggle Sidebar"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
    
    <div 
      class="absolute left-0 top-0 w-56 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-zinc-300 dark:border-zinc-700 z-50 transition-colors duration-200"
      :class="{
        'translate-x-0': isSidebarOpen || !isMobile, 
        '-translate-x-full': !isSidebarOpen && isMobile,
        'w-80': isPanelExpanded,
        'w-[0px]': !isPanelExpanded
      }"
    >
      <!-- Header with search or toggle button -->
      <div class="border-b border-gray-200 dark:border-gray-700 dark:bg-gray-900 transition-colors duration-300">
        <!-- Expanded View with Search Bar -->
        <div v-if="isPanelExpanded" class="p-4">
          <div class="relative w-full">
            <label for="searchInput" class="sr-only">Search</label>
            <input
              id="searchInput"
              type="text"
              v-model="formData.search"
              @keyup.enter="fetchPosts"
              class="py-2 px-4 pr-12 w-full rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors text-sm"
              placeholder="Titles, positions, techniques, etc."
              aria-label="Search"
            />
            <button 
              @click.prevent="fetchPosts" 
              class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md bg-transparent hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search"
            >
              <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- No collapsed view toggle button, using the top header button instead -->
      </div>
      
      <!-- Filter section -->
      <aside
        v-if="isPanelExpanded"
        class="flex-1 p-4 overflow-y-auto dark:bg-gray-900 transition-all duration-300"
      >
        <h3 class="text-base font-medium text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">Filter Options</h3>
        <!-- Post By field -->
        <div class="mb-4">
          <div class="flex justify-between mb-1.5">
            <label for="postBy" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Post By</label>
          </div>
          <div class="relative">
            <input
              id="postBy"
              type="text"
              v-model="formData.postBy"
              placeholder="Enter poster's name"
              class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors duration-200 border border-transparent dark:border-gray-600"
              aria-label="Post By"
            />
          </div>
        </div>

        <!-- Movement Type field -->
        <div class="mb-4">
          <div class="flex justify-between mb-1.5">
            <label for="movementType" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Movement Type</label>
          </div>
          <div class="relative">
            <select
              id="movementType"
              v-model="formData.movementType"
              class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors duration-200 border border-transparent dark:border-gray-600"
            >
              <option value="">Any</option>
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
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="h-4 w-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Starting Position field -->
        <div class="mb-4">
          <div class="flex justify-between mb-1.5">
            <label for="startingPosition" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Starting Position</label>
          </div>
          <div class="relative">
            <select
              id="startingPosition"
              v-model="formData.startingPosition"
              class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors duration-200 border border-transparent dark:border-gray-600"
            >
              <option value="">Any</option>
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
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="h-4 w-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Starting Position Type field -->
        <div class="mb-4">
          <div class="flex justify-between mb-1.5">
            <label for="startingTopBottom" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Starting Position Type</label>
          </div>
          <div class="relative">
            <select
              id="startingTopBottom"
              v-model="formData.startingTopBottom"
              class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors duration-200 border border-transparent dark:border-gray-600"
            >
              <option value="">Any</option>
              <option value="TOP">Top</option>
              <option value="BOTTOM">Bottom</option>
              <option value="NEUTRAL">Neutral</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Ending Position field -->
        <div class="mb-4">
          <div class="flex justify-between mb-1.5">
            <label for="endingPosition" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Ending Position</label>
          </div>
          <div class="relative">
            <select
              id="endingPosition"
              v-model="formData.endingPosition"
              class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors duration-200 border border-transparent dark:border-gray-600"
            >
              <option value="">Any</option>
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
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Ending Position Type field -->
        <div class="mb-4">
          <div class="flex justify-between mb-1.5">
            <label for="endingTopBottom" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Ending Position Type</label>
          </div>
          <div class="relative">
            <select
              id="endingTopBottom"
              v-model="formData.endingTopBottom"
              class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors duration-200 border border-transparent dark:border-gray-600"
            >
              <option value="">Any</option>
              <option value="TOP">Top</option>
              <option value="BOTTOM">Bottom</option>
              <option value="NEUTRAL">Neutral</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Gi/No-Gi field -->
        <div class="mb-4">
          <div class="flex justify-between mb-1.5">
            <label for="giNogi" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Gi / No-Gi</label>
          </div>
          <div class="relative">
            <select
              id="giNogi"
              v-model="formData.giNogi"
              class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors duration-200 border border-transparent dark:border-gray-600"
            >
              <option value="">Any</option>
              <option value="Gi">Gi</option>
              <option value="No-Gi">No-Gi</option>
              <option value="Both">Both</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Practitioner/Instructor field -->
        <div class="mb-4">
          <div class="flex justify-between mb-1.5">
            <label for="practitioner" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Practitioner / Instructor</label>
          </div>
          <div class="relative">
            <input
              id="practitioner"
              type="text"
              v-model="formData.practitioner"
              placeholder="Search by practitioner name"
              class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors duration-200 border border-transparent dark:border-gray-600"
            />
          </div>
        </div>

        <!-- Public Status field -->
        <div class="mb-4">
          <div class="flex justify-between mb-1.5">
            <label for="publicStatus" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Public Status</label>
          </div>
          <div class="relative">
            <select
              id="publicStatus"
              v-model="formData.publicStatus"
              class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors duration-200 border border-transparent dark:border-gray-600"
            >
              <option value="">Any</option>
              <option value="public">Public</option>
              <option value="subscribers">Subscribers Only</option>
              <option value="private">Private</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Language field -->
        <div class="mb-4">
          <div class="flex justify-between mb-1.5">
            <label for="language" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Language</label>
          </div>
          <div class="relative">
            <select
              id="language"
              v-model="formData.language"
              class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors duration-200 border border-transparent dark:border-gray-600"
            >
              <option value="">Any</option>
              <option value="English">English</option>
              <option value="Japanese">Japanese</option>
              <option value="Traditional Chinese">Traditional Chinese</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Sort By field -->
        <div class="mb-4">
          <div class="flex justify-between mb-1.5">
            <label for="sortOption" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Sort By</label>
          </div>
          <div class="relative">
            <select
              id="sortOption"
              v-model="formData.sortOption"
              @change="fetchPosts"
              class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors duration-200 border border-transparent dark:border-gray-600"
            >
              <option value="newToOld">New to Old</option>
              <option value="oldToNew">Old to New</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </aside>
    </div>
    <main
      class="flex flex-col flex-1 p-6 overflow-y-auto h-full transition-all duration-300 bg-gray-50 dark:bg-gray-900"
      :style="{
        marginLeft: computeMainMargin
      }"
    >
      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center items-center py-10 w-full">
        <div class="animate-spin h-10 w-10 border-4 border-blue-500 dark:border-blue-400 rounded-full border-t-transparent"></div>
      </div>
      
      <!-- Error message -->
      <div v-else-if="errorMessage" class="flex flex-col justify-center items-center py-10 w-full">
        <div class="text-red-500 dark:text-red-400 font-medium mb-2">{{ errorMessage }}</div>
        <button 
          @click="fetchPosts"
          class="px-4 py-2 bg-black dark:bg-gray-800 text-white rounded hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
      
      <!-- Empty state -->
      <div v-else-if="posts.length === 0" class="flex justify-center items-center py-10 w-full">
        <p class="text-gray-500 dark:text-gray-400">No posts found. Try adjusting your search criteria.</p>
      </div>
      
      <!-- Post list -->
      <section
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3 w-full"
      >
        <PreviewCard
          v-for="(post, index) in posts"
          :key="post.id"
          :index="index"
          :id="post.id"
          :videoId="post.video_id"
          :videoPlatform="post.video_platform"
          :title="post.title"
          :username="post.username"
          :name="post.name"
          :belt="post.belt"
          :academy="post.academy"
          :avatarSrc="post.avatar_url"
          :createdAt="post.created_at"
        />
      </section>
    </main>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import PreviewCard from "./PreviewCard.vue";
import { BACKEND_URL } from "../utils/config";
import { getUserFromToken } from "../utils/auth";

export default {
  components: {
    PreviewCard,
  },
  setup() {
    const formData = ref({
      search: "",
      postBy: "", // This will store the user's username
      movementType: "",
      startingPosition: "",
      startingTopBottom: "",
      endingPosition: "",
      endingTopBottom: "",
      giNogi: "",
      practitioner: "", // New field for instructor/practitioner
      publicStatus: "",
      language: "",
      sortOption: "newToOld",
    });

    const posts = ref([]);
    const isExpanded = ref(true);
    const isSidebarOpen = ref(!window.matchMedia("(max-width: 768px)").matches);
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const isLoading = ref(false);
    const errorMessage = ref("");
    const isPanelExpanded = ref(true); // Controls the filter panel visibility

    // Compute the correct margin for the main content based on sidebar state
    const computeMainMargin = computed(() => {
      if (!isSidebarOpen.value && (isMobile || !isPanelExpanded.value)) {
        return '0px';
      } else if (isPanelExpanded.value) {
        return '320px'; // 80px * 4 = 320px (tailwind w-80 = 20rem = 320px)
      } else {
        return '0px';
      }
    });

    // Toggle the entire filter panel (like ChatGPT)
    const toggleFilterPanel = () => {
      isPanelExpanded.value = !isPanelExpanded.value;
    };
    
    // Sorting logic
    const toggleSort = () => {
      formData.value.sortOption =
        formData.value.sortOption === "newToOld" ? "oldToNew" : "newToOld";
      fetchPosts(); // Re-fetch posts when sort changes
    };

    // Fetch posts function
    const fetchPosts = async () => {
      isLoading.value = true;
      errorMessage.value = "";
      
      try {
        console.log("Fetching posts with params:", formData.value);
        const token = localStorage.getItem("accessToken"); // Assume token is stored in local storage

        // Make the API call
        const response = await axios.get(`${BACKEND_URL}/search`, {
          params: formData.value, // Pass query params as required by backend
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined, // Attach token if available
          },
        });

        console.log("Search API response:", response.data);
        posts.value = response.data.posts || []; // Update posts data with response
        console.log(`Loaded ${posts.value.length} posts`);
      } catch (error) {
        console.error("Error fetching posts:", error);
        
        // Extract detailed error information
        if (error.response) {
          // Server responded with a status code outside of 2xx range
          console.error("Server error:", {
            status: error.response.status,
            data: error.response.data,
          });
          errorMessage.value = error.response.data?.error || 
            `Server error (${error.response.status})`;
        } else if (error.request) {
          // Request was made but no response received (network error)
          console.error("Network error - no response received");
          errorMessage.value = "Network error - couldn't connect to server";
        } else {
          // Error in setting up the request
          console.error("Request error:", error.message);
          errorMessage.value = "Error sending request";
        }
      } finally {
        isLoading.value = false;
      }
    };

    // Sidebar toggle event handler
    const handleSidebarToggle = (event) => {
      isPanelExpanded.value = event.detail.expanded;
    };
    
    // Set up and tear down sidebar toggle event listener
    const listenForSidebarToggle = () => {
      window.addEventListener('toggle-sidebar', handleSidebarToggle);
    };
    
    // Clean up event listeners when component is unmounted
    onBeforeUnmount(() => {
      window.removeEventListener('toggle-sidebar', handleSidebarToggle);
    });

    // Fetch user's posts on mount
    onMounted(() => {
      const username = getUserFromToken();
      if (username) {
        formData.value.postBy = username; // Set the username in the form data
        fetchPosts(); // Fetch initial posts
      }
      
      // Set up listener for sidebar toggle events
      listenForSidebarToggle();
    });

    return {
      formData,
      posts,
      isExpanded,
      isSidebarOpen,
      isMobile,
      isLoading,
      errorMessage,
      isPanelExpanded,
      computeMainMargin,
      toggleFilterPanel,
      toggleSort,
      fetchPosts,
    };
  },
};
</script>

<style scoped>
/* Default border for larger screens */
.border {
  border-width: 1px; /* Default thickness */
}

/* Hide scrollbar for various browsers while maintaining functionality */
.overflow-y-auto::-webkit-scrollbar,
aside::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

aside, 
.overflow-y-auto {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

/* Thinner border on mobile screens */
@media (max-width: 400px) {
  .flex-wrap {
    padding: 0px; /* Reduced padding for mobile */
  }
  .border {
    border-width: 0.5px; /* Reduced thickness for smaller screens */
  }
  .flex-wrap {
    padding: 1rem; /* Reduced padding for mobile */
  }
}
</style>