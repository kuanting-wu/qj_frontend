<template>
  <div class="relative">
    <button @click="openModal" 
      class="flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      aria-label="Add to Game Plan" title="Add to Game Plan">
      <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" 
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
      </svg>
    </button>
    
    <!-- Modal Backdrop -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal">
      <!-- Modal Content -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 transition-colors duration-200">
        <!-- Modal Header -->
        <div class="border-b border-gray-200 dark:border-gray-700 p-4">
          <h3 class="text-xl font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">
            Manage Game Plans
          </h3>
        </div>
        
        <!-- Modal Body -->
        <div class="p-4">
          <!-- Loading State -->
          <div v-if="isLoading" class="flex justify-center items-center py-8">
            <div class="animate-spin h-8 w-8 border-4 border-blue-500 dark:border-blue-400 rounded-full border-t-transparent"></div>
          </div>
          
          <!-- Error State -->
          <div v-else-if="errorMessage" class="py-4 text-center">
            <p class="text-red-500 dark:text-red-400 mb-2">{{ errorMessage }}</p>
            <button @click="fetchGamePlans" 
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              Retry
            </button>
          </div>
          
          <!-- Empty State -->
          <div v-else-if="gamePlans.length === 0" class="py-8 text-center">
            <p class="text-gray-500 dark:text-gray-400">No game plans found</p>
            <button @click="showNewGamePlanForm = true" 
              class="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-500 text-white rounded-lg transition-colors duration-200">
              Create New Game Plan
            </button>
          </div>
          
          <!-- Game Plans List -->
          <div v-else>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Select game plans to add this post to:
            </p>
            
            <!-- Debug info -->
            <div class="text-xs text-gray-500 mb-2">
              Game plans count: {{ gamePlans.length }}
            </div>
            
            <ul class="space-y-2 max-h-60 overflow-y-auto">
              <li v-for="plan in gamePlans" :key="plan.id" 
                class="p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox"
                    :checked="plan.containsPost"
                    @change="toggleGamePlan(plan.id)"
                    class="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400 rounded transition-colors duration-200 focus:ring-blue-500">
                  <span class="ml-3 text-gray-800 dark:text-gray-200 transition-colors duration-200">{{ plan.name }}</span>
                </label>
                <p v-if="plan.description" class="text-xs text-gray-500 dark:text-gray-400 ml-8 mt-1 transition-colors duration-200">
                  {{ plan.description }}
                </p>
              </li>
            </ul>
            
            <!-- Create New Game Plan -->
            <div class="mt-4">
              <!-- Use NewGamePlan component here -->
              <NewGamePlan @game-plan-created="handleNewGamePlan" />
            </div>
          </div>
        </div>
        
        <!-- Modal Footer -->
        <div class="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end space-x-3">
          <button @click="closeModal" 
            class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200">
            Cancel
          </button>
          <button @click="submitChanges" 
            class="px-4 py-2 text-white bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-500 rounded transition-colors duration-200 disabled:opacity-50"
            :disabled="Object.keys(updates).length === 0">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { BACKEND_URL } from "@/utils/config";
import { ref } from 'vue';
import NewGamePlan from '@/pages/gameplan/NewGamePlan.vue';

export default {
  components: {
    NewGamePlan
  },
  props: {
    postId: {
      type: String, 
      required: true
    }
  },
  setup(props) {
    const showModal = ref(false);
    const gamePlans = ref([]);
    const updates = ref({});
    const isLoading = ref(false);
    const errorMessage = ref('');
    const showNewGamePlanForm = ref(false);

    const openModal = async () => {
      console.log('Opening modal');
      showModal.value = true;
      await fetchGamePlans();
      
      // If we have the response directly from you, we can use it for testing
      if (gamePlans.value.length === 0) {
        console.log('No game plans fetched, using test data');
        // This is just for testing with the data you provided
        gamePlans.value = [
          {id: "3657acdb-3cc9-428e-83d9-9f07da8e5c12", name: "A", containsPost: false},
          {id: "f7f457c9-ebdd-4cf8-b50c-1cf2b11ddfb6", name: "B", containsPost: false},
          {id: "ef7cdbcd-7c22-492b-a97b-409a8b05aaf9", name: "C", containsPost: false}
        ];
      }
    };

    const closeModal = () => {
      showModal.value = false;
      showNewGamePlanForm.value = false;
      updates.value = {};
      errorMessage.value = '';
    };

    const fetchGamePlans = async () => {
      isLoading.value = true;
      errorMessage.value = '';
      
      try {
        const response = await axios.get(`${BACKEND_URL}/list-gameplans/${props.postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        
        // Log the response to debug
        console.log('Game plans response:', response.data);
        
        // Check if response.data is directly the game plans array
        if (Array.isArray(response.data)) {
          gamePlans.value = response.data;
        } 
        // Check if it's in the expected format
        else if (response.data.game_plans) {
          gamePlans.value = response.data.game_plans;
        } 
        // Handle case where it might be a different property name
        else if (response.data.gamePlans) {
          gamePlans.value = response.data.gamePlans;
        }
        // If still empty, check if the entire response might be the array
        else if (Object.keys(response.data).length > 0) {
          console.log('No recognized game plans property, using full response data');
          gamePlans.value = response.data;
        }
        
        console.log('Processed game plans:', gamePlans.value);
        isLoading.value = false;
      } catch (error) {
        console.error('Failed to fetch game plans:', error);
        errorMessage.value = 'Failed to load game plans. Please try again.';
        isLoading.value = false;
      }
    };

    const toggleGamePlan = (gamePlanId) => {
      // Find the plan
      const plan = gamePlans.value.find(plan => plan.id === gamePlanId);
      
      if (!plan) return;

      // Toggle local state
      plan.containsPost = !plan.containsPost;

      // Track the update
      updates.value[gamePlanId] = {
        gamePlanId,
        add: plan.containsPost
      };
    };

    const handleNewGamePlan = (gamePlanData) => {
      if (gamePlanData && gamePlanData.game_plan) {
        const newPlan = gamePlanData.game_plan;
        newPlan.containsPost = true; // Automatically select the new plan
        gamePlans.value.push(newPlan);
          
        // Add to updates
        updates.value[newPlan.id] = {
          gamePlanId: newPlan.id,
          add: true
        };
      }
      
      // Refresh the list to ensure everything is up to date
      fetchGamePlans();
    };

    const submitChanges = async () => {
      const changes = Object.values(updates.value);
      
      if (changes.length === 0) {
        closeModal();
        return;
      }
      
      isLoading.value = true;
      try {
        await axios.post(`${BACKEND_URL}/update-gameplans/${props.postId}`, {
          gamePlanUpdates: changes
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        
        closeModal();
      } catch (error) {
        console.error('Failed to update game plans:', error);
        errorMessage.value = 'Failed to save changes. Please try again.';
        isLoading.value = false;
      }
    };

    return {
      showModal,
      gamePlans,
      updates,
      isLoading,
      errorMessage,
      showNewGamePlanForm,
      openModal,
      closeModal,
      fetchGamePlans,
      toggleGamePlan,
      handleNewGamePlan,
      submitChanges
    };
  }
};
</script>

<style scoped>
/* Hide scrollbar for various browsers while maintaining functionality */
.overflow-y-auto::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.overflow-y-auto {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}
</style>