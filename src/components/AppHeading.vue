<template>
  <component :is="tag || 'div'" ref="heading">
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
  else {
    // heading element
    const element = this?.$refs?.heading as HTMLElement;
    // parent section element
    const section = element.closest("section") as HTMLElement;
    // is there an existing h1 (besides self)
    let h1 = document.querySelector("h1");
    if (h1 === element) h1 = null;

    // if heading is first element in section
    if (element.matches(":first-child")) {
      // if section is first section in <main> and if no other h1s already
      // (only one h1 per page for accessibility)
      if (section.matches(":first-child") && !h1) level = 1;
      // if section is latter
      else level = 2;
    }
    // if heading is latter
    else {
      level = 3;
    }
  }

  // set tag/component
  this.tag = "h" + level;
}

// determine hash link
function setLink(this: Heading) {
  // heading element
  const element = this?.$refs?.heading as HTMLElement;
  // parent section element
  const section = element.closest("section") as HTMLElement;

  // if heading right at top of page, don't have link because no point
  if (element.matches(":first-child") && section.matches(":first-child"))
    this.link = "";
  // otherwise, determine link from text content of heading
  else this.link = kebabCase(element.innerText);
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
