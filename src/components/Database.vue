<template>
  <div class="flex flex-wrap gap-10 px-20 py-8 bg-white">
    <aside
      class="flex flex-col justify-start p-4 w-60 bg-white rounded-lg border border-solid border-zinc-300 font-[number:var(--sds-typography-body-font-weight-regular)] text-[color:var(--sds-color-text-default-default)] text-[length:var(--sds-typography-body-size-medium)]"
    >
      <div class="flex flex-col justify-center w-auto">
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
      </div>
    </aside>
    <main
      class="flex flex-col flex-1 shrink self-start rounded-lg basis-8 min-w-[240px] max-md:max-w-full"
    >
      <div
        class="flex flex-wrap gap-10 justify-between items-center w-full leading-none font-[number:var(--sds-typography-body-font-weight-regular)] text-[length:var(--sds-typography-body-size-medium)] max-md:max-w-full"
      >
        <!-- Search form with placeholder -->
        <form
          class="flex overflow-hidden gap-2.5 items-center self-stretch my-auto whitespace-nowrap min-w-[240px] text-[color:var(--sds-color-text-default-tertiary)]"
        >
          <div
            class="flex gap-6 items-center self-stretch my-auto min-w-[240px] w-[327px]"
          >
            <div
              class="flex gap-2 items-center self-stretch px-4 py-2 my-auto bg-white rounded-full border border-solid border-zinc-300 min-h-[40px] text-[color:var(--sds-color-text-default-default)] w-full min-w-[200px]"
            >
              <label for="searchInput" class="sr-only">Search</label>
              <input
                id="searchInput"
                type="text"
                v-model="formData.search"
                class="flex-1 shrink self-stretch my-auto basis-0 bg-transparent border-none outline-none"
                placeholder="Search"
                aria-label="Search"
              />

              <button @click.prevent="fetchPosts" aria-label="Search">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/6a84d58b5b4d8ca5193fbdf5fb619cb016e069b7371bc4fa40ef7d5941ac53b1?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1"
                  class="object-contain shrink-0 self-stretch my-auto aspect-square w-[25px]"
                  alt="Search icon"
                />
              </button>
            </div>
          </div>
          <router-link to="/new" aria-label="Create a new page">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/a1a346bb6435f7307fd48c41414b143ec3e125a1e61bb152903251e3aecff500?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1"
              class="object-contain shrink-0 self-stretch my-auto w-10 aspect-square"
              alt=""
            />
          </router-link>
        </form>
        <nav
          class="flex gap-2 items-start self-stretch my-auto min-w-[240px] text-[color:var(--sds-color-text-brand-tertiary)]"
        >
          <button
            @click="toggleSort"
            :class="[
              'flex gap-2 items-center justify-center p-2 whitespace-nowrap rounded-lg',
              formData.sortOption === 'oldToNew'
                ? 'bg-zinc-800 text-neutral-100'
                : 'bg-neutral-100',
            ]"
          >
            <img
              v-if="formData.sortOption === 'oldToNew'"
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/9d1653cc14e39c3046030201a565cd1b83ef71da82354897202129da1ce32c18?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1"
              class="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
              alt=""
            />
            <span
              :class="
                formData.sortOption === 'oldToNew'
                  ? 'text-neutral-100'
                  : 'text-current'
              "
            >
              Old to New
            </span>
          </button>

          <button
            @click="toggleSort"
            :class="[
              'flex gap-2 items-center justify-center p-2 whitespace-nowrap rounded-lg',
              formData.sortOption === 'newToOld'
                ? 'bg-zinc-800 text-neutral-100'
                : 'bg-neutral-100',
            ]"
          >
            <img
              v-if="formData.sortOption === 'newToOld'"
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/9d1653cc14e39c3046030201a565cd1b83ef71da82354897202129da1ce32c18?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1"
              class="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
              alt=""
            />
            <span
              :class="
                formData.sortOption === 'newToOld'
                  ? 'text-neutral-100'
                  : 'text-current'
              "
            >
              New to Old
            </span>
          </button>
        </nav>
      </div>
      <section
        class="flex flex-wrap gap-6 items-center mt-12 w-full max-md:mt-10 max-md:max-w-full"
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
import { ref, watch } from "vue";
import axios from "axios";
import PreviewCard from "./PreviewCard.vue";
import { BACKEND_URL } from "../utils/config"

export default {
  components: {
    PreviewCard,
  },
  setup() {
    const formData = ref({
      search: "",
      postBy: "",
      movementType: "",
      startingPosition: "",
      endingPosition: "",
      publicStatus: "",
      language: "",
      sortOption: "newToOld",
    });

    // Sorting logic
    const toggleSort = () => {
      formData.value.sortOption =
        formData.value.sortOption === "newToOld" ? "oldToNew" : "newToOld";
      fetchPosts(); // Re-fetch posts when sort changes
    };

    const posts = ref([]);

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
        console.log("Fetched posts:", data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    // Return everything to make it accessible in the template
    return {
      formData,
      posts,
      toggleSort,
      fetchPosts,
    };
  },
};
</script>


