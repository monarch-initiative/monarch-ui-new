<template>
  <TheHeader />
  <main>
    <router-view />
  </main>
  <TheFooter />
  <TheJumpButton />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import "normalize.css"; // keep this before global styles
import "@/global/icons";
import "@/global/styles.scss";
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
import TheJumpButton from "@/components/TheJumpButton.vue";

export default defineComponent({
  props: {
    large: Boolean,
  },
  components: {
    TheHeader,
    TheFooter,
    TheJumpButton,
  },
});
</script>
