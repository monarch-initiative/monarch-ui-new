<template>
  <!-- status -->
  <template v-if="status">
    <AppHeading>Node</AppHeading>
    <AppStatus :status="status" />
  </template>

  <!-- results -->
  <template v-else>
    <Title :node="node" />
    <Overview :node="node" />
    <Hierarchy :node="node" />
    <Associations :node="node" />
    <Visualization :node="node" />
    <Breadcrumbs :node="node" />

    <Teleport to="body">
      <TheTableOfContents />
    </Teleport>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { lookupNode, Result } from "@/api/node-lookup";
import { Status } from "@/components/AppStatus";
import { ApiError } from "@/api";
import AppStatus from "@/components/AppStatus.vue";
import TheTableOfContents from "@/components/TheTableOfContents.vue";
import Title from "./Title.vue";
import Overview from "./Overview.vue";
import Hierarchy from "./Hierarchy.vue";
import Associations from "./Associations.vue";
import Visualization from "./Visualization.vue";
import Breadcrumbs from "./Breadcrumbs.vue";

export default defineComponent({
  components: {
    AppStatus,
    Title,
    Overview,
    Hierarchy,
    Associations,
    Visualization,
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
    } catch (error) {
      // error...
      this.status = error as ApiError;
    }
  },
});
</script>
