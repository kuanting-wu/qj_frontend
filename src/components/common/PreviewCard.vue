<template>
  <article
    class="flex flex-col self-stretch p-4 my-auto bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:translate-y-[-2px] w-full">
    <!-- Video Thumbnail -->
    <div class="relative w-full bg-neutral-100 dark:bg-neutral-700 overflow-hidden rounded-lg"
      style="aspect-ratio: 16/9">
      <div @click="navigateToPost">
        <img :src="imageSrc" :alt="props.title" class="absolute top-0 left-0 w-full h-full object-cover" />
      </div>
    </div>

    <!-- Post Details -->
    <div class="flex flex-col gap-2 mt-4 w-full">
      <!-- Title -->
      <div @click="navigateToPost">
        <h2
          class="leading-tight text-black dark:text-white font-bold text-lg truncate-title transition-colors duration-200">
          {{ props.title }}
        </h2>
      </div>

      <!-- Profile Info and Metadata -->
      <div class="flex items-center justify-between mt-1 w-full gap-4">
        <ProfileCard :owner-name="props.ownerName" :avatar-url="props.avatarUrl" :belt="props.belt"
          :academy="props.academy" />
        <div class="flex flex-col items-end gap-1">
          <time v-if="props.updatedAt && props.updatedAt !== props.createdAt"
            class="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">
            {{ formattedUpdatedDate }}
          </time>
          <time v-else class="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">{{ formattedDate
          }}</time>
          <div>
            <span class="inline-block text-xs font-medium px-2 py-1 rounded-full text-right"
              :class="getPublicStatusClass(props.publicStatus)">
              {{ formatPublicStatus(props.publicStatus) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { computed, ref, onMounted} from "vue";
import { useRouter } from "vue-router";
import { BACKEND_URL } from "@/utils/config.js";
import postStructure from "@/data/postStructure.json"; // Import postStructure
import ProfileCard from "./ProfileCard.vue";

export default {
  name: "PreviewCard",
  props: {
    ...postStructure, // Spread postStructure as default prop structure
  },
  components: {
    ProfileCard,
  },
  setup(props) {
    const router = useRouter()
    const bilibiliThumbnail = ref("");

    const getThumbnail = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/proxy-image?bvid=${props.videoId}`);
        if (response.ok) {
          const blob = await response.blob();
          bilibiliThumbnail.value = URL.createObjectURL(blob);
        } else {
          console.error("Error fetching the thumbnail:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching Bilibili thumbnail through proxy:", error);
      }
    };

    onMounted(() => {
      if (props.videoPlatform === "Bilibili") {
        getThumbnail();
      }
      console.log("PreviewCard props:", props);
    });

    const imageSrc = computed(() => {
      if (props.videoPlatform === "YouTube") {
        return `https://img.youtube.com/vi/${props.videoId}/hqdefault.jpg`;
      } else if (props.videoPlatform === "Bilibili" && bilibiliThumbnail.value) {
        return bilibiliThumbnail.value;
      } else {
        return `https://example.com/default-image.jpg`; // Replace with a local fallback if needed
      }
    });

    const formattedDate = computed(() => {
      return props.createdAt ? new Date(props.createdAt).toLocaleDateString() : "";
    });

    const formattedUpdatedDate = computed(() => {
      return props.updatedAt ? new Date(props.updatedAt).toLocaleDateString() : "";
    });

    const formatPublicStatus = (status) => {
      return status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "Unknown";
    };

    const getPublicStatusClass = (status) => {
      const statusClasses = {
        public: "bg-green-100 text-green-800",
        private: "bg-red-100 text-red-800",
        draft: "bg-yellow-100 text-yellow-800",
      };
      return statusClasses[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
    };

    const navigateToPost = () => {
      const routeData = {
        name: 'ViewPost',
        params: { id: props.id }
      }
      console.log('Navigating with:', routeData)
      router.push(routeData)
    }

    return {
      imageSrc,
      formattedDate,
      formattedUpdatedDate,
      navigateToPost,
      formatPublicStatus,
      getPublicStatusClass,
      props,
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