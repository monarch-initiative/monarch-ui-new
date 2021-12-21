<template>
  <label class="checkbox">
    <input type="checkbox" :checked="modelValue" @change="onChange" />
    <span>
      <span>
        <slot />
      </span>
      <AppIcon v-if="icon" :icon="icon" />
    </span>
  </label>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// checkbox with aribitrary content (slot) and icon
export default defineComponent({
  props: {
    // checked state
    modelValue: Boolean,
    // icon to show next to slot content
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
  display: inline-flex;
  align-items: center;
  margin: 10px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background $fast;

  &:focus-within,
  &:hover {
    background: $light-gray;
  }

  input {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-right: 10px;
    appearance: none;
    background: none;
    border-radius: 3px;
    border: solid 2px $theme;
    outline: none;
    cursor: pointer;
  }

  input:checked {
    background: $theme;
    background-image: url("~@/assets/checkmark.svg");
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
  }
}
</style>
