<template>
  <Header />
  <main>
    <router-view />
  </main>
  <Footer />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import "@/global/icons";
import "normalize.css";
import "@/global/styles.scss";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  props: {
    large: Boolean,
  },
  components: {
    Header,
    Footer,
  },
});
</script>
