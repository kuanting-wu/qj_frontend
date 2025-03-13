<template>
  <div class="flex flex-col h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
     <!-- Main Content with Sidebar and Document Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar Menu -->
      <aside class="w-1/4 min-w-[240px] border-r border-zinc-300 dark:border-zinc-700 p-4 bg-gray-100 dark:bg-gray-800 transition-colors duration-200">
        <nav class="flex flex-col gap-2">
          <button
            v-for="section in sections"
            :key="section.id"
            @click="setActiveSection(section)"
            :class="{
              'bg-gray-200 dark:bg-gray-700': activeSection === section,
              'hover:bg-gray-300 dark:hover:bg-gray-600': true
            }"
            class="p-2 text-left rounded-lg text-gray-800 dark:text-gray-200 transition-colors duration-200"
          >
            {{ section.title }}
          </button>
        </nav>
      </aside>

      <!-- Document Content -->
      <main class="flex-1 p-6 overflow-auto">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100 transition-colors duration-200">{{ activeSection.title }}</h2>
        <p class="text-gray-700 dark:text-gray-300 transition-colors duration-200">{{ activeSection.content }}</p>
      </main>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const activeSection = ref(null);
    const sections = ref([
      { id: 1, title: "Introduction", content: "Content for Introduction" },
      { id: 2, title: "Getting Started", content: "Content for Getting Started" },
      { id: 3, title: "Features", content: "Content for Features" },
      // Add more sections as needed
    ]);

    // Initial active section
    activeSection.value = sections.value[0];

    const setActiveSection = (section) => {
      activeSection.value = section;
    };

    return {
      sections,
      activeSection,
      setActiveSection,
    };
  },
};
</script>

<style scoped>
.absolute {
  z-index: 50;
}
</style>
