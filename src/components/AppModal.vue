<!--
  basic modal component with arbitrary content

  references:
  https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/dialog.html
-->

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
          role="dialog"
          aria-modal="true"
          :aria-label="label"
          @mousedown.stop
          @touchstart.stop
        >
          <AppButton
            v-tippy="'Close dialog (esc)'"
            class="close"
            design="circle"
            icon="times"
            @click="close"
          />
          <slot />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, onUpdated, onBeforeUpdate } from "vue";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { useEventListener } from "@vueuse/core";

interface Props {
  /** two-way bound open state */
  modelValue?: boolean;
  /** modal aria label */
  label: string;
}

const props = defineProps<Props>();

interface Emits {
  /** two-way bound open state */
  (event: "update:modelValue", value: boolean): void;
}

const emit = defineEmits<Emits>();

/** element that had focus before modal was opened */
const originalFocus = ref<HTMLElement | null>(null);

/** update model value to close modal */
function close() {
  emit("update:modelValue", false);
}

/** when user presses any key */
function keyDown(event: KeyboardEvent) {
  if (event.key === "Escape") close();
}

/** attach key down listener to window */
useEventListener(window, "keydown", keyDown);

/** modal element */
const modal = ref<HTMLElement>();

/** after state change */
onUpdated(() => {
  /** rest of app besides modal */
  const app = document?.querySelector("#app");

  /** if modal just opened */
  if (props.modelValue) {
    /** hide for screen readers */
    app?.setAttribute("aria-hidden", "true");
    /** disable focus */
    app?.setAttribute("inert", "true");
    /** disable body scroll */
    if (modal.value) disableBodyScroll(modal.value);
    /** focus first focusable element in modal */
    const query = "input, textarea, button, select";
    const focusable = modal.value?.querySelector(query) as HTMLElement;
    focusable?.focus();
  }
});

/** before state change */
onBeforeUpdate(async () => {
  /** rest of app besides modal */
  const app = document?.querySelector("#app");

  /** if modal about to be opened */
  if (props.modelValue) {
    originalFocus.value = document?.activeElement as HTMLElement;
  } else {
    /** if modal about to be closed */
    /** show for screen readers */
    app?.removeAttribute("aria-hidden");
    /** enable focus */
    app?.removeAttribute("inert");
    /** enable body scroll */
    if (modal.value) enableBodyScroll(modal.value);
    /** restore focus to what had focus before modal opened */
    await nextTick();
    originalFocus.value?.focus();
  }
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

/** close button */
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  margin: 0;
  font-size: 0.8rem;
}
</style>
