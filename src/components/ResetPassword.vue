<template>
  <main
    class="flex flex-col justify-center items-center px-6 py-40 bg-neutral-100 max-md:px-5 max-md:py-24"
  >
    <h1
      class="max-w-full tracking-tighter leading-tight text-center font-[number:var(--sds-typography-title-hero-font-weight)] text-[color:var(--sds-color-text-brand-on-brand-tertiary)] text-6xl w-[300px] max-md:text-4xl"
    >
      Reset Password
    </h1>
    <form
      @submit.prevent="handleResetPassword"
      class="flex flex-col p-6 mt-8 w-80 max-w-full bg-white rounded-lg border border-solid border-zinc-300 font-[number:var(--sds-typography-body-font-weight-regular)] min-w-[320px] text-[length:var(--sds-typography-body-size-medium)] max-md:px-5"
    >
      <p
        class="mb-6 text-[length:var(--sds-typography-body-size-medium)] text-[color:var(--sds-color-text-default-default)]"
      >
        Enter your new password below to reset your account password.
      </p>
      <div class="flex flex-col w-full whitespace-nowrap">
        <label
          for="new-password"
          class="leading-snug text-[color:var(--sds-color-text-default-default)]"
        >
          New Password
        </label>
        <input
          id="new-password"
          type="password"
          v-model="newPassword"
          required
          class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-2 w-full leading-none bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px] text-[color:var(--sds-color-text-default-tertiary)]"
          placeholder="Enter your new password"
        />
      </div>
      <div class="flex flex-col mt-6 w-full whitespace-nowrap">
        <label
          for="confirm-password"
          class="leading-snug text-[color:var(--sds-color-text-default-default)]"
        >
          Confirm Password
        </label>
        <input
          id="confirm-password"
          type="password"
          v-model="confirmPassword"
          required
          class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-2 w-full leading-none bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px] text-[color:var(--sds-color-text-default-tertiary)]"
          placeholder="Confirm your new password"
        />
      </div>
      <div
        v-if="errorMessage"
        class="mt-4 text-sm text-red-500 text-center"
      >
        {{ errorMessage }}
      </div>
      <div
        class="flex gap-4 items-center mt-6 w-full leading-none text-[color:var(--sds-color-text-brand-on-brand)]"
      >
        <button
          type="submit"
          class="overflow-hidden flex-1 shrink gap-2 self-stretch p-3 my-auto w-full text-white rounded-lg border border-solid bg-zinc-800 border-zinc-800 min-w-[240px]"
        >
          Reset Password
        </button>
      </div>
    </form>
  </main>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { BACKEND_URL } from "../utils/config";

export default {
  setup() {
    const newPassword = ref("");
    const confirmPassword = ref("");
    const errorMessage = ref("");
    const route = useRoute();
    const router = useRouter();

    const handleResetPassword = async () => {
      // Check if passwords match
      if (newPassword.value !== confirmPassword.value) {
        errorMessage.value = "Passwords do not match. Please try again.";
        return;
      }

      // Clear error message before making the API call
      errorMessage.value = "";

      const token = route.query.token; // Get the reset token from the URL
      try {
        const response = await axios.post(`${BACKEND_URL}/api/reset-password`, {
          token,
          newPassword: newPassword.value,
        });
        if (response.status === 200) {
          alert("Password reset successful! You can now log in.");
          router.push("/signin");
        }
      } catch (error) {
        console.error(error.message); // Log error for debugging
        if (error.response && error.response.status === 400) {
          errorMessage.value =
            "Invalid or expired token. Please request a new reset link.";
        } else {
          errorMessage.value = "An unexpected error occurred. Please try again.";
        }
      }
    };

    return {
      newPassword,
      confirmPassword,
      errorMessage,
      handleResetPassword,
    };
  },
};
</script>
