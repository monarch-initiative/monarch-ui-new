<!--
  homepage of entire site
-->

<template>
  <!-- dive right in -->
  <AppSection design="fill">
    <AppTabs v-model="tab" name="Explore Mode" :tabs="tabs" route="Explore" />
    <NodeSearch />
  </AppSection>

  <AppSection>
    <AppHeading>What is Monarch?</AppHeading>

    <!-- high level description of monarch as a whole. "elevator pitch" -->
    <!-- eslint-disable-next-line -->
    <AppFlex gap="big" vAlign="top">
      <AppTile
        icon="knowledge-graph"
        title="An extensive, cross-species, semantic knowledge graph"
      />
      <AppTile
        icon="phenotype-search"
        title="A website for quick and easy exploration of the graph"
      />
      <AppTile
        icon="toolbox"
        title="Powerful API and ecosystem of related tools"
      />
    </AppFlex>

    <hr />

    <!-- (rough) node counts, just for advertising -->
    <AppFlex>
      <!-- http://solr.monarchinitiative.org/solr/search/select?q=*:*&rows=0&facet=true&facet.field=category&wt=json -->
      <AppTile
        icon="category-gene"
        design="small"
        :title="`~${(1000000).toLocaleString()}`"
        subtitle="genes"
      />
      <AppTile
        icon="category-disease"
        design="small"
        :title="`~${(25000).toLocaleString()}`"
        subtitle="diseases"
      />
      <AppTile
        icon="category-phenotype"
        design="small"
        :title="`~${(70000).toLocaleString()}`"
        subtitle="phenotypes"
      />
      <AppTile
        icon="category-variant"
        design="small"
        :title="`~${(3000000).toLocaleString()}`"
        subtitle="variants"
      />
      <AppTile
        icon="category-genotype"
        design="small"
        :title="`~${(200000).toLocaleString()}`"
        subtitle="genotypes"
      />
      <AppTile
        icon="category-anatomy"
        design="small"
        :title="`~${(100000).toLocaleString()}`"
        subtitle="anatomies"
      />
      <AppTile
        icon="category-publication"
        design="small"
        :title="`~${(50000).toLocaleString()}`"
        subtitle="publications"
      />
      <AppTile
        icon="category-unknown"
        design="small"
        :title="`~${(5000000).toLocaleString()}`"
        subtitle="total nodes"
      />
    </AppFlex>
    <AppButton to="/about" text="Learn more" icon="arrow-right" />
  </AppSection>

  <!-- specific feature demos -->
  <AppSection>
    <AppHeading>Highlights</AppHeading>

    <p>Some cool things you can do on this website.</p>

    <div class="highlight">
      <video src="@/assets/demos/node-search.mp4" muted autoplay loop></video>
      <p>
        Quickly and easily browse nodes. Filter by category and taxon. See your
        recent and frequent searches.
      </p>
    </div>

    <div class="highlight">
      <video
        src="@/assets/demos/text-annotator.mp4"
        muted
        autoplay
        loop
      ></video>
      <p>
        Easily search our knowledge graph for multiple nodes from free text.
        Download the results or send them to the phenotype explorer tool for
        analysis.
      </p>
    </div>

    <div class="highlight">
      <video
        src="@/assets/demos/phenotype-explorer.mp4"
        muted
        autoplay
        loop
      ></video>
      <p>
        Compare a set of phenotypes to another set of phenotypes, or to all
        genes/diseases of a species. See a rich comparison of the overlap
        between the two sets.
      </p>
    </div>

    <div class="highlight">
      <video src="@/assets/demos/node-page.mp4" muted autoplay loop></video>
      <p>
        See rich details about each node. Traverse between nodes via
        associations between them, and view the evidence for those associations.
      </p>
    </div>
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

.highlight {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  width: 100%;
  margin: 20px 0;

  &:nth-child(even) {
    flex-direction: row-reverse;
  }

  @media (max-width: 800px) {
    flex-direction: column !important;
  }

  video {
    width: 100%;
    max-width: 360px;
    box-shadow: $shadow;
  }

  p {
    flex-grow: 1;
  }
}
</style>
