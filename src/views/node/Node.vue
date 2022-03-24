<template>
  <!-- status -->
  <template v-if="status">
    <AppSection>
      <AppHeading>Node</AppHeading>
      <AppStatus :status="status" />
    </AppSection>
  </template>

  <!-- results -->
  <template v-else-if="Object.keys(node).length">
    <Title :node="node" />
    <Overview :node="node" />
    <Details :node="node" />
    <Hierarchy :node="node" />
    <Visualization :node="node" />
    <Associations :node="node" />
    <Breadcrumbs :node="node" />

    <Teleport to="body">
      <TheTableOfContents />
    </Teleport>
  </template>
</template>

<script lang="ts">
import { defineComponent, nextTick } from "vue";
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

export default defineComponent({
  components: {
    AppStatus,
    Title,
    Overview,
    Details,
    Hierarchy,
    Visualization,
    Associations,
    Breadcrumbs,
    TheTableOfContents,
  },
  data() {
    return {
      // info/metadata about node
      node: {} as Result,
      // status of query
      status: null as Status | null,
    };
  },
  async mounted() {
    try {
      // loading...
      this.status = { code: "loading", text: "Loading results" };

      // get results
      this.node = await lookupNode(
        this.$route.params.id as string,
        this.$route.params.category as string
      );

      // clear status
      this.status = null;

      // scroll to hash once data loaded
      await nextTick();
      scrollToHash();
    } catch (error) {
      // error...
      this.status = error as ApiError;
    }
  },
});
</script>
