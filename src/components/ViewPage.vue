<template>
  <main class="flex flex-col px-24 py-16 bg-white min-w-[240px] max-md:px-5">
    <section
      class="flex flex-wrap flex-1 content-center gap-8 size-full max-md:max-w-full"
    >
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
        scrolling=""
        border="0"
        frameborder="no"
        framespacing="0"
        allowfullscreen="true"
        class="aspect-video flex-1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
      >
      </iframe>
      <img
        v-else
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/2f69a4548ace8090c05433e11f57f205ac0b85a8b70f1642dc2ef2de05544a72?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1"
        alt="Video thumbnail"
        class="object-contain flex-1 shrink self-stretch aspect-[1.86] basis-0 h-[360px] min-h-[360px] min-w-[640px] w-[640px] max-md:max-w-full"
      />

      <div class="flex flex-col py-2 min-w-[240px] w-[350px]">
        <header class="flex overflow-hidden gap-2.5 items-center w-full">
          <h1
            class="flex flex-1 shrink gap-2.5 items-center self-stretch py-1 my-auto text-2xl tracking-tight leading-tight basis-0 font-[number:var(--sds-typography-heading-font-weight)] min-w-[240px] text-[color:var(--sds-color-text-default-default)]"
          >
            {{ post.title || "Title Unavailable" }}
          </h1>
          <router-link
            :to="editPageLink"
            class="flex gap-2.5 justify-center items-center self-stretch my-auto w-6"
            aria-label="More options"
          >
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/4728a160951595f6e5389159b3e8e714f7e82c751a59139a4751cce2c9ca8e56?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1"
              alt="More options"
              class="object-contain self-stretch my-auto w-6 aspect-square"
            />
          </router-link>
        </header>
        <router-link
          :to="profileLink"
          class="flex gap-4 items-center mt-4 w-full whitespace-nowrap text-[length:var(--sds-typography-body-size-medium)]"
        >
          <div
            class="flex gap-3 items-start self-stretch my-auto leading-snug w-[139px]"
          >
            <img
              :src="post.avatar_url"
              alt="User avatar"
              class="object-contain shrink-0 w-10 rounded-full aspect-square"
            />
            <div
              class="flex flex-col flex-1 shrink justify-between basis-0 min-h-[46px]"
            >
              <div class="font-semibold text-gray-600">
                {{ post.name || "Anonymous" }}
              </div>
              <div class="text-gray-500">
                {{ post.belt || "No rank" }}
              </div>
            </div>
          </div>
        </router-link>

        <!-- Post details section -->
        <div
          class="flex flex-col mt-4 w-full leading-snug text-black bg-white text-[length:var(--sds-typography-body-size-medium)]"
        >
          <div
            class="flex overflow-hidden gap-10 justify-between items-center w-full bg-white"
          >
            <div class="self-stretch my-auto font-semibold">Movement Type</div>
            <div class="self-stretch my-auto">
              {{ post.movement_type || "Not specified" }}
            </div>
          </div>
          <div
            class="flex overflow-hidden gap-10 justify-between items-center mt-1 w-full bg-white"
          >
            <div class="self-stretch my-auto font-semibold">
              Starting Position
            </div>
            <div class="self-stretch my-auto">
              {{ post.starting_position || "Not specified" }}
            </div>
          </div>
          <div
            class="flex overflow-hidden gap-10 justify-between items-center mt-1 w-full bg-white"
          >
            <div class="self-stretch my-auto font-semibold">
              Ending Position
            </div>
            <div class="self-stretch my-auto">
              {{ post.ending_position || "Not specified" }}
            </div>
          </div>
          <div
            class="flex overflow-hidden gap-10 justify-between items-center mt-1 w-full bg-white"
          >
            <div class="self-stretch my-auto font-semibold">
              Sequence Start Time
            </div>
            <div class="self-stretch my-auto">
              {{ post.sequence_start_time || "Not specified" }}
            </div>
          </div>
          <div
            class="flex overflow-hidden gap-10 justify-between items-center mt-1 w-full bg-white"
          >
            <div class="self-stretch my-auto font-semibold">Public Status</div>
            <div class="self-stretch my-auto">
              {{ post.public_status || "Not specified" }}
            </div>
          </div>
          <div
            class="flex overflow-hidden gap-10 justify-between items-center mt-1 w-full whitespace-nowrap bg-white"
          >
            <div class="self-stretch my-auto font-semibold">Language</div>
            <div class="self-stretch my-auto">
              {{ post.language || "Not specified" }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Notes section -->
    <section
      v-if="parsedNotes.length"
      class="flex flex-col py-8 mt-6 w-full leading-snug bg-white text-[length:var(--sds-typography-body-size-medium)] max-md:max-w-full"
    >
      <h2
        class="tracking-tight leading-tight whitespace-nowrap font-semibold text-black text-base"
      >
        Notes
      </h2>
      <ul class="list-none p-0">
        <li
          class="flex overflow-hidden flex-wrap gap-2.5 items-center mt-4 w-full bg-white max-md:max-w-full"
          v-for="(note, index) in parsedNotes"
          :key="index"
        >
          <time
            class="text-blue-600 cursor-pointer"
            @click="seekToTimestamp(note.timestamp)"
          >
            {{ note.timestamp }}
          </time>
          <p class="text-black">{{ note.text }}</p>
        </li>
      </ul>
    </section>

    <!-- Comments section -->
    <section
      class="flex flex-col py-8 mt-6 w-full leading-snug bg-white text-[length:var(--sds-typography-body-size-medium)] max-md:max-w-full"
    >
      <h2
        class="tracking-tight leading-tight whitespace-nowrap font-semibold text-black text-base"
      >
        Comments
      </h2>
      <article
        class="flex flex-wrap gap-2 items-start py-2 mt-4 w-full rounded-lg min-w-[240px] max-md:max-w-full"
      >
        <!-- Static sample comment - replace with dynamic comments if needed -->
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/627b91dced9c8426bf48fc2d969a954670a66ff70203371f9ab4ba516f040d25?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1"
          alt="Reviewer avatar"
          class="object-contain shrink-0 w-10 rounded-full aspect-square"
        />
        <div
          class="flex flex-col flex-1 shrink basis-0 min-w-[240px] max-md:max-w-full"
        >
          <header class="flex gap-2 items-start self-start">
            <h3 class="font-semibold text-gray-600">Reviewer name</h3>
            <time class="text-gray-500">Date</time>
          </header>
          <p class="text-black">Review body</p>
        </div>
      </article>
    </section>
  </main>
</template>

<script>
import axios from "axios";
import { ref, onMounted, watch, computed } from "vue";

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

    const fetchPostData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/viewpost/${props.postId}`
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
        return `https://player.bilibili.com/player.html?bvid=${videoId}&t=${startSeconds}`;
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
    };
  },
};
</script>
