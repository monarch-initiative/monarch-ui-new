<template>
  <label class="checkbox" :aria-checked="modelValue">
    <input type="checkbox" :checked="modelValue" @change="onChange" />
    <AppIcon class="check" :icon="modelValue ? 'square-check' : 'square'" />
    <span v-if="text">{{ text }}</span>
    <AppIcon v-if="icon" class="icon" :icon="icon" />
  </label>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// checkbox with aribitrary content (slot) and icon
export default defineComponent({
  props: {
    // checked state
    modelValue: Boolean,
    // text to show in label
    text: String,
    // icon to show in label
    icon: String,
  },
  emits: ["update:modelValue"],
  methods: {
    onChange(event: Event) {
      this.$emit(
        "update:modelValue",
        (event?.target as HTMLInputElement).checked
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  cursor: pointer;
  transition: background $fast;

  .check {
    color: $theme;
    font-size: 1.2rem;
  }

  .icon {
    color: $gray;
  }

  &:focus-within,
  &:hover {
    background: $light-gray;
  }

  input {
    position: absolute;
    appearance: none;
  }
}
</style>
