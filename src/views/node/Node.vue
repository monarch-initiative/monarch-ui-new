<!--
  node landing page
-->

<template>
  <!-- status -->
  <template v-if="status">
    <AppSection>
      <AppHeading>Node</AppHeading>
      <AppStatus :status="status" />
    </AppSection>
  </template>

  <!-- results -->
  <template v-else-if="node">
    <Title :node="node" />
    <Overview :node="node" />
    <Details :node="node" />
    <Hierarchy :node="node" />
    <Associations :node="node" />
    <Visualization :node="node" />
    <Breadcrumbs :node="node" />

    <Teleport to="body">
      <TheTableOfContents />
    </Teleport>
  </template>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import { lookupNode, Result } from "@/api/node-lookup";
import { Status } from "@/components/AppStatus";
import { ApiError } from "@/api";
import AppStatus from "@/components/AppStatus.vue";
import TheTableOfContents from "@/components/TheTableOfContents.vue";
import Title from "./Title.vue";
import Overview from "./Overview.vue";
import Details from "./Details.vue";
import Hierarchy from "./Hierarchy.vue";
import Visualization from "./Visualization.vue";
import Associations from "./Associations.vue";
import Breadcrumbs from "./Breadcrumbs.vue";
import { scrollToHash } from "@/router";
import { useRoute } from "vue-router";

// route info
const route = useRoute();

// info/metadata about node
const node = ref<Result | null>(null);
// status of query
const status = ref<Status | null>(null);

// get new node data
async function getData() {
  // get node from route params
  const { id = "", category = "" } = route.params;

  try {
    // loading...
    status.value = { code: "loading", text: `Loading node info for ${id}` };
    node.value = null;

    // get node information
    node.value = await lookupNode(id as string, category as string);

    // clear status
    status.value = null;

    // scroll to hash once data loaded
    await nextTick();
    scrollToHash();
  } catch (error) {
    // error...
    status.value = error as ApiError;
    node.value = null;
  }
}

// when path (not hash or query) changed, get new node data
watch(() => route.path, getData);

// get new node data on load
onMounted(getData);
</script>
