<template>
  <div class="flex overflow-hidden flex-col bg-white">
    <header class="flex overflow-hidden flex-wrap gap-4 items-center px-6 py-2.5 w-full bg-white border-b border-zinc-300 min-h-[60px] max-md:px-5 max-md:max-w-full">
      <button aria-label="Go to welcome page" @click="displayPage = 'Welcome'" class="flex justify-center items-center self-stretch my-auto w-10">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/24824442aa5a6ce30384715ebcc5bd08c428c7b22bfa0c7dab7215ec74c99bf1?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" class="object-contain self-stretch my-auto w-10 aspect-square" alt="Logo" />
      </button>
      <nav class="flex justify-end flex-wrap flex-1 shrink gap-2 items-center self-stretch my-auto leading-none whitespace-nowrap basis-0 font-[number:var(--sds-typography-body-font-weight-regular)] min-w-[240px] text-[length:var(--sds-typography-body-size-medium)] max-md:max-w-full">
        <button @click="displayPage = 'DatabasePanel'" class="gap-2 self-stretch p-2 my-auto rounded-lg text-[color:var(--sds-color-text-brand-on-brand-secondary)]">
          Database
        </button>
        <form class="flex gap-2 items-center self-stretch px-4 py-2 my-auto bg-white rounded-full border border-solid border-zinc-300 min-h-[40px] text-[color:var(--sds-color-text-default-default)] w-[239px]">
          <label for="search" class="sr-only">Search</label>
          <input type="search" id="search" class="flex-1 shrink self-stretch my-auto basis-0 bg-transparent border-none outline-none" placeholder="Search" />
          <button type="submit" aria-label="Submit search">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/6a84d58b5b4d8ca5193fbdf5fb619cb016e069b7371bc4fa40ef7d5941ac53b1?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" class="object-contain shrink-0 self-stretch my-auto aspect-square w-[25px]" alt="" />
          </button>
        </form>
        <button aria-label="Create a new page">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/a1a346bb6435f7307fd48c41414b143ec3e125a1e61bb152903251e3aecff500?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" class="object-contain shrink-0 self-stretch my-auto w-10 aspect-square" alt="" />
        </button>
      </nav>
      <button @click="displayPage = 'SignIn'" aria-label="Go to profile page">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/64c9bda73ca89162bc806ea1e084a3cd2dccf15193fe0e3c0e8008a485352e26?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" class="object-contain shrink-0 self-stretch my-auto w-10 rounded-full aspect-square" alt="User profile" />
      </button>
    </header>
    <div v-if="displayPage =='SignIn'" >
      <SignIn @SignUp="displayPage = 'SignUp'"/>
    </div>
    <div v-if="displayPage =='SignUp'" >
      <SignUp @SignIn="displayPage = 'SignIn'" />
    </div>
    <div v-if="displayPage =='Welcome'" >
      <Welcome/>
    </div>
    <div v-if="displayPage == 'DatabasePanel'" >
      <DatabasePanel/>
    </div>
    <div v-if="displayPage == 'ProfileCard'" >
      <ProfileCard/>
    </div>
    <footer class="flex overflow-hidden flex-wrap gap-4 items-start px-8 pt-8 pb-40 w-full bg-white border-t border-zinc-300 max-md:px-5 max-md:pb-24 max-md:max-w-full">
        <div class="flex flex-col items-start min-w-[240px] w-[262px]">
          <button @click="displayPage = 'Welcome'" class="flex justify-center items-center w-[50px]">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/21491438aefeab829f0ffd6daf88fc794baafb8415db65c779c4539e1a152205?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" class="object-contain self-stretch my-auto aspect-[1.02] w-[50px]" alt="Footer logo" />
          </button>
          <div class="flex gap-4 items-center mt-6">
            <a href="#" aria-label="Social media link 1">
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/1ec8abb446b65da3969e46bbddeebabc8234b63bdc680331c90cd3a394625731?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" class="object-contain shrink-0 self-stretch my-auto w-6 aspect-square" alt="" />
            </a>
            <a href="#" aria-label="Social media link 2">
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/3a0351abefabe90f9572e4f722e012d64b46624d15f715e4b16a23d61b7e915c?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1" class="object-contain shrink-0 self-stretch my-auto w-6 aspect-square" alt="" />
            </a>
          </div>
        </div>
    </footer>
  </div>
</template>

<script>
import Welcome from './components/Welcome.vue'
import DatabasePanel from './components/DatabasePanel.vue'
import ProfileCard from './components/ProfileCard.vue'
import SignIn from './components/SignIn.vue'
import EditPage from './components/EditPage.vue'
import ViewPage from './components/ViewPage.vue'
import SignUp from './components/SignUp.vue'
import CardGrid from './components/CardGrid.vue'
import PreviewCard from './components/PreviewCard.vue'

export default{
  data() {
    return {
      displayPage: 'SignUp'


    }
  },
  components: {
    Welcome,
    DatabasePanel,
    ProfileCard,
    EditPage,
    SignIn,
    ViewPage,
    SignUp,
    PreviewCard,
    CardGrid
  }
}
</script>

<style scoped>
builder-component {
  max-width: none !important;
}
</style>
