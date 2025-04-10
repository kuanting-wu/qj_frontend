<template>
  <main
    class="flex flex-col justify-center items-center px-6 py-40 bg-neutral-100 max-md:px-5 max-md:py-24"
  >
    <h1
      class="max-w-full tracking-tighter leading-tight text-center font-[number:var(--sds-typography-title-hero-font-weight)] text-[color:var(--sds-color-text-brand-on-brand-tertiary)] text-6xl w-[259px] max-md:text-4xl"
    >
      Terms and Conditions
    </h1>
    <section
      class="flex flex-col p-6 mt-8 w-full max-w-2xl bg-white rounded-lg border border-solid border-zinc-300 text-neutral-700 text-sm leading-relaxed whitespace-pre-line"
    >
      <p>
        **Welcome to Our Site** Please read these terms and conditions carefully
        before using our services. By accessing or using the site, you agree to
        be bound by these terms.
      </p>
      <h2 class="mt-4 font-semibold text-lg text-zinc-800">
        1. Development Disclaimer
      </h2>
      <p>
        This website is currently in development. We strive to maintain all
        posts and content to the best of our abilities. However, we cannot
        guarantee complete reliability during this phase. By using this site,
        you acknowledge and accept that:
      </p>
      <ul class="list-disc ml-6 mt-2">
        <li>
          Posts may be deleted accidentally during updates or maintenance.
        </li>
        <li>
          The site reserves the right to remove any content without prior
          notice.
        </li>
        <li>Some features may not be fully functional or stable.</li>
      </ul>
      <h2 class="mt-4 font-semibold text-lg text-zinc-800">
        2. Content Ownership
      </h2>
      <p>
        All user-generated content remains the property of its original creator.
        By posting content on the site, you grant us the right to display and
        distribute it as necessary for site functionality.
      </p>
      <h2 class="mt-4 font-semibold text-lg text-zinc-800">3. Privacy</h2>
      <p>
        Your privacy is important to us. Please review our Privacy Policy to
        understand how we handle your personal information.
      </p>
      <h2 class="mt-4 font-semibold text-lg text-zinc-800">
        4. Limitation of Liability
      </h2>
      <p>
        The site and its developers are not responsible for any loss or damage
        caused by your use of the site or reliance on its content.
      </p>
      <h2 class="mt-4 font-semibold text-lg text-zinc-800">
        5. Changes to These Terms
      </h2>
      <p>
        These terms may be updated at any time to reflect changes in site policy
        or functionality. By continuing to use the site, you agree to the
        updated terms.
      </p>
    </section>
    <button
      @click="goBack"
      class="overflow-hidden gap-2 self-stretch p-3 mt-6 w-80 text-white leading-none whitespace-nowrap rounded-lg border border-solid bg-zinc-800 border-zinc-800 font-[number:var(--sds-typography-body-font-weight-regular)] min-h-[40px] text-[color:var(--sds-color-text-brand-on-brand)] text-[length:var(--sds-typography-body-size-medium)] mx-auto"
    >
      Back
    </button>
  </main>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const goBack = () => {
      router.back();
    };

    return {
      goBack,
    };
  },
};
</script>

<style scoped>
/* Add custom styling if needed */
</style>
