<template>
    <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900 relative transition-colors duration-200">
      <!-- Main Content -->
      <main class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col p-6 gap-4 w-full">
        <div class="flex flex-col md:flex-row flex-grow w-full gap-4">
          <!-- Left Section: FilterPanel (Always Visible) -->
          <FilterPanel
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200 w-full md:w-80"
            :form-data="formData"
            :fields="gamePlanFormFields"
            :is-loading="isLoading"
            :error-message="errorMessage"
            :is-mobile="isMobile"
            @search="fetchGamePlans"
            @field-changed="fetchGamePlans"
          />
          <!-- Right Section: Game Plan List -->
          <section class="w-full md:flex-1">
            <!-- Loading state -->
            <div v-if="isLoading" class="flex justify-center items-center py-10 w-full">
              <div
                class="animate-spin h-10 w-10 border-4 border-blue-500 dark:border-blue-400 rounded-full border-t-transparent"
              ></div>
            </div>
  
            <!-- Error message -->
            <div v-else-if="errorMessage" class="flex flex-col justify-center items-center py-10 w-full">
              <div class="text-red-500 dark:text-red-400 font-medium mb-2">{{ errorMessage }}</div>
              <button
                @click="fetchGamePlans"
                class="px-4 py-2 bg-black dark:bg-gray-800 text-white rounded hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
  
            <!-- Empty state -->
            <div v-else-if="gamePlans.length === 0" class="flex justify-center items-center py-10 w-full">
              <p class="text-gray-500 dark:text-gray-400">No game plan found. Try adjusting your search criteria.</p>
            </div>
  
            <!-- Game Plan list -->
            <div v-else class="flex flex-col gap-4 mt-3 w-full">
              <PreviewRow
                v-for="gamePlan in gamePlans"
                :key="gamePlan.id"
                :game-plan="gamePlan"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import PreviewRow from "@/components/common/PreviewRow.vue";
  import FilterPanel from "@/components/layout/FilterPanel.vue";
  import gamePlanFormFields from "@/data/gamePlanFormFields.json";
  import gamePlanFormData from "@/data/gamePlanFormData.json";
  import gamePlanStructure from "@/data/gamePlanStructure.json";
  import { BACKEND_URL } from "@/utils/config";
  import { getUserFromToken } from "@/utils/auth";
  
  export default {
    components: {
      PreviewRow,
      FilterPanel,
    },
    setup() {
      const formData = ref({ ...gamePlanFormData });
      const gamePlans = ref([]);
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const isLoading = ref(false);
      const errorMessage = ref("");
  
      const fetchGamePlans = async () => {
        isLoading.value = true;
        errorMessage.value = "";
        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.get(`${BACKEND_URL}/search-gameplans`, {
            params: formData.value,
            headers: { Authorization: token ? `Bearer ${token}` : undefined },
          });
          gamePlans.value = (response.data.game_plans || []).map(gamePlan => ({
            ...gamePlanStructure,
            id: gamePlan.id || gamePlanStructure.id,
            name: gamePlan.name || gamePlanStructure.name,
            description: gamePlan.description || gamePlanStructure.description,
            language: gamePlan.language || gamePlanStructure.language,
            createdAt: gamePlan.created_at || gamePlanStructure.createdAt,
            updatedAt: gamePlan.updated_at || gamePlanStructure.updatedAt,
            publicStatus: gamePlan.public_status || gamePlanStructure.publicStatus,
            ownerName: gamePlan.owner_name || gamePlan.username || gamePlanStructure.ownerName,
            avatarUrl: gamePlan.avatar_url || gamePlanStructure.avatarUrl,
            belt: gamePlan.belt || gamePlanStructure.belt,
            academy: gamePlan.academy || gamePlanStructure.academy,
          }));
          console.log(`Loaded ${gamePlans.value.length} game plans`);
        } catch (error) {
          errorMessage.value = error.response
            ? error.response.data?.error || `Server error (${error.response.status})`
            : "Network error";
          console.error("Error fetching game plans:", errorMessage.value);
        } finally {
          isLoading.value = false;
        }
      };
  
      onMounted(() => {
        const username = getUserFromToken();
        if (username) {
          formData.value.createdBy = username;
          fetchGamePlans();
        }
      });
  
      return {
        formData,
        gamePlans,
        isMobile,
        isLoading,
        errorMessage,
        fetchGamePlans,
        gamePlanFormFields,
      };
    },
  };
  </script>
  
  <style scoped>
  .overflow-y-auto::-webkit-scrollbar {
    display: none;
  }
  
  .overflow-y-auto {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  </style>