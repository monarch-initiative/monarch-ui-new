<template>
  <main>
    <!-- temporary test items -->
    <markdownify :source="testMarkdown"></markdownify>
    <ul>
      <li v-for="(item, index) of testYaml" :key="index">{{ item }}</li>
    </ul>
    <fa icon="dna" />
  </main>
</template>
<script lang="ts">
import { defineComponent } from "vue";

// temporary test items
import testMarkdown from "./test-markdown.md";
import testYaml from "./test-yaml.yaml";

// landing/home page
export default defineComponent({
  data() {
    return { testMarkdown, testYaml };
  },
});
</script>
