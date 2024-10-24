<template>
  <div class="flex flex-wrap gap-10 px-20 py-8 bg-white">
    <aside class="flex flex-col justify-start p-4 w-60 bg-white rounded-lg border border-solid border-zinc-300 font-[number:var(--sds-typography-body-font-weight-regular)] text-[color:var(--sds-color-text-default-default)] text-[length:var(--sds-typography-body-size-medium)]">
      <div class="flex flex-col justify-center w-auto">
        <div class="flex flex-col w-full">
          <label for="postBy" class="leading-snug">Post By</label>
          <input id="postBy" type="text" class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300" aria-label="Post By" />
        </div>
        <div class="flex flex-col mt-2 w-full">
          <label for="movementType" class="leading-6">Movement Type</label>
          <input id="movementType" type="text" class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300" aria-label="Movement Type" />
        </div>
        <div class="flex flex-col mt-2 w-full">
          <label for="startingPosition" class="leading-6">Starting Position</label>
          <input id="startingPosition" type="text" class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300" aria-label="Starting Position" />
        </div>
        <div class="flex flex-col mt-2 w-full">
          <label for="endingPosition" class="leading-6">Ending Position</label>
          <input id="endingPosition" type="text" class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300" aria-label="Ending Position" />
        </div>
        <div class="flex flex-col mt-2 w-full">
          <label for="sequenceStartTime" class="leading-6">Sequence Start Time</label>
          <input id="sequenceStartTime" type="text" class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300" aria-label="Sequence Start Time" />
        </div>
        <div class="flex flex-col mt-2 w-full whitespace-nowrap">
          <label for="status" class="leading-snug">Status</label>
          <input id="status" type="text" class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none bg-white rounded-lg border border-solid border-zinc-300" aria-label="Status" />
        </div>
        <div class="flex flex-col mt-2 w-full whitespace-nowrap">
          <label for="language" class="leading-6">Language</label>
          <input id="language" type="text" class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none bg-white rounded-lg border border-solid border-zinc-300" aria-label="Language" />
        </div>
      </div>
    </aside>
    <main class="flex flex-col flex-1 shrink self-start rounded-lg basis-8 min-w-[240px] max-md:max-w-full">
      <div class="flex flex-wrap gap-10 justify-between items-center w-full leading-none font-[number:var(--sds-typography-body-font-weight-regular)] text-[length:var(--sds-typography-body-size-medium)] max-md:max-w-full">
        <form class="flex overflow-hidden gap-2.5 items-center self-stretch my-auto whitespace-nowrap min-w-[240px] text-[color:var(--sds-color-text-default-tertiary)]">
          <div class="flex gap-6 items-center self-stretch my-auto min-w-[240px] w-[327px]">
            <div class="flex overflow-hidden flex-1 shrink gap-2 items-center self-stretch px-4 py-3 my-auto w-full bg-white rounded-full border border-solid basis-0 border-zinc-300 min-w-[240px]">
              <label for="searchInput" class="sr-only">Search</label>
              <input id="searchInput" type="search" class="flex-1 shrink self-stretch my-auto basis-0" placeholder="Search" aria-label="Search" />
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/ceee35d297d4c0fe5453107e73e7fbb494e6164c747eb1afdb410a1be3052fd4?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" class="object-contain shrink-0 self-stretch my-auto w-4 aspect-square" alt="" />
            </div>
          </div>
          <button type="submit" class="sr-only">Submit Search</button>
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/a5f3b994123d631859e61cfed8cf5cf081e13390dff6f69b585f7484b1c38100?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" class="object-contain shrink-0 self-stretch my-auto w-10 aspect-square" alt="" />
        </form>
        <nav class="flex gap-2 items-start self-stretch my-auto min-w-[240px] text-[color:var(--sds-color-text-brand-tertiary)]">
          <button class="flex gap-2 justify-center items-center p-2 whitespace-nowrap rounded-lg bg-zinc-800 text-neutral-100">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/9d1653cc14e39c3046030201a565cd1b83ef71da82354897202129da1ce32c18?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" class="object-contain shrink-0 self-stretch my-auto w-4 text-white aspect-square" alt="" />
            <span class="self-stretch my-auto text-neutral-100">New</span>
          </button>
          <button class="gap-2 self-stretch p-2 rounded-lg bg-neutral-100">Most Up Votes</button>
          <button class="gap-2 self-stretch p-2 rounded-lg bg-neutral-100">My Posts</button>
        </nav>
      </div>
      <section class="flex flex-wrap gap-6 items-center mt-12 w-full max-md:mt-10 max-md:max-w-full">
        <PreviewCard
        v-for="(post, index) in posts"
        :key="index"
        :title="post.title"
        :name="post.name"
        :postTime="post.postTime"
        :imageSrc="post.imageSrc"
        :avatarSrc="post.avatarSrc"
      />
      </section>
    </main>
  </div>
</template>

<script>
import PreviewCard from './PreviewCard.vue';

export default {
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
  }
}
</script>

