<template>
  <main
    class="flex flex-col justify-center items-center px-6 py-40 bg-neutral-100 dark:bg-gray-900 transition-colors duration-200 min-h-screen"
  >
    <h1
      class="max-w-full tracking-tighter leading-tight text-center font-bold text-gray-800 dark:text-gray-100 text-6xl w-[259px] max-md:text-4xl transition-colors duration-200"
    >
      Forgot Password
    </h1>
    
    <!-- Notification Message -->
    <div 
      v-if="notification.show" 
      class="mt-4 w-80 p-4 rounded-lg text-center transition-all duration-200"
      :class="[
        notification.type === 'error' 
          ? 'bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200' 
          : 'bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-800 text-green-800 dark:text-green-200'
      ]"
    >
      <p class="text-sm">{{ notification.message }}</p>
    </div>
    
    <div
      class="flex flex-col p-6 mt-8 w-80 max-w-full bg-white dark:bg-gray-800 rounded-lg border border-solid border-zinc-300 dark:border-zinc-700 min-w-[320px] text-sm transition-colors duration-200"
    >
      <p
        class="mb-6 text-gray-700 dark:text-gray-300 transition-colors duration-200"
      >
        Enter your email address to receive a password reset link.
      </p>
      
      <div class="flex flex-col w-full whitespace-nowrap">
        <label
          for="email"
          class="leading-snug text-gray-700 dark:text-gray-300 transition-colors duration-200 mb-2"
        >
          Email
        </label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Enter your email"
          required
          class="overflow-hidden flex-1 shrink self-stretch px-4 py-3 w-full leading-none bg-white dark:bg-gray-700 rounded-lg border border-solid border-zinc-300 dark:border-zinc-600 min-w-[240px] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors duration-200"
        />
      </div>
      
      <button
        @click="handleForgotPassword"
        :disabled="isSubmitting"
        class="overflow-hidden gap-2 self-stretch p-3 mt-6 w-full text-white leading-none whitespace-nowrap rounded-lg border border-solid bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-500 border-zinc-800 dark:border-zinc-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <span v-if="isSubmitting">Sending...</span>
        <span v-else>Submit</span>
      </button>
      
      <button
        type="button"
        @click="goToSignIn"
        class="mt-6 w-fit mx-auto leading-snug text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
      >
        Back to Sign In
      </button>
    </div>
  </main>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { BACKEND_URL } from "@/utils/config";

export default {
  setup() {
    const router = useRouter();
    const email = ref("");
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

    // Email validation
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const handleForgotPassword = async () => {
      if (isSubmitting.value) return;
      
      // Validate email format
      if (!validateEmail(email.value)) {
        showNotification("Please enter a valid email address.");
        return;
      }

      isSubmitting.value = true;
      
      try {
        const response = await axios.post(`${BACKEND_URL}/forgot-password`, {
          email: email.value,
        });
        
        if (response.status === 200) {
          // Show success notification
          showNotification(
            "Password reset email sent. Please check your inbox.", 
            "success", 
            5000
          );
          
          // Clear email field
          email.value = "";
        }
      } catch (error) {
        console.error("Error:", error.message);
        
        if (error.response && error.response.status === 404) {
          showNotification("Email address not found. Please try again or sign up for an account.");
        } else {
          showNotification("An error occurred. Please try again later.");
        }
      } finally {
        isSubmitting.value = false;
      }
    };

    const goToSignIn = () => {
      router.push("/signin");
    };

    return {
      email,
      isSubmitting,
      notification,
      handleForgotPassword,
      goToSignIn
    };
  }
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