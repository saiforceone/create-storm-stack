<script lang="ts">
/**
 * @author SaiForceOne/ST🌀RM Stack CLI
 * @description Defines the equivalent of a 404-not found page for routes that
 * are not found. This only has a minimal design and should be updated as needed
 * to fit your current design.
 */

// Core imports
import { defineComponent } from 'vue';

export default defineComponent({
  computed: {
    /**
     * @description To ensure that the 404 image is loaded properly, we use attempt
     * to resolve the image based on the filesystem path. Refer to the link for
     * more info: 🔗 https://vitejs.dev/guide/assets
     * @constructor
     */
    RESOLVED_404_IMG() {
      return new URL(
        '../../../../static/dist/images/404-not-found.jpg',
        import.meta.url
      ).href;
    },
    PAGE_TITLE() {
      return 'ST🌀RM';
    },
  },
  name: 'NotFound',
});
</script>

<template>
  <div
    class="w-full min-h-screen text-white flex flex-col bg-gradient-to-b from-storm-bg-dark to-storm-bg-lighter p-2"
  >
    <div class="flex flex-col gap-y-4">
      <h1 class="font-heading text-4xl text-center">{{ PAGE_TITLE }} Stack</h1>
      <p class="text-lg text-center">
        The 🌀 blew away the component you are looking for 🙃
      </p>
      <img :src="RESOLVED_404_IMG" alt="404 not found" />
      <h2 class="text-2xl text-center font-heading">What to do next?</h2>
      <div class="flex flex-col items-center gap-y-2">
        <router-link class="text-center w-fit hover:underline" to="/">
          Navigate to Home
        </router-link>
        <p class="text-center">
          You should probably update this component to better fit your app's
          overall theme. The component can be edited:
          <span class="px-1 py-0.5 italic rounded-sm text-white bg-strm-bg-dark"
            >strm_fe_vue/src/components/shared/NotFound.vue</span
          >
        </p>
      </div>
    </div>
  </div>
</template>
