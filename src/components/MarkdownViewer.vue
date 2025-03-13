<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400"></div>
    </div>
    <div v-else-if="error" class="text-red-500 dark:text-red-400 py-2 transition-colors duration-200">
      {{ error }}
    </div>
    <div v-else-if="!markdownContent" class="text-gray-500 dark:text-gray-400 py-2 italic transition-colors duration-200">
      No notes available for this post.
    </div>
    <div v-else class="markdown-content prose prose-sm dark:prose-invert max-w-none transition-colors duration-200" v-html="renderedMarkdown"></div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import axios from 'axios';
import { marked } from 'marked';

export default {
  name: 'MarkdownViewer',
  props: {
    markdownUrl: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup(props) {
    const markdownContent = ref('');
    const loading = ref(false);
    const error = ref('');

    // Parse markdown to HTML
    const renderedMarkdown = computed(() => {
      if (!markdownContent.value) return '';
      try {
        return marked(markdownContent.value);
      } catch (e) {
        console.error('Error parsing markdown:', e);
        return '<p>Error rendering markdown content</p>';
      }
    });

    // Fetch markdown from S3 when URL changes
    const fetchMarkdown = async () => {
      if (!props.markdownUrl) {
        markdownContent.value = '';
        return;
      }

      loading.value = true;
      error.value = '';

      try {
        // Add cache buster to prevent browser caching
        const urlWithCacheBuster = `${props.markdownUrl}?t=${new Date().getTime()}`;
        const response = await axios.get(urlWithCacheBuster);
        markdownContent.value = response.data;
      } catch (err) {
        console.error('Error fetching markdown:', err);
        error.value = 'Failed to load markdown content';
        markdownContent.value = '';
      } finally {
        loading.value = false;
      }
    };

    // Watch for changes to the markdown URL
    watch(() => props.markdownUrl, (newUrl) => {
      if (newUrl) {
        fetchMarkdown();
      } else {
        markdownContent.value = '';
      }
    }, { immediate: true });

    return {
      markdownContent,
      renderedMarkdown,
      loading,
      error
    };
  }
};
</script>

<style scoped>
.markdown-content {
  @apply transition-colors duration-200;
}

.markdown-content :deep(h1) {
  @apply text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 transition-colors duration-200;
}

.markdown-content :deep(h2) {
  @apply text-xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-100 transition-colors duration-200;
}

.markdown-content :deep(h3) {
  @apply text-lg font-medium mt-5 mb-2 text-gray-800 dark:text-gray-100 transition-colors duration-200;
}

.markdown-content :deep(p) {
  @apply my-3 text-gray-700 dark:text-gray-300 transition-colors duration-200;
}

.markdown-content :deep(ul), .markdown-content :deep(ol) {
  @apply my-3 ml-6 text-gray-700 dark:text-gray-300 transition-colors duration-200;
}

.markdown-content :deep(ul) {
  @apply list-disc;
}

.markdown-content :deep(ol) {
  @apply list-decimal;
}

.markdown-content :deep(li) {
  @apply mb-1;
}

.markdown-content :deep(code) {
  @apply bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded px-1 transition-colors duration-200;
}

.markdown-content :deep(pre) {
  @apply bg-gray-800 dark:bg-gray-900 text-white dark:text-gray-100 p-3 rounded overflow-x-auto my-4 transition-colors duration-200;
}

.markdown-content :deep(blockquote) {
  @apply border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 transition-colors duration-200;
}

.markdown-content :deep(a) {
  @apply text-blue-500 dark:text-blue-400 hover:underline transition-colors duration-200;
}

.markdown-content :deep(table) {
  @apply border-collapse border border-gray-300 dark:border-gray-600 my-4 transition-colors duration-200;
}

.markdown-content :deep(th), .markdown-content :deep(td) {
  @apply border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-700 dark:text-gray-300 transition-colors duration-200;
}

.markdown-content :deep(img) {
  @apply max-w-full h-auto my-4;
}
</style>