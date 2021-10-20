<template>
  <AppSection>
    <h1>Publications</h1>
    <p class="center">
      <template
        class="link"
        v-for="(group, index) in publications"
        :key="index"
      >
        <a :href="'#' + group.year">{{ group.year }}</a>
        <span v-if="index !== publications.length - 1"> · </span>
      </template>
    </p>
  </AppSection>

  <!-- by year -->
  <AppSection v-for="(group, index) in publications" :key="index" width="big">
    <h2 v-heading>{{ group.year }}</h2>
    <AppGallery size="big">
      <AppCitation
        v-for="(publication, item) in group.list"
        :key="item"
        :title="publication.title"
        :authors="publication.authors"
        :details="[publication.journal, publication.issue, publication.link]"
      />
    </AppGallery>
  </AppSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import publications from "./publications.yaml";

export default defineComponent({
  data() {
    return { publications };
  },
});
</script>
