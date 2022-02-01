<template>
  <label class="checkbox">
    <input type="checkbox" :checked="modelValue" @change="onChange" />
    <span class="text">
      <span v-if="text">{{ text }}</span>
      <AppIcon v-if="icon" class="icon" :icon="icon" />
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
  display: inline-flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: background $fast;

  .icon {
    margin-left: 10px;
    color: $gray;
  }

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
    border-radius: $rounded;
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
