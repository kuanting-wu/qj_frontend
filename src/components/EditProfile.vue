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
        class="flex flex-col justify-center items-start self-stretch my-auto gap-4"
      >
        <!-- Name Field -->
        <div class="flex flex-col">
          <label class="text-gray-700 font-semibold mb-1">Name</label>
          <input
            v-model="profile.name"
            class="tracking-tighter leading-tight text-center font-[number:var(--sds-typography-title-page-font-weight)] text-[color:var(--sds-color-text-default-default)] text-[length:var(--sds-typography-title-page-size-base)] max-md:text-4xl outline-none border border-solid border-zinc-300 rounded px-2 py-1 focus:outline-blue-500"
          />
        </div>

        <!-- Belt Field -->
        <div class="flex flex-col">
          <label class="text-gray-700 font-semibold mb-1">Belt</label>
          <input
            v-model="profile.belt"
            class="tracking-tighter leading-tight text-center font-[number:var(--sds-typography-title-page-font-weight)] text-[color:var(--sds-color-text-default-default)] text-[length:var(--sds-typography-title-page-size-base)] max-md:text-4xl outline-none border border-solid border-zinc-300 rounded px-2 py-1 focus:outline-blue-500"
          />
        </div>

        <!-- Academy Field -->
        <div class="flex flex-col">
          <label class="text-gray-700 font-semibold mb-1">Academy</label>
          <input
            v-model="profile.academy"
            class="tracking-tighter leading-tight text-center font-[number:var(--sds-typography-title-page-font-weight)] text-[color:var(--sds-color-text-default-default)] text-[length:var(--sds-typography-title-page-size-base)] max-md:text-4xl outline-none border border-solid border-zinc-300 rounded px-2 py-1 focus:outline-blue-500"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          @click="submitProfile"
          class="overflow-hidden gap-2 self-stretch p-3 my-auto rounded-lg border border-solid bg-zinc-800 border-zinc-800 text-white"
        >
          Submit
        </button>
      </div>
    </div>
  </article>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router"; // Import useRouter
import axios from "axios";
import { BACKEND_URL } from "../utils/config";

export default {
  props: ["userName"],
  setup(props) {
    const router = useRouter();
    const profile = ref({
      avatar_url: "",
      name: "test",
      belt: "white",
      academy: "qcgc",
    });

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

    const submitProfile = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        await axios.put(
          `${BACKEND_URL}/api/editprofile/${props.userName}`,
          profile.value,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Pass access token in Authorization header
            },
          }
        );
        alert("Profile updated successfully!");
        router.push(`/profile/${props.userName}`);
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("There was an error updating the profile.");
      }
    };

    onMounted(fetchProfile);

    return {
      profile,
      submitProfile,
    };
  },
};
</script>
