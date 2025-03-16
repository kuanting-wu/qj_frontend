<template>
  <main
    class="flex flex-col justify-center items-center px-6 py-40 bg-neutral-100 dark:bg-gray-900 transition-colors duration-200 min-h-screen"
  >
    <h1
      class="max-w-full tracking-tighter leading-tight text-center font-bold text-gray-800 dark:text-gray-100 text-6xl w-[226px] max-md:text-4xl transition-colors duration-200"
    >
      Sign In
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
      @submit.prevent="handleSignIn"
      class="flex flex-col p-6 mt-8 w-80 max-w-full bg-white dark:bg-gray-800 rounded-lg border border-solid border-zinc-300 dark:border-zinc-700 min-w-[320px] text-sm transition-colors duration-200"
    >
      <div class="flex flex-col w-full whitespace-nowrap">
        <label
          for="email"
          class="leading-snug text-gray-700 dark:text-gray-300 transition-colors duration-200"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          v-model="email"
          required
          class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-2 w-full leading-none bg-white dark:bg-gray-700 rounded-lg border border-solid border-zinc-300 dark:border-zinc-600 min-w-[240px] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          placeholder="Enter your email"
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
          id="password"
          type="password"
          v-model="password"
          required
          class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 mt-2 w-full leading-none bg-white dark:bg-gray-700 rounded-lg border border-solid border-zinc-300 dark:border-zinc-600 min-w-[240px] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          placeholder="Enter your password"
        />
      </div>
      <div
        class="flex gap-4 items-center mt-6 w-full leading-none"
      >
        <button
          type="submit"
          :disabled="isSubmitting"
          class="overflow-hidden flex-1 shrink gap-2 self-stretch p-3 my-auto w-full text-white rounded-lg border border-solid bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-500 border-zinc-800 dark:border-zinc-600 min-w-[240px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting">Signing in...</span>
          <span v-else>Sign In</span>
        </button>
      </div>
      <button
        type="button"
        @click="goToForgotPassword"
        class="mt-6 w-fit leading-snug text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
      >
        Forgot password?
      </button>
      <button
        type="button"
        @click="goToSignUp"
        class="mt-6 w-fit leading-snug text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
      >
        Create an account
      </button>
    </form>
  </main>
</template>

<script>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { BACKEND_URL } from "../utils/config";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();

    const email = ref("");
    const password = ref("");
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

    const handleSignIn = async () => {
      if (isSubmitting.value) return;
      
      isSubmitting.value = true;
      
      try {
        const response = await axios.post(`${BACKEND_URL}/signin`, {
          email: email.value,
          password: password.value,
        });

        if (response.status === 200) {
          const { accessToken, refreshToken, message, email_verified } =
            response.data;

          // Check if email is verified
          if (!email_verified) {
            showNotification("Please verify your email before signing in.");
            isSubmitting.value = false;
            return;
          }

          // Store tokens in localStorage
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          // Show success notification
          showNotification(message || "Signin successful!", "success", 2000);

          // Use route.query.redirect or fallback to the home page
          const redirectTo = route.query.redirect || "/database";
          
          // Redirect after a short delay to show success message
          setTimeout(() => {
            router.push(redirectTo);
          }, 1500);
        } else {
          showNotification("Failed to sign in. Please try again.");
        }
      } catch (err) {
        console.error("Error signing in:", err.response?.data || err.message);
        showNotification(
          err.response?.data.error || "An error occurred. Please try again."
        );
      } finally {
        isSubmitting.value = false;
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
      isSubmitting,
      notification,
      handleSignIn,
      goToSignUp,
      goToForgotPassword
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
</style>