<template>
  <TheHeader />
  <main>
    <router-view />
    <TheFloatButtons />
    <TheSnackbar />
  </main>
  <TheFooter />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import "normalize.css"; // keep this before global styles so they take priority
import "@/global/icons";
import "@/global/styles.scss";
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
import TheFloatButtons from "@/components/TheFloatButtons.vue";
import TheSnackbar from "./components/TheSnackbar.vue";

export default defineComponent({
  props: {
    large: Boolean,
  },
  components: {
    TheHeader,
    TheFooter,
    TheFloatButtons,
    TheSnackbar,
  },
});
</script>
