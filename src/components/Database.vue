<template>
  <div
    class="flex flex-wrap justify-center gap-0 px-8 py-8 bg-white md:gap-8 md:px-20 md:py-20"
  >
    <div class="flex flex-col gap-1 md:gap-4 justify-center w-auto">
      <div class="flex items-center gap-2 px-0 py-0">
        <!-- Filter Button -->
        <button
          class="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-700 rounded-lg md:hidden"
          @click="isExpanded = !isExpanded"
          aria-label="Toggle Filters"
        >
          <img
            v-if="!isExpanded"
            loading="lazy"
            src="@/assets/icons/ChevronDown.svg"
            alt="ChevronDown"
            class="object-contain w-6 h-6"
          />
          <img
            v-if="isExpanded"
            loading="lazy"
            src="@/assets/icons/ChevronUp.svg"
            alt="ChevronUp"
            class="object-contain w-6 h-6"
          />
        </button>

        <!-- Search Bar -->
        <form
          class="flex overflow-hidden gap-2.5 items-center flex-1 whitespace-nowrap min-w-[200px] text-[color:var(--sds-color-text-default-tertiary)]"
        >
          <div
            class="flex gap-6 items-center flex-1 px-4 py-2 bg-white rounded-full border border-solid border-zinc-300 min-h-[40px] text-[color:var(--sds-color-text-default-default)]"
          >
            <label for="searchInput" class="sr-only">Search</label>
            <input
              id="searchInput"
              type="text"
              v-model="formData.search"
              class="flex-1 bg-transparent border-none outline-none"
              placeholder="Title"
              aria-label="Search"
            />
            <button @click.prevent="fetchPosts" aria-label="Search">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/6a84d58b5b4d8ca5193fbdf5fb619cb016e069b7371bc4fa40ef7d5941ac53b1?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1"
                class="object-contain w-6 h-6"
                alt="Search icon"
              />
            </button>
          </div>
        </form>
      </div>
      <aside
        v-if="isExpanded || !isMobile"
        class="flex flex-col justify-center p-4 w-full bg-white rounded-lg border border-solid border-zinc-300 font-[number:var(--sds-typography-body-font-weight-regular)] text-[color:var(--sds-color-text-default-default)] text-[length:var(--sds-typography-body-size-medium)] transition-all duration-300"
        :class="{ 'h-auto': isExpanded, 'h-12 overflow-hidden': !isExpanded }"
      >
        <div class="flex flex-col w-full">
          <label for="postBy" class="leading-snug">Post By</label>
          <input
            id="postBy"
            type="text"
            v-model="formData.postBy"
            placeholder="Enter poster's name"
            class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300"
            aria-label="Post By"
          />
        </div>
        <div class="flex flex-col mt-2 w-full">
          <label for="movementType" class="leading-6">Movement Type</label>
          <input
            id="movementType"
            type="text"
            v-model="formData.movementType"
            placeholder="Enter movement type"
            class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300"
            aria-label="Movement Type"
          />
        </div>
        <div class="flex flex-col mt-2 w-full">
          <label for="startingPosition" class="leading-6"
            >Starting Position</label
          >
          <input
            id="startingPosition"
            type="text"
            v-model="formData.startingPosition"
            placeholder="Enter starting position"
            class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300"
            aria-label="Starting Position"
          />
        </div>
        <div class="flex flex-col mt-2 w-full">
          <label for="endingPosition" class="leading-6">Ending Position</label>
          <input
            id="endingPosition"
            type="text"
            v-model="formData.endingPosition"
            placeholder="Enter ending position"
            class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300"
            aria-label="Ending Position"
          />
        </div>
        <div class="flex flex-col mt-2 w-full">
          <label for="publicStatus">Public Status</label>
          <select
            id="publicStatus"
            v-model="formData.publicStatus"
            class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300"
          >
            <option value=""></option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div class="flex flex-col mt-2 w-full">
          <label for="language">Language</label>
          <select
            id="language"
            v-model="formData.language"
            required
            class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300"
          >
            <option value=""></option>
            <option value="en">English</option>
            <option value="tc">Traditional Chinese</option>
          </select>
        </div>
        <div class="flex flex-col mt-2 w-full">
          <label for="sortOption">Sort By</label>
          <select
            id="sortOption"
            v-model="formData.sortOption"
            @change="fetchPosts"
            class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300"
          >
            <option value="newToOld">New to Old</option>
            <option value="oldToNew">Old to New</option>
          </select>
        </div>
      </aside>
    </div>
    <main
      class="flex flex-col flex-1 shrink self-start rounded-lg basis-8 min-w-[240px] max-md:max-w-full"
    >
      <section
        class="flex flex-wrap gap-6 items-center mt-1 md:mt-5 w-full max-md:mt-8 max-md:max-w-full"
      >
        <PreviewCard
          v-for="(post, index) in posts"
          :key="post.id"
          :index="index"
          :id="post.id"
          :videoId="post.video_id"
          :videoPlatform="post.video_platform"
          :title="post.title"
          :user_name="post.user_name"
          :name="post.name"
          :belt="post.belt"
          :avatarSrc="post.avatar_url"
          :createdAt="post.created_at"
        />
      </section>
    </main>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
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
      endingPosition: "",
      publicStatus: "",
      language: "",
      sortOption: "newToOld",
    });

    const posts = ref([]);
    const isExpanded = ref(true);
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // Sorting logic
    const toggleSort = () => {
      formData.value.sortOption =
        formData.value.sortOption === "newToOld" ? "oldToNew" : "newToOld";
      fetchPosts(); // Re-fetch posts when sort changes
    };

    // Fetch posts function
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Assume token is stored in local storage

        const { data } = await axios.get(`${BACKEND_URL}/api/search`, {
          params: formData.value, // Pass query params as required by backend
          headers: {
            Authorization: `Bearer ${token}`, // Attach token for authentication
          },
        });

        posts.value = data.posts; // Update posts data with response
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    // Fetch user's posts on mount
    onMounted(() => {
      const tokenUserName = getUserFromToken();
      if (tokenUserName) {
        formData.value.postBy = tokenUserName; // Set the username in the form data
        fetchPosts(); // Fetch initial posts
      }
    });

    return {
      formData,
      posts,
      isExpanded,
      isMobile,
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
