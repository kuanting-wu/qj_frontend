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
        <!-- Name Field -->
        <div class="flex justify-between items-center w-full">
          <label for="name" class="font-semibold text-left w-1/4">Name</label>
          <input
            id="name"
            type="text"
            v-model="profile.name"
            required
            class="input-field ml-auto w-2/3 border rounded"
            placeholder="Enter name"
          />
        </div>

        <!-- Belt Field -->
        <div class="flex justify-between items-center mt-4 w-full">
          <label for="belt" class="font-semibold w-1/4">Belt</label>
          <input
            id="belt"
            type="text"
            v-model="profile.belt"
            required
            class="input-field ml-auto w-2/3 border rounded"
            placeholder="Enter belt"
          />
        </div>

        <!-- Academy Field -->
        <div class="flex justify-between items-center mt-4 w-full">
          <label for="academy" class="font-semibold w-1/4">Academy</label>
          <input
            id="academy"
            type="text"
            v-model="profile.academy"
            required
            class="input-field ml-auto w-2/3 border rounded"
            placeholder="Enter academy"
          />
        </div>
      </div>
    </div>
  </article>
  <footer class="flex gap-6 justify-center items-center mt-6 py-4">
    <button
      type="button"
      class="overflow-hidden gap-2 self-stretch p-3 my-auto rounded-lg border border-solid bg-neutral-200 border-neutral-500 text-[color:var(--sds-color-text-default-default)]"
      @click="cancelEdit"
    >
      Cancel
    </button>
    <button
      type="submit"
      class="overflow-hidden gap-2 self-stretch p-3 my-auto rounded-lg border border-solid bg-zinc-800 border-zinc-800 text-white"
      @click="submitProfile"
    >
      Submit
    </button>
  </footer>
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

    const cancelEdit = () => {
      router.push(`/profile/${props.userName}`); // Navigate back to the profile page
    };

    onMounted(fetchProfile);

    return {
      profile,
      submitProfile,
      cancelEdit, // Expose cancelEdit to the template
    };
  },
};
</script>
