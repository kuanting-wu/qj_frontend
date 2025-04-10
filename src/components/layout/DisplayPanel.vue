<template>
  <div
    class="flex flex-col bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm transition-colors duration-200 overflow-auto">
    <header class="p-4">
      <div v-if="selectedPosition">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Techniques for "{{ selectedPosition }}"</h2>
        <p class="text-gray-600 dark:text-gray-400 mt-2">All techniques involving this position</p>
      </div>
      <div v-else-if="selectedMovement">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">{{ selectedMovement.source }} → {{
          selectedMovement.target }}</h2>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Techniques transitioning from {{ selectedMovement.source }} to
          {{ selectedMovement.target }}</p>
      </div>
      <div v-else>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">All Techniques</h2>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Select a position or movement in the graph to filter</p>
      </div>
    </header>

    <!-- Loading/Error/Empty States -->
    <div v-if="isLoading" class="flex justify-center items-center py-10 w-full">
      <div
        class="animate-spin h-10 w-10 border-4 border-blue-500 dark:border-blue-400 rounded-full border-t-transparent">
      </div>
    </div>
    <div v-else-if="errorMessage" class="flex flex-col justify-center items-center py-10 w-full">
      <div class="text-red-500 dark:text-red-400 font-medium mb-2">{{ errorMessage }}</div>
      <button @click="$emit('retry-fetch')"
        class="px-4 py-2 bg-black dark:bg-gray-800 text-white rounded hover:bg-gray-800 dark:hover:bg-gray-700">
        Try Again
      </button>
    </div>
    <div v-else-if="!selectedPosition && !selectedMovement && posts.length === 0"
      class="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-center">Select a position from the graph to view related techniques</p>
    </div>
    <div v-else-if="(selectedPosition || selectedMovement) && posts.length === 0"
      class="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-center">No techniques found for the selected position</p>
      <button @click="$emit('clear-selection')"
        class="mt-4 px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">
        Clear Selection
      </button>
    </div>

    <!-- Technique Cards -->
    <div v-else class="grid gap-4 p-4">
      <div v-for="post in posts" :key="post.id" class="card-wrapper">
        <PreviewCard v-bind="post" />
      </div>
    </div>
  </div>
</template>

<script>
import PreviewCard from "../common/PreviewCard.vue";

export default {
  name: "DisplayPanel",
  components: {
    PreviewCard,
  },
  props: {
    posts: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: "",
    },
    selectedPosition: {
      type: String,
      default: null,
    },
    selectedMovement: {
      type: Object,
      default: null,
    },
  },
  emits: ["clear-selection", "retry-fetch"],
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Match old size */
  justify-content: start; /* Align tracks to the left */
  align-content: start; /* Align rows to the top */
  gap: 1rem; /* Matches Tailwind's gap-4 */
  padding: 1rem; /* Matches Tailwind's p-4 */
}

.card-wrapper {
  display: flex;
  justify-content: center; /* Center the card within the cell */
}

.card-wrapper > * {
  width: 100%;
  max-width: 400px; /* Match old max-width */
}
</style>
