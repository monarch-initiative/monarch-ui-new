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
    <AppHeading>What is Monarch</AppHeading>
    <AppPlaceholder />
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

    Latest posts about Monarch

    <!-- status -->
    <AppStatus v-if="isLoading" code="loading" role="option"
      >Loading results</AppStatus
    >
    <AppStatus v-if="isError" code="error" role="option"
      >Error loading results</AppStatus
    >

    <!-- list of posts -->
    <AppFlex v-if="blogPosts.length" direction="col" gap="big">
      <AppCard
        v-for="(item, index) in blogPosts.slice(0, 5)"
        :key="index"
        class="blog-post"
        :image="item.thumbnail"
      >
        <span class="blog-date">{{ item.date.toLocaleDateString() }}</span>
        <AppLink :to="item.link">
          {{ item.title }}
        </AppLink>
        <p class="blog-description truncate-2">
          {{ item.description }}
        </p>
      </AppCard>
    </AppFlex>

    <AppButton
      to="https://monarchinit.medium.com/"
      text="More on Medium.com"
      icon="external-link-alt"
    />
  </AppSection>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import AppTabs from "@/components/AppTabs.vue";
import AppCard from "@/components/AppCard.vue";
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
  max-width: 100%;
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
