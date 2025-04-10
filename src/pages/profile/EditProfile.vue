<template>
  <form @submit.prevent="submitProfile" class="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900">
    <h1 class="text-2xl font-bold mb-6">Edit Profile</h1>

    <!-- Avatar Section -->
    <div class="mb-8 flex items-center gap-4">
      <div class="flex-shrink-0">
        <AvatarUpload :currentAvatar="profile.avatar_url" :userId="currentUserId"
          @avatar-updated="handleAvatarUpdate" />
      </div>
      <div>
        <h2 class="text-lg font-medium mb-2">Profile Photo</h2>
        <p class="text-gray-500 dark:text-gray-300 mb-3">Your avatar will be displayed on your profile and posts</p>
        <p class="text-sm text-blue-500">Click on your avatar image to upload a new photo</p>
      </div>
    </div>

    <!-- Basic Information Section -->
    <div class="border-t border-gray-200 pt-6 mb-8">
      <h2 class="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Basic Information</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <!-- Username Field (Editable) -->
        <div class="flex flex-col">
          <label for="username" class="font-medium mb-1">Username</label>
          <input id="username" type="text" v-model="profile.username"
            class="input-field w-full border rounded p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
          <p v-if="usernameError" class="text-red-500 text-sm mt-1">{{ usernameError }}</p>
          <p class="text-gray-500 dark:text-gray-300 text-xs mt-1">*Your username is used for your public profile URL
          </p>
        </div>

        <!-- Name Field (New) -->
        <div class="flex flex-col">
          <label for="name" class="font-medium mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
          <input id="name" type="text" v-model="profile.name"
            class="input-field w-full border rounded p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            placeholder="Enter your full name" />
        </div>

        <!-- Belt Field -->
        <div class="flex flex-col">
          <label for="belt" class="font-medium mb-1 text-gray-700 dark:text-gray-300">Belt</label>
          <select id="belt" v-model="profile.belt"
            class="input-field w-full border rounded p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <option value="">Select Belt</option>
            <option value="White">White</option>
            <option value="Blue">Blue</option>
            <option value="Purple">Purple</option>
            <option value="Brown">Brown</option>
            <option value="Black">Black</option>
          </select>
        </div>

        <!-- Academy Field -->
        <div class="flex flex-col">
          <label for="academy" class="font-medium mb-1 text-gray-700 dark:text-gray-300">Academy</label>
          <input id="academy" type="text" v-model="profile.academy"
            class="input-field w-full border rounded p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            placeholder="Enter your academy" />
        </div>

        <!-- Location Field -->
        <div class="flex flex-col">
          <label for="location" class="font-medium mb-1 text-gray-700 dark:text-gray-300">Location</label>
          <input id="location" type="text" v-model="profile.location"
            class="input-field w-full border rounded p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            placeholder="City, Country" />
        </div>

        <!-- Nationality Field -->
        <div class="flex flex-col">
          <label for="nationality" class="font-medium mb-1 text-gray-700 dark:text-gray-300">Nationality</label>
          <input id="nationality" type="text" v-model="profile.nationality"
            class="input-field w-full border rounded p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            placeholder="Enter your nationality" />
        </div>

        <!-- Weight Class Field -->
        <div class="flex flex-col">
          <label for="weight_class" class="font-medium mb-1 text-gray-700 dark:text-gray-300">Weight Class</label>
          <input id="weight_class" type="text" v-model="profile.weight_class"
            class="input-field w-full border rounded p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            placeholder="e.g. Light, Middle, Heavy" />
        </div>

        <!-- Height Field -->
        <div class="flex flex-col">
          <label for="height" class="font-medium mb-1 text-gray-700 dark:text-gray-300">Height</label>
          <input id="height" type="text" v-model="profile.height"
            class="input-field w-full border rounded p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            placeholder="e.g. 5'10 or 178cm" />
        </div>

        <!-- Date of Birth Field -->
        <div class="flex flex-col">
          <label for="date_of_birth" class="font-medium mb-1 text-gray-700 dark:text-gray-300">Date of Birth</label>
          <input id="date_of_birth" type="date" v-model="profile.date_of_birth"
            class="input-field w-full border rounded p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
        </div>
      </div>
    </div>

    <!-- Bio Section -->
    <div class="border-t border-gray-200 pt-6 mb-8">
      <h2 class="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">About You</h2>

      <div class="flex flex-col mb-4">
        <label for="bio" class="font-medium mb-1 text-gray-700 dark:text-gray-300">Bio</label>
        <textarea id="bio" v-model="profile.bio" rows="4"
          class="input-field w-full border rounded p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          placeholder="Tell others about yourself"></textarea>
      </div>

      <div class="flex flex-col">
        <label for="achievements" class="font-medium mb-1 text-gray-700 dark:text-gray-300">Achievements</label>
        <textarea id="achievements" v-model="profile.achievements" rows="4"
          class="input-field w-full border rounded p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          placeholder="List your competition achievements and accomplishments"></textarea>
      </div>
    </div>

    <!-- Links Section -->
    <div class="border-t border-gray-200 pt-6 mb-8">
      <h2 class="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Links</h2>

      <div class="flex flex-col mb-4">
        <label for="website_url" class="font-medium mb-1 text-gray-700 dark:text-gray-300">Website</label>
        <input id="website_url" type="url" v-model="profile.website_url"
          class="input-field w-full border rounded p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          placeholder="https://yourwebsite.com" />
      </div>

      <!-- Social Links -->
      <h3 class="font-medium mb-2 text-gray-700 dark:text-gray-300">Social Media Links</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="flex flex-col">
          <label for="instagram" class="text-sm mb-1 text-gray-700 dark:text-gray-300">Instagram</label>
          <input id="instagram" type="url" v-model="socialLinksForm.instagram"
            class="input-field w-full border rounded p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            placeholder="https://instagram.com/username" />
        </div>
        <div class="flex flex-col">
          <label for="youtube" class="text-sm mb-1 text-gray-700 dark:text-gray-300">YouTube</label>
          <input id="youtube" type="url" v-model="socialLinksForm.youtube"
            class="input-field w-full border rounded p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            placeholder="https://youtube.com/channel/..." />
        </div>
        <div class="flex flex-col">
          <label for="twitter" class="text-sm mb-1 text-gray-700 dark:text-gray-300">Twitter/X</label>
          <input id="twitter" type="url" v-model="socialLinksForm.twitter"
            class="input-field w-full border rounded p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            placeholder="https://twitter.com/username" />
        </div>
        <div class="flex flex-col">
          <label for="facebook" class="text-sm mb-1 text-gray-700 dark:text-gray-300">Facebook</label>
          <input id="facebook" type="url" v-model="socialLinksForm.facebook"
            class="input-field w-full border rounded p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            placeholder="https://facebook.com/username" />
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end gap-4 border-t border-gray-200 pt-6">
      <button type="button" @click="cancelEdit"
        class="px-5 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
        Cancel
      </button>
      <button type="submit"
        class="px-5 py-2.5 text-white bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-500 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
        Save Changes
      </button>
    </div>
  </form>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { BACKEND_URL } from "@/utils/config";
import AvatarUpload from "@/components/common/AvatarUpload.vue";

export default {
  components: {
    AvatarUpload
  },
  props: ["userName"],
  setup(props) {
    const router = useRouter();
    const profile = ref({
      username: "",
      name: "",
      avatar_url: "",
      belt: "",
      academy: "",
      bio: "",
      location: "",
      nationality: "",
      weight_class: "",
      height: "",
      date_of_birth: null,
      social_links: {},
      achievements: "",
      website_url: ""
    });

    const originalUsername = ref(""); // Store original username for change detection
    const usernameError = ref(""); // For username validation errors

    // Separate form for social links that will be combined into social_links JSON
    const socialLinksForm = ref({
      instagram: "",
      youtube: "",
      twitter: "",
      facebook: ""
    });

    // Extract user info from token for userId
    const currentUserId = computed(() => {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;

      try {
        // Decode JWT token (base64)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        return payload.user_id;
      } catch (e) {
        console.error('Error decoding token:', e);
        return null;
      }
    });

    // Handle avatar update from the AvatarUpload component
    const handleAvatarUpdate = async (newAvatarUrl) => {
      profile.value.avatar_url = newAvatarUrl;

      // Refresh the token to include the new avatar URL
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${BACKEND_URL}/refresh-token`, {
            refreshToken
          });

          if (response.data && response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            console.log('Access token updated with new avatar URL');
          }
        }
      } catch (error) {
        console.error('Failed to refresh token with new avatar URL:', error);
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/viewprofile/${props.userName}`
        );
        profile.value = response.data;
        originalUsername.value = profile.value.username; // Store original username

        // Parse social_links if it exists and populate the form
        if (profile.value.social_links) {
          try {
            const socialLinks = typeof profile.value.social_links === 'string'
              ? JSON.parse(profile.value.social_links)
              : profile.value.social_links;

            // Populate social links form
            socialLinksForm.value.instagram = socialLinks.instagram || "";
            socialLinksForm.value.youtube = socialLinks.youtube || "";
            socialLinksForm.value.twitter = socialLinks.twitter || "";
            socialLinksForm.value.facebook = socialLinks.facebook || "";
          } catch (e) {
            console.error("Error parsing social links:", e);
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    const submitProfile = async () => {
      try {
        // Reset validation errors
        usernameError.value = "";

        // Validate username
        if (!profile.value.username || profile.value.username.trim() === "") {
          usernameError.value = "Username cannot be empty";
          return;
        }

        // Username format validation (alphanumeric and underscores only)
        if (!/^[a-zA-Z0-9_]+$/.test(profile.value.username)) {
          usernameError.value = "Username can only contain letters, numbers, and underscores";
          return;
        }

        // Combine social links into a JSON object
        const socialLinks = {};

        // Only include non-empty social links
        if (socialLinksForm.value.instagram) socialLinks.instagram = socialLinksForm.value.instagram;
        if (socialLinksForm.value.youtube) socialLinks.youtube = socialLinksForm.value.youtube;
        if (socialLinksForm.value.twitter) socialLinks.twitter = socialLinksForm.value.twitter;
        if (socialLinksForm.value.facebook) socialLinks.facebook = socialLinksForm.value.facebook;

        // Create a copy of the profile to avoid modifying the ref directly
        const profileData = { ...profile.value };

        // Set social_links as a stringified JSON if we have any links
        profileData.social_links = Object.keys(socialLinks).length > 0
          ? JSON.stringify(socialLinks)
          : null;

        const accessToken = localStorage.getItem("accessToken");

        // Extract user_id from the token
        const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
        const user_id = tokenPayload.user_id;

        console.log("Updating profile for user ID:", user_id);

        const response = await axios.put(
          `${BACKEND_URL}/edit-profile/${user_id}`,
          profileData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // If username was changed and server returned new tokens, update them
        if (response.data.accessToken && profile.value.username !== originalUsername.value) {
          localStorage.setItem("accessToken", response.data.accessToken);
          if (response.data.refreshToken) {
            localStorage.setItem("refreshToken", response.data.refreshToken);
          }
          alert("Profile updated successfully! You've changed your username, so you'll need to use the new one to log in.");
        } else {
          alert("Profile updated successfully!");
        }

        router.push(`/viewprofile/${profile.value.username}`);
      } catch (error) {
        console.error("Error updating profile:", error);

        // Handle username taken error
        if (error.response && error.response.status === 409) {
          usernameError.value = "This username is already taken";
        } else {
          alert("There was an error updating the profile.");
        }
      }
    };

    const cancelEdit = () => {
      router.push(`/viewprofile/${profile.value.username}`);
    };

    onMounted(fetchProfile);

    return {
      profile,
      socialLinksForm,
      usernameError,
      submitProfile,
      cancelEdit,
      currentUserId,
      handleAvatarUpdate
    };
  },
};
</script>
