<template>
  <TheHeader />
  <main>
    <router-view />
  </main>
  <TheFooter />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import "@/global/icons";
import "normalize.css";
import "@/global/styles.scss";
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";

export default defineComponent({
  props: {
    large: Boolean,
  },
  components: {
    TheHeader,
    TheFooter,
  },
});
</script>
