<template>
  <article
    class="flex self-stretch p-4 my-auto bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:translate-y-[-2px] w-full">
    <!-- Game Plan Details in a Row -->
    <div class="flex flex-row items-center gap-4 w-full">
      <!-- Title -->
      <router-link :to="{ name: 'ViewGamePlan', params: { id: gamePlan.id }}"
                   class="flex-shrink-0 w-32">
        <h2
          class="leading-tight text-black dark:text-white font-bold text-lg truncate-title transition-colors duration-200">
          {{ gamePlan.name || 'Untitled Game Plan' }}
        </h2>
      </router-link>

      <!-- Description -->
      <div class="flex-grow text-gray-600 dark:text-gray-400 truncate">
        {{ gamePlan.description || 'N/A' }}
      </div>

      <!-- Profile Info (as a single unit) -->
      <div class="flex-shrink-0 w-40">
        <ProfileCard
          :owner-name="gamePlan.ownerName"
          :avatar-url="gamePlan.avatarUrl"
          :belt="gamePlan.belt"
          :academy="gamePlan.academy"
        />
      </div>

      <!-- Date and Public Status -->
      <div class="flex-shrink-0 flex flex-col items-end gap-1 w-28">
        <time class="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">
          {{ formattedDate }}
        </time>
        <time v-if="gamePlan.updatedAt && gamePlan.updatedAt !== gamePlan.createdAt"
              class="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">
          Updated: {{ formattedUpdatedDate }}
        </time>
        <span class="inline-block text-xs font-medium px-2 py-1 rounded-full text-right"
              :class="getPublicStatusClass(gamePlan.publicStatus)">
          {{ formatPublicStatus(gamePlan.publicStatus) }}
        </span>
      </div>
    </div>
  </article>
</template>

<script>
import { computed } from "vue";
import ProfileCard from "./ProfileCard.vue"; // Adjust path as needed
import gamePlanProps from "@/schemas/gamePlanProps.js"; // Import the schema

export default {
  name: "PreviewRow",
  props: gamePlanProps,
  components: {
    ProfileCard,
  },
  setup(props) {
    const formattedDate = computed(() => {
      if (!props.gamePlan.createdAt) return "Unknown date";
      try {
        return new Date(props.gamePlan.createdAt).toLocaleDateString();
      } catch (error) {
        console.error("Date formatting error:", error);
        return "Invalid date";
      }
    });

    const formattedUpdatedDate = computed(() => {
      if (!props.gamePlan.updatedAt) return "";
      try {
        return new Date(props.gamePlan.updatedAt).toLocaleDateString();
      } catch (error) {
        console.error("Date formatting error:", error);
        return "Invalid date";
      }
    });

    const formatPublicStatus = (status) => {
      if (!status) return "Public";
      const statusLower = status.toLowerCase();
      if (statusLower === "public") return "Public";
      if (statusLower === "private") return "Private";
      if (statusLower === "subscribers" || statusLower === "subscribers only") return "Subscribers";
      return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const getPublicStatusClass = (status) => {
      const normalizedStatus = formatPublicStatus(status).toLowerCase();
      const statusClasses = {
        public: "bg-green-100 text-green-800",
        private: "bg-red-100 text-red-800",
        subscribers: "bg-yellow-100 text-yellow-800",
      };
      return statusClasses[normalizedStatus] || "bg-gray-100 text-gray-800";
    };

    return {
      formattedDate,
      formattedUpdatedDate,
      getPublicStatusClass,
      formatPublicStatus,
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
</style>