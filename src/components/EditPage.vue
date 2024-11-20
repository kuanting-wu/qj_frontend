<template>
  <main
    class="flex flex-row gap-8 px-8 py-6 bg-white min-w-[240px] max-md:px-4"
  >
    <!-- Left Section: Video and Metadata -->
    <section class="flex flex-col flex-1 gap-6">
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
        border="0"
        frameborder="no"
        framespacing="0"
        allowfullscreen="true"
        class="aspect-video w-full"
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
        <div class="flex justify-between items-center">
          <label
            for="title"
            class="text-2xl font-semibold text-gray-800 leading-tight"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            v-model="formData.title"
            required
            class="input-field w-2/3 border rounded"
            placeholder="Enter title"
          />
        </div>

        <!-- Metadata in Grid -->
        <div class="grid grid-cols-2 gap-x-24 gap-y-4">
          <!-- Movement Type -->
          <div class="flex justify-between items-center">
            <label for="movementType" class="font-semibold"
              >Movement Type</label
            >
            <input
              id="movementType"
              type="text"
              v-model="formData.movement_type"
              required
              class="input-field w-1/2 border rounded"
              placeholder="Enter movement type"
            />
          </div>

          <!-- Sequence Start Time -->
          <div class="flex justify-between items-center">
            <label for="sequenceStartTime" class="font-semibold"
              >Sequence Start Time</label
            >
            <input
              id="sequenceStartTime"
              type="text"
              v-model="formData.sequence_start_time"
              class="input-field w-1/2 border rounded"
              placeholder="hh:mm:ss"
              maxlength="8"
              required
            />
          </div>

          <!-- Starting Position -->
          <div class="flex justify-between items-center">
            <label for="startingPosition" class="font-semibold"
              >Starting Position</label
            >
            <input
              id="startingPosition"
              type="text"
              v-model="formData.starting_position"
              required
              class="input-field w-1/2 border rounded"
              placeholder="Enter starting position"
            />
          </div>

          <!-- Ending Position -->
          <div class="flex justify-between items-center">
            <label for="endingPosition" class="font-semibold"
              >Ending Position</label
            >
            <input
              id="endingPosition"
              type="text"
              v-model="formData.ending_position"
              required
              class="input-field w-1/2 border rounded"
              placeholder="Enter ending position"
            />
          </div>

          <!-- Public Status -->
          <div class="flex justify-between items-center">
            <label for="publicStatus" class="font-semibold"
              >Public Status</label
            >
            <select
              id="publicStatus"
              v-model="formData.public_status"
              required
              class="input-field w-1/2 border rounded"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <!-- Language -->
          <div class="flex justify-between items-center">
            <label for="language" class="font-semibold">Language</label>
            <select
              id="language"
              v-model="formData.language"
              required
              class="input-field w-1/2 border rounded"
            >
              <option value="en">English</option>
              <option value="tc">Traditional Chinese</option>
            </select>
          </div>
        </div>
      </div>
    </section>
    <!-- Right Section: Notes --->
    <section class="flex flex-col w-1/3 min-w-[240px] bg-white">
      <label for="notes" class="mb-2 font-semibold">Notes</label>
      <textarea
        id="notes"
        v-model="formData.notes"
        class="textarea-field flex-grow resize-none p-2 border rounded"
        placeholder="Enter notes here"
      ></textarea>
    </section>
  </main>
  <footer class="flex gap-6 justify-center items-center mt-6 py-4">
    <button
      type="button"
      class="overflow-hidden gap-2 self-stretch p-3 my-auto rounded-lg border border-solid bg-neutral-200 border-neutral-500 text-[color:var(--sds-color-text-default-default)]"
      @click="cancelEdit"
    >
      Cancel
    </button>
    <button
      type="submit"
      class="overflow-hidden gap-2 self-stretch p-3 my-auto rounded-lg border border-solid bg-zinc-800 border-zinc-800 text-white"
      @click="submitForm"
    >
      Submit
    </button>
    <button
      type="button"
      class="overflow-hidden gap-2 self-stretch p-3 my-auto rounded-lg border border-solid bg-red-500 border-red-500 text-white"
      @click="deletePost"
    >
      Delete
    </button>
  </footer>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { BACKEND_URL } from "../utils/config";

export default {
  props: ["postId"], // Define props to receive postId
  setup(props) {
    const router = useRouter(); // Initialize the router
    const formattedTime = ref("");
    const formData = ref({
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

    const fetchPostData = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/viewpost/${props.postId}`
        );
        formData.value = response.data;
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    const convertToSeconds = (time) => {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    };

    const getEmbedUrl = (videoId, platform, startTime) => {
      const startSeconds = convertToSeconds(startTime);
      if (platform === "YouTube") {
        return `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&rel=0`;
      } else if (platform === "Bilibili") {
        return `https://player.bilibili.com/player.html?bvid=${videoId}&t=${startSeconds}&no_related=1`;
      }
      return "";
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

    const cancelEdit = () => {
      router.push(`/view/${props.postId}`); // Navigate back to the view page of the current post
    };

    const deletePost = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Retrieve access token from localStorage

        const response = await axios.delete(
          `${BACKEND_URL}/api/deletepost/${props.postId}`, // Corrected template string
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Pass access token in Authorization header
            },
          }
        );

        alert(response.data.message); // Display a success message
        // Navigate back to the home page or another relevant page
        router.push(`/`);
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete the post.");
      }
    };

    const submitForm = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Retrieve access token from localStorage

        const response = await axios.put(
          `${BACKEND_URL}/api/editpost/${props.postId}`, // Corrected template string
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
        alert("Failed to update the post.");
      }
    };

    onMounted(() => {
      fetchPostData();
    });

    return {
      formattedTime,
      formData,
      cancelEdit,
      deletePost,
      submitForm,
      getEmbedUrl,
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
