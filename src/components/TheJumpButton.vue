<template>
  <AppButton
    v-if="show"
    icon="angle-up"
    v-tooltip="'Jump to top of page'"
    @click="jump()"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { debounce, DebouncedFunc } from "lodash";

// floating button that lets user conveniently jump to top of page
export default defineComponent({
  data() {
    return {
      // whether to show the button
      show: false,
    };
  },
  methods: {
    onScroll() {
      // only show if page is long and user has scrolled far (but not to bottom)
      this.show =
        window.scrollY > window.innerHeight &&
        window.scrollY + window.innerHeight <
          document.body.clientHeight -
            (document.querySelector("footer")?.clientHeight || 0);
    },
    jump() {
      // jump to top of page
      window.scrollTo(0, 0);
    },
  },
  computed: {
    // debounced version of on scroll listener for performance
    debounced(): DebouncedFunc<() => void> {
      return debounce(this.onScroll, 100);
    },
  },
  mounted() {
    window.addEventListener("scroll", this.debounced);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.debounced);
  },
});
</script>

<style lang="scss" scoped>
button {
  position: fixed;
  right: 0;
  bottom: 0;
}
</style>
