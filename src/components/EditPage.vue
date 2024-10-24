<template>
  <main class="flex flex-col px-24 py-16 bg-white font-[number:var(--sds-typography-body-font-weight-regular)] min-w-[240px] text-[length:var(--sds-typography-body-size-medium)] max-md:px-5">
    <section class="flex flex-wrap gap-8 text-[color:var(--sds-color-text-default-default)] max-md:max-w-full">
      <form class="flex flex-col min-w-[300px] w-[300px]">
        <h1 class="w-full text-2xl tracking-tight leading-tight font-[number:var(--sds-typography-heading-font-weight)]">
          Text Heading
        </h1>
        <div class="flex flex-col mt-2 w-full leading-snug">
          <label for="videoUrl">Video URL</label>
          <input id="videoUrl" type="url" class="overflow-hidden flex-1 shrink px-4 py-3 mt-1 w-full whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300 min-h-[80px] min-w-[240px]" placeholder="Enter video URL" />
        </div>
        <div class="flex flex-col mt-2 w-full">
          <label for="movementType">Movement Type</label>
          <input id="movementType" type="text" class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px]" placeholder="Enter movement type" />
        </div>
        <div class="flex flex-col mt-2 w-full">
          <label for="startingPosition">Starting Position</label>
          <input id="startingPosition" type="text" class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px]" placeholder="Enter starting position" />
        </div>
        <div class="flex flex-col mt-2 w-full">
          <label for="endingPosition">Ending Position</label>
          <input id="endingPosition" type="text" class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px]" placeholder="Enter ending position" />
        </div>
        <div class="flex flex-col mt-2 w-full">
          <label for="sequenceStartTime">Sequence Start Time</label>
          <input id="sequenceStartTime" type="time" class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px]" />
        </div>
        <div class="flex flex-col mt-2 w-full">
          <label for="publicStatus">Public Status</label>
          <select id="publicStatus" class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px]">
            <option value="">Select status</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div class="flex flex-col mt-2 w-full whitespace-nowrap">
          <label for="language">Language</label>
          <select id="language" class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-1 w-full leading-none bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px]">
            <option value="">Select language</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
      </form>
      <div class="flex overflow-hidden flex-col justify-center px-px my-auto leading-snug whitespace-nowrap min-h-[607px] min-w-[420px] w-[700px] max-md:max-w-full">
        <div class="flex flex-col flex-1 w-full max-md:max-w-full">
          <label for="notes" class="max-md:max-w-full">Notes</label>
          <textarea id="notes" class="overflow-hidden flex-1 shrink px-4 pt-3 mt-1 w-full bg-white rounded-lg border border-solid border-zinc-300 min-h-[581px] min-w-[240px] pb-[547px] max-md:pb-24 max-md:max-w-full" placeholder="Enter notes here"></textarea>
        </div>
      </div>
    </section>
    <footer class="flex flex-wrap gap-6 justify-center items-center p-16 mt-6 w-full leading-none whitespace-nowrap bg-white max-md:px-5 max-md:max-w-full">
      <button type="button" class="overflow-hidden gap-2 self-stretch p-3 my-auto rounded-lg border border-solid bg-neutral-200 border-neutral-500 text-[color:var(--sds-color-text-default-default)]">
        Delete
      </button>
      <button type="submit" class="overflow-hidden gap-2 self-stretch p-3 my-auto rounded-lg border border-solid bg-zinc-800 border-zinc-800 text-[color:var(--sds-color-text-brand-on-brand)]">
        Submit
      </button>
    </footer>
  </main>
</template>

<script>
export default {
  name: 'TextHeadingForm'
}
</script>

<style scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>