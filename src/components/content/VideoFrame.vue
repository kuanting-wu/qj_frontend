<template>
  <div class="flex flex-col gap-6">
    <iframe
      v-if="videoId"
      id="video-iframe"
      :src="getEmbedUrl(videoId, videoPlatform, sequenceStartTime)"
      width="100%"
      height="auto"
      scrolling="no"
      border="0"
      frameborder="no"
      framespacing="0"
      allowfullscreen="true"
      class="aspect-video rounded-lg shadow-sm"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
    ></iframe>

    <img
      v-else
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/2f69a4548ace8090c05433e11f57f205ac0b85a8b70f1642dc2ef2de05544a72?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1"
      alt="Video thumbnail"
      class="object-contain aspect-video w-full"
    />
  </div>
</template>

<script>
import { convertToSeconds } from '@/utils/time';

export default {
  name: 'VideoFrame',
  props: {
    videoId: {
      type: String,
      required: true,
      default: ''
    },
    videoPlatform: {
      type: String,
      required: true,
      default: ''
    },
    sequenceStartTime: {
      type: String,
      required: false,
      default: '0'
    }
  },
  setup(props) {
    const getEmbedUrl = (videoId, platform, startTime) => {
      const startSeconds = convertToSeconds(startTime || '0'); // Fallback to '0' if startTime is undefined
      if (platform === 'YouTube') {
        return `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&rel=0&enablejsapi=1`;
      }
      if (platform === 'Bilibili') {
        return `https://player.bilibili.com/player.html?bvid=${videoId}&t=${startSeconds}&no_related=1`;
      }
      return '';
    };

    return { getEmbedUrl };
  }
};
</script>

<style scoped>
@media (max-width: 768px) {
  #video-iframe {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
}
</style>