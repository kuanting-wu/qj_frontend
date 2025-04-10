<template>
  <div class="flex flex-col gap-4 max-h-full overflow-y-auto">
    <!-- Header Section (Title, GamePlanManager, Fork/Edit Buttons) -->
    <header v-if="mode === 'display'" class="flex flex-wrap items-center gap-2 justify-between mb-3">
      <h1
        class="text-2xl font-semibold text-gray-800 dark:text-gray-100 leading-tight truncate-title transition-colors duration-200 flex-grow"
      >
        {{ post.title || "Title Unavailable" }}
      </h1>
      <div class="flex items-center gap-3">
        <GamePlanManager :post-id="post.id" />
        <button
          @click="$emit('fork-post', post.id)"
          class="flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Fork Post"
          title="Fork Post"
        >
          <svg
            class="w-5 h-5 text-gray-600 dark:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
            />
          </svg>
        </button>
        <router-link
          v-if="canEditPost"
          :to="editPageLink"
          class="flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Edit"
          title="Edit post"
        >
          <svg
            class="w-5 h-5 text-gray-600 dark:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </router-link>
      </div>
    </header>

    <!-- Title, Save, and Delete Section (Edit Mode) -->
    <div v-else class="flex justify-between items-center mb-4">
      <div class="flex items-center gap-4 w-full">
        <h1
          for="title"
          class="text-2xl font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap transition-colors duration-200"
        >
          Title:
        </h1>
        <input
          id="title"
          type="text"
          v-model="post.title"
          required
          class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          placeholder="Enter title"
        />
      </div>
      <div class="flex items-center gap-2 ml-2">
        <!-- Save Button -->
        <button
          type="button"
          class="flex items-center rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200"
          @click="$emit('save-post')"
          title="Save post"
        >
          <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2 2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
        </button>
        
        <!-- Delete Button -->
        <button
          type="button"
          class="flex items-center rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200"
          @click="$emit('delete-post')"
          title="Delete post"
        >
          <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- ProfileInfo Section (Display Mode) -->
    <div v-if="mode === 'display'" class="flex items-center justify-between gap-4">
      <ProfileInfo
        :owner-name="post.ownerName || 'Anonymous'"
        :avatar-url="post.avatarUrl || ''"
        :belt="post.belt || 'white'"
        :academy="post.academy || ''"
      />
    </div>

    <!-- Dynamic Metadata Fields (Always Visible) -->
    <div
      class="grid gap-4"
      :class="{
        'grid-cols-1': isMobile,
        'grid-cols-[repeat(auto-fit,minmax(250px,1fr))]': !isMobile,
      }"
    >
      <!-- Display Mode: Read-Only Fields -->
      <template v-if="mode === 'display'">
        <div v-for="field in filteredFields" :key="field.id" class="mb-2">
          <div class="flex justify-between">
            <span class="font-semibold truncate text-gray-700 dark:text-gray-300 transition-colors duration-200">
              {{ field.label }}
            </span>
            <span class="text-gray-600 dark:text-gray-400 transition-colors duration-200">
              {{ formatFieldValue(field) || "Not specified" }}
            </span>
          </div>
        </div>
      </template>

      <!-- Edit Mode: Editable Fields -->
      <template v-else>
        <!-- Dynamic Fields -->
        <div v-for="field in filteredFields" :key="field.id" class="mb-4">
          <label :for="field.id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
            {{ field.label }}
          </label>
          <select
            v-if="field.type === 'select'"
            :id="field.id"
            v-model="post[field.key]"
            required
            class="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm"
          >
            <option v-for="option in field.options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <input
            v-else-if="field.type === 'text' && field.id !== 'sequenceStartTime'"
            :id="field.id"
            type="text"
            v-model="post[field.key]"
            :placeholder="field.placeholder || `Enter ${field.label.toLowerCase()}`"
            class="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm"
          />
        </div>

        <!-- Special Case: Sequence Start Time -->
        <div class="mb-4">
          <label for="sequenceStartTime" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
            Sequence Start Time
          </label>
          <div class="flex items-center">
            <input
              id="sequenceStartTime"
              type="text"
              v-model="post.sequenceStartTime"
              class="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm"
              placeholder="hh:mm:ss"
              maxlength="8"
              required
            />
            <button
              type="button"
              class="px-3 py-2 bg-black dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white rounded-r-md border border-black dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              @click="$emit('set-current-time')"
              title="Use current video time"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import formFields from "@/data/postFormFields.json";
import GamePlanManager from './GamePlanManager.vue';
import ProfileInfo from '../common/ProfileCard.vue';

export default {
  name: "PostMetadata",
  components: {
    GamePlanManager,
    ProfileInfo,
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
    mode: {
      type: String,
      default: 'edit',
      validator: (value) => ['edit', 'display'].includes(value),
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
    canEditPost: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["set-current-time", "save-post", "delete-post", "fork-post"],
  setup(props) {
    const filteredFields = formFields.filter(
      (field) => field.id !== "sortOption" && field.id !== "postBy"
    );

    const editPageLink = computed(() => `/editpost/${props.post.id}`);

    const formatFieldValue = (field) => {
      const value = props.post[field.key];
      if (field.type === 'select' && field.options) {
        const option = field.options.find((opt) => opt.value === value);
        return option ? option.label : value;
      }
      return value;
    };

    return {
      filteredFields,
      editPageLink,
      formatFieldValue,
    };
  },
};
</script>

<style scoped>
.truncate-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.max-h-full {
  max-height: 100%;
}

.overflow-y-auto::-webkit-scrollbar {
  display: none;
}

.overflow-y-auto {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>