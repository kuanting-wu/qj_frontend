<template>
  <main class="flex flex-col px-24 py-16 bg-white min-w-[240px] max-md:px-5">
    <section class="flex flex-wrap flex-1 content-center gap-8 size-full max-md:max-w-full">
      <iframe v-if="true" src="//player.bilibili.com/player.html?isOutside=true&aid=249640766&bvid=BV18v411K7Z7&cid=384432698&p=1" sscrolling="" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="aspect-video flex-1 "></iframe>
      <img v-else loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/2f69a4548ace8090c05433e11f57f205ac0b85a8b70f1642dc2ef2de05544a72?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" alt="Video thumbnail" class="object-contain flex-1 shrink self-stretch aspect-[1.86] basis-0 h-[360px] min-h-[360px] min-w-[640px] w-[640px] max-md:max-w-full" />
      
      <div class="flex flex-col py-2 min-w-[240px] w-[350px]">
        <header class="flex overflow-hidden gap-2.5 items-center w-full">
          <h1 class="flex flex-1 shrink gap-2.5 items-center self-stretch py-1 my-auto text-2xl tracking-tight leading-tight basis-0 font-[number:var(--sds-typography-heading-font-weight)] min-w-[240px] text-[color:var(--sds-color-text-default-default)]">
            Text Heading
          </h1>
          <button class="flex gap-2.5 justify-center items-center self-stretch my-auto w-6" aria-label="More options">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/4728a160951595f6e5389159b3e8e714f7e82c751a59139a4751cce2c9ca8e56?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" alt="" class="object-contain self-stretch my-auto w-6 aspect-square" />
          </button>
        </header>
        <div class="flex gap-4 items-center mt-4 w-full whitespace-nowrap text-[length:var(--sds-typography-body-size-medium)]">
          <div class="flex gap-3 items-start self-stretch my-auto leading-snug w-[139px]">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/9d9a8229c3425236e37972b8b716e0073fb8e636867639a33bc23e00d9f35984?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" alt="User avatar" class="object-contain shrink-0 w-10 rounded-full aspect-square" />
            <div class="flex flex-col flex-1 shrink justify-between basis-0 min-h-[46px]">
              <div class="font-[number:var(--sds-typography-body-font-weight-strong)] text-[color:var(--sds-color-text-default-secondary)]">
                Name
              </div>
              <div class="font-[number:var(--sds-typography-body-font-weight-regular)] text-[color:var(--sds-color-text-default-tertiary)]">
                Description
              </div>
            </div>
          </div>
          <button class="flex overflow-hidden gap-2 justify-center items-center self-stretch p-2 my-auto leading-none bg-white rounded-lg border border-solid border-zinc-400 font-[number:var(--sds-typography-body-font-weight-regular)] text-[color:var(--sds-color-text-brand-default)]">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/057017f7dbfe75b1d43399f44e24c5bd044ebf2ce6d0122446d26ee8886b5fcb?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" alt="" class="object-contain shrink-0 self-stretch my-auto w-4 aspect-square" />
            <span class="self-stretch my-auto">0</span>
          </button>
          <button aria-label="Action 1">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/acbf67aca969c4139c246afcd593a834cc483248230f763a5fdaec316c1cf917?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" alt="" class="object-contain shrink-0 self-stretch my-auto w-6 aspect-square" />
          </button>
          <button aria-label="Action 2">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/2d842ba5f20161c5d394add2d4b2b5efe41e5b25c0ba850c14392c67973e8e9c?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" alt="" class="object-contain shrink-0 self-stretch my-auto w-6 aspect-square" />
          </button>
          <button aria-label="Action 3">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/62ec68088f17750b86b372f90f7d57d5ba91bb13331b2a55c348100b52ce1380?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" alt="" class="object-contain shrink-0 self-stretch my-auto w-6 aspect-square" />
          </button>
        </div>
        <div class="flex flex-col mt-4 w-full leading-snug text-black bg-white text-[length:var(--sds-typography-body-size-medium)]">
          <div class="flex overflow-hidden gap-10 justify-between items-center w-full bg-white">
            <div class="self-stretch my-auto font-semibold">Movement Type</div>
            <div class="self-stretch my-auto">Guard pass</div>
          </div>
          <div class="flex overflow-hidden gap-10 justify-between items-center mt-1 w-full bg-white">
            <div class="self-stretch my-auto font-semibold">Starting Position</div>
            <div class="self-stretch my-auto font-[number:var(--sds-typography-body-font-weight-regular)]">
              Open guard
            </div>
          </div>
          <div class="flex overflow-hidden gap-10 justify-between items-center mt-1 w-full bg-white">
            <div class="self-stretch my-auto font-semibold">Ending Position</div>
            <div class="self-stretch my-auto font-[number:var(--sds-typography-body-font-weight-regular)]">
              Side control
            </div>
          </div>
          <div class="flex overflow-hidden gap-10 justify-between items-center mt-1 w-full bg-white">
            <div class="self-stretch my-auto font-semibold">Sequence Starts Time</div>
            <div class="self-stretch my-auto font-[number:var(--sds-typography-body-font-weight-regular)]">
              5:01
            </div>
          </div>
          <div class="flex overflow-hidden gap-10 justify-between items-center mt-1 w-full bg-white">
            <div class="self-stretch my-auto font-semibold">Public Status</div>
            <div class="self-stretch my-auto font-[number:var(--sds-typography-body-font-weight-regular)]">
              Privite
            </div>
          </div>
          <div class="flex overflow-hidden gap-10 justify-between items-center mt-1 w-full whitespace-nowrap bg-white">
            <div class="self-stretch my-auto font-semibold">Language</div>
            <div class="self-stretch my-auto font-[number:var(--sds-typography-body-font-weight-regular)]">
              English
            </div>
          </div>
          <div class="flex overflow-hidden gap-10 justify-between items-center mt-1 w-full bg-white">
            <div class="self-stretch my-auto font-semibold">Post Time</div>
            <div class="self-stretch my-auto font-[number:var(--sds-typography-body-font-weight-regular)]">
              MM/DD/YYYY
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="flex flex-col py-8 mt-6 w-full leading-snug bg-white font-[number:var(--sds-typography-body-font-weight-regular)] text-[length:var(--sds-typography-body-size-medium)] max-md:max-w-full">
      <h2 class="tracking-tight leading-tight whitespace-nowrap font-[number:var(--sds-typography-heading-font-weight)] text-[color:var(--sds-color-text-default-default)] text-[length:var(--sds-typography-heading-size-base)] w-[67px]">
        Notes
      </h2>
      <ul class="list-none p-0">
        <li class="flex overflow-hidden flex-wrap gap-2.5 items-center mt-4 w-full bg-white max-md:max-w-full">
          <time class="self-stretch my-auto text-[color:var(--sds-color-text-default-secondary)]">Timestamp</time>
          <p class="self-stretch my-auto text-black">Note texts</p>
        </li>
        <li class="flex overflow-hidden flex-wrap gap-2.5 items-center mt-4 w-full bg-white max-md:max-w-full">
          <time class="self-stretch my-auto text-[color:var(--sds-color-text-default-secondary)]">Timestamp</time>
          <p class="self-stretch my-auto text-black">Note texts</p>
        </li>
        <li class="flex overflow-hidden flex-wrap gap-2.5 items-center mt-4 w-full bg-white max-md:max-w-full">
          <time class="self-stretch my-auto text-[color:var(--sds-color-text-default-secondary)]">Timestamp</time>
          <p class="self-stretch my-auto text-black">Note texts</p>
        </li>
        <li class="flex overflow-hidden flex-wrap gap-2.5 items-center mt-4 w-full bg-white max-md:max-w-full">
          <time class="self-stretch my-auto text-[color:var(--sds-color-text-default-secondary)]">Timestamp</time>
          <p class="self-stretch my-auto text-black">Note texts</p>
        </li>
        <li class="flex overflow-hidden flex-wrap gap-2.5 items-center mt-4 w-full bg-white max-md:max-w-full">
          <time class="self-stretch my-auto text-[color:var(--sds-color-text-default-secondary)]">Timestamp</time>
          <p class="self-stretch my-auto text-black">Note texts</p>
        </li>
        <li class="flex overflow-hidden flex-wrap gap-2.5 items-center mt-4 w-full bg-white max-md:max-w-full">
          <time class="self-stretch my-auto text-[color:var(--sds-color-text-default-secondary)]">Timestamp</time>
          <p class="self-stretch my-auto text-black">Note texts</p>
        </li>
      </ul>
    </section>
    <section class="flex flex-col py-8 mt-6 w-full leading-snug bg-white text-[length:var(--sds-typography-body-size-medium)] max-md:max-w-full">
      <h2 class="self-start tracking-tight leading-tight whitespace-nowrap font-[number:var(--sds-typography-heading-font-weight)] text-[color:var(--sds-color-text-default-default)] text-[length:var(--sds-typography-heading-size-base)]">
        Comments
      </h2>
      <article class="flex flex-wrap gap-2 items-start py-2 mt-4 w-full rounded-lg min-w-[240px] max-md:max-w-full">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/627b91dced9c8426bf48fc2d969a954670a66ff70203371f9ab4ba516f040d25?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" alt="Reviewer avatar" class="object-contain shrink-0 w-10 rounded-full aspect-square" />
        <div class="flex flex-col flex-1 shrink basis-0 min-w-[240px] max-md:max-w-full">
          <header class="flex gap-2 items-start self-start">
            <h3 class="font-[number:var(--sds-typography-body-font-weight-strong)] text-[color:var(--sds-color-text-default-secondary)]">
              Reviewer name
            </h3>
            <time class="font-[number:var(--sds-typography-body-font-weight-regular)] text-[color:var(--sds-color-text-default-tertiary)]">
              Date
            </time>
          </header>
          <p class="flex-1 shrink w-full font-[number:var(--sds-typography-body-font-weight-regular)] text-[color:var(--sds-color-text-default-default)] max-md:max-w-full">
            Review body
          </p>
        </div>
      </article>
      <article class="flex flex-wrap gap-2 items-start py-2 mt-4 w-full rounded-lg min-w-[240px] max-md:max-w-full">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/627b91dced9c8426bf48fc2d969a954670a66ff70203371f9ab4ba516f040d25?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" alt="Reviewer avatar" class="object-contain shrink-0 w-10 rounded-full aspect-square" />
        <div class="flex flex-col flex-1 shrink basis-0 min-w-[240px] max-md:max-w-full">
          <header class="flex gap-2 items-start self-start">
            <h3 class="font-[number:var(--sds-typography-body-font-weight-strong)] text-[color:var(--sds-color-text-default-secondary)]">
              Reviewer name
            </h3>
            <time class="font-[number:var(--sds-typography-body-font-weight-regular)] text-[color:var(--sds-color-text-default-tertiary)]">
              Date
            </time>
          </header>
          <p class="flex-1 shrink w-full font-[number:var(--sds-typography-body-font-weight-regular)] text-[color:var(--sds-color-text-default-default)] max-md:max-w-full">
            Review body
          </p>
        </div>
      </article>
      <article class="flex flex-wrap gap-2 items-start py-2 mt-4 w-full rounded-lg min-w-[240px] max-md:max-w-full">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/627b91dced9c8426bf48fc2d969a954670a66ff70203371f9ab4ba516f040d25?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" alt="Reviewer avatar" class="object-contain shrink-0 w-10 rounded-full aspect-square" />
        <div class="flex flex-col flex-1 shrink basis-0 min-w-[240px] max-md:max-w-full">
          <header class="flex gap-2 items-start self-start">
            <h3 class="font-[number:var(--sds-typography-body-font-weight-strong)] text-[color:var(--sds-color-text-default-secondary)]">
              Reviewer name
            </h3>
            <time class="font-[number:var(--sds-typography-body-font-weight-regular)] text-[color:var(--sds-color-text-default-tertiary)]">
              Date
            </time>
          </header>
          <p class="flex-1 shrink w-full font-[number:var(--sds-typography-body-font-weight-regular)] text-[color:var(--sds-color-text-default-default)] max-md:max-w-full">
            Review body
          </p>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
builder-component {
  max-width: none !important;
}
</style>