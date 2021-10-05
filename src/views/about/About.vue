<template>
  <AppSection>
    <h1>About</h1>
    <p>
      The Monarch Initiative is an extensive, comprehensive knowledge graph and
      ecosystem of tools made for the benefit of clinicians, researchers, and
      scientists. The knowledge graph consists of XX genes, diseases,
      phenotypes, and other entities, imported from over XX sources. Our
      strenghts are how we connect phenotypes to genotypes across species and
      bridge basic and applied research with semantics-based analysis.
    </p>
  </AppSection>
  <AppSection>
    <AppTile
      v-for="(item, index) in links"
      :key="index"
      :to="item.to"
      :icon="item.icon"
      :title="item.title"
      :subtitle="item.subtitle"
    />
  </AppSection>
  <AppSection>
    <h2 v-heading>Stay up to date</h2>
    <p class="center">
      Be the first to know when we have important updates or other fun news.
    </p>
    <AppTile
      v-for="(item, index) in social"
      :key="index"
      :to="item.to"
      :icon="item.icon"
      :title="item.title"
      :subtitle="item.subtitle"
      design="small"
    />
  </AppSection>
  <AppSection>
    <h2 v-heading>Our Vision</h2>
    <ol>
      <li v-for="(item, index) in vision" :key="index">{{ item }}</li>
    </ol>
  </AppSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import social from "@/global/social.yaml";
import links from "./links.yaml";
import vision from "./vision.yaml";

export default defineComponent({
  data() {
    return {
      // big page links data
      links,
      // social icons data
      social,
      // vision list data
      vision,
    };
  },
});
</script>
