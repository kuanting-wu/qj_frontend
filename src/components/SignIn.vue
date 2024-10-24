<template>
  <main class="flex flex-col justify-center items-center px-6 py-40 bg-neutral-100 max-md:px-5 max-md:py-24">
    <h1 class="max-w-full tracking-tighter leading-tight text-center font-[number:var(--sds-typography-title-hero-font-weight)] text-[color:var(--sds-color-text-brand-on-brand-tertiary)] text-6xl w-[226px] max-md:text-4xl">
      Sign In
    </h1>
    <form class="flex flex-col p-6 mt-8 w-80 max-w-full bg-white rounded-lg border border-solid border-zinc-300 font-[number:var(--sds-typography-body-font-weight-regular)] min-w-[320px] text-[length:var(--sds-typography-body-size-medium)] max-md:px-5">
      <div class="flex flex-col w-full whitespace-nowrap">
        <label for="email" class="leading-snug text-[color:var(--sds-color-text-default-default)]">
          Email
        </label>
        <input id="email" type="email" class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-2 w-full leading-none bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px] text-[color:var(--sds-color-text-default-tertiary)]" placeholder="Enter your email" />
      </div>
      <div class="flex flex-col mt-6 w-full whitespace-nowrap">
        <label for="password" class="leading-snug text-[color:var(--sds-color-text-default-default)]">
          Password
        </label>
        <input id="password" type="password" class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-2 w-full leading-none bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px] text-[color:var(--sds-color-text-default-tertiary)]" placeholder="Enter your password" />
      </div>
      <div class="flex gap-4 items-center mt-6 w-full leading-none text-[color:var(--sds-color-text-brand-on-brand)]">
        <button type="submit" class="overflow-hidden flex-1 shrink gap-2 self-stretch p-3 my-auto w-full text-white rounded-lg border border-solid bg-zinc-800 border-zinc-800 min-w-[240px]">
          Sign In
        </button>
      </div>
      <button class="mt-6 w-fit leading-snug underline text-[color:var(--sds-color-text-default-default)]">
        Forgot password?
      </button>
      <button @click="goToSignUp" class="mt-6 w-fit leading-snug underline text-[color:var(--sds-color-text-default-default)]">
        Create an account
      </button>
    </form>
  </main>
</template>

<script>
export default {
  methods: {
    goToSignUp(){
      this.$emit('SignUp')
    }
  }
  
}
</script>