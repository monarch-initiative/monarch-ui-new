<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        ref="notification"
        v-if="notification"
        role="alert"
        aria-live="polite"
        class="snackbar"
        @click="onClick"
        @keydown="() => null"
      >
        {{ notification }}
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { restartAnimations } from "@/util/dom";

// global function to push a notification to snackbar
export const push = (message: string): unknown =>
  window.dispatchEvent(new CustomEvent("snackbar", { detail: message }));

let timeout: number;

// "snackbar" component (temporary notification at bottom of screen)
export default defineComponent({
  data() {
    return {
      // notification text
      notification: "",
    };
  },
  methods: {
    // set notification event
    push(event: Event) {
      // flash notification
      restartAnimations(this.$refs.notification as Element);

      // set notification text
      this.notification = (event as CustomEvent).detail;

      // set timer to close
      window.clearTimeout(timeout);
      timeout = window.setTimeout(
        () => (this.notification = ""),
        // make delay longer for longer messages
        this.notification.length * 50
      );
    },
    // when user clicks notification
    onClick() {
      window.clearTimeout(timeout);
      this.notification = "";
    },
  },
  created() {
    // listen for global snackbar push event
    window.addEventListener("snackbar", this.push);
  },
  beforeUnmount() {
    // cancel any in-progress debounce
    window.clearTimeout(timeout);
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
  animation: flash 0.25s linear forwards;
}

@keyframes flash {
  0% {
    background: $theme-dark;
  }
  100% {
    background: $off-black;
  }
}
</style>
