<template>
  <blockquote class="citation">
    <div>{{ title }}</div>
    <div>{{ authors }}</div>
    <div>{{ journal }}&nbsp;·&nbsp;{{ issue }}</div>
    <div>DOI: {{ doi }}</div>
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
    // journal/publisher
    journal: String,
    // date/issue
    issue: String,
    // doi
    doi: String,
  },
});
</script>

<style lang="scss" scoped>
.citation {
  & > div {
    &:first-child {
      font-weight: 600;
    }

    &:last-child {
      font-style: italic;
    }
  }
}
</style>
