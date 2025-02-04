<template>
  <main class="flex flex-col lg:flex-row gap-8 px-8 py-8 bg-white">
    <!-- Left Section: Video and Metadata -->
    <section class="flex lg:w-2/3 flex-col gap-6">
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
          <button
            class="flex items-center justify-center w-6 h-6 rounded-lg lg:hidden"
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
        </div>

        <div
          v-if="isExpanded || !isMobile"
          class="flex flex-col lg:flex-row gap-x-2 lg:gap-x-24"
          :class="{
            'h-auto': isExpanded,
            'h-12 overflow-hidden': !isExpanded,
          }"
        >
          <div class="flex flex-1 flex-col">
            <div class="flex justify-between items-center">
              <label for="movementType" class="font-semibold truncate"
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
            <div class="flex justify-between items-center">
              <label for="startingPosition" class="font-semibold truncate"
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
            <div class="flex justify-between items-center">
              <label for="endingPosition" class="font-semibold truncate"
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
          </div>
          <div class="flex flex-1 flex-col">
            <div class="flex justify-between items-center">
              <label for="sequenceStartTime" class="font-semibold truncate"
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
            <div class="flex justify-between items-center">
              <label for="publicStatus" class="font-semibold truncate"
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
            <div class="flex justify-between items-center">
              <label for="language" class="font-semibold truncate"
                >Language</label
              >
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
      </div>
    </section>
    <!-- Right Section: Notes --->
    <section class="flex flex-col lg:w-1/3 bg-white">
      <div class="flex justify-between items-center mb-2">
        <div class="flex gap-4">
          <!-- Notes Label -->
          <label for="notes" class="font-semibold">Notes</label>
          <!-- Time Button -->
          <button
            type="button"
            class="flex items-center rounded"
            @click="getCurrentTime"
          >
            <img src="@/assets/icons/Time.svg" alt="Time" class="w-5 h-5" />
          </button>
          <!-- Code Button -->
          <button
            type="button"
            class="flex items-center rounded"
            @click="codeMode"
          >
            <img src="@/assets/icons/Code.svg" alt="Code" class="w-5 h-5" />
          </button>
          <!-- Save Button -->
          <button
            type="button"
            class="flex items-center rounded"
            @click="savePost"
          >
            <img src="@/assets/icons/Save.svg" alt="Save" class="w-5 h-5" />
          </button>
        </div>
        <div class="flex gap-4">
          <!-- Trash Button -->
          <button
            type="button"
            class="flex items-center rounded"
            @click="deletePost"
          >
            <img src="@/assets/icons/Trash.svg" alt="Trash" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div v-if="isCodeMode">
        <!-- If code mode is on, use markdown editor (like EasyMDE or another) -->
        <easymde v-model="formData.notes" :options="editorOptions" />
      </div>
      <div v-else class="flex flex-col flex-grow min-h-[240px]">
        <!-- Otherwise, use a regular textarea -->
        <textarea
          id="notes"
          v-model="formData.notes"
          class="textarea-field flex-grow resize-none p-2 border rounded"
          placeholder="Enter notes here"
        ></textarea>
      </div>
    </section>
  </main>
</template>

<script>
import { ref, watch, onMounted, nextTick } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { BACKEND_URL } from "@/utils/config";
import { convertToSeconds, formatSecondsToHMS } from "@/utils/time";
import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";

export default {
  props: ["postId"], // Define props to receive postId
  setup(props) {
    const player = ref(null);
    const currentTime = ref(0);
    const router = useRouter(); // Initialize the router
    const formattedTime = ref("");
    const isCodeMode = ref(false);
    const isExpanded = ref(true);
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
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
        const response = await axios.get(
          `${BACKEND_URL}/api/viewpost/${props.postId}`
        );
        formData.value = response.data;
      } catch (error) {
        console.error("Error fetching post data:", error);
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

      console.log("getCurrentTime invoked");

      // Bilibili 平台处理逻辑
      if (iframeElement && formData.value.video_platform === "Bilibili") {
        console.log("Detected Bilibili platform");

        // 向 iframe 发送获取当前时间的消息
        iframeElement.contentWindow.postMessage(
          {
            event: "getCurrentTime",
          },
          "http://api.bilibili.com/"
        );

        console.log("Message sent to Bilibili iframe");

        // 添加全局监听器，确保不重复绑定
        const messageHandler = (event) => {
          if (event.origin === "https://player.bilibili.com") {
            console.log("Received data:", event.data);

            if (event.data && event.data.event === "timeupdate") {
              console.log("当前播放时间:", event.data.currentTime);
              currentTime.value = event.data.currentTime;

              const formattedTime = formatSecondsToHMS(event.data.currentTime);
              formData.value.notes =
                `${formData.value.notes.trim()}\n${formattedTime}`.trim();
            }
          }
        };

        // 移除之前的监听器（如果有）
        window.removeEventListener("message", messageHandler);
        // 添加新的监听器
        window.addEventListener("message", messageHandler);
      }

      // YouTube 平台处理逻辑
      else if (formData.value.video_platform === "YouTube") {
        console.log("Detected YouTube platform");

        if (player.value && typeof player.value.getCurrentTime === "function") {
          const timeInSeconds = player.value.getCurrentTime();
          currentTime.value = timeInSeconds;

          const formattedTime = formatSecondsToHMS(timeInSeconds);
          formData.value.notes =
            `${formData.value.notes.trim()}\n${formattedTime}`.trim();
        } else {
          console.error(
            "YouTube player instance or getCurrentTime method not found."
          );
        }
      }

      // 不支持的平台或错误情况
      else {
        console.error(
          "Unsupported platform or iframe/player element unavailable."
        );
      }
    };

    const editorOptions = {
      autoDownloadFontAwesome: true,
      spellChecker: false,
    };

    const codeMode = () => {
      isCodeMode.value = !isCodeMode.value; // Toggle the codeMode state
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

    const savePost = async () => {
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

    onMounted(async () => {
      fetchPostData();
      if (isCodeMode.value) {
        new EasyMDE({ element: document.getElementById("notes") });
      }
    });

    return {
      formattedTime,
      formData,
      isCodeMode,
      editorOptions,
      isExpanded,
      isMobile,
      codeMode,
      deletePost,
      savePost,
      getEmbedUrl,
      getCurrentTime,
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
