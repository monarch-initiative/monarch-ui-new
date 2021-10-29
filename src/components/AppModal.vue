<template>
  <VueFinalModal
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event.value)"
    classes="modal-container"
    content-class="modal-content"
    :focus-trap="true"
    :esc-to-close="true"
    v-slot="{ close }"
  >
    <slot />
    <AppButton
      class="close"
      icon="times"
      @click="close"
      v-tooltip="'Close form (esc)'"
    />
  </VueFinalModal>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// modal component with arbitrary content
// TODO: transition away from vue-final-modal
export default defineComponent({
  props: {
    // open state
    modelValue: Boolean,
  },
  emits: ["update:modelValue"],
});
</script>

<style lang="scss">
// style overlay under modal
.vfm--overlay {
  background: #000000a0 !important;
}

// center modal in screen
.modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

// style modal itself
.modal-content {
  position: relative;
  max-width: min(800px, calc(95vw - 50px));
  max-height: calc(100vh - 50px);
  padding: 40px;
  background: $white;
  overflow-y: auto;
}

// close button
.close {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 0.8rem !important;
}
</style>
