<template>
  <main
    class="flex items-top justify-center min-h-screen px-8 py-8 bg-white md:px-20 md:py-20 font-[number:var(--sds-typography-body-font-weight-regular)] text-[length:var(--sds-typography-body-size-medium)]"
  >
    <section
      class="flex flex-col gap-4 items-center w-full max-w-md"
    >
      <form
        @submit.prevent="submitForm"
        class="flex flex-col gap-4 items-center w-full max-w-md"
      >
        <div class="flex flex-col w-full">
          <label for="videoUrl" class="text-xl font-semibold"
            >Enter Video URL</label
          >
          <input
            id="videoUrl"
            type="text"
            v-model="formData.video_url"
            @input="extractVideoId"
            required
            class="overflow-hidden px-4 py-3 mt-1 w-full rounded-lg border border-solid border-zinc-300"
            placeholder="Enter video URL"
          />
        </div>
        <button
          @click="nextForm"
          type="next"
          class="p-3 mt-4 rounded-lg bg-zinc-800 text-white"
        >
          Next
        </button>
      </form>
    </section>
  </main>
</template>


<script>
import { ref, watch, onMounted } from "vue";
import axios from "axios";
import { nanoid } from "nanoid";
import { useRouter } from "vue-router";
import { BACKEND_URL } from "../utils/config";

export default {
  setup() {
    const router = useRouter(); // Initialize the router
    const formattedTime = ref("");
    const formData = ref({
      id: nanoid(16), // Generate a new 16-character ID for the post
      title: "",
      video_id: "",
      video_platform: "",
      movement_type: "",
      starting_position: "",
      ending_position: "",
      sequence_start_time: "",
      public_status: "public",
      language: "en",
      notes: "",
    });

    // Function to extract video ID based on platform
    const extractVideoId = () => {
      const url = videoUrl.value;

      // Check for YouTube video ID
      const youtubeMatch = url.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );
      if (youtubeMatch) {
        formData.value.video_id = youtubeMatch[1];
        formData.value.video_platform = "YouTube";
        return;
      }

      // Check for Bilibili video ID
      const bilibiliMatch = url.match(
        /(?:https?:\/\/)?(?:www\.)?bilibili\.com\/video\/(BV[0-9A-Za-z]+|av\d+)/
      );
      if (bilibiliMatch) {
        let videoId = bilibiliMatch[1];

        // Check for &p=? in the URL
        const pageMatch = url.match(/[?&]p=(\d+)/);
        if (pageMatch) {
          videoId += `&p=${pageMatch[1]}`; // Concatenate the page number to the video ID
        }

        formData.value.video_id = videoId;
        formData.value.video_platform = "Bilibili";
        return;
      }

      // Clear fields if the URL doesn't match
      formData.value.video_id = "";
      formData.value.video_platform = "";
    };

    const nextForm = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Retrieve access token from localStorage

        const response = await axios.post(
          `${BACKEND_URL}/newpost/${formData.value.id}`, // Include the post ID in the URL
          formData.value,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Pass access token in Authorization header
            },
          }
        );

        alert(response.data.message);
        // Navigate to the view page for the new post
        router.push(`/edit/${formData.value.id}`);
      } catch (error) {
        console.error("Error continuing to next form:", error);
        alert("Failed to add the new post.");
      }
    };

    return {
      formData,
      extractVideoId,
      nextForm,
    };
  },
};
</script>

<style scoped>
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
