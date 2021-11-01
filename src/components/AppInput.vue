<template>
  <label class="input">
    <div v-if="title" class="title">
      {{ title }}
      <AppIcon
        v-if="required"
        icon="asterisk"
        class="asterisk"
        v-tooltip="'Required field'"
      />
    </div>
    <textarea
      v-if="multi"
      :value="modelValue"
      @input="onInput"
      :placeholder="placeholder"
    >
    </textarea>
    <input
      v-else
      :value="modelValue"
      @input="onInput"
      :placeholder="placeholder"
      :type="type"
    />
    <div v-if="description" class="description">{{ description }}</div>
  </label>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  emits: ["update:modelValue"],
  props: {
    //  state
    modelValue: String,
    // placeholder string when nothing typed in
    placeholder: String,
    // type of text box
    type: String,
    // name of field, shown above box
    title: String,
    // description of field, shown below box
    description: String,
    // whether field is required
    required: Boolean,
    // whether field is multi-line
    multi: Boolean,
  },
  methods: {
    onInput(event: Event) {
      this.$emit(
        "update:modelValue",
        (event?.target as HTMLInputElement).value
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.input {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.title {
  text-align: left;
  font-weight: 500;
}

.asterisk {
  position: relative;
  top: -5px;
  left: 5px;
  color: $error;
  font-size: 0.7rem;
}

.description {
  color: $dark-gray;
  text-align: left;
  font-size: 0.9rem;
}

input,
textarea {
  width: 100%;
  max-width: 100%;
  min-height: 40px;
  padding: 10px;
  border: solid 2px $off-black;
  border-radius: 3px;
  outline: none;
  transition: box-shadow $fast;
}

textarea {
  min-width: 100%;
  min-height: 160px;
}

input:hover,
input:focus,
textarea:hover,
textarea:focus {
  box-shadow: 0 0 0 2px $theme;
}
</style>
