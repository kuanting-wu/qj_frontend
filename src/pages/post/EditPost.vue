<template>
  <main
    class="flex flex-col h-auto px-8 py-8 bg-white dark:bg-gray-900 transition-colors duration-200 resizable-container">
    <div class="flex flex-col sm:flex-row h-full">
      <section ref="leftSection" class="flex flex-col gap-6 h-full overflow-auto" :style="{ width: videoWidth + '%' }">
        <VideoFrame :post="post" />
        <PostMetadata :post="post" :is-expanded="isExpanded" :is-mobile="isMobile"
          @set-current-time="setCurrentTimeAsStartTime" @save-post="savePost" @delete-post="deletePost" />
      </section>

      <ResizableDivider :initial-width="videoWidth" :min-width="20" :max-width="80"
        container-selector=".resizable-container" @update:width="updateVideoWidth" />

      <section class="flex flex-col bg-gray-50 dark:bg-gray-800 overflow-auto transition-colors duration-200"
        :style="{ width: (100 - videoWidth) + '%' }">
        <div class="flex-grow p-4 overflow-auto">
          <div v-if="loadingMarkdown" class="flex justify-center items-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
          <div v-else-if="markdownError" class="text-red-500 py-2">
            {{ markdownError }}
          </div>
          <MarkdownEditor v-else ref="markdownEditor" v-model="post.notes" label=""
            placeholder="Enter your notes in Markdown format. You can add headings, lists, code blocks, and more."
            hint="Use the toolbar to format your text or insert the current video timestamp."
            :videoTime="formattedCurrentTime" @request-time="getCurrentTime" />
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import { ref, watch, onMounted, nextTick } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { BACKEND_URL } from "@/utils/config";
import { convertToSeconds, formatSecondsToHMS } from "@/utils/time";
import MarkdownEditor from "@/components/content/MarkdownEditor.vue";
import apiClient from "@/utils/apiClient";
import PostMetadata from "@/components/content/PostMetadata.vue";
import ResizableDivider from "@/components/common/ResizableDivider.vue";
import VideoFrame from "@/components/content/VideoFrame.vue";
import postStructure from "@/data/postStructure.json";

export default {
  components: {
    MarkdownEditor,
    PostMetadata,
    ResizableDivider,
    VideoFrame,
    postStructure,
  },
  props: {
    id: String,
  },
  setup(props) {
    const post = ref({ ...postStructure }); // Changed from formData to post
    const player = ref(null);
    const currentTime = ref(0);
    const router = useRouter();
    const formattedTime = ref("");
    const formattedCurrentTime = ref("");
    const isExpanded = ref(true);
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const loadingMarkdown = ref(false);
    const markdownError = ref("");
    const videoWidth = ref(65);

    const updateVideoWidth = (newWidth) => {
      videoWidth.value = newWidth;
    };

    const loadYouTubeIframeAPI = () => {
      return new Promise((resolve) => {
        if (window.YT) return resolve();
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };

    const initializePlayer = async () => {
      const iframeElement = document.getElementById("video-iframe");
      await loadYouTubeIframeAPI();
      if (window.YT && iframeElement) {
        player.value = new window.YT.Player("video-iframe", {
          events: {
            onReady: () => console.log("YouTube player is ready"),
            onError: (error) => console.error("Error initializing YouTube player:", error),
          },
        });
      } else {
        console.error("YT.Player or iframe not found.");
      }
    };

    watch(
      () => post.value.videoId,
      (newVideoId) => {
        if (newVideoId) {
          nextTick(() => {
            const iframe = document.getElementById("video-iframe");
            if (iframe) initializePlayer();
            else console.error("Iframe not found.");
          });
        }
      }
    );

    const fetchPostData = async () => {
      try {
        const response = await apiClient.get(`/viewpost/${props.id}`);
        post.value = response.data; // Updated to post
        console.log(post.value);
        if (post.value.notesPath || post.value.markdownUrl) {
          await fetchMarkdownContent();
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    const fetchMarkdownContent = async () => {
      if (!post.value.notesPath && !post.value.markdownUrl) {
        console.log('No markdown path available, skipping fetch');
        return;
      }
      loadingMarkdown.value = true;
      markdownError.value = "";
      try {
        const markdownUrl = post.value.markdownUrl || post.value.notesPath;
        console.log(`Fetching markdown from: ${markdownUrl}`);
        post.value.originalMarkdownUrl = markdownUrl;
        const urlWithCacheBuster = `${markdownUrl}?t=${new Date().getTime()}`;
        const response = await axios.get(urlWithCacheBuster);
        post.value.notes = response.data;
        console.log('Markdown content loaded successfully');
      } catch (error) {
        console.error("Error fetching markdown:", error);
        markdownError.value = "Failed to load markdown content. Please try again.";
      } finally {
        loadingMarkdown.value = false;
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

    watch(formattedTime, (newValue) => {
      post.value.sequenceStartTime = formatSecondsToHMS(newValue); // Updated to post
      formattedTime.value = formatSecondsToHMS(newValue);
    });

    const getCurrentTime = () => {
      const iframeElement = document.getElementById("video-iframe");
      formattedCurrentTime.value = "";
      if (iframeElement && post.value.videoPlatform === "Bilibili") {
        iframeElement.contentWindow.postMessage(
          { event: "getCurrentTime" },
          "http://api.bilibili.com/"
        );
        const messageHandler = (event) => {
          if (event.origin === "https://player.bilibili.com" && event.data?.event === "timeupdate") {
            currentTime.value = event.data.currentTime;
            formattedCurrentTime.value = formatSecondsToHMS(event.data.currentTime);
          }
        };
        window.removeEventListener("message", messageHandler);
        window.addEventListener("message", messageHandler);
      } else if (post.value.videoPlatform === "YouTube") {
        if (player.value && typeof player.value.getCurrentTime === "function") {
          const timeInSeconds = player.value.getCurrentTime();
          currentTime.value = timeInSeconds;
          setTimeout(() => {
            formattedCurrentTime.value = formatSecondsToHMS(timeInSeconds);
          }, 10);
        } else {
          console.error("YouTube player instance or getCurrentTime method not found.");
        }
      } else {
        console.error("Unsupported platform or iframe/player element unavailable.");
      }
    };

    const deletePost = async () => {
      try {
        const response = await apiClient.delete(`/deletepost/${props.id}`);
        alert(response.data.message);
        router.push(`/`);
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete the post.");
      }
    };

    const savePost = async () => {
      try {
        const postData = { ...post.value }; // Updated to post
        if (postData.markdownUrl || postData.notesPath) {
          postData.updateMarkdown = true; // Adjusted to camelCase
        }
        console.log(`Sending save request to: /editpost/${props.id}`);
        const accessToken = localStorage.getItem("accessToken");
        const endpoint = `${BACKEND_URL}/editpost/${props.id}`;
        console.log(`Request URL: ${endpoint}`);
        const response = await axios({
          method: 'put',
          url: endpoint,
          data: postData,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        });
        console.log("Save response:", response.data);
        if (response.data.markdownUrl) post.value.markdownUrl = response.data.markdownUrl;
        if (response.data.notesPath) post.value.notesPath = response.data.notesPath;
        alert(response.data.message);
        router.push(`/viewpost/${post.value.id}`);
      } catch (error) {
        console.error("Error submitting form:", error);
        if (error.response) {
          console.error("Response error:", error.response.status, error.response.data);
          if (error.response.status === 0 || error.message.includes('CORS')) {
            alert("CORS Error: Your request was blocked due to cross-origin restrictions. Please contact the administrator.");
          } else if (error.response.status === 401) {
            alert("Authentication error: Please sign in again.");
            router.push('/signin');
          } else {
            alert(`Error (${error.response.status}): ${error.response.data.message || "Failed to update the post."}`);
          }
        } else if (error.request) {
          console.error("No response received:", error.request);
          alert("Network error: No response received from server. Please check your internet connection.");
        } else {
          console.error("Request error:", error.message);
          alert("Failed to update the post: " + error.message);
        }
      }
    };

    onMounted(async () => {
      fetchPostData();
    });

    const setCurrentTimeAsStartTime = () => {
      const iframeElement = document.getElementById("video-iframe");
      if (iframeElement && post.value.videoPlatform === "Bilibili") {
        iframeElement.contentWindow.postMessage(
          { event: "getCurrentTime" },
          "http://api.bilibili.com/"
        );
        const messageHandler = (event) => {
          if (event.origin === "https://player.bilibili.com" && event.data?.event === "timeupdate") {
            const time = event.data.currentTime;
            post.value.sequenceStartTime = formatSecondsToHMS(time); // Updated to post
            window.removeEventListener("message", messageHandler);
          }
        };
        window.addEventListener("message", messageHandler);
      } else if (post.value.videoPlatform === "YouTube") {
        if (player.value && typeof player.value.getCurrentTime === "function") {
          const timeInSeconds = player.value.getCurrentTime();
          post.value.sequenceStartTime = formatSecondsToHMS(timeInSeconds); // Updated to post
        } else {
          console.error("YouTube player instance or getCurrentTime method not found.");
        }
      } else {
        console.error("Unsupported platform or iframe/player element unavailable.");
      }
    };

    return {
      formattedTime,
      formattedCurrentTime,
      post, // Updated to post
      isExpanded,
      isMobile,
      deletePost,
      savePost,
      getEmbedUrl,
      getCurrentTime,
      setCurrentTimeAsStartTime,
      videoWidth,
      updateVideoWidth,
      loadingMarkdown,
      markdownError,
    };
  },
};
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar,
section::-webkit-scrollbar {
  display: none;
}

section,
.overflow-y-auto {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

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