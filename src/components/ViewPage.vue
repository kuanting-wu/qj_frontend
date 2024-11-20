<template>
  <main
    class="flex flex-row gap-8 px-8 py-8 bg-white min-w-[240px] max-md:px-4"
  >
    <!-- Left Section: Video and Metadata -->
    <section class="flex flex-col flex-1 gap-6">
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
        <header class="flex items-center gap-2 justify-between">
          <h1 class="text-2xl font-semibold text-gray-800 leading-tight">
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
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/4728a160951595f6e5389159b3e8e714f7e82c751a59139a4751cce2c9ca8e56?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1"
              alt="Edit"
              class="object-contain w-6 h-6"
            />
          </router-link>
        </header>

        <div class="flex flex-col gap-4">
          <!-- User Info -->
          <div class="flex items-center gap-4">
            <router-link :to="profileLink" class="flex gap-4 items-center">
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
          </div>

          <!-- Metadata in Two Columns -->
          <div class="grid grid-cols-2 gap-x-24 gap-4">
            <div class="flex justify-between">
              <span class="font-semibold">Movement Type</span>
              <span>{{ post.movement_type || "Not specified" }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-semibold">Sequence Start Time</span>
              <span>{{ post.sequence_start_time || "Not specified" }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-semibold">Starting Position</span>
              <span>{{ post.starting_position || "Not specified" }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-semibold">Public Status</span>
              <span>{{ post.public_status || "Not specified" }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-semibold">Ending Position</span>
              <span>{{ post.ending_position || "Not specified" }}</span>
            </div>

            <div class="flex justify-between">
              <span class="font-semibold">Language</span>
              <span>{{ post.language || "Not specified" }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Right Section: Notes -->
    <section
      v-if="parsedNotes.length"
      class="flex flex-col w-1/3 min-w-[240px] bg-white"
    >
      <h2 class="text-lg font-semibold text-gray-800">Notes</h2>
      <ul class="list-none p-0 mt-4">
        <li
          class="flex items-start gap-2 mt-4"
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
import { ref, onMounted, watch, computed } from "vue";
import { getUserFromToken } from "../utils/auth";
import { BACKEND_URL } from "../utils/config";

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

    const profileLink = computed(() => `/profile/${post.value.user_name}`);
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

    const seekToTimestamp = (timestamp) => {
      const seconds = convertToSeconds(timestamp);
      const iframe = document.getElementById("video-iframe");
      if (iframe) {
        const platform = post.value.video_platform;
        iframe.src = getEmbedUrl(post.value.video_id, platform, timestamp);
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
    };
  },
};
</script>
