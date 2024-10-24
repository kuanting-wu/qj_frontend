<template>
  <div class="flex flex-col px-16 py-12 bg-white max-md:px-5">
    <h1 class="w-16 tracking-tight leading-tight whitespace-nowrap font-[number:var(--sds-typography-heading-font-weight)] text-[color:var(--sds-color-text-default-default)] text-[length:var(--sds-typography-heading-size-base)]">
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