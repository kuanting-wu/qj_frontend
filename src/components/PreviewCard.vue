<template>
  <article class="flex flex-col self-stretch p-4 my-auto bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px] w-[332px]">
    <div class="flex relative justify-center items-start bg-neutral-100">
      <img v-if="true" :src="`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`">
      <img v-else :src="imageSrc" :alt="title" class="object-contain absolute z-0 shrink-0 self-start h-12 aspect-[0.98] bottom-[61px] left-[127px] right-[126px] w-[47px]" />
    </div>
    <div class="flex gap-4 items-center mt-4 w-full">
      <img :src="avatarSrc" :alt="`${name}'s avatar`" class="object-contain shrink-0 self-stretch my-auto w-10 rounded-full aspect-square" />
      <div class="flex flex-col flex-1 shrink self-stretch my-auto basis-0 min-w-[240px]">
        <h2 class="leading-tight text-black font-[number:var(--sds-typography-subheading-font-weight)] text-[length:var(--sds-typography-subheading-size-medium)]">
          {{ title }}
        </h2>
        <div class="flex gap-10 justify-between items-center w-full leading-snug font-[number:var(--sds-typography-body-font-weight-regular)] text-[color:var(--sds-color-text-default-secondary)] text-[length:var(--sds-typography-body-size-small)]">
          <div class="self-stretch my-auto">{{ name }}</div>
          <time class="self-stretch my-auto">{{ sequenceStartTime }}</time>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'PostCard',
  props: [
    'key',
    'title',
    'videoId',
    'sequenceStartTime',
    'postTime',
    'avatarSrc'
  ]
};

</script>