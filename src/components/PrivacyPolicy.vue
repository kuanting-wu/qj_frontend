<template>
  <main class="flex flex-col px-6 py-12 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-200">
    <div class="max-w-3xl mx-auto w-full">
      <h1 class="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 transition-colors duration-200">Privacy Policy</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-8 transition-colors duration-200">
        Effective Date: March 15, 2024
      </p>

      <section class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 transition-colors duration-200">1. Introduction</h2>
        <p class="mb-4 text-gray-700 dark:text-gray-300 transition-colors duration-200">
          Welcome to Quantify JiuJitsu. Your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your data when you use our services, including Google OAuth login and YouTube video uploads.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 transition-colors duration-200">2. Information We Collect</h2>
        <p class="mb-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">
          When you use our app, we may collect the following information:
        </p>
        <ul class="list-disc ml-8 mb-4 text-gray-700 dark:text-gray-300 transition-colors duration-200">
          <li class="mb-1">Your Google account email and profile information (if you log in via Google OAuth)</li>
          <li class="mb-1">YouTube video details (title, description, and video file when you upload a video through our app)</li>
          <li class="mb-1">Application usage data (to improve our services)</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 transition-colors duration-200">3. How We Use Your Information</h2>
        <p class="mb-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">
          We use the collected information to:
        </p>
        <ul class="list-disc ml-8 mb-4 text-gray-700 dark:text-gray-300 transition-colors duration-200">
          <li class="mb-1">Authenticate you via Google OAuth</li>
          <li class="mb-1">Allow you to upload videos to your own YouTube account</li>
          <li class="mb-1">Improve our app experience and functionality</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 transition-colors duration-200">4. Data Storage and Protection</h2>
        <ul class="list-disc ml-8 mb-4 text-gray-700 dark:text-gray-300 transition-colors duration-200">
          <li class="mb-1">We do not store your Google OAuth credentials or YouTube video files permanently.</li>
          <li class="mb-1">We use industry-standard security measures to protect your data.</li>
          <li class="mb-1">Your authentication tokens are used only for the duration of the session and are not saved on our servers.</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 transition-colors duration-200">5. Third-Party Services</h2>
        <p class="mb-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">
          Our app interacts with third-party services, including:
        </p>
        <ul class="list-disc ml-8 mb-4 text-gray-700 dark:text-gray-300 transition-colors duration-200">
          <li class="mb-1"><strong>Google APIs & YouTube Data API</strong> for authentication and video uploads.</li>
          <li class="mb-1"><strong>Cloudflare</strong> for domain management and security.</li>
          <li class="mb-1">Any other services required to operate the app effectively.</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 transition-colors duration-200">6. User Rights</h2>
        <p class="mb-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">
          You have the right to:
        </p>
        <ul class="list-disc ml-8 mb-4 text-gray-700 dark:text-gray-300 transition-colors duration-200">
          <li class="mb-1">Revoke Google OAuth permissions at any time from your Google Account settings.</li>
          <li class="mb-1">Delete any videos you have uploaded via YouTube's platform.</li>
          <li class="mb-1">Contact us for data deletion requests.</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 transition-colors duration-200">7. Changes to This Privacy Policy</h2>
        <p class="mb-4 text-gray-700 dark:text-gray-300 transition-colors duration-200">
          We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated effective date.
        </p>
      </section>

      <section class="mb-12">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 transition-colors duration-200">8. Contact Us</h2>
        <p class="mb-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p class="mb-1 text-gray-700 dark:text-gray-300 transition-colors duration-200">
          <strong>Email:</strong> <a href="mailto:quantifyjiujitsu@gmail.com" class="text-blue-600 dark:text-blue-400 hover:underline">quantifyjiujitsu@gmail.com</a>
        </p>
        <p class="mb-4 text-gray-700 dark:text-gray-300 transition-colors duration-200">
          <strong>Website:</strong> <a href="https://quantifyjiujitsu.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">https://quantifyjiujitsu.com</a>
        </p>
      </section>

      <hr class="border-gray-300 dark:border-gray-700 mb-8 transition-colors duration-200" />

      <p class="italic text-gray-700 dark:text-gray-300 mb-12 transition-colors duration-200">
        By using our app, you agree to this Privacy Policy.
      </p>
    </div>
  </main>
</template>

<script>
export default {
  name: 'PrivacyPolicy',
  metaInfo: {
    title: 'Privacy Policy - Quantify JiuJitsu',
    meta: [
      { name: 'description', content: 'Privacy Policy for Quantify JiuJitsu, including information about Google OAuth and YouTube integrations.' }
    ]
  }
}
</script>

<style scoped>
a:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>