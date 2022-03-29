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
import "normalize.css";
import "@/global/icons";
import "@/global/styles.scss"; // keep these last so they take priority
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
