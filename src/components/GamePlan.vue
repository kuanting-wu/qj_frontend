<template>
  <div
    class="flex min-h-screen bg-gray-50 dark:bg-gray-900 relative transition-colors duration-200 pt-[60px]"
  >
    <!-- Left Section: Position Graph Visualizer -->
    <section 
      class="flex flex-col h-[calc(100vh-60px)] w-1/2 overflow-auto p-6 border-r border-gray-200 dark:border-gray-700 transition-colors duration-200"
    >
      <header class="mb-4">
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-200">
          Game Plan Visualizer
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-200">
          Explore your jiujitsu positions and transitions in a visual graph
        </p>
      </header>

      <!-- Game Plan Controls -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4 transition-colors duration-200">
        <div class="flex flex-col space-y-4">
          <!-- Game Plan Selector -->
          <div>
            <label for="gamePlanSelect" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
              Select Game Plan
            </label>
            <select
              id="gamePlanSelect"
              v-model="selectedGamePlan"
              class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors duration-200 border border-transparent dark:border-gray-600"
            >
              <option value="">Select a Game Plan</option>
              <option value="half-guard">Half Guard Game</option>
              <option value="closed-guard">Closed Guard Game</option>
              <option value="butterfly">Butterfly Guard Game</option>
              <option value="open-guard">Open Guard Game</option>
            </select>
          </div>

          <!-- Position Filter -->
          <div>
            <label for="positionFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
              Filter by Position
            </label>
            <input
              id="positionFilter"
              type="text"
              v-model="positionFilter"
              placeholder="Search positions..."
              class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors duration-200 border border-transparent dark:border-gray-600"
            />
          </div>

          <!-- Create New Game Plan Button -->
          <button
            @click="showNewGamePlanForm = true"
            class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors duration-200"
          >
            Create New Game Plan
          </button>
        </div>
      </div>

      <!-- New Game Plan Form (conditionally displayed) -->
      <div v-if="showNewGamePlanForm" class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4 transition-colors duration-200">
        <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3 transition-colors duration-200">Create New Game Plan</h3>
        
        <div class="flex flex-col space-y-4">
          <div>
            <label for="newGamePlanName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
              Game Plan Name
            </label>
            <input
              id="newGamePlanName"
              type="text"
              v-model="newGamePlan.name"
              placeholder="E.g., My Half Guard Strategy"
              class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors duration-200 border border-transparent dark:border-gray-600"
            />
          </div>
          
          <div>
            <label for="newGamePlanDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
              Description
            </label>
            <textarea
              id="newGamePlanDescription"
              v-model="newGamePlan.description"
              placeholder="Describe your game plan strategy..."
              rows="3"
              class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors duration-200 border border-transparent dark:border-gray-600"
            ></textarea>
          </div>
          
          <div>
            <label for="newGamePlanStartingPosition" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
              Starting Position
            </label>
            <select
              id="newGamePlanStartingPosition"
              v-model="newGamePlan.startingPosition"
              class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors duration-200 border border-transparent dark:border-gray-600"
            >
              <option value="">Select Starting Position</option>
              <option value="Standing">Standing</option>
              <option value="Closed Guard">Closed Guard</option>
              <option value="Open Guard">Open Guard</option>
              <option value="Half Guard">Half Guard</option>
              <option value="Deep Half Guard">Deep Half Guard</option>
              <option value="Butterfly Guard">Butterfly Guard</option>
              <option value="Side Control">Side Control</option>
              <option value="Mount">Mount</option>
              <option value="Back Control">Back Control</option>
              <option value="Turtle">Turtle</option>
            </select>
          </div>
          
          <div class="flex space-x-3 pt-2">
            <button
              @click="createGamePlan"
              class="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors duration-200"
            >
              Create
            </button>
            <button
              @click="showNewGamePlanForm = false"
              class="flex-1 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Graph Visualization Area -->
      <div class="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 transition-colors duration-200">
        <div v-if="!selectedGamePlan" class="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
          <p class="text-center">Select a game plan to visualize your position graph</p>
        </div>
        <div v-else class="h-full flex items-center justify-center">
          <!-- Placeholder for D3.js or other graph visualization (to be implemented) -->
          <div class="text-sm text-gray-500 dark:text-gray-400 text-center transition-colors duration-200">
            Position graph will be rendered here<br>
            <span class="text-xs">(Graph visualization to be implemented)</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Right Section: Technique Cards -->
    <section class="flex flex-col h-[calc(100vh-60px)] w-1/2 overflow-auto p-6 transition-colors duration-200">
      <header class="mb-4">
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-200">
          Related Techniques
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-200">
          Techniques associated with the selected positions
        </p>
      </header>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-10 w-full">
        <div class="animate-spin h-10 w-10 border-4 border-blue-500 dark:border-blue-400 rounded-full border-t-transparent"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="flex flex-col justify-center items-center py-10 w-full">
        <div class="text-red-500 dark:text-red-400 font-medium mb-2">{{ errorMessage }}</div>
        <button 
          @click="fetchTechniques"
          class="px-4 py-2 bg-black dark:bg-gray-800 text-white rounded hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div 
        v-else-if="!selectedPosition && !selectedGamePlan" 
        class="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400 transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-center">Select a position from the graph to view related techniques</p>
      </div>

      <!-- No Techniques Found State -->
      <div 
        v-else-if="posts.length === 0" 
        class="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400 transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-center">No techniques found for the selected position</p>
      </div>

      <!-- Technique Cards -->
      <div v-else class="grid grid-cols-1 gap-4">
        <PreviewCard
          v-for="post in posts"
          :key="post.id"
          :id="post.id"
          :videoId="post.video_id"
          :videoPlatform="post.video_platform"
          :title="post.title"
          :username="post.username"
          :name="post.name"
          :belt="post.belt"
          :academy="post.academy"
          :avatarSrc="post.avatar_url"
          :createdAt="post.created_at"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";
import axios from "axios";
import PreviewCard from "./PreviewCard.vue";
import { BACKEND_URL } from "../utils/config";
import { getUserFromToken, isUserLoggedIn } from "../utils/auth";

export default {
  components: {
    PreviewCard,
  },
  setup() {
    // State variables
    const posts = ref([]);
    const isLoading = ref(false);
    const errorMessage = ref("");
    const selectedGamePlan = ref("");
    const positionFilter = ref("");
    const selectedPosition = ref("");
    const showNewGamePlanForm = ref(false);
    const newGamePlan = ref({
      name: "",
      description: "",
      startingPosition: ""
    });

    // Fetch techniques related to a position
    const fetchTechniques = async () => {
      if (!selectedPosition.value && !selectedGamePlan.value) return;
      
      isLoading.value = true;
      errorMessage.value = "";
      
      try {
        // In a real implementation, you would fetch from your backend
        // This is a placeholder that simulates a backend call
        console.log(`Fetching techniques for position: ${selectedPosition.value}`);
        
        // Mock API call - in real implementation, use actual backend endpoint
        const params = {
          startingPosition: selectedPosition.value || "",
          gamePlanId: selectedGamePlan.value || ""
        };
        
        // Simulate API response delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock response data - in real implementation, this would come from your backend
        posts.value = [
          {
            id: "mock-id-1",
            title: "Half Guard to Back Take",
            video_id: "dPr7ua9-Lhs",
            video_platform: "YouTube",
            username: "johnsmith",
            name: "John Smith",
            belt: "Black Belt",
            academy: "Gracie Academy",
            avatar_url: "https://ui-avatars.com/api/?name=John+Smith&background=random",
            created_at: "2023-05-15T10:30:00Z"
          },
          {
            id: "mock-id-2",
            title: "Deep Half Sweep Variation",
            video_id: "dPr7ua9-Lhs",
            video_platform: "YouTube",
            username: "mariasilva",
            name: "Maria Silva",
            belt: "Brown Belt",
            academy: "Alliance BJJ",
            avatar_url: "https://ui-avatars.com/api/?name=Maria+Silva&background=random",
            created_at: "2023-06-20T14:15:00Z"
          }
        ];
        
        console.log(`Loaded ${posts.value.length} techniques`);
      } catch (error) {
        console.error("Error fetching techniques:", error);
        errorMessage.value = "Failed to load techniques. Please try again.";
        posts.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    // Create new game plan
    const createGamePlan = async () => {
      // Validate form
      if (!newGamePlan.value.name || !newGamePlan.value.startingPosition) {
        errorMessage.value = "Please fill in all required fields";
        return;
      }
      
      isLoading.value = true;
      errorMessage.value = "";
      
      try {
        // In a real implementation, you would make an API call to create the game plan
        console.log("Creating new game plan:", newGamePlan.value);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Reset form and hide it
        showNewGamePlanForm.value = false;
        newGamePlan.value = {
          name: "",
          description: "",
          startingPosition: ""
        };
        
        // Set the selected game plan to the newly created one (in real implementation, use the ID returned from backend)
        selectedGamePlan.value = "new-game-plan";
        
        // Fetch techniques for the new game plan
        selectedPosition.value = newGamePlan.value.startingPosition;
        fetchTechniques();
        
      } catch (error) {
        console.error("Error creating game plan:", error);
        errorMessage.value = "Failed to create game plan. Please try again.";
      } finally {
        isLoading.value = false;
      }
    };

    // Watch for changes to selectedGamePlan or selectedPosition and fetch techniques
    watch([selectedGamePlan, selectedPosition], () => {
      fetchTechniques();
    });

    // Initialize component
    onMounted(() => {
      // You might want to fetch user's game plans here
      console.log("Game Plan component mounted");
    });

    return {
      posts,
      isLoading,
      errorMessage,
      selectedGamePlan,
      positionFilter,
      selectedPosition,
      showNewGamePlanForm,
      newGamePlan,
      fetchTechniques,
      createGamePlan
    };
  },
};
</script>

<style scoped>
/* Hide scrollbar but maintain functionality */
.overflow-auto::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.overflow-auto {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

/* Responsive adjustments for mobile */
@media (max-width: 768px) {
  .flex {
    flex-direction: column;
  }
  
  section {
    width: 100%;
    height: auto;
  }
  
  section:first-child {
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
}
</style>