<template>
  <component
    class="button"
    :is="component"
    :to="to"
    @click="click"
    :data-design="design"
    :data-text="!!text"
    :data-active="active"
    :data-notification="notification"
  >
    <span v-if="text">{{ text }}</span>
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
    // whether button is "on" or not
    active: {
      type: Boolean,
      default: undefined,
    },
    // visual design
    design: {
      default: "primary",
      type: String as PropType<"primary" | "secondary" | "small" | "circle">,
    },
    // whether to show little notification dot
    notification: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    // type of component to render
    component() {
      // if a link to somewhere, use link component (<a> or <router-link>)
      if (this.to) return "AppLink";
      // if has attached click event or submit button for form, make it a <button>
      else if (this.$attrs.onClick || this.$attrs.type === "submit")
        return "button";
      // fallback, use <span>
      else return "span";
    },
  },
});
</script>

<style lang="scss" scoped>
.button {
  &[data-design="primary"],
  &[data-design="secondary"],
  &[data-design="small"],
  &[data-design="circle"] {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-grow: 0;
    flex-shrink: 0;
    text-decoration: none;
    transition: color $fast, background $fast, opacity $fast, box-shadow $fast;
  }

  &[data-design="primary"],
  &[data-design="secondary"] {
    min-width: min(200px, calc(100% - 40px));
    min-height: 40px;
    padding: 5px 20px;
    color: $off-black;
    border-radius: $rounded;
    font-size: 1rem;
    font-weight: 500;
  }

  &[data-design="primary"] {
    background: $theme-light;
  }

  &[data-design="secondary"] {
    background: $light-gray;
  }

  &[data-design="small"] {
    flex-direction: row-reverse;
    padding: 3px;
    border-radius: $rounded;
    color: $theme;

    &[data-active="false"] {
      color: $gray;
    }
  }

  &[data-design="circle"] {
    background: $theme-light;
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

    &[data-active="false"] {
      background: none;
    }
  }

  &:hover,
  &:focus {
    &[data-design="primary"],
    &[data-design="secondary"],
    &[data-design="circle"] {
      outline: none;
      box-shadow: $outline;
    }

    &[data-design="small"] {
      color: $black;
    }
  }

  &[disabled] {
    pointer-events: none;
    opacity: 0.5;
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
[data-design="fill"] .button[data-design="circle"][data-active="true"] {
  background: $theme-mid;
}
</style>
