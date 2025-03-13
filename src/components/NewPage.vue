<template>
  <main
    class="flex items-top justify-center min-h-screen px-8 py-8 bg-white md:px-20 md:py-20 font-[number:var(--sds-typography-body-font-weight-regular)] text-[length:var(--sds-typography-body-size-medium)]"
  >
    <section
      class="flex flex-col gap-4 items-center w-full max-w-md"
    >
      <form
        @submit.prevent="nextForm"
        class="flex flex-col gap-4 items-center w-full max-w-md"
      >
        <div class="mb-6">
          <label for="videoUrl" class="block text-base font-medium text-gray-700 mb-1"
            >Enter Video URL</label
          >
          <input
            id="videoUrl"
            type="text"
            v-model="formData.video_url"
            @input="extractVideoId"
            required
            class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
            placeholder="Enter YouTube or Bilibili URL"
          />
        </div>
        
        <div class="mb-6">
          <label for="title" class="block text-base font-medium text-gray-700 mb-1"
            >Title (Optional)</label
          >
          <input
            id="title"
            type="text"
            v-model="formData.title"
            class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
            placeholder="Enter a title for your post"
          />
          <p class="text-xs text-gray-500 mt-1">
            If left blank, a default title will be generated.
          </p>
        </div>
        
        <!-- Three-column layout for technique details -->
        <div class="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Column 1: Movement Type, Gi/No-Gi, Practitioner -->
          <div class="flex flex-col space-y-4">
            <div>
              <label for="movementType" class="block text-base font-medium text-gray-700 mb-1"
                >Movement Type</label
              >
              <select
                id="movementType"
                v-model="formData.movement_type"
                required
                class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
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
            
            <div>
              <label for="giNogi" class="block text-base font-medium text-gray-700 mb-1"
                >Gi / No-Gi</label
              >
              <select
                id="giNogi"
                v-model="formData.gi_nogi"
                required
                class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
              >
                <option value="Gi">Gi</option>
                <option value="No-Gi">No-Gi</option>
                <option value="Both">Both</option>
              </select>
            </div>
            
            <div>
              <label for="practitioner" class="block text-base font-medium text-gray-700 mb-1"
                >Practitioner / Instructor</label
              >
              <input
                id="practitioner"
                type="text"
                v-model="formData.practitioner"
                placeholder="Enter name of instructor or practitioner"
                class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
              />
            </div>
          </div>
          
          <!-- Column 2: Starting/Ending Positions -->
          <div class="flex flex-col space-y-4">
            <div>
              <label for="startingPosition" class="block text-base font-medium text-gray-700 mb-1"
                >Starting Position</label
              >
              <select
                id="startingPosition"
                v-model="formData.starting_position"
                required
                class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
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
            
            <div>
              <label for="startingTopBottom" class="block text-base font-medium text-gray-700 mb-1"
                >Starting Position Type</label
              >
              <select
                id="startingTopBottom"
                v-model="formData.starting_top_bottom"
                required
                class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
              >
                <option value="TOP">Top</option>
                <option value="BOTTOM">Bottom</option>
                <option value="NEUTRAL">Neutral</option>
              </select>
            </div>
            
            <div>
              <label for="endingPosition" class="block text-base font-medium text-gray-700 mb-1"
                >Ending Position</label
              >
              <select
                id="endingPosition"
                v-model="formData.ending_position"
                required
                class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
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
            
            <div>
              <label for="endingTopBottom" class="block text-base font-medium text-gray-700 mb-1"
                >Ending Position Type</label
              >
              <select
                id="endingTopBottom"
                v-model="formData.ending_top_bottom"
                required
                class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
              >
                <option value="TOP">Top</option>
                <option value="BOTTOM">Bottom</option>
                <option value="NEUTRAL">Neutral</option>
              </select>
            </div>
          </div>
          
          <!-- Column 3: Sequence Start Time, Public Status, Language -->
          <div class="flex flex-col space-y-4">
            <div>
              <label for="sequenceStartTime" class="block text-base font-medium text-gray-700 mb-1"
                >Sequence Start Time</label
              >
              <input
                id="sequenceStartTime"
                type="text"
                v-model="formData.sequence_start_time"
                class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                placeholder="hh:mm:ss"
                maxlength="8"
                required
              />
            </div>
            
            <div>
              <label for="publicStatus" class="block text-base font-medium text-gray-700 mb-1"
                >Public Status</label
              >
              <select
                id="publicStatus"
                v-model="formData.public_status"
                required
                class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
              >
                <option value="public">Public</option>
                <option value="subscribers">Subscribers Only</option>
                <option value="private">Private</option>
              </select>
            </div>
            
            <div>
              <label for="language" class="block text-base font-medium text-gray-700 mb-1"
                >Language</label
              >
              <select
                id="language"
                v-model="formData.language"
                required
                class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
              >
                <option value="English">English</option>
                <option value="Japanese">Japanese</option>
                <option value="Traditional Chinese">Traditional Chinese</option>
              </select>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create Post
        </button>
      </form>
    </section>
  </main>
</template>


<script>
import { ref, watch, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { BACKEND_URL } from "../utils/config";

export default {
  setup() {
    const router = useRouter(); // Initialize the router
    const formattedTime = ref("");
    const formData = ref({
      video_url: "", // Added explicitly for the form input
      title: "",
      video_id: "",
      video_platform: "",
      movement_type: "",
      starting_position: "",
      starting_top_bottom: "NEUTRAL", // New field with default NEUTRAL
      ending_position: "",
      ending_top_bottom: "NEUTRAL", // New field with default NEUTRAL
      gi_nogi: "Gi", // New field with default Gi
      practitioner: "", // New field for practitioner/instructor
      sequence_start_time: "00:00:00", // Default to start of video
      public_status: "public",
      language: "English",
      notes: "",
    });

    // Function to extract video ID based on platform
    const extractVideoId = () => {
      const url = formData.value.video_url;

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
        // Check if video_id and video_platform were extracted properly
        if (!formData.value.video_id || !formData.value.video_platform) {
          alert("Please enter a valid YouTube or Bilibili video URL");
          return;
        }

        // Set default title if not provided
        if (!formData.value.title) {
          formData.value.title = `Video ${formData.value.video_id}`;
        }

        // Set default values for required fields
        if (!formData.value.movement_type) {
          formData.value.movement_type = "General";
        }

        if (!formData.value.starting_position) {
          formData.value.starting_position = "Not Specified";
        }

        if (!formData.value.ending_position) {
          formData.value.ending_position = "Not Specified";
        }

        // Make sure we have a valid time format (HH:MM:SS)
        if (!formData.value.sequence_start_time || !/^\d{2}:\d{2}:\d{2}$/.test(formData.value.sequence_start_time)) {
          formData.value.sequence_start_time = "00:00:00";
        }

        const accessToken = localStorage.getItem("accessToken"); // Retrieve access token from localStorage

        // Send only the necessary fields to the backend (remove video_url)
        const postData = {
          title: formData.value.title,
          video_id: formData.value.video_id,
          video_platform: formData.value.video_platform,
          movement_type: formData.value.movement_type,
          starting_position: formData.value.starting_position,
          starting_top_bottom: formData.value.starting_top_bottom,
          ending_position: formData.value.ending_position,
          ending_top_bottom: formData.value.ending_top_bottom,
          gi_nogi: formData.value.gi_nogi,
          practitioner: formData.value.practitioner,
          sequence_start_time: formData.value.sequence_start_time,
          public_status: formData.value.public_status,
          language: formData.value.language,
          notes: formData.value.notes
        };

        const response = await axios.post(
          `${BACKEND_URL}/newpost`, // No ID in URL anymore - server will generate it
          postData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Pass access token in Authorization header
            },
          }
        );

        // Get the post ID from the response
        const postId = response.data.post_id;

        alert(response.data.message);
        // Navigate to the edit page for the new post using the ID from response
        router.push(`/editpost/${postId}`);
      } catch (error) {
        console.error("Error continuing to next form:", error);
        if (error.response?.data?.error) {
          alert(error.response.data.error);
        } else {
          alert("Failed to add the new post.");
        }
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
