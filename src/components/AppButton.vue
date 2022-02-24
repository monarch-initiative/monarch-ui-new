<template>
  <component
    class="button"
    :is="component"
    :to="to"
    @click="copy ? copyToClipboard() : click"
    :data-design="design"
    :data-color="color"
    :data-text="!!text"
    :data-notification="notification"
  >
    <span v-if="text">{{ copied ? "Copied!" : text }}</span>
    <AppIcon v-if="icon" :icon="icon" />
  </component>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

// component that looks like a button that either does something or goes somewhere
export default defineComponent({
  props: {
    // text to show
    text: String,
    // icon to show
    icon: String,
    // location to link to
    to: String,
    // on click action
    click: Function,
    // visual design
    design: {
      default: "normal",
      type: String as PropType<"normal" | "circle" | "small">,
    },
    // color
    color: {
      default: "primary",
      type: String as PropType<"primary" | "secondary" | "none">,
    },
    // whether to show little notification dot
    notification: {
      default: false,
      type: Boolean,
    },
    // whether to copy text prop to clipboard on click
    copy: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      // flag for clipboard copy notification
      copied: false,
    };
  },
  computed: {
    // type of component to render
    component() {
      if (this.to) return "AppLink";
      else if (
        this.$attrs.onClick ||
        this.$attrs.type === "submit" ||
        this.copy
      )
        return "button";
      else return "span";
    },
  },
  methods: {
    async copyToClipboard() {
      await window.navigator.clipboard.writeText(this.text || "");
      this.copied = true;
      window.setTimeout(() => (this.copied = false), 1000);
    },
  },
});
</script>

<style lang="scss" scoped>
.button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-grow: 0;
  flex-shrink: 0;
  text-decoration: none;
  transition: color $fast, background $fast, opacity $fast, box-shadow $fast;

  &[data-design="normal"] {
    min-width: min(200px, calc(100% - 40px));
    min-height: 40px;
    padding: 5px 20px;
    color: $off-black;
    border-radius: $rounded;
    font-size: 1rem;
    font-weight: 500;

    &[data-color="primary"] {
      background: $theme-light;
    }

    &[data-color="secondary"] {
      background: $light-gray;
    }

    &:hover,
    &:focus {
      outline: none;
      box-shadow: $outline;
    }
  }

  &[data-design="circle"] {
    color: $off-black;
    border-radius: 999px;

    &[data-text="true"] {
      min-width: 2em;
      min-height: 2em;
      padding: 0.5em 0.75em;
    }

    &:not([data-text="true"]) {
      width: 2.5em;
      height: 2.5em;
    }

    &[data-color="primary"] {
      background: $theme-light;
    }

    &[data-color="secondary"] {
      background: $light-gray;
    }

    &:hover,
    &:focus {
      outline: none;
      box-shadow: $outline;
    }
  }

  &[data-design="small"] {
    flex-direction: row-reverse;
    padding: 3px;
    border-radius: $rounded;

    &[data-color="primary"] {
      color: $theme;
    }

    &[data-color="secondary"] {
      color: $gray;
    }

    &:hover,
    &:focus {
      color: $black;
    }
  }

  &[data-notification="true"]:after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 5px;
    height: 5px;
    border-radius: 999px;
    background: $error;
  }
}
</style>

<style lang="scss">
[data-design="fill"] .button[data-design="circle"][data-color="primary"] {
  background: $theme-mid;
}
</style>
