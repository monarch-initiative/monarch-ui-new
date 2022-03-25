<template>
  <AppFlex
    ref="cell"
    hAlign="left"
    direction="col"
    gap="small"
    class="detail"
    :data-big="big"
  >
    <div class="text">{{ title }}</div>

    <div v-if="blank" class="empty">No info</div>
    <slot v-else />
  </AppFlex>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// simple container primarily for showing fields of a node as blocks of info
// for fields not relevant to current page (e.g. taxon on a disease node page),
// hide with v-if
// for relevant fields, show with v-if, to indicate that field exists, but pass
// "blank" prop to indicate that no data available
export default defineComponent({
  props: {
    // whether or not to show "no info" placeholder
    blank: {
      type: Boolean,
      default: false,
    },
    // title of info
    title: {
      type: String,
      required: true,
    },
    // size of info block
    big: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.detail {
  flex-grow: 1;
  text-align: left;

  &[data-big="true"] {
    width: 100%;
  }

  &[data-big="false"] {
    // keep in sync with AppDetails gap
    width: calc((100% - 30px) / 2);
  }

  @media (max-width: 700px) {
    &[data-big] {
      width: 100%;
    }
  }
}

.text {
  font-weight: 600;
}

.empty {
  color: $gray;
}
</style>
