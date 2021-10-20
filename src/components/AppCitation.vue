<template>
  <blockquote class="citation">
    <div v-if="title" class="truncate-2" tabindex="0">{{ title }}</div>
    <div v-if="authors" class="truncate-2" tabindex="0">{{ authors }}</div>
    <AppMarkdown
      v-if="_details"
      class="truncate-2"
      tabindex="0"
      :source="_details"
    />
  </blockquote>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    // work title
    title: String,
    // list of authors
    authors: String,
    // journal, issue, date, or other misc info
    details: Array,
  },
  computed: {
    _details() {
      return (this.details || []).filter((e) => e).join("&nbsp; · &nbsp;");
    },
  },
});
</script>

<style lang="scss" scoped>
.citation {
  & > div {
    margin: 10px 0;
    @include trim-v-margins;

    &:nth-child(1) {
      font-weight: 600;
    }

    &:nth-child(2) {
      font-style: italic;
    }
  }
}
</style>
