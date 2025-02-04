<template>
  <main class="flex flex-col lg:flex-row gap-4 lg:gap-8 px-8 py-8 bg-white">
    <!-- Left Section: Video and Metadata -->
    <section class="flex lg:w-2/3 flex-col gap-6">
      <!-- Video -->
      <iframe
        id="video-iframe"
        v-if="post.video_id"
        :src="
          getEmbedUrl(
            post.video_id,
            post.video_platform,
            post.sequence_start_time
          )
        "
        width="100%"
        height="auto"
        scrolling="no"
        border="0"
        frameborder="no"
        framespacing="0"
        allowfullscreen="true"
        class="aspect-video rounded-lg shadow-sm"
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
        <header class="flex items-center gap-2 justify-between">
          <h1
            class="text-2xl font-semibold text-gray-800 leading-tight truncate-title"
          >
            {{ post.title || "Title Unavailable" }}
          </h1>
          <router-link
            v-if="post.user_name === currentUser"
            :to="editPageLink"
            class="flex items-center justify-center w-6 h-6"
            aria-label="Edit"
          >
            <img
              loading="lazy"
              src="@/assets/icons/Edit.svg"
              alt="Edit"
              class="object-contain w-6 h-6"
            />
          </router-link>
        </header>

        <div class="flex flex-col gap-4">
          <!-- User Info -->
          <div class="flex items-center justify-between gap-4">
            <router-link
              v-if="profileLink"
              :to="profileLink"
              class="flex gap-4 items-center"
            >
              <img
                :src="post.avatar_url"
                alt="User avatar"
                class="w-12 h-12 rounded-full"
              />
              <div>
                <div class="font-medium text-gray-600">
                  {{ post.name || "Anonymous" }}
                </div>
                <div class="text-gray-500">
                  {{ post.belt || "No rank" }}
                </div>
              </div>
            </router-link>
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

          <!-- Metadata in Two Columns -->
          <div
            v-if="isExpanded || !isMobile"
            class="flex flex-col lg:flex-row gap-x-2 lg:gap-x-24"
            :class="{
              'h-auto': isExpanded,
              'h-12 overflow-hidden': !isExpanded,
            }"
          >
            <div class="flex flex-1 flex-col">
              <div class="flex justify-between">
                <span class="font-semibold truncate">Movement Type</span>
                <span>{{ post.movement_type || "Not specified" }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold truncate">Starting Position</span>
                <span>{{ post.starting_position || "Not specified" }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold truncate">Ending Position</span>
                <span>{{ post.ending_position || "Not specified" }}</span>
              </div>
            </div>
            <div class="flex flex-1 flex-col">
              <div class="flex justify-between">
                <span class="font-semibold truncate">Sequence Start Time</span>
                <span>{{ post.sequence_start_time || "Not specified" }}</span>
              </div>

              <div class="flex justify-between">
                <span class="font-semibold truncate">Public Status</span>
                <span>{{ post.public_status || "Not specified" }}</span>
              </div>

              <div class="flex justify-between">
                <span class="font-semibold truncate">Language</span>
                <span>{{ post.language || "Not specified" }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Right Section: Notes -->
    <section v-if="parsedNotes.length" class="flex lg:w-1/3 flex-col bg-white">
      <h2 class="text-lg font-semibold text-gray-800">Notes</h2>
      <ul class="list-none p-0 mt-0 lg:mt-4">
        <li
          class="flex items-start gap-2 mt-1 lg:mt-4"
          v-for="(note, index) in parsedNotes"
          :key="index"
        >
          <time
            class="text-blue-600 cursor-pointer"
            @click="seekToTimestamp(note.timestamp)"
          >
            {{ note.timestamp }}
          </time>
          <p class="text-gray-700">{{ note.text }}</p>
        </li>
      </ul>
    </section>
  </main>
</template>


<script>
import axios from "axios";
import { ref, onMounted, watch, computed, nextTick } from "vue";
import { getUserFromToken } from "../utils/auth";
import { BACKEND_URL } from "@/utils/config";
import { convertToSeconds } from "@/utils/time";

export default {
  name: "PostDetail",
  props: ["postId"],
  setup(props) {
    const post = ref({
      id: "",
      title: "",
      video_id: "",
      video_platform: "",
      movement_type: "",
      starting_position: "",
      ending_position: "",
      sequence_start_time: "",
      public_status: "",
      language: "",
      notes: "",
      user_name: "",
      avatar_url: "",
      name: "",
      belt: "",
    });
    const player = ref(null);
    const isExpanded = ref(true);
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const profileLink = computed(() => {
      return post.value.user_name ? `/profile/${post.value.user_name}` : null;
    });
    const editPageLink = computed(() => `/edit/${props.postId}`);
    const currentUser = getUserFromToken();

    const fetchPostData = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/viewpost/${props.postId}`
        );
        post.value = response.data;
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    watch(() => props.postId, fetchPostData);

    const getEmbedUrl = (videoId, platform, startTime) => {
      const startSeconds = convertToSeconds(startTime);
      if (platform === "YouTube") {
        return `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&rel=0&enablejsapi=1`;
      } else if (platform === "Bilibili") {
        return `https://player.bilibili.com/player.html?bvid=${videoId}&t=${startSeconds}&no_related=1`;
      }
      return "";
    };

    const parsedNotes = computed(() => {
      const notesArray = [];
      if (post.value && post.value.notes) {
        const regex = /(\d{2}:\d{2}:\d{2})\s+([^0-9]*)/g;
        let match;
        while ((match = regex.exec(post.value.notes)) !== null) {
          notesArray.push({
            timestamp: match[1],
            text: match[2].trim(),
          });
        }
      }
      return notesArray;
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
          videoId: post.value.video_id,
          playerVars: {
            rel: 0, // Disable related videos
            // Other player parameters you might need
          },
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
      () => post.value.video_id,
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

    const seekToTimestamp = (timestamp) => {
      const seconds = convertToSeconds(timestamp);

      if (post.value.video_platform === "YouTube") {
        // Use the YouTube API to seek
        if (player.value && typeof player.value.seekTo === "function") {
          player.value.seekTo(seconds, true); // Seek to the time
          player.value.playVideo(); // Optionally play the video
        } else {
          console.error("YouTube Player is not initialized.");
        }
      } else if (post.value.video_platform === "Bilibili") {
        // Fallback to the old method for Bilibili
        const iframe = document.getElementById("video-iframe");
        if (iframe) {
          const platform = post.value.video_platform;
          iframe.src = getEmbedUrl(post.value.video_id, platform, timestamp);
        }
      } else {
        console.error("Unsupported platform:", post.value.video_platform);
      }
    };

    onMounted(() => {
      fetchPostData();
    });

    return {
      post,
      getEmbedUrl,
      profileLink,
      editPageLink,
      parsedNotes,
      seekToTimestamp,
      currentUser,
      isExpanded,
      isMobile,
    };
  },
};
</script>
<style scoped>
@media (max-width: 768px) {
  #video-iframe {
    width: 100%; /* Full width on smaller screens */
    height: auto; /* Maintain aspect ratio */
    border-radius: 8px; /* Optional: Add rounded corners */
  }
}
.truncate-title {
  white-space: nowrap; /* Prevent wrapping */
  overflow: hidden; /* Hide the overflow text */
  text-overflow: ellipsis; /* Show ellipsis for overflowing text */
}
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>