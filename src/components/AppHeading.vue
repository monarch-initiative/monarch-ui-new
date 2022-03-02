<template>
  <component :is="tag || 'div'" ref="heading" :id="link">
    <!-- heading content -->
    <slot />

    <!-- heading anchor -->
    <AppLink
      v-if="link"
      :to="'#' + link"
      class="anchor"
      :aria-label="'Link to this section'"
    >
      <AppIcon icon="link" />
    </AppLink>
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { kebabCase } from "lodash";

// heading component with anchor link and (optionally) automatic level
export default defineComponent({
  props: {
    // manually specified heading level
    level: Number,
  },
  data() {
    return {
      // tag of heading (default to blank to avoid conflict with automatic level)
      tag: "",
      // hash link of heading
      link: "",
    };
  },
  methods: {
    // get heading level/tag, i.e. h1, h2, h3, etc
    getTag() {
      // if level manually specified, just use that
      if (this.level) return "h" + this.level;

      // otherwise, determine automatically based on heading's position in document
      // https://dequeuniversity.com/rules/axe/4.1/page-has-heading-one

      // heading element
      const element = this?.$refs?.heading as HTMLElement;
      // section element
      const parent = element.parentElement as HTMLElement;

      // if heading is first in section
      const firstHeading = element.matches("*:first-child");
      // if section is first in main
      const firstSection = parent.matches("*:first-child");

      // determine level
      if (firstSection) {
        if (firstHeading) return "h1";
        else return "h2";
      } else {
        if (firstHeading) return "h2";
        else return "h3";
      }
    },
    // determine hash link
    getLink() {
      // heading element
      const element = this?.$refs?.heading as HTMLElement;

      // determine link from text content of heading
      return kebabCase(element.textContent || "");
    },
  },
  mounted() {
    this.tag = this.getTag();
    this.link = this.getLink();
  },
  updated() {
    this.tag = this.getTag();
    this.link = this.getLink();
  },
});
</script>

<style lang="scss" scoped>
.anchor {
  display: inline-block;
  width: 0;
  margin-left: 10px;
  opacity: 0;
  text-decoration: none;
  font-size: 0.8em;
  transition: opacity $fast, color $fast;
}

.anchor:focus {
  opacity: 1;
}

h1,
h2,
h3 {
  &:hover .anchor {
    opacity: 1;
  }
}
</style>
