<template>
  <div class="flex flex-col px-16 py-12 bg-white dark:bg-gray-900 max-md:px-5 transition-colors duration-200">
    <h1 class="w-16 tracking-tight leading-tight whitespace-nowrap text-gray-800 dark:text-gray-100 text-2xl font-semibold transition-colors duration-200">
      Posts
    </h1>
    <main class="flex flex-wrap gap-16 justify-between items-center mt-8 w-full max-md:max-w-full">
      <PreviewCard
        v-for="(post, index) in posts"
        :key="index"
        :title="post.title"
        :videoId="post.videoId"
        :sequenceStartTime="post.sequenceStartTime"
        :postTime="post.postTime"
        :avatarSrc="post.avatarSrc"
      />
    </main>
  </div>
</template>

<script>
import PreviewCard from './PreviewCard.vue';

export default {
  name: 'CardGrid',
  components: {
    PreviewCard
  },
  data() {
    return {
      posts: [
        {
        key: "index",
        title: "AAA",
        videoId: "KxRkF5_dBlo",
        sequenceStartTime: "5:01",
        postTime: "10/22/2024",
        avatarSrc: 'https://cdn.builder.io/api/v1/image/assets/TEMP/c7fdd9b8e8cba9d4d04b56bc84a10a1d3ca20d5b41e8dd7993f83747a8e7f864?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1',
        },
        {
        key: "index2",
        title: "AAAA",
        videoId: "KxRkF5_dBlo",
        sequenceStartTime: "5:01",
        postTime: "10/22/2024",
        avatarSrc: 'https://cdn.builder.io/api/v1/image/assets/TEMP/c7fdd9b8e8cba9d4d04b56bc84a10a1d3ca20d5b41e8dd7993f83747a8e7f864?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1',
        }
      ],
    };
  },
};
</script>

<style scoped>
builder-component {
  max-width: none !important;
}
</style>