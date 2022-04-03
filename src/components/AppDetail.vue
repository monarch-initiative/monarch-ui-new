<!--
  simple container for blocks of info (primarily for node page)
-->

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

<script setup lang="ts">
// for fields not relevant to current page (e.g. taxon on a disease node page),
// hide with v-if

// for relevant fields, show with v-if, to indicate that field exists, but pass
// "blank" prop to indicate that no data available

interface Props {
  // title of info block
  title: string;
  // whether or not to show "no info" placeholder. why? to show that this field
  // exists, but doesn't have data this time.
  blank?: boolean;
  // whether info block is full width or not
  big?: boolean;
}

withDefaults(defineProps<Props>(), { blank: false, big: false });
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
