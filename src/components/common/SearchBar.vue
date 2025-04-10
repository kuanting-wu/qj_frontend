<template>
  <aside class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200">
    <h3
      class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      Search
    </h3>
    <div class="relative">
      <input
        :id="id"
        type="text"
        v-model="searchValue"
        @keyup.enter="$emit('search')"
        class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-gray-600 transition-colors duration-200 shadow-sm border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
        :placeholder="placeholder"
        aria-label="Search" />
      <button
        @click="$emit('search')"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-150 focus:outline-none"
        aria-label="Search">
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  </aside>
</template>

<script>
import { defineProps, defineEmits } from "vue";

export default {
  name: "SearchBar",
  props: {
    id: {
      type: String,
      default: "searchInput",
    },
    modelValue: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "Titles, positions, techniques, etc.",
    },
  },
  emits: ["update:modelValue", "search"],
  computed: {
    searchValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
};
</script>

<style scoped>
/* Hide scrollbar for consistency with VerticalForm */
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}

.overflow-y-auto {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

/* Match focus and hover states with VerticalForm */
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); /* Subtle blue glow */
}

/* Optional: Ensure consistent shadow on the container */
aside {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06); /* Tailwind shadow-sm */
}
</style>