<template>
  <main
    class="flex flex-col px-24 py-16 bg-white font-[number:var(--sds-typography-body-font-weight-regular)] min-w-[240px] text-[length:var(--sds-typography-body-size-medium)] max-md:px-5"
  >
    <section
      class="flex flex-wrap gap-8 text-[color:var(--sds-color-text-default-default)] max-md:max-w-full"
    >
      <form
        @submit.prevent="submitForm"
        class="flex flex-col min-w-[300px] w-[300px]"
      >
        <div class="flex flex-col mt-2 w-full">
          <label for="title">Title</label>
          <input
            id="title"
            type="text"
            v-model="formData.title"
            required
            class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px]"
            placeholder="Enter title"
          />
        </div>
        <div class="flex flex-col mt-2 w-full leading-snug">
          <label for="videoUrl">Video URL</label>
          <textarea
            id="videoUrl"
            v-model="formData.video_url"
            @input="extractVideoId"
            required
            class="overflow-hidden flex-1 shrink px-4 py-3 mt-1 w-full leading-tight whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300 min-h-[80px] min-w-[240px]"
            placeholder="Enter video URL"
          />
        </div>
        <div class="flex flex-col mt-2 w-full">
          <label for="movementType">Movement Type</label>
          <input
            id="movementType"
            type="text"
            v-model="formData.movement_type"
            required
            class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px]"
            placeholder="Enter movement type"
          />
        </div>
        <div class="flex flex-col mt-2 w-full">
          <label for="startingPosition">Starting Position</label>
          <input
            id="startingPosition"
            type="text"
            v-model="formData.starting_position"
            required
            class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px]"
            placeholder="Enter starting position"
          />
        </div>
        <div class="flex flex-col mt-2 w-full">
          <label for="endingPosition">Ending Position</label>
          <input
            id="endingPosition"
            type="text"
            v-model="formData.ending_position"
            required
            class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px]"
            placeholder="Enter ending position"
          />
        </div>
        <div class="flex flex-col mt-2 w-full">
          <label for="sequenceStartTime">Sequence Start Time</label>
          <input
            id="sequenceStartTime"
            type="text"
            v-model="formattedTime"
            required
            class="overflow-hidden px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px]"
            placeholder="hh:mm:ss"
            maxlength="8"
          />
        </div>
        <div class="flex flex-col mt-2 w-full">
          <label for="publicStatus">Public Status</label>
          <select
            id="publicStatus"
            v-model="formData.public_status"
            required
            class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px]"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div class="flex flex-col mt-2 w-full whitespace-nowrap">
          <label for="language">Language</label>
          <select
            id="language"
            v-model="formData.language"
            required
            class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px]"
          >
            <option value="en">English</option>
            <option value="tc">Traditional Chinese</option>
          </select>
        </div>
      </form>
      <div
        class="flex overflow-hidden flex-col justify-center px-px my-auto leading-snug whitespace-nowrap min-h-[607px] min-w-[420px] w-[700px] max-md:max-w-full"
      >
        <div class="flex flex-col flex-1 w-full max-md:max-w-full">
          <label for="notes" class="max-md:max-w-full">Notes</label>
          <textarea
            id="notes"
            v-model="formData.notes"
            required
            class="overflow-hidden flex-1 shrink px-4 pt-3 mt-1 w-full bg-white rounded-lg border border-solid border-zinc-300 min-h-[581px] min-w-[240px] pb-[547px] max-md:pb-24 max-md:max-w-full"
            placeholder="Enter notes here"
          ></textarea>
        </div>
      </div>
    </section>
    <footer
      class="flex flex-wrap gap-6 justify-center items-center p-16 mt-6 w-full leading-none whitespace-nowrap bg-white max-md:px-5 max-md:max-w-full"
    >
      <button
        type="button"
        class="overflow-hidden gap-2 self-stretch p-3 my-auto rounded-lg border border-solid bg-neutral-200 border-neutral-500 text-[color:var(--sds-color-text-default-default)]"
      >
        Delete
      </button>
      <button
        type="submit"
        @click="submitForm"
        class="overflow-hidden gap-2 self-stretch p-3 my-auto rounded-lg border border-solid bg-zinc-800 border-zinc-800 text-white"
      >
        Submit
      </button>
    </footer>
  </main>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import axios from "axios";
import { nanoid } from "nanoid"; 
import { useRouter } from "vue-router";
import { BACKEND_URL } from "../utils/config" 

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
        formData.value.video_id = bilibiliMatch[1];
        formData.value.video_platform = "Bilibili";
        return;
      }

      // Clear fields if the URL doesn't match
      formData.value.video_id = "";
      formData.value.video_platform = "";
    };

    // Function to format time input
    const formatTime = (value) => {
      let input = value.replace(/[^0-9]/g, "");
      if (input.length >= 2) input = input.slice(0, 2) + ":" + input.slice(2);
      if (input.length >= 5) input = input.slice(0, 5) + ":" + input.slice(5);
      return input.slice(0, 8);
    };

    // Watch the formattedTime ref for changes and update it accordingly
    watch(formattedTime, (newValue) => {
      formData.value.sequence_start_time = formatTime(newValue);
      formattedTime.value = formatTime(newValue);
    });

    const submitForm = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Retrieve access token from localStorage

        const response = await axios.post(
          `${BACKEND_URL}/api/newpost/${formData.value.id}`, // Include the post ID in the URL
          formData.value,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Pass access token in Authorization header
            },
          }
        );

        alert(response.data.message);
        // Navigate to the view page for the new post
        router.push(`/view/${formData.value.id}`);
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to add the new post.");
      }
    };

    return {
      formattedTime,
      formData,
      submitForm,
      extractVideoId,
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
