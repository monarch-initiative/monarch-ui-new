<!--
  homepage of entire site
-->

<template>
  <!-- dive right in -->
  <AppSection design="fill">
    <AppTabs v-model="tab" name="Explore Mode" :tabs="tabs" route="Explore" />
    <NodeSearch />
  </AppSection>

  <!-- "elevator pitch" -->
  <AppSection>
    <AppHeading>What is Monarch?</AppHeading>

    <AppFlex gap="big">
      <AppTile
        icon="knowledge-graph"
        title="Extensive, cross-species, semantic knowledge graph"
      />
      <AppTile
        icon="toolbox"
        title="Ecosystem of powerful tools for analysis"
      />
      <AppTile
        icon="phenotype-search"
        title="One-of-a-kind fuzzy phenotype search"
      />
    </AppFlex>

    <hr />

    <AppFlex>
      <AppTile
        icon="category-gene"
        design="small"
        :title="`${(100000).toLocaleString()}+`"
        subtitle="genes"
      />
      <AppTile
        icon="category-disease"
        design="small"
        :title="`${(100000).toLocaleString()}+`"
        subtitle="diseases"
      />
      <AppTile
        icon="category-phenotype"
        design="small"
        :title="`${(100000).toLocaleString()}+`"
        subtitle="phenotypes"
      />
      <AppTile
        icon="category-publication"
        design="small"
        :title="`${(100000).toLocaleString()}+`"
        subtitle="publications"
      />
      <AppTile
        icon="category-unknown"
        design="small"
        :title="`${(1000000).toLocaleString()}+`"
        subtitle="total nodes"
      />
    </AppFlex>
    <AppButton to="/about" text="Learn more" icon="arrow-right" />
  </AppSection>

  <!-- specific feature demos -->
  <AppSection>
    <AppHeading>Features</AppHeading>
    <AppPlaceholder />
  </AppSection>

  <!-- news -->
  <AppSection>
    <AppHeading>News</AppHeading>

    <p>Latest posts about Monarch.</p>

    <!-- status -->
    <AppStatus v-if="isLoading" code="loading">Loading posts</AppStatus>
    <AppStatus v-if="isError" code="error">Error loading posts</AppStatus>

    <!-- list of posts -->
    <AppFlex v-if="blogPosts.length" direction="col" gap="big">
      <AppCard
        v-for="(item, index) in blogPosts.slice(0, 5)"
        :key="index"
        class="blog-post"
        :image="item.thumbnail"
      >
        <span class="blog-date">{{
          item.date.toLocaleDateString(undefined, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        }}</span>
        <AppLink class="blog-link" :to="item.link">
          {{ item.title }}
        </AppLink>
        <p class="blog-description truncate-2">
          {{ item.description }}
        </p>
      </AppCard>
    </AppFlex>

    <AppButton
      to="https://monarchinit.medium.com/"
      text="More on Medium"
      icon="medium"
    />
  </AppSection>

  <!-- social media -->
  <AppSection>
    <AppHeading>Follow</AppHeading>
    <p>Be the first to know when we have major updates or other fun news.</p>
    <AppFlex>
      <AppTile
        to="https://medium.com/@MonarchInit"
        icon="medium"
        title="Medium"
        subtitle="Blog posts and major updates"
        design="small"
      />
      <AppTile
        to="https://github.com/monarch-initiative"
        icon="github"
        title="GitHub"
        subtitle="Source code and releases"
        design="small"
      />
      <AppTile
        to="https://twitter.com/MonarchInit"
        icon="twitter"
        title="Twitter"
        subtitle="Quick updates and musings"
        design="small"
      />
    </AppFlex>
  </AppSection>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import AppTabs from "@/components/AppTabs.vue";
import AppCard from "@/components/AppCard.vue";
import AppTile from "@/components/AppTile.vue";
import tabs from "./explore/tabs.json";
import NodeSearch from "./explore/NodeSearch.vue";
import { useQuery } from "@/util/composables";
import { getBlogPosts } from "@/api/blog";

/** selected tab state */
const tab = ref(tabs[0].id);

const {
  query: getPosts,
  data: blogPosts,
  isLoading,
  isError,
} = useQuery(async function () {
  return await getBlogPosts();
}, []);

onMounted(getPosts);
</script>

<style lang="scss" scoped>
.news-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

@media (max-width: 800px) {
  .news-cols {
    grid-template-columns: 1fr;
  }
}

.blog-post {
  width: 100%;
}

.blog-link {
  line-height: $spacing;
}

.blog-description {
  font-size: 0.9rem;
  line-height: $spacing;
}

.blog-date {
  color: $gray;
  font-size: 0.9rem;
}
</style>
