<template>
  <main
    class="flex flex-col justify-center items-center px-6 py-40 bg-neutral-100 max-md:px-5 max-md:py-24"
  >
    <h1
      v-if="status === 'loading'"
      class="max-w-full tracking-tighter leading-tight text-center font-[number:var(--sds-typography-title-hero-font-weight)] text-[color:var(--sds-color-text-brand-on-brand-tertiary)] text-6xl w-[259px] max-md:text-4xl"
    >
      Verifying...
    </h1>
    <h1
      v-else-if="status === 'success'"
      class="max-w-full tracking-tighter leading-tight text-center font-[number:var(--sds-typography-title-hero-font-weight)] text-[color:var(--sds-color-text-brand-on-brand-tertiary)] text-6xl w-[259px] max-md:text-4xl"
    >
      Email Verified!
    </h1>
    <h1
      v-else-if="status === 'error'"
      class="max-w-full tracking-tighter leading-tight text-center font-[number:var(--sds-typography-title-hero-font-weight)] text-red-500 text-6xl w-[259px] max-md:text-4xl"
    >
      Verification Failed
    </h1>
    <div
      v-if="status === 'success'"
      class="flex flex-col p-6 mt-8 w-80 max-w-full bg-white rounded-lg border border-solid border-zinc-300 min-w-[320px] max-md:px-5 text-center"
    >
      <p
        class="mb-6 text-[length:var(--sds-typography-body-size-medium)] text-[color:var(--sds-color-text-default-default)]"
      >
        Your email has been successfully verified. You can now access all features of Quantify Jiu-Jitsu!
      </p>
      <button
        @click="goToSignin"
        class="overflow-hidden gap-2 self-stretch p-3 w-full text-white leading-none whitespace-nowrap rounded-lg border border-solid bg-zinc-800 border-zinc-800 font-[number:var(--sds-typography-body-font-weight-regular)] min-h-[40px] text-[color:var(--sds-color-text-brand-on-brand)] text-[length:var(--sds-typography-body-size-medium)]"
      >
        Go to Signin
      </button>
    </div>
    <div
      v-if="status === 'error'"
      class="flex flex-col p-6 mt-8 w-80 max-w-full bg-white rounded-lg border border-solid border-zinc-300 min-w-[320px] max-md:px-5 text-center"
    >
      <p
        class="mb-6 text-[length:var(--sds-typography-body-size-medium)] text-red-500"
      >
        The verification link is invalid or has expired. Please try signing up again.
      </p>
      <button
        @click="goToSignup"
        class="overflow-hidden gap-2 self-stretch p-3 w-full text-white leading-none whitespace-nowrap rounded-lg border border-solid bg-zinc-800 border-zinc-800 font-[number:var(--sds-typography-body-font-weight-regular)] min-h-[40px] text-[color:var(--sds-color-text-brand-on-brand)] text-[length:var(--sds-typography-body-size-medium)]"
      >
        Go to Signup
      </button>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import { BACKEND_URL } from "../utils/config";

export default {
  data() {
    return {
      status: 'loading', // Possible values: 'loading', 'success', 'error'
    };
  },
  methods: {
    async verifyEmail() {
      const token = this.$route.query.token;
      try {
        const response = await axios.get(`${BACKEND_URL}/api/verify-email`, {
          params: { token },
        });
        if (response.status !== 200) {
          throw new Error('Verification failed');
        }
        this.status = 'success';
      } catch (error) {
        console.error(error.message); // Log error for debugging
        this.status = 'error';
      }
    },
    goToSignin() {
      this.$router.push('/signin');
    },
    goToSignup() {
      this.$router.push('/signup');
    },
  },
  mounted() {
    this.verifyEmail();
  },
};
</script>
