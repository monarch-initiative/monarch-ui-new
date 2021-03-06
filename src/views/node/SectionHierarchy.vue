<!--
  node page hierarchy section. super/sub/equivalent classes of current node.
-->

<template>
  <AppSection>
    <AppHeading icon="sitemap">Hierarchy</AppHeading>

    <!-- status -->
    <AppStatus v-if="isLoading" code="loading"
      >Loading hierarchy data</AppStatus
    >
    <AppStatus v-else-if="isError" code="error"
      >Error loading hierarchy data</AppStatus
    >

    <AppDetails v-else>
      <!-- nodes that are "parents" of node -->
      <AppDetail
        title="Super-classes"
        icon="angle-up"
        :blank="!hierarchy.superClasses.length"
        :big="true"
        :v-tippy="`Nodes that are &quot;parents&quot; of this node`"
      >
        <AppFlex class="flex" h-align="left" gap="small">
          <AppLink
            v-for="(_class, index) in hierarchy.superClasses"
            :key="index"
            :to="'/' + _class.id"
            >{{ _class.name || _class.id }}</AppLink
          >
        </AppFlex>
      </AppDetail>

      <!-- nodes that are "siblings" of node -->
      <AppDetail
        title="Equivalent classes"
        icon="equals"
        :blank="!hierarchy.equivalentClasses.length"
        :big="true"
        :v-tippy="`Nodes that are &quot;siblings&quot; of this node`"
      >
        <AppFlex class="flex" h-align="left" gap="small">
          <AppLink
            v-for="(_class, index) in hierarchy.equivalentClasses"
            :key="index"
            :to="'/' + _class.id"
            >{{ _class.name || _class.id }}</AppLink
          >
        </AppFlex>
      </AppDetail>

      <!-- nodes that are "children" of node -->
      <AppDetail
        title="Sub-classes"
        icon="angle-down"
        :blank="!hierarchy.subClasses.length"
        :big="true"
        :v-tippy="`Nodes that are &quot;children&quot; of this node`"
      >
        <AppFlex class="flex" h-align="left" gap="small">
          <AppLink
            v-for="(_class, index) in hierarchy.subClasses"
            :key="index"
            :to="'/' + _class.id"
            >{{ _class.name || _class.id }}</AppLink
          >
        </AppFlex>
      </AppDetail>
    </AppDetails>
  </AppSection>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { Node } from "@/api/node-lookup";
import { getHierarchy } from "@/api/node-hierachy";
import AppDetails from "@/components/AppDetails.vue";
import AppDetail from "@/components/AppDetail.vue";
import AppStatus from "@/components/AppStatus.vue";
import { useQuery } from "@/util/composables";
import { onMounted, watch } from "vue";

const route = useRoute();

interface Props {
  /** current node */
  node: Node;
}

const props = defineProps<Props>();

/** get node hierarchy data */
const {
  query: getHier,
  data: hierarchy,
  isLoading,
  isError,
} = useQuery(
  async function () {
    return await getHierarchy(props.node.id, props.node.category);
  },

  /** default value */
  { superClasses: [], equivalentClasses: [], subClasses: [] }
);

/** when path (not hash or query) changed, get new node data */
watch(
  [() => route.path, () => props.node.id, () => props.node.category],
  getHier
);

/** get new node data on load */
onMounted(getHier);
</script>

<style lang="scss" scoped>
.flex {
  column-gap: 20px !important;
}
</style>
