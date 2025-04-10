<template>
  <div class="flex min-h-screen bg-gray-100 dark:bg-gray-950 relative transition-colors duration-200">
    <main class="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-200 flex flex-col p-6 gap-4 w-full">
      <div class="flex flex-col md:flex-row flex-grow w-full gap-4">
        <FilterPanel
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200 w-full md:w-80"
          :form-data="formData"
          :fields="postFormFields"
          :is-loading="isLoading"
          :error-message="errorMessage"
          :is-mobile="isMobile"
          @search="fetchPosts"
          @field-changed="fetchPosts"
        />
        <DisplayPanel
          class="w-full md:flex-1"
          :posts="posts"
          :is-loading="isLoading"
          :error-message="errorMessage"
          display-type="card"
          @retry-fetch="fetchPosts"
        />
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import DisplayPanel from "@/components/layout/DisplayPanel.vue";
import FilterPanel from "@/components/layout/FilterPanel.vue";
import postFormFields from "@/data/postFormFields.json";
import postFormData from "@/data/postFormData.json";
import { mapBackendPostsToFrontend } from "@/utils/postMapper"; // Import the utility
import { BACKEND_URL } from "@/utils/config";
import { getUserFromToken } from "@/utils/auth";

export default {
  name: "PostFinder",
  components: {
    DisplayPanel,
    FilterPanel,
  },
  setup() {
    const formData = ref({ ...postFormData });
    const posts = ref([]);
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const isLoading = ref(false);
    const errorMessage = ref("");

    const fetchPosts = async () => {
      isLoading.value = true;
      errorMessage.value = "";
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${BACKEND_URL}/search-posts`, {
          params: formData.value,
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
        });
        posts.value = mapBackendPostsToFrontend(response.data.posts); // Use the utility
        console.log("Fetched posts:", posts.value);
      } catch (error) {
        errorMessage.value = error.response
          ? error.response.data?.error || `Server error (${error.response.status})`
          : "Network error";
        console.error("Error fetching posts:", errorMessage.value);
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      const username = getUserFromToken();
      console.log("Username from token:", username);
      if (username) {
        formData.value.ownerName = username;
        console.log("Updated formData with ownerName:", formData.value);
        fetchPosts();
      } else {
        console.warn("No username found in token. Skipping fetchPosts.");
      }
    });

    return {
      formData,
      posts,
      isMobile,
      isLoading,
      errorMessage,
      fetchPosts,
      postFormFields,
    };
  },
};
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}

.overflow-y-auto {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>