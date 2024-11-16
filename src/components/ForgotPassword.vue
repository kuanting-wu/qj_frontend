<template>
  <main
    class="flex flex-col justify-center items-center px-6 py-40 bg-neutral-100 max-md:px-5 max-md:py-24"
  >
    <h1
      class="max-w-full tracking-tighter leading-tight text-center font-[number:var(--sds-typography-title-hero-font-weight)] text-[color:var(--sds-color-text-brand-on-brand-tertiary)] text-6xl w-[259px] max-md:text-4xl"
    >
      Forgot Password
    </h1>
    <div
      class="flex flex-col p-6 mt-8 w-80 max-w-full bg-white rounded-lg border border-solid border-zinc-300 min-w-[320px] max-md:px-5 text-center"
    >
      <p
        class="mb-6 text-[length:var(--sds-typography-body-size-medium)] text-[color:var(--sds-color-text-default-default)]"
      >
        Enter your email address to receive a password reset link.
      </p>
      <input
        v-model="email"
        type="email"
        placeholder="Email Address"
        class="mb-4 p-3 w-full border border-solid border-zinc-300 rounded-lg text-[length:var(--sds-typography-body-size-medium)] text-[color:var(--sds-color-text-default-default)]"
      />
      <button
        @click="handleForgotPassword"
        class="overflow-hidden gap-2 self-stretch p-3 w-full text-white leading-none whitespace-nowrap rounded-lg border border-solid bg-zinc-800 border-zinc-800 font-[number:var(--sds-typography-body-font-weight-regular)] min-h-[40px] text-[color:var(--sds-color-text-brand-on-brand)] text-[length:var(--sds-typography-body-size-medium)]"
      >
        Submit
      </button>
    </div>

    <!-- Error Popup -->
    <div
      v-if="showErrorPopup"
      class="fixed top-8 left-1/2 transform -translate-x-1/2 p-4 bg-red-500 text-white rounded-lg shadow-lg max-w-full text-center z-50"
    >
      {{ errorMessage }}
    </div>
  </main>
</template>

<script>
import axios from "axios";
import { BACKEND_URL } from "../utils/config";

export default {
  data() {
    return {
      email: "",
      showErrorPopup: false, // Controls the visibility of the error popup
      errorMessage: "", // Stores the error message to display
    };
  },
  methods: {
    validateEmail(email) {
      // Regular expression for validating email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    async handleForgotPassword() {
      // Check if the email format is valid
      if (!this.validateEmail(this.email)) {
        this.errorMessage = "Please enter a valid email address.";
        this.showErrorPopup = true;
        setTimeout(() => {
          this.showErrorPopup = false;
        }, 3000);
        return;
      }

      // Proceed with the API call if the email format is valid
      try {
        const response = await axios.post(`${BACKEND_URL}/api/forgot-password`, {
          email: this.email,
        });
        if (response.status === 200) {
          alert("Password reset email sent successfully!"); // Alternatively, use a success popup.
        }
      } catch (error) {
        console.error(error.message); // Log error for debugging
        if (error.response && error.response.status === 404) {
          this.errorMessage = "Email address not found. Please try again or sign up for an account.";
          this.showErrorPopup = true;
          setTimeout(() => {
            this.showErrorPopup = false;
          }, 3000);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    },
  },
};
</script>
