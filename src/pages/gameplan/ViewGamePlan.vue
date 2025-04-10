<template>
  <main class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200 flex flex-col p-5 gap-1">
    <!-- Header Section (Using GamePlanMetadata) -->
    <GamePlanMetadata
      v-if="gamePlanData.id"
      :form-data="gamePlanData"
      :mode="'display'"
      :can-edit-game-plan="canEditGamePlan"
      @fork-game-plan="handleForkGamePlan"
      class="px-6 py-4"
    />

    <!-- Main Content: Two Columns -->
    <div class="flex flex-col md:flex-row flex-grow w-full resizable-container">
      <!-- Left Section: Graph Visualization -->
      <div
        class="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200"
        :style="{ width: graphWidth + '%' }"
      >
        <div
          v-if="!gamePlanData || !gamePlanData.posts || gamePlanData.posts.length === 0"
          class="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 mb-4 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
          <p class="text-center">Select a game plan to visualize your position graph</p>
        </div>
        <div v-else class="h-full w-full flex items-center justify-center min-h-[400px]">
          <GamePlanGraph
            :gamePlanData="gamePlanData"
            @position-clicked="handlePositionClicked"
            @edge-clicked="handleEdgeClicked"
          />
        </div>
      </div>

      <!-- Resizable Divider -->
      <ResizableDivider v-model:width="graphWidth" />

      <!-- Right Section: Technique Display Panel -->
      <DisplayPanel
        :posts="displayedPosts"
        :is-loading="isLoading"
        :error-message="errorMessage"
        :selected-position="selectedPosition"
        :selected-movement="selectedMovement"
        @clear-selection="clearSelection"
        @retry-fetch="fetchGamePlanData"
        :style="{ width: 100 - graphWidth + '%' }"
      />
    </div>
  </main>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import GamePlanMetadata from "@/components/content/GamePlanMetadata.vue";
import DisplayPanel from "@/components/layout/DisplayPanel.vue";
import GamePlanGraph from "@/components/content/GamePlanGraph.vue";
import ResizableDivider from "@/components/common/ResizableDivider.vue";
import postStructure from "@/data/postStructure.json";
import { BACKEND_URL } from "@/utils/config";

export default {
  components: {
    GamePlanMetadata,
    DisplayPanel,
    GamePlanGraph,
    ResizableDivider,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const posts = ref([]);
    const isLoading = ref(false);
    const errorMessage = ref("");
    const gamePlanData = ref({
      id: "",
      name: "",
      description: "",
      language: "English",
      createdAt: "",
      updatedAt: "",
      publicStatus: "public",
      ownerName: "",
      avatarUrl: "",
      belt: "",
      academy: "",
      posts: [],
    });

    const selectedPosition = ref(null);
    const selectedMovement = ref(null);
    const filteredPosts = ref([]);
    const canEditGamePlan = ref(false);
    const graphWidth = ref(50);

    const fetchGamePlanData = async () => {
      isLoading.value = true;
      errorMessage.value = "";
      try {
        const response = await axios.get(`${BACKEND_URL}/view-gameplan/${props.id}`);
        const { game_plan, posts: fetchedPosts } = response.data;

        const mappedPosts = (fetchedPosts || []).map((post) => ({
          ...postStructure,
          id: post.id || postStructure.id,
          title: post.title || postStructure.title,
          videoId: post.video_id || postStructure.videoId,
          videoPlatform: post.video_platform || postStructure.videoPlatform,
          movementType: post.movement_type || postStructure.movementType,
          startingPosition: post.starting_position || postStructure.startingPosition,
          endingPosition: post.ending_position || postStructure.endingPosition,
          startingTopBottom: post.starting_top_bottom || postStructure.startingTopBottom,
          endingTopBottom: post.ending_top_bottom || postStructure.endingTopBottom,
          giNogi: post.gi_nogi || postStructure.giNogi,
          practitioner: post.practitioner || postStructure.practitioner,
          sequenceStartTime: post.sequence_start_time || postStructure.sequenceStartTime,
          publicStatus: post.public_status || postStructure.publicStatus,
          language: post.language || postStructure.language,
          notesPath: post.notes_path || postStructure.notesPath,
          updatedAt: post.updated_at || postStructure.updatedAt,
          createdAt: post.created_at || postStructure.createdAt,
          ownerName: post.owner_name || post.username || postStructure.ownerName,
          avatarUrl: post.avatar_url || postStructure.avatarUrl,
          belt: post.belt || postStructure.belt,
          academy: post.academy || postStructure.academy,
        }));

        posts.value = mappedPosts;
        gamePlanData.value = {
          id: game_plan.id || props.id,
          name: game_plan.name || "Not specified",
          description: game_plan.description || "Not specified",
          language: game_plan.language || "English",
          createdAt: game_plan.created_at || "",
          updatedAt: game_plan.updated_at || "",
          publicStatus: game_plan.public_status || "public",
          ownerName: game_plan.owner_name || "Unknown",
          avatarUrl: game_plan.avatar_url || "default-avatar.png",
          belt: game_plan.belt || "No rank",
          academy: game_plan.academy || "Not specified",
          posts: mappedPosts,
        };

        await checkGamePlanEditability();
      } catch (error) {
        console.error("Error fetching game plan data:", error);
        errorMessage.value = "Failed to load game plan data.";
      } finally {
        isLoading.value = false;
      }
    };

    const checkGamePlanEditability = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token || !props.id) {
        canEditGamePlan.value = false;
        return;
      }
      try {
        await axios.head(`${BACKEND_URL}/edit-gameplan/${props.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        canEditGamePlan.value = true;
      } catch (error) {
        canEditGamePlan.value = false;
        console.error("Error checking edit permissions:", error);
      }
    };

    const handlePositionClicked = (data) => {
      selectedPosition.value = data.position;
      selectedMovement.value = null;
      filteredPosts.value = JSON.parse(JSON.stringify(data.posts || []));
    };

    const handleEdgeClicked = (data) => {
      selectedPosition.value = null;
      selectedMovement.value = { source: data.source, target: data.target };
      filteredPosts.value = JSON.parse(JSON.stringify(data.posts || []));
    };

    const clearSelection = () => {
      selectedPosition.value = null;
      selectedMovement.value = null;
      filteredPosts.value = [];
    };

    const displayedPosts = computed(() => {
      return filteredPosts.value.length > 0
        ? JSON.parse(JSON.stringify(filteredPosts.value))
        : JSON.parse(JSON.stringify(posts.value));
    });

    const handleForkGamePlan = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token || !props.id) {
        alert("Please log in to fork this game plan.");
        return;
      }
      try {
        const response = await axios.post(
          `${BACKEND_URL}/new-gameplan/${props.id}`,
          {}, // No body needed since ID is in path
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Game plan forked successfully!");
        router.push(`/view-gameplan/${response.data.game_plan_id}`);
      } catch (error) {
        console.error("Error forking game plan:", error);
        alert("Failed to fork game plan");
      }
    };

    onMounted(() => {
      if (props.id) fetchGamePlanData();
    });

    watch(
      () => props.id,
      (newId) => {
        if (newId) fetchGamePlanData();
      }
    );

    return {
      isLoading,
      errorMessage,
      gamePlanData,
      posts,
      displayedPosts,
      selectedPosition,
      selectedMovement,
      graphWidth,
      canEditGamePlan,
      handlePositionClicked,
      handleEdgeClicked,
      clearSelection,
      fetchGamePlanData,
      handleForkGamePlan,
    };
  },
};
</script>

<style scoped>
.overflow-auto::-webkit-scrollbar {
  display: none;
}
.overflow-auto {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

@media (max-width: 768px) {
  .md\\:flex-row {
    flex-direction: column;
  }
  .md\\:flex {
    display: none;
  }
  .md\\:flex-row > div {
    width: 100% !important;
  }
}
</style>