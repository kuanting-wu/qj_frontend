<template>
    <div class="flex items-center w-full relative">
      <router-link :to="`/viewprofile/${ownerName}`" class="flex items-center">
        <img :src="avatarUrl" class="object-cover shrink-0 w-10 h-10 rounded-full mr-3" />
        <div class="flex-row">
          <div class="flex flex-col">
            <div class="flex items-center">
              <span class="text-gray-600 dark:text-gray-400 text-sm truncate transition-colors duration-200"
                    :title="ownerName">@{{ ownerName }}</span>
              <span v-if="academy"
                    class="text-gray-600 dark:text-gray-400 text-sm ml-1 truncate transition-colors duration-200"
                    :title="academy">· {{ academy }}</span>
            </div>
          </div>
          <!-- Belt Badge -->
          <div class="ml-auto">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                  :class="getBeltColor(belt)">
              {{ belt }}
            </span>
          </div>
        </div>
      </router-link>
    </div>
  </template>
  
  <script>
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "ProfileCard",
    props: {
      ownerName: { type: String, required: true },
      avatarUrl: { type: String, required: true },
      belt: { type: String, default: "white" },
      academy: { type: String, default: "" },
    },
    setup(props) {
      const getBeltColor = (belt) => {
        const beltColors = {
          white: "bg-gray-100 text-gray-800",
          blue: "bg-blue-100 text-blue-800",
          purple: "bg-purple-100 text-purple-800",
          brown: "bg-amber-100 text-amber-800",
          black: "bg-black text-white",
        };
        const beltLower = belt?.toLowerCase() || "white";
        return beltColors[beltLower] || beltColors.white;
      };
  
      return {
        getBeltColor,
      };
    },
  });
  </script>
  
  <style scoped>
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  </style>