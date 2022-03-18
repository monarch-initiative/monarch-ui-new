<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="notification" class="snackbar">{{ notification }}</div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import { debounce, DebouncedFunc } from "lodash";
import { defineComponent } from "vue";

// global function to push a notification to snackbar
export const push = (message: string): unknown =>
  window.dispatchEvent(new CustomEvent("snackbar", { detail: message }));

// "snackbar" component (temporary notification at bottom of screen)
export default defineComponent({
  data() {
    return {
      // notification text
      notification: "",
      // close notification func
      close: debounce(() => null) as DebouncedFunc<() => void>,
    };
  },
  methods: {
    // set notification event
    push(event: Event) {
      this.notification = (event as CustomEvent).detail;
      this.close.cancel();
      this.close();
    },
  },
  created() {
    // create debounced version of clearing notification
    this.close = debounce(() => (this.notification = ""), 1000);

    // listen for global snackbar push event
    window.addEventListener("snackbar", this.push);
  },
  beforeUnmount() {
    // cancel any in-progress debounce
    this.close.cancel();
    // stop listening for global snackbar push event
    window.removeEventListener("snackbar", this.push);
  },
});
</script>

<style lang="scss" scoped>
.snackbar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  padding: 10px;
  transform: translateX(-50%);
  background: $off-black;
  color: $white;
  box-shadow: $shadow;
  z-index: 99;
}
</style>
