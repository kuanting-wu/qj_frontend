<template>
    <aside
      class="flex-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200 overflow-y-auto">
      <h3
        class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        Filter Options
      </h3>
  
      <!-- Dynamic Fields -->
      <div v-for="(field, index) in fields" :key="index" class="mb-4">
        <div class="flex justify-between mb-1.5">
          <label :for="field.id"
            class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
            {{ field.label }}
          </label>
        </div>
        <div class="relative">
          <!-- Input Field -->
          <input v-if="field.type === 'text'" :id="field.id" type="text" v-model="formData[field.key]"
            :placeholder="field.placeholder || `Enter ${field.label.toLowerCase()}`"
            class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-gray-600 transition-colors duration-200 shadow-sm border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600" />
  
          <!-- Select Field -->
          <select v-else-if="field.type === 'select'" :id="field.id" v-model="formData[field.key]"
            class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-gray-600 transition-colors duration-200 shadow-sm border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
            @change="field.onChange ? $emit('field-changed', field.key) : null">
            <option v-for="(option, optIndex) in field.options" :key="optIndex" :value="option.value">
              {{ option.label }}
            </option>
          </select>
  
          <!-- Dropdown Arrow for Select -->
          <div v-if="field.type === 'select'"
            class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg class="h-4 w-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </aside>
  </template>
  
  <script>
  import { defineProps, defineEmits } from "vue";
  
  export default {
    name: "VerticalForm",
    props: {
      formData: {
        type: Object,
        required: true,
      },
      fields: {
        type: Array,
        required: true,
        default: () => [],
      },
    },
    emits: ["field-changed"],
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
  
  /* Enhance hover and focus states for consistency with PreviewCard */
  input:focus,
  select:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); /* Subtle blue glow */
  }
  
  /* Optional: Add slight elevation to mimic card-like feel */
  aside {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06); /* Tailwind shadow-sm */
  }
  </style>