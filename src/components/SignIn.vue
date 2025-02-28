<template>
  <main
    class="flex flex-col justify-center items-center px-6 py-40 bg-neutral-100 max-md:px-5 max-md:py-24"
  >
    <h1
      class="max-w-full tracking-tighter leading-tight text-center font-[number:var(--sds-typography-title-hero-font-weight)] text-[color:var(--sds-color-text-brand-on-brand-tertiary)] text-6xl w-[226px] max-md:text-4xl"
    >
      Sign In
    </h1>
    <form
      @submit.prevent="handleSignIn"
      class="flex flex-col p-6 mt-8 w-80 max-w-full bg-white rounded-lg border border-solid border-zinc-300 font-[number:var(--sds-typography-body-font-weight-regular)] min-w-[320px] text-[length:var(--sds-typography-body-size-medium)] max-md:px-5"
    >
      <div class="flex flex-col w-full whitespace-nowrap">
        <label
          for="email"
          class="leading-snug text-[color:var(--sds-color-text-default-default)]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          v-model="email"
          required
          class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-2 w-full leading-none bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px] text-[color:var(--sds-color-text-default-tertiary)]"
          placeholder="Enter your email"
        />
      </div>
      <div class="flex flex-col mt-6 w-full whitespace-nowrap">
        <label
          for="password"
          class="leading-snug text-[color:var(--sds-color-text-default-default)]"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          v-model="password"
          required
          class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-2 w-full leading-none bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px] text-[color:var(--sds-color-text-default-tertiary)]"
          placeholder="Enter your password"
        />
      </div>
      <div
        class="flex gap-4 items-center mt-6 w-full leading-none text-[color:var(--sds-color-text-brand-on-brand)]"
      >
        <button
          type="submit"
          class="overflow-hidden flex-1 shrink gap-2 self-stretch p-3 my-auto w-full text-white rounded-lg border border-solid bg-zinc-800 border-zinc-800 min-w-[240px]"
        >
          Sign In
        </button>
      </div>
      <button
        @click="goToForgotPassword"
        class="mt-6 w-fit leading-snug underline text-[color:var(--sds-color-text-default-default)]"
      >
        Forgot password?
      </button>
      <button
        @click="goToSignUp"
        class="mt-6 w-fit leading-snug underline text-[color:var(--sds-color-text-default-default)]"
      >
        Create an account
      </button>
    </form>
  </main>
</template>

<script>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router"; // Import useRoute
import axios from "axios";
import { BACKEND_URL } from "../utils/config";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute(); // Initialize route

    const email = ref("");
    const password = ref("");

    const handleSignIn = async () => {
      try {
        const response = await axios.post(`${BACKEND_URL}/signin`, {
          email: email.value,
          password: password.value,
        });

        if (response.status === 200) {
          const { accessToken, refreshToken, message, email_verified } =
            response.data;

          // Check if email is verified (email_verified will be 1 if verified)
          if (email_verified !== 1) {
            alert("Please verify your email before signing in.");
            return;
          }

          // Store tokens in localStorage
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          // Use route.query.redirect or fallback to the home page
          const redirectTo = route.query.redirect || "/";
          router.push(redirectTo);

          alert(message || "Signin successful!");
        } else {
          alert("Failed to sign in. Please try again.");
        }
      } catch (err) {
        console.error("Error signing in:", err.response?.data || err.message);
        alert(
          err.response?.data.error || "An error occurred. Please try again."
        );
      }
    };

    const goToSignUp = () => {
      router.push("/signup");
    };
    const goToForgotPassword = () => {
      router.push("/forgot-password");
    };


    return {
      email,
      password,
      handleSignIn,
      goToSignUp,
      goToForgotPassword
    };
  },
};
</script>
