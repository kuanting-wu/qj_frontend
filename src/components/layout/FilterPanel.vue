<template>
  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-200 overflow-hidden"
    :class="{ 'w-80': isExpanded, 'w-0': !isExpanded }">
    <!-- Header Section -->
    <SearchBar v-model="formData.search" @search="$emit('search')" :is-loading="isLoading" />
    <!-- Filter Section -->
    <VerticalForm :form-data="formData" :fields="fields" @field-changed="$emit('field-changed', $event)" />
    <!-- Error Message (if provided) -->
    <div v-if="errorMessage" class="p-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { defineProps, defineEmits } from "vue";
import SearchBar from "../common/SearchBar.vue";
import VerticalForm from "../common/VerticalForm.vue";

export default {
  name: "FilterPanel",
  components: {
    SearchBar,
    VerticalForm,
  },
  props: {
    formData: {
      type: Object,
      required: true,
    },
    fields: {
      type: Array,
      required: true,
    },
    isExpanded: {
      type: Boolean,
      default: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: "",
    },
  },
  emits: ["search", "field-changed"],
};
</script>

<style scoped>
.overflow-hidden {
  overflow: hidden;
}

/* Smooth width transition */
.w-80 {
  transition: width 0.3s ease-in-out;
}

.w-0 {
  transition: width 0.3s ease-in-out;
}
</style>