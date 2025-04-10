<template>
  <div class="markdown-editor-container">
    <div class="mb-2 flex justify-between">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">{{ label }}</label>
      <div class="text-xs text-gray-500 dark:text-gray-400 flex gap-2 transition-colors duration-200">
        <button 
          type="button" 
          class="flex items-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded transition-colors duration-200"
          @click="togglePreview"
        >
          <span v-if="isPreview">Edit</span>
          <span v-else>Preview</span>
        </button>
        <button 
          type="button" 
          class="flex items-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded transition-colors duration-200"
          @click="toggleFullscreen"
        >
          <span v-if="isFullscreen">Exit Fullscreen</span>
          <span v-else>Fullscreen</span>
        </button>
      </div>
    </div>
    
    <div 
      :class="[
        isFullscreen ? 'fixed inset-0 z-50 bg-gray-50 dark:bg-gray-800 p-4' : 'relative'
      ]"
    >
      <!-- Editor -->
      <div v-if="!isPreview" class="h-full">
        <textarea
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          class="w-full h-full p-3 min-h-[200px] focus:ring-blue-500 focus:border-transparent block rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-200"
          :placeholder="placeholder"
          :disabled="disabled"
        ></textarea>
      </div>
      
      <!-- Preview -->
      <div v-else class="p-3 min-h-[200px] markdown-preview prose prose-sm dark:prose-invert max-w-none transition-colors duration-200">
        <div v-if="!modelValue" class="text-gray-500 dark:text-gray-400 italic transition-colors duration-200">No content to preview</div>
        <div v-else v-html="renderedMarkdown"></div>
      </div>

      <!-- Toolbar -->
      <div v-if="!isPreview" class="p-2 flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-700 rounded-b-md transition-colors duration-200">
        <button
          v-for="button in toolbarButtons"
          :key="button.label"
          @click="button.custom ? button.custom() : insertMarkdown(button.insert)"
          type="button"
          class="text-xs bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 px-2 py-1 rounded transition-colors duration-200"
          :title="button.label"
        >
          {{ button.label }}
        </button>
      </div>
    </div>
    
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{{ error }}</p>
    <p v-if="hint" class="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">{{ hint }}</p>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { marked } from 'marked';

export default {
  name: 'MarkdownEditor',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'Notes'
    },
    placeholder: {
      type: String,
      default: 'Write your notes in Markdown format...'
    },
    hint: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    videoTime: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'request-time'],
  setup(props, { emit }) {
    const isPreview = ref(false);
    const isFullscreen = ref(false);
    
    const togglePreview = () => {
      isPreview.value = !isPreview.value;
    };
    
    const toggleFullscreen = () => {
      isFullscreen.value = !isFullscreen.value;
    };
    
    const renderedMarkdown = computed(() => {
      if (!props.modelValue) return '';
      try {
        return marked(props.modelValue);
      } catch (error) {
        console.error('Error parsing markdown:', error);
        return '<p>Error rendering markdown</p>';
      }
    });
    
    // Request time from parent component then insert timestamp
    const insertTimestamp = () => {
      // Emit event to request the current time from parent component
      emit('request-time');
    };
    
    // Watch for videoTime changes to insert the timestamp
    watch(() => props.videoTime, (newTime) => {
      if (newTime) {
        const timestampHeading = `\n### ${newTime}\n`;
        insertMarkdown(timestampHeading);
      }
    });
    
    const insertMarkdown = (template) => {
      const textArea = document.querySelector('.markdown-editor-container textarea');
      if (!textArea) return;
      
      const startPos = textArea.selectionStart;
      const endPos = textArea.selectionEnd;
      const selectedText = props.modelValue ? props.modelValue.substring(startPos, endPos) : '';
      const beforeText = props.modelValue ? props.modelValue.substring(0, startPos) : '';
      const afterText = props.modelValue ? props.modelValue.substring(endPos) : '';
      
      let insertion = template;
      
      // If text is selected, replace placeholder with selection
      if (selectedText) {
        insertion = template.replace('$1', selectedText);
      }
      
      const newValue = beforeText + insertion + afterText;
      
      // Update the model value
      textArea.focus();
      
      // Emit the update
      emit('update:modelValue', newValue);
    };
    
    const insertHyperlink = () => {
      const textArea = document.querySelector('.markdown-editor-container textarea');
      if (!textArea) return;
      
      const startPos = textArea.selectionStart;
      const endPos = textArea.selectionEnd;
      const selectedText = props.modelValue ? props.modelValue.substring(startPos, endPos) : '';
      const beforeText = props.modelValue ? props.modelValue.substring(0, startPos) : '';
      const afterText = props.modelValue ? props.modelValue.substring(endPos) : '';
      
      const linkText = selectedText || 'Link text';
      const insertion = `[${linkText}](https://)`;
      
      const newValue = beforeText + insertion + afterText;
      textArea.focus();
      
      emit('update:modelValue', newValue);
    };
    
    // This function is already defined above
    
    const toolbarButtons = [
      { label: 'H1', insert: '# $1' },
      { label: 'H2', insert: '## $1' },
      { label: 'H3', insert: '### $1' },
      { label: 'Bold', insert: '**$1**' },
      { label: 'Italic', insert: '*$1*' },
      { label: 'Code', insert: '`$1`' },
      { label: 'Quote', insert: '> $1' },
      { label: 'Link', custom: insertHyperlink },
      { label: 'Time', custom: insertTimestamp },
      { label: 'List', insert: '\n- Item 1\n- Item 2\n- Item 3' },
      { label: 'Numbered List', insert: '\n1. Item 1\n2. Item 2\n3. Item 3' },
      { label: 'Table', insert: '\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |' },
      { label: 'Image', insert: '![alt text](image-url)' }
    ];
    
    return {
      isPreview,
      isFullscreen,
      togglePreview,
      toggleFullscreen,
      renderedMarkdown,
      insertMarkdown,
      toolbarButtons,
      insertHyperlink,
      insertTimestamp
    };
  }
};
</script>

<style scoped>
.markdown-editor-container {
  @apply w-full;
}

.markdown-preview :deep(h1) {
  @apply text-2xl font-bold mb-4;
}

.markdown-preview :deep(h2) {
  @apply text-xl font-semibold mt-6 mb-3;
}

.markdown-preview :deep(h3) {
  @apply text-lg font-medium mt-5 mb-2;
}

.markdown-preview :deep(p) {
  @apply my-3;
}

.markdown-preview :deep(ul), .markdown-preview :deep(ol) {
  @apply my-3 ml-6;
}

.markdown-preview :deep(ul) {
  @apply list-disc;
}

.markdown-preview :deep(ol) {
  @apply list-decimal;
}

.markdown-preview :deep(li) {
  @apply mb-1;
}

.markdown-preview :deep(code) {
  @apply bg-gray-200 rounded px-1;
}

.markdown-preview :deep(pre) {
  @apply bg-gray-800 text-white p-3 rounded overflow-x-auto my-4;
}

.markdown-preview :deep(blockquote) {
  @apply border-l-4 border-gray-300 pl-4 italic;
}

.markdown-preview :deep(a) {
  @apply text-blue-500 hover:underline;
}

.markdown-preview :deep(table) {
  @apply border-collapse border border-gray-300 my-4;
}

.markdown-preview :deep(th), .markdown-preview :deep(td) {
  @apply border border-gray-300 px-3 py-2;
}

.markdown-preview :deep(img) {
  @apply max-w-full h-auto my-4;
}
</style>