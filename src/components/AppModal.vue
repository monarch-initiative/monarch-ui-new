<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="modelValue"
        class="overlay"
        @mousedown="close"
        @touchstart="close"
      >
        <div
          ref="modal"
          class="modal"
          @mousedown.stop
          @touchstart.stop
          role="dialog"
          aria-modal="true"
          :aria-label="label"
        >
          <AppButton
            class="close"
            design="circle"
            icon="times"
            @click="close"
            v-tooltip="'Close dialog (esc)'"
          />
          <slot />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, nextTick } from "vue";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

// references:
// https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/dialog.htmlw

// basic modal component with arbitrary content
export default defineComponent({
  props: {
    // open state
    modelValue: Boolean,
    // modal aria label
    label: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      originalFocus: null as HTMLElement | null,
    };
  },
  emits: ["update:modelValue"],
  methods: {
    // update model value to close modal
    close() {
      this.$emit("update:modelValue", false);
    },
    // on key down
    keyDown(event: KeyboardEvent) {
      if (event.key === "Escape") this.close();
    },
  },
  mounted() {
    // global keydown listener
    window.addEventListener("keydown", this.keyDown);
  },
  updated() {
    // modal element
    const modal = this.$refs.modal as HTMLElement;
    // rest of app besides modal
    const app = document.querySelector("#app");

    // if modal just opened
    if (this.modelValue) {
      // hide for screen readers
      app?.setAttribute("aria-hidden", "true");
      // disable focus
      app?.setAttribute("inert", "true");
      // disable body scroll
      disableBodyScroll(modal);
      // focus first focusable element in modal
      const query = "input, textarea, button, select";
      const focusable = modal.querySelector(query) as HTMLElement;
      focusable?.focus();
    }
  },
  beforeUpdate() {
    // modal element
    const modal = this.$refs.modal as HTMLElement;
    // rest of app besides modal
    const app = document.querySelector("#app");

    // if modal about to be opened
    if (this.modelValue) {
      this.originalFocus = document.activeElement as HTMLElement;
    }
    // if modal about to be closed
    else {
      // show for screen readers
      app?.removeAttribute("aria-hidden");
      // enable focus
      app?.removeAttribute("inert");
      // enable body scroll
      enableBodyScroll(modal);
      // restore focus to what had focus before modal opened
      nextTick(() => this.originalFocus?.focus());
    }
  },
  beforeUnmount() {
    // global keydown listener
    window.removeEventListener("keydown", this.keyDown);
  },
});
</script>

<style lang="scss" scoped>
.overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #000000c0;
  z-index: 99;
}

.modal {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  max-width: min(800px, calc(100vw - 80px));
  max-height: calc(100vh - 80px);
  padding: 40px;
  background: $white;
  overflow-y: auto;
  z-index: 100;
}

// close button
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  margin: 0;
  font-size: 0.8rem;
}
</style>
