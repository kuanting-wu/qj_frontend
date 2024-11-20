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
        <header class="flex items-center gap-2">
          <h1 class="text-2xl font-semibold text-gray-800 leading-tight">
            {{ profile.name }}
          </h1>
          <router-link
            v-if="props.userName === currentUser"
            :to="editProfileLink"
            class="flex gap-2.5 justify-center items-center w-6"
          >
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/0fe83109a8d51a4fd2a24605fbdfcc5d59311bc09d746dfd905a6fbbfb936d0a?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1"
              alt="Icon"
              class="object-contain self-stretch my-auto w-6 aspect-square"
            />
          </router-link>
        </header>
        <p class="mt-2 text-gray-500">{{ profile.belt }}</p>
        <p class="mt-2 text-gray-500">{{ profile.academy }}</p>
      </div>
    </div>
  </article>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import { getUserFromToken } from "../utils/auth";
import { BACKEND_URL } from "../utils/config";

export default {
  props: ["userName"],
  setup(props) {
    const profile = ref({
      avatar_url: "",
      name: "",
      belt: "",
      academy: "",
    });

    const editProfileLink = computed(() => `/editprofile/${props.userName}`);
    const currentUser = getUserFromToken() || "";

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/profile/${props.userName}`
        );
        profile.value = response.data;
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    onMounted(fetchProfile);

    watch(
      () => props.userName,
      (newUserName) => {
        if (newUserName) {
          fetchProfile();
        }
      }
    );

    return {
      editProfileLink,
      profile,
      currentUser,
      props,
    };
  },
};
</script>