<template>
  <div>
    <!-- Trigger Button -->
    <button @click="openModal" 
      class="px-6 py-2 text-white bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-500 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
      New Game Plan
    </button>
    
    <!-- Modal Backdrop -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal">
      <!-- Modal Content -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 transition-colors duration-200">
        <!-- Modal Header -->
        <div class="border-b border-gray-200 dark:border-gray-700 p-4">
          <h3 class="text-xl font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">
            Create New Game Plan
          </h3>
        </div>
        
        <!-- Modal Body -->
        <div class="p-4">
          <div class="flex-col space-y-4">
            <div>
              <label for="newGamePlanName"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                Game Plan Name
              </label>
              <input id="newGamePlanName" type="text" v-model="newGamePlan.name"
                placeholder="E.g., My Bottom Game"
                class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors duration-200 border border-transparent dark:border-gray-600" />
            </div>
            <div>
              <label for="newGamePlanDescription"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                Description
              </label>
              <textarea id="newGamePlanDescription" v-model="newGamePlan.description"
                placeholder="Describe your game plan strategy..." rows="3"
                class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors duration-200 border border-transparent dark:border-gray-600"></textarea>
            </div>
            <div>
              <label for="newGamePlanPublicsSatus"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                Public Status
              </label>
              <select id="newGamePlanPublicStatus" v-model="newGamePlan.publicStatus"
                class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors duration-200 border border-transparent dark:border-gray-600">
                <option value="">Any</option>
                <option value="public">Public</option>
                <option value="subscribers">Subscribers Only</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div>
              <label for="newGamePlanLanguage"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                Language
              </label>
              <select id="newGamePlanLanguage" v-model="newGamePlan.language"
                class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600 transition-colors duration-200 border border-transparent dark:border-gray-600">
                <option value="">Any</option>
                <option value="english">English</option>
                <option value="traditional chinese">Traditional Chinese</option>
                <option value="japanese">Japanese</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Modal Footer -->
        <div class="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end space-x-3">
          <button @click="closeModal" 
            class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200">
            Cancel
          </button>
          <button @click="createGamePlan" 
            class="px-4 py-2 text-white bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-500 rounded transition-colors duration-200 disabled:opacity-50"
            :disabled="!newGamePlan.name">
            Create
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

export default {
  props: {
    isPanelExpanded: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {
    const showModal = ref(false);
    const newGamePlan = ref({
      name: '',
      description: '',
      publicStatus: 'public',
      language: 'english'
    });

    const openModal = () => {
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      // Reset form
      newGamePlan.value = {
        name: '',
        description: '',
        publicStatus: 'public',
        language: 'english'
      };
    };

    const createGamePlan = async () => {
      try {
        if (!newGamePlan.value.name) {
          console.error("Game plan name is required");
          return;
        }

        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.post(`${BACKEND_URL}/new-gameplan`, newGamePlan.value, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log("Game plan saved successfully!", response.data);
        
        // Emit event to notify parent component
        emit('game-plan-created', response.data);
        
        // Close the modal
        closeModal();
      } catch (error) {
        console.error("Error saving game plan:", error.response?.data?.error || "Failed to save game plan");
      }
    };

    return {
      showModal,
      newGamePlan,
      openModal,
      closeModal,
      createGamePlan
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