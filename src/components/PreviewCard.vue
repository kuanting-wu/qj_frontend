<template>
  <article
    class="flex flex-col self-stretch p-4 my-auto bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px] w-[332px]"
  >
    <!-- Video Thumbnail -->
    <div class="relative w-full h-48 bg-neutral-100 overflow-hidden rounded-lg">
      <router-link :to="`/view/${id}`">
        <img
          :src="imageSrc"
          :alt="title"
          class="absolute top-0 left-0 w-full h-full object-cover"
        />
      </router-link>
    </div>

    <!-- Post Details -->
    <div class="flex gap-4 items-center mt-4 w-full">
      <!-- Avatar Image -->
      <router-link :to="`/profile/${user_name}`">
        <img
          :src="avatarSrc"
          :alt="`${name}'s avatar`"
          class="object-contain shrink-0 self-stretch my-auto w-10 rounded-full aspect-square"
        />
      </router-link>

      <!-- Title and Metadata -->
      <div
        class="flex flex-col flex-1 shrink self-stretch my-auto basis-0 min-w-[240px]"
      >
        <router-link :to="`/view/${id}`">
          <h2
            class="leading-tight text-black font-bold text-[length:var(--sds-typography-subheading-size-medium)]"
          >
            {{ title }}
          </h2>
        </router-link>
        <div
          class="flex gap-10 justify-between items-center w-full leading-snug font-[number:var(--sds-typography-body-font-weight-regular)] text-[color:var(--sds-color-text-default-secondary)] text-[length:var(--sds-typography-body-size-small)]"
        >
          <router-link :to="`/profile/${user_name}`">
            <div class="self-stretch my-auto">{{ name }} - {{ belt }}</div>
          </router-link>
          <time class="self-stretch my-auto">{{ formattedDate }}</time>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import axios from "axios";

export default {
  name: "PreviewCard",
  props: {
    index: Number, // Receiving the index to verify order
    id: String,
    videoId: String,
    videoPlatform: String,
    title: String,
    user_name: String,
    name: String,
    belt: String,
    avatarSrc: String,
    createdAt: String,
  },
  setup(props) {
    // Destructure props for easier access
    const {
      id,
      videoId,
      videoPlatform,
      title,
      user_name,
      name,
      belt,
      avatarSrc,
      createdAt,
    } = props;

    // Ref to store the Bilibili thumbnail URL
    const bilibiliThumbnail = ref("");

    // Function to fetch Bilibili thumbnail
    const getThumbnail = async () => {
      try {
        const response = await axios.get(`https://api.bilibili.com/x/web-interface/view?bvid=${videoId}`);
        bilibiliThumbnail.value = response.data.data.pic;
      } catch (error) {
        console.error("Error fetching Bilibili thumbnail:", error);
      }
    };

    // Run getThumbnail if videoPlatform is Bilibili
    onMounted(() => {
      if (videoPlatform === "Bilibili") {
        getThumbnail();
      }
    });

    // Compute image source based on video platform
    const imageSrc = computed(() => {
      if (videoPlatform === "YouTube") {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      } else if (videoPlatform === "Bilibili" && bilibiliThumbnail.value) {
        return bilibiliThumbnail.value;
      } else {
        return `https://example.com/default-image.jpg`; // Fallback image
      }
    });

    // Format createdAt to a more readable date
    const formattedDate = computed(() => {
      return new Date(createdAt).toLocaleDateString();
    });

    return {
      imageSrc,
      formattedDate,
      id,
      title,
      user_name,
      name,
      belt,
      avatarSrc,
    };
  },
};
</script>
