<template>
  <div
    class="w-1 cursor-col-resize hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150 md:flex hidden"
    @mousedown="startResize"></div>
</template>

<script>
import { ref, onMounted, onUnmounted, defineEmits, defineProps } from "vue";

export default {
  name: "ResizableDivider",
  props: {
    initialWidth: {
      type: Number,
      default: 50, // Default starting width (percentage)
    },
    minWidth: {
      type: Number,
      default: 20, // Minimum width (percentage)
    },
    maxWidth: {
      type: Number,
      default: 80, // Maximum width (percentage)
    },
    containerSelector: {
      type: String,
      default: ".resizable-container", // CSS selector for the container
    },
  },
  emits: ["update:width"],
  setup(props, { emit }) {
    const width = ref(props.initialWidth); // Local width state
    const isResizing = ref(false);

    const startResize = (e) => {
      isResizing.value = true;
      document.addEventListener("mousemove", handleResize);
      document.addEventListener("mouseup", stopResize);
      e.preventDefault();
    };

    const handleResize = (e) => {
      if (!isResizing.value) return;
      // Find the container using the provided selector or use document.body as fallback
      const container = props.containerSelector 
        ? document.querySelector(props.containerSelector) || document.body 
        : document.body;
      
      const containerWidth = container.clientWidth;
      const containerLeft = container.getBoundingClientRect().left;
      const newWidth = ((e.clientX - containerLeft) / containerWidth) * 100;
      
      // Apply min/max constraints
      width.value = Math.min(Math.max(newWidth, props.minWidth), props.maxWidth);
      
      // Notify parent of new width
      emit("update:width", width.value);
      
      // Debug info if needed
      // console.log(`Resizing: ${width.value}%, Container: ${props.containerSelector}, Width: ${containerWidth}px`);
    };

    const stopResize = () => {
      isResizing.value = false;
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", stopResize);
    };

    onMounted(() => {
      emit("update:width", width.value); // Emit initial width
    });

    onUnmounted(() => {
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", stopResize);
    });

    return {
      width,
      isResizing,
      startResize,
    };
  },
};
</script>

<style scoped>
/* No additional styles needed; all styling is in the template */
</style>