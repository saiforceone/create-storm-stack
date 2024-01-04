<script lang="ts">
/**
 * @author SaiForceOne
 * @description Represents the welcome page shown when a new project is scaffolded from the CLI.
 * You are expected to replace or edit this to better fit your project.
 */
import { defineComponent } from 'vue';
import { STRMApp } from '🌀/@types/strm_fe';
import StrmConfig from '../../../../strm_config/strm_config.json';

export default defineComponent({
  name: 'Welcome',
  computed: {
    strmConfig: () => StrmConfig,
    pageTitle: () => 'ST🌀RM Stack',
    techIconSize: () => 2.25,
    contactIconSize: () => 1.5,
  },
  components: {},
  data(): { apiResponse: STRMApp.BaseAPIResponse | null } {
    return {
      apiResponse: null,
    };
  },
  methods: {
    /**
     * @function fetchApiData
     * @description Helper function that retrieves data from the corresponding controller. You are expected
     * to remove or repurpose this function. If you remove it, be sure to remove the corresponding function call
     * from `mounted`
     */
    fetchApiData() {
      const url = '/api/';
      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          this.apiResponse = json;
        })
        .catch((err) => {
          console.error('failed to load data with error: ', err);
        });
    },
  },
  mounted() {
    this.fetchApiData();
  },
});
</script>

<template>
  <div
    class="w-full h-full flex flex-col bg-gradient-to-b from-strm-bg-dark to-strm-bg-lighter p-2"
  >
    <header
      class="text-center text-white mt-4 w-full md:container md:mx-auto md:self-center"
    >
      <h1 class="text-3xl md:text-6xl font-heading text-white">
        {{ pageTitle }}
      </h1>
      <p class="text-lg mt-1">Make fullstack web applications a breeze</p>
      <p class="text-lg text-white mt-6">
        Welcome to the {{ pageTitle }} Stack. A different way to build
        python-based fullstack web applications with Reactive UIs
      </p>
    </header>

    <section
      v-if="apiResponse"
      class="rounded bg-white p-4 w-full md:w-4/5 self-center my-4"
      id="strm-api-response"
    >
      <h2 class="font-heading font-bold text-2xl">
        {{ pageTitle }} Welcome API Response
      </h2>
      <p class="text-lg">Here is an example of an API response</p>
      <div class="rounded bg-strm-bg-lighter p-4 text-white">
        {{ JSON.stringify(apiResponse['data']) }}
      </div>
      <p class="mt-2">
        * API functions can be found at:
        <span class="bg-strm-bg-lighter p-1 rounded text-white font-medium"
          >strm_controllers/[controller_name]</span
        >
      </p>
    </section>

    <section
      class="rounded bg-white p-4 w-full md:w-4/5 self-center"
      id="strm-do-next"
    >
      <h2 class="font-heading font-bold text-2xl">Project Details</h2>
      <div class="grid grid cols-1 my-2 gap-1">
        <p class="font-bold">
          Project Name:
          <span class="bg-strm-bg-lighter p-1 rounded text-white font-medium">{{
            strmConfig.appId
          }}</span>
        </p>
        <p class="font-bold">
          Frontend:
          <span class="bg-strm-bg-lighter p-1 rounded text-white font-medium">{{
            strmConfig.frontend
          }}</span>
        </p>
      </div>
      <h2 class="font-heading font-bold text-2xl">What to do next</h2>
      <p class="text-lg mt-2">
        Now that your {{ pageTitle }} Stack project is running, consider doing
        the following:
      </p>
      <div class="grid grid-cols-1 gap-1 mt-2">
        <p>
          1. Edit or replace this page found at:
          <span class="bg-strm-bg-lighter p-1 rounded text-white font-medium">{{
            `${strmConfig.frontendBasePath}/src/pages/Welcome/Index.vue`
          }}</span>
        </p>
        <p>
          2. Create a controller:
          <span class="bg-strm-bg-lighter p-1 rounded text-white font-medium">
            npx @saiforceone/strm-cli --create-controller
            [controller_name]</span
          >
        </p>
      </div>
      <h3 class="font-heading font-bold mt-4">Other links</h3>
      <p>
        For a more detailed guide or to find out about important files and
        folder, consider reading the getting started guide (coming soon)
      </p>
    </section>
    <section class="text-white mt-10" id="strm-powered">
      <p class="text-lg text-center font-heading font-bold mb-2">
        The {{ pageTitle }} is powered by
      </p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <a
          href="https://www.starlette.io/"
          target="_blank"
          title="Link to Starlette"
        >
          <div class="flex flex-col items-center">
            <v-icon name="bi-star-fill" :scale="techIconSize" />
            Starlette
          </div>
        </a>
        <a
          href="https://tailwindcss.com/"
          target="_blank"
          title="Link to TailwindCSS"
        >
          <div class="flex flex-col items-center">
            <v-icon name="si-tailwindcss" :scale="techIconSize" />
            Tailwind CSS
          </div>
        </a>
        <a href="https://vuejs.org/" target="_blank" title="Link to Vue">
          <div class="flex flex-col items-center">
            <v-icon name="si-vuedotjs" :scale="techIconSize" />
            Reactive UI ({{ strmConfig.frontend }})
          </div>
        </a>
        <a
          href="https://www.mongodb.com/"
          target="_blank"
          title="Link to MongoDB"
        >
          <div class="flex flex-col items-center">
            <v-icon name="si-mongodb" :scale="techIconSize" />
            MongoDB
          </div>
        </a>
      </div>
      <p class="text-lg font-bold font-heading text-center my-4">
        and supercharged by
      </p>
      <a href="https://vitejs.dev/" target="_blank" title="Link to Vite">
        <div class="flex flex-col items-center">
          <v-icon name="si-vite" :scale="techIconSize" />
          Vite
        </div>
      </a>
    </section>
    <footer
      class="mt-4 p-2 text-white flex flex-col items-center"
      id="strm-footer"
    >
      <div class="w-full md:w-2/5 grid grid-cols-2 gap-2">
        <div>
          <a
            class="flex items-center gap-x-1"
            href="https://discord.gg/sY3a5VN3y9"
            title="Link to the Peanut Cart Express Discord"
            target="_blank"
          >
            <v-icon name="si-discord" :scale="contactIconSize" />
            P.C.E Discord
          </a>
        </div>
        <div class="flex">
          <a
            class="flex items-center gap-x-1"
            title="Link to the STORM Stack on Github"
            href="https://github.com/saiforceone/strm-cli"
            target="_blank"
          >
            <v-icon name="si-github" :scale="contactIconSize" />
            {{ pageTitle }} Stack Git
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
