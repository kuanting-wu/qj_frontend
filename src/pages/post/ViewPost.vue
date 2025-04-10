<template>
  <main class="flex flex-col min-h-screen px-8 py-8 bg-white dark:bg-gray-900 transition-colors duration-200">
    <div class="flex flex-col sm:flex-row resizable-container min-h-full">
      <section class="flex flex-col bg-gray-50 dark:bg-gray-800 overflow-auto transition-colors duration-200"
        :style="{ width: videoWidth + '%' }">
        <VideoFrame v-if="!loading" :video-id="post.videoId" :video-platform="post.videoPlatform"
          :sequence-start-time="post.sequenceStartTime" @time-update="handleTimeUpdate" />
        <div class="flex-1 overflow-auto">
          <PostMetadata v-if="!loading" :post="post" mode="display" :is-mobile="isMobile" :can-edit-post="canEditPost"
            @fork-post="forkPost" />
          <div v-else class="flex justify-center items-center h-full">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
      <ResizableDivider v-model:width="videoWidth" container-selector=".resizable-container" />
      <section class="flex flex-col bg-gray-50 dark:bg-gray-800 overflow-auto transition-colors duration-200"
        :style="{ width: 100 - videoWidth + '%' }">
        <div v-if="!loading && post.notesPath" class="p-4">
          <MarkdownViewer :notes-path="post.notesPath" />
        </div>
        <p v-else-if="!loading" class="text-gray-500 dark:text-gray-400 italic p-4 transition-colors duration-200">
          No notes available for this post.
        </p>
        <div v-else class="flex justify-center items-center h-full">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { BACKEND_URL } from "@/utils/config";
import MarkdownViewer from "@/components/content/MarkdownViewer.vue";
import ResizableDivider from "@/components/common/ResizableDivider.vue";
import VideoFrame from "@/components/content/VideoFrame.vue";
import PostMetadata from "@/components/content/PostMetadata.vue";
import postStructure from "@/data/postStructure.json";
import { mapBackendPostToFrontend } from "@/utils/postMapper";

export default {
  name: "ViewPost",
  components: {
    MarkdownViewer,
    ResizableDivider,
    VideoFrame,
    PostMetadata,
  },
  props: {
    id: String,
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const post = ref(route.state?.post || { ...postStructure });
    const videoWidth = ref(60);
    const canEditPost = ref(false);
    const isMobile = ref(window.innerWidth <= 768);
    const loading = ref(false);

    const fetchPostData = async () => {
      if (!props.id) {
        console.error("No post ID provided for fetching.");
        return;
      }
      loading.value = true;
      try {
        console.log(`Fetching post data for ID: ${props.id}`);
        const response = await axios.get(`${BACKEND_URL}/viewpost/${props.id}`);
        console.log("Raw backend response:", response.data);
        post.value = mapBackendPostToFrontend(response.data);
        console.log("Updated post value:", post.value);
        await checkPostEditability();
      } catch (error) {
        console.error("Error fetching post data:", error);
        post.value = { ...postStructure };
      } finally {
        loading.value = false;
      }
    };

    const checkPostEditability = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token || !props.id) {
        canEditPost.value = false;
        console.log("No token or ID, editability set to false");
        return;
      }
      try {
        await axios.head(`${BACKEND_URL}/editpost/${props.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        canEditPost.value = true;
        console.log("Post is editable");
      } catch (error) {
        canEditPost.value = error.response?.status === 401 || error.response?.status === 403 ? false : false;
        if (!canEditPost.value) console.error("Error checking edit permissions:", error);
      }
    };

    const forkPost = async () => {
      const token = localStorage.getItem("accessToken");
      if (!props.id) return;
      try {
        const response = await axios.post(`${BACKEND_URL}/newpost`, post.value, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Post forked successfully!");
        router.push(`/viewpost/${response.data.post_id || response.data.id}`);
      } catch (error) {
        console.error("Error forking post:", error);
        alert("Failed to fork post");
      }
    };

    const handleTimeUpdate = (currentTime) => {
      console.log("Current video time from VideoFrame:", currentTime);
    };

    watch(() => props.id, (newId) => {
      if (!route.state?.post || newId !== post.value.id) {
        console.log(`ID changed to ${newId}, fetching data`);
        fetchPostData();
      }
    });

    onMounted(() => {
      fetchPostData();
      checkPostEditability();
    })

    return {
      post,
      videoWidth,
      canEditPost,
      forkPost,
      isMobile,
      handleTimeUpdate,
      loading,
    };
  },
};
</script>

<style scoped>
section {
  min-width: 300px;
}

.resizable-container {
  gap: 8px;
}
</style>