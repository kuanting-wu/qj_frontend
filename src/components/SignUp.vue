<template>
  <main
    class="flex flex-col justify-center items-center px-6 py-20 bg-neutral-100 dark:bg-gray-900 transition-colors duration-200 min-h-screen"
  >
    <h1
      class="max-w-full tracking-tighter leading-tight text-center font-bold text-gray-800 dark:text-gray-100 text-6xl w-[259px] max-md:text-4xl transition-colors duration-200"
    >
      Sign Up
    </h1>
    
    <!-- Notification Messages -->
    <div v-if="notification.show" 
         class="mt-4 w-80 p-4 rounded-lg text-center transition-all duration-200"
         :class="[
           notification.type === 'error' 
             ? 'bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200' 
             : 'bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-800 text-green-800 dark:text-green-200'
         ]">
      <p class="text-sm">{{ notification.message }}</p>
    </div>
    
    <form
      @submit.prevent="handleSignUp"
      class="flex flex-col p-6 mt-6 w-80 max-w-full bg-white dark:bg-gray-800 rounded-lg border border-solid border-zinc-300 dark:border-zinc-700 min-w-[320px] text-sm transition-colors duration-200"
    >
      <div class="flex flex-col w-full whitespace-nowrap">
        <label
          for="email"
          class="leading-snug text-gray-700 dark:text-gray-300 transition-colors duration-200"
        >
          Email
        </label>
        <input
          type="email"
          v-model="email"
          required
          id="email"
          class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-2 w-full leading-none bg-white dark:bg-gray-700 rounded-lg border border-solid border-zinc-300 dark:border-zinc-600 min-w-[240px] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          placeholder="Enter your email"
        />
      </div>
      
      <div class="flex flex-col mt-6 w-full whitespace-nowrap">
        <label
          for="username"
          class="leading-snug text-gray-700 dark:text-gray-300 transition-colors duration-200"
        >
          User Name
        </label>
        <input
          type="text"
          v-model="username"
          required
          id="username"
          class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-2 w-full leading-none bg-white dark:bg-gray-700 rounded-lg border border-solid border-zinc-300 dark:border-zinc-600 min-w-[240px] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          placeholder="Choose a username"
        />
      </div>
      
      <div class="flex flex-col mt-6 w-full whitespace-nowrap">
        <label
          for="password"
          class="leading-snug text-gray-700 dark:text-gray-300 transition-colors duration-200"
        >
          Password
        </label>
        <input
          type="password"
          v-model="password"
          required
          id="password"
          class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-2 w-full leading-none bg-white dark:bg-gray-700 rounded-lg border border-solid border-zinc-300 dark:border-zinc-600 min-w-[240px] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          placeholder="Enter your password"
        />
      </div>
      
      <div class="flex flex-col mt-6 w-full whitespace-nowrap">
        <label
          for="passwordcheck"
          class="leading-snug text-gray-700 dark:text-gray-300 transition-colors duration-200"
        >
          Confirm Password
        </label>
        <input
          type="password"
          v-model="passwordcheck"
          required
          id="passwordcheck"
          class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-2 w-full leading-none bg-white dark:bg-gray-700 rounded-lg border border-solid border-zinc-300 dark:border-zinc-600 min-w-[240px] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          placeholder="Confirm your password"
        />
      </div>
      
      <div class="flex flex-col gap-0.5 mt-4 w-full">
        <div class="flex gap-3 items-center w-full">
          <input
            type="checkbox"
            v-model="terms"
            required
            id="terms"
            class="w-4 h-4 accent-blue-600 cursor-pointer"
          />
          <label
            for="terms"
            class="flex-1 shrink self-stretch my-auto leading-snug text-gray-700 dark:text-gray-300 transition-colors duration-200 cursor-pointer"
          >
            I agree to the following terms
          </label>
        </div>
        <div class="flex gap-3 items-center w-full leading-snug whitespace-nowrap text-gray-500 dark:text-gray-400 transition-colors duration-200">
          <div class="flex shrink-0 self-stretch my-auto w-4 h-4"></div>
          <button 
            type="button"
            @click="seeTerms" 
            class="text-blue-600 dark:text-gray-300 hover:underline transition-colors duration-200"
          >
            Terms
          </button>
        </div>
      </div>
      
      <button
        type="submit"
        :disabled="isSubmitting"
        class="overflow-hidden gap-2 self-stretch p-3 mt-6 w-full text-white leading-none whitespace-nowrap rounded-lg border border-solid bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-500 border-zinc-800 dark:border-zinc-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <span v-if="isSubmitting">Creating account...</span>
        <span v-else>Register</span>
      </button>
      
      <button
        type="button"
        @click="alreadyHaveAnAccount"
        class="mt-6 w-fit leading-snug text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
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
    const isSubmitting = ref(false);
    const notification = ref({
      show: false,
      type: "error",
      message: ""
    });

    // Function to show notification
    const showNotification = (message, type = "error", duration = 5000) => {
      notification.value = {
        show: true,
        type: type,
        message: message
      };
      
      setTimeout(() => {
        notification.value.show = false;
      }, duration);
    };

    // Utility function to make the username URL-safe
    const sanitizeUsername = (username) => {
      return username
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    };

    const handleSignUp = async () => {
      if (isSubmitting.value) return;
      
      // Client-side validation
      if (password.value !== passwordcheck.value) {
        showNotification("Passwords do not match.");
        return;
      }
      
      if (!terms.value) {
        showNotification("You must agree to the terms.");
        return;
      }

      isSubmitting.value = true;
      const sanitizedUsername = sanitizeUsername(username.value);

      try {
        const response = await axios.post(`${BACKEND_URL}/signup`, {
          username: sanitizedUsername,
          email: email.value,
          password: password.value,
        });

        if (response.status === 201) {
          // Show verification message
          showNotification(
            "Account created! Please check your email for the verification link.", 
            "success",
            5000
          );
          
          // Redirect after delay
          setTimeout(() => {
            router.push("/signin");
          }, 3000);
        } else {
          showNotification("Failed to create account. Please try again.");
        }
      } catch (err) {
        console.error("Error signing up:", err.response?.data || err.message);
        showNotification(
          err.response?.data.error || "An error occurred. Please try again."
        );
      } finally {
        isSubmitting.value = false;
      }
    };

    const alreadyHaveAnAccount = () => {
      router.push("/signin");
    };

    const seeTerms = () => {
      router.push("/terms");
    };

    return {
      email,
      username,
      password,
      passwordcheck,
      terms,
      isSubmitting,
      notification,
      handleSignUp,
      alreadyHaveAnAccount,
      seeTerms,
    };
  },
};
</script>

<style scoped>
/* Button hover effect */
button:not(:disabled):hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}

/* Focus styles for accessibility */
input:focus, button:focus {
  outline: none;
}

/* Checkbox styling for better dark mode visibility */
input[type="checkbox"] {
  border-radius: 0.2rem;
}
</style>