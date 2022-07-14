<!--
  node landing page
-->

<template>
  <!-- status -->
  <template v-if="isLoading || isError">
    <AppSection design="fill" class="section">
      <AppHeading
        class="heading"
        :icon="`category-${kebabCase(String($route.params.category))}`"
      >
        {{ $route.params.id }}
      </AppHeading>
    </AppSection>
    <AppSection>
      <AppStatus v-if="isLoading" code="loading"
        >Loading node information</AppStatus
      >
      <AppStatus v-if="isError" code="loading"
        >Error loading node information</AppStatus
      >
    </AppSection>
  </template>

  <!-- results -->
  <template v-else-if="node">
    <SectionTitle :node="node" />
    <SectionOverview :node="node" />
    <SectionDetails :node="node" />
    <SectionHierarchy :node="node" />
    <SectionAssociations :node="node" />

    <Teleport to="body">
      <TheTableOfContents />
    </Teleport>
  </template>
</template>

<script setup lang="ts">
import { watch, onMounted, nextTick } from "vue";
import { kebabCase } from "lodash";
import { lookupNode } from "@/api/node-lookup";
import AppStatus from "@/components/AppStatus.vue";
import TheTableOfContents from "@/components/TheTableOfContents.vue";
import SectionTitle from "./SectionTitle.vue";
import SectionOverview from "./SectionOverview.vue";
import SectionDetails from "./SectionDetails.vue";
import SectionHierarchy from "./SectionHierarchy.vue";
import SectionAssociations from "./SectionAssociations.vue";
import { scrollToHash } from "@/router";
import { useRoute } from "vue-router";
import { useQuery } from "@/util/composables";
import { appDescription } from "@/global/meta";

/** route info */
const route = useRoute();

/** get new node data */
const {
  query: getNode,
  data: node,
  isLoading,
  isError,
} = useQuery(
  async function getData() {
    /** get node from route params */
    const { id = "", category = "" } = route.params;

    /** get node information */
    return await lookupNode(id as string, category as string);
  },

  /** default value */
  null,

  /** on success, after data loaded */
  async (results) => {
    /** scroll to hash */
    await nextTick();
    scrollToHash();

    /**
     * set page description from node meta data. no need to include category and
     * id, as those should already be in the document title. see https://metatags.io/
     */
    const { name = "", description = "" } = results || {};
    appDescription.value = [name, description]
      .filter((part) => part)
      .join(" | ");
  }
);

/** when path (not hash or query) changed, get new node data */
watch(() => route.path, getNode);

/** get new node data on load */
onMounted(getNode);
</script>

<style lang="scss" scoped>
.heading {
  font-size: 1.2rem;
}
</style>
