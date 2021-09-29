<template>
  <header :data-big="big">
    <Title :big="big" :expanded="expanded" @toggle="expanded = !expanded" />
    <Nav :big="big" :expanded="expanded" />
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Title from "@/components/Title.vue";
import Nav from "@/components/Nav.vue";

export default defineComponent({
  components: {
    Title,
    Nav,
  },
  data() {
    return {
      // is nav menu expanded
      expanded: false,
    };
  },
  computed: {
    // is big version (home page)
    big() {
      return this.$route.name === "home";
    },
  },
});
</script>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: $theme-dark;
  color: $white;
}

@media (max-width: $nav) {
  header {
    flex-direction: column;
  }
}

header[data-big="true"] {
  justify-content: center;
  min-height: 300px;

  @media (min-width: $nav) {
    position: relative;
  }

  @media (max-width: $nav) {
    justify-content: space-between;
    min-height: unset;
  }
}
</style>
