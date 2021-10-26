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

// set heading level and tag, i.e. h1, h2, h3, etc
function setTag(this: Heading) {
  // level to set
  let level;

  // if level manually specified, just use that
  if (this.level) {
    level = this.level;
  }

  // otherwise, determine automatically based on heading's position in document
  // https://dequeuniversity.com/rules/axe/4.1/page-has-heading-one
  else {
    // heading element
    const element = this?.$refs?.heading as HTMLElement;

    // if heading is first in parent
    const firstInParent = element.matches("*:first-child");
    // if heading is first in document
    const firstInDoc = element.matches(
      "main > section:first-child > *:first-child, main > *:first-child"
    );

    // determine level
    if (firstInDoc) level = 1;
    else if (firstInParent) level = 2;
    else level = 3;
  }

  // set tag/component
  this.tag = "h" + level;
}

// determine hash link
function setLink(this: Heading) {
  // heading element
  const element = this?.$refs?.heading as HTMLElement;

  // determine link from text content of heading
  this.link = kebabCase(element.textContent || "");
}

// heading component with anchor link and (optionally) automatic level
const heading = defineComponent({
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
  mounted() {
    setTag.call(this);
    setLink.call(this);
  },
  updated() {
    setTag.call(this);
    setLink.call(this);
  },
});

// type of instance of this component
type Heading = InstanceType<typeof heading>;

// export component as usual
export default heading;
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
