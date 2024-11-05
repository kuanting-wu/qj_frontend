<template>
  <article
    class="flex flex-col justify-center items-start p-16 bg-white bg-opacity-80 max-md:px-5"
  >
    <div class="flex gap-5 items-center">
      <figure
        class="flex overflow-hidden gap-2.5 items-center self-stretch my-auto rounded-full border border-solid border-zinc-300 w-[200px]"
      >
        <img
          loading="lazy"
          :src="profile.avatar_url"
          alt="Profile picture"
          class="object-contain self-stretch my-auto aspect-square w-[200px]"
        />
      </figure>
      <div
        class="flex flex-col justify-center items-start self-stretch my-auto"
      >
        <h1
          class="tracking-tighter leading-tight text-center font-[number:var(--sds-typography-title-page-font-weight)] text-[color:var(--sds-color-text-default-default)] text-[length:var(--sds-typography-title-page-size-base)] max-md:text-4xl"
        >
          {{ profile.name }}
        </h1>
        <p
          class="mt-2 leading-snug text-center font-[number:var(--sds-typography-body-font-weight-strong)] text-[color:var(--sds-color-text-default-default)] text-[length:var(--sds-typography-body-size-medium)]"
        >
          {{ profile.belt }}
        </p>
        <p
          class="self-stretch mt-2 leading-snug font-[number:var(--sds-typography-body-font-weight-strong)] text-[color:var(--sds-color-text-default-default)] text-[length:var(--sds-typography-body-size-medium)]"
        >
          {{ profile.academy }}
        </p>
        <button class="flex gap-2.5 justify-center items-center mt-2 w-6">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/0fe83109a8d51a4fd2a24605fbdfcc5d59311bc09d746dfd905a6fbbfb936d0a?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1"
            alt="Icon"
            class="object-contain self-stretch my-auto w-6 aspect-square"
          />
        </button>
      </div>
    </div>
  </article>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const profile = ref({
      avatar_url:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/584d0499acd7e52bc516e3647b2e066542945995232e0bafc85aea114c723425?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1",
      name: "Name",
      belt: "Belt",
      academy: "Academy",
    });

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Retrieve token from storage
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await axios.get("http://localhost:3000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        profile.value = response.data;
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    onMounted(fetchProfile);

    return {
      profile,
    };
  },
};
</script>

<style scoped>
/* Add any necessary styling */
</style>
