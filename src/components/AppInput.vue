<template>
  <label class="label">
    <div v-if="title" class="title">
      {{ title }}
      <AppIcon v-if="required" icon="asterisk" class="asterisk" />
    </div>
    <div class="input" :data-icon="!!icon">
      <textarea
        v-if="multi"
        :value="modelValue"
        @focus="onFocus"
        @input="onInput"
        @change="onChange"
        :placeholder="placeholder"
        :required="required"
      >
      </textarea>
      <input
        v-else
        :value="modelValue"
        @focus="onFocus"
        @input="onInput"
        @change="onChange"
        :placeholder="placeholder"
        :type="type"
        :required="required"
      />
      <div class="icon">
        <AppIcon v-if="icon" :icon="icon" />
      </div>
    </div>
    <div v-if="description" class="description">{{ description }}</div>
  </label>
</template>

<script lang="ts">
import { defineComponent, nextTick } from "vue";
import { debounce, DebouncedFunc } from "lodash";

// basic text box input, single line or multi-line
// can be used as controlled (you provide v-model/modelValue) or uncontrolled
export default defineComponent({
  emits: ["update:modelValue", "focus", "input", "change"],
  props: {
    // state
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
    // optional side icon
    icon: String,
  },
  data() {
    return {
      // debounced on change event
      debounced: debounce(() => null) as DebouncedFunc<(event: Event) => void>,
      // last on change value that was emitted
      last: undefined as string | undefined,
    };
  },
  methods: {
    // when user focuses box
    onFocus() {
      this.$emit("focus");
    },
    // when user types in box
    onInput(event: Event) {
      this.$emit("update:modelValue", (event.target as HTMLInputElement).value);
      this.$emit("input");
      this.debounced(event);
    },
    // when user "commits" change to value, e.g. pressing enter, de-focusing, etc
    onChange(event: Event) {
      // https://bugs.chromium.org/p/chromium/issues/detail?id=1297334
      nextTick(() => {
        const value = (event.target as HTMLInputElement).value;
        if (
          document?.contains(event.target as Node) &&
          // debounced on change has not already emitted
          value !== this.last
        ) {
          this.$emit("change", value);
          this.last = value;
        }
      });
    },
  },
  created() {
    // make instance-unique debounced version of on change func
    this.debounced = debounce(this.onChange, 500);
  },
  beforeUnmount() {
    // cancel any in-progress debounce
    this.debounced.cancel();
  },
});
</script>

<style lang="scss" scoped>
.label {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  --height: 40px;
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

.input {
  position: relative;
  width: 100%;
}

.icon {
  position: absolute;
  right: 0;
  top: 0;
  width: var(--height);
  height: var(--height);
  display: flex;
  justify-content: center;
  align-items: center;
  color: $gray;
}

input,
textarea {
  width: 100%;
  background: $white;
  border: solid 2px $off-black;
  border-radius: $rounded;
  outline: none;
  transition: box-shadow $fast;
}

input {
  height: var(--height);
  padding: 0 calc(var(--height) * 0.25);
  line-height: $spacing;
}

textarea {
  min-width: 100%;
  max-width: 100%;
  min-height: calc(var(--height) * 2);
  height: calc(var(--height) * 4);
  padding: calc(var(--height) * 0.25);
  line-height: $spacing;
}

.input[data-icon="true"] {
  input,
  textarea {
    padding-right: calc(var(--height) * 0.85);
  }
}

input:hover,
input:focus,
textarea:hover,
textarea:focus {
  box-shadow: $outline;
}
</style>
