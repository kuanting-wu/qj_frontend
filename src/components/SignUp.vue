<template>
  <main
    class="flex flex-col justify-center items-center px-6 py-40 bg-neutral-100 max-md:px-5 max-md:py-24"
  >
    <h1
      class="max-w-full tracking-tighter leading-tight text-center font-[number:var(--sds-typography-title-hero-font-weight)] text-[color:var(--sds-color-text-brand-on-brand-tertiary)] text-6xl w-[259px] max-md:text-4xl"
    >
      Sign Up
    </h1>
        <!-- Notification Box for Email Verification -->
    <div v-if="showVerificationMessage" class="mt-6 w-80 p-4 bg-yellow-200 border border-yellow-400 rounded-lg text-center">
      <p class="text-sm text-yellow-800">Please check your email for the verification link.</p>
    </div>
    <form
      @submit.prevent="handleSignUp"
      class="flex flex-col p-6 mt-8 w-80 max-w-full bg-white rounded-lg border border-solid border-zinc-300 min-w-[320px] max-md:px-5"
    >
      <div
        class="flex flex-col w-full whitespace-nowrap font-[number:var(--sds-typography-body-font-weight-regular)] text-[length:var(--sds-typography-body-size-medium)]"
      >
        <label
          for="email"
          class="leading-snug text-[color:var(--sds-color-text-default-default)]"
        >
          Email
        </label>
        <input
          type="email"
          v-model="email"
          required
          id="email"
          class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-2 w-full leading-none bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px] text-[color:var(--sds-color-text-default-tertiary)]"
          placeholder="Enter your email"
        />
      </div>
      <div
        class="flex flex-col mt-6 w-full whitespace-nowrap font-[number:var(--sds-typography-body-font-weight-regular)] text-[length:var(--sds-typography-body-size-medium)]"
      >
        <label
          for="username"
          class="leading-snug text-[color:var(--sds-color-text-default-default)]"
        >
          User Name
        </label>
        <input
          type="username"
          v-model="username"
          required
          id="username"
          class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-2 w-full leading-none bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px] text-[color:var(--sds-color-text-default-tertiary)]"
          placeholder="Enter your password"
        />
      </div>
      <div
        class="flex flex-col mt-6 w-full whitespace-nowrap font-[number:var(--sds-typography-body-font-weight-regular)] text-[length:var(--sds-typography-body-size-medium)]"
      >
        <label
          for="password"
          class="leading-snug text-[color:var(--sds-color-text-default-default)]"
        >
          Password
        </label>
        <input
          type="password"
          v-model="password"
          required
          id="password"
          class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-2 w-full leading-none bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px] text-[color:var(--sds-color-text-default-tertiary)]"
          placeholder="Enter your password"
        />
      </div>
      <div
        class="flex flex-col mt-6 w-full whitespace-nowrap font-[number:var(--sds-typography-body-font-weight-regular)] text-[length:var(--sds-typography-body-size-medium)]"
      >
        <label
          for="passwordcheck"
          class="leading-snug text-[color:var(--sds-color-text-default-default)]"
        >
          Type the password again
        </label>
        <input
          type="password"
          v-model="passwordcheck"
          required
          id="passwordcheck"
          class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-2 w-full leading-none bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px] text-[color:var(--sds-color-text-default-tertiary)]"
          placeholder="Enter your password"
        />
      </div>
      <div class="flex flex-col gap-0.5 mt-4 w-full">
        <div class="flex gap-3 items-center w-full">
          <input
            type="checkbox"
            v-model="terms"
            required
            id="terms"
            class="w-4 h-4"
          />
          <label
            for="terms"
            class="flex-1 shrink self-stretch my-auto leading-snug basis-0 font-[number:var(--sds-typography-body-font-weight-regular)] text-[color:var(--sds-color-text-default-default)] text-[length:var(--sds-typography-body-size-medium)]"
          >
            I agree to the following terms
          </label>
        </div>
        <div
          class="flex gap-3 items-center w-full leading-snug whitespace-nowrap font-[number:var(--sds-typography-body-font-weight-regular)] text-[color:var(--sds-color-text-default-secondary)] text-[length:var(--sds-typography-body-size-medium)]"
        >
          <div class="flex shrink-0 self-stretch my-auto w-4 h-4"></div>
          <a
            href="#"
            class="flex-1 shrink self-stretch my-auto underline basis-0 text-neutral-400"
          >
            Terms
          </a>
        </div>
      </div>
      <button
        type="submit"
        class="overflow-hidden gap-2 self-stretch p-3 mt-6 w-full text-white leading-none whitespace-nowrap rounded-lg border border-solid bg-zinc-800 border-zinc-800 font-[number:var(--sds-typography-body-font-weight-regular)] min-h-[40px] text-[color:var(--sds-color-text-brand-on-brand)] text-[length:var(--sds-typography-body-size-medium)]"
      >
        Register
      </button>
      <button
        @click="alreadyHaveAnAccount"
        class="mt-6 w-fit leading-snug underline font-[number:var(--sds-typography-body-font-weight-regular)] text-[color:var(--sds-color-text-default-default)] text-[length:var(--sds-typography-body-size-medium)]"
      >
        Already have an account?
      </button>
    </form>


  </main>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { BACKEND_URL } from "../utils/config";

export default {
  setup() {
    const router = useRouter();

    const email = ref("");
    const username = ref("");
    const password = ref("");
    const passwordcheck = ref("");
    const terms = ref(false);
    const showVerificationMessage = ref(false); // To control the display of the verification message

    // Utility function to make the username URL-safe
    const sanitizeUsername = (username) => {
      return username
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    };

    const handleSignUp = async () => {
      if (password.value !== passwordcheck.value) {
        alert("Passwords do not match.");
        return;
      }
      if (!terms.value) {
        alert("You must agree to the terms.");
        return;
      }

      const sanitizedUsername = sanitizeUsername(username.value); // Sanitize username

      try {
        const response = await axios.post(`${BACKEND_URL}/api/signup`, {
          name: sanitizedUsername, // Use sanitized username
          email: email.value,
          password: password.value,
        });

        if (response.status === 201) {
          // Show the verification message after successful sign-up
          showVerificationMessage.value = true;
          setTimeout(() => router.push("/signin"), 3000); // Redirect after a delay
        } else {
          alert("Failed to create account. Please try again.");
        }
      } catch (err) {
        console.error("Error signing up:", err.response?.data || err.message);
        alert(
          err.response?.data.error || "An error occurred. Please try again."
        );
      }
    };

    const alreadyHaveAnAccount = () => {
      router.push("/signin");
    };

    return {
      email,
      username,
      password,
      passwordcheck,
      terms,
      showVerificationMessage,
      handleSignUp,
      alreadyHaveAnAccount,
    };
  },
};
</script>

<style scoped>
/* Add custom styling for the message box if needed */
</style>
