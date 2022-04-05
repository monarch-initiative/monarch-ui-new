<!--
  node page associations section
-->

<template>
  <AppSection>
    <AppHeading icon="arrows-left-right">Associations</AppHeading>

    <!-- select -->
    <AppFlex gap="small">
      <span
        >Associations between <strong>{{ node.name }}</strong> and</span
      >
      <AppSelectSingle
        v-model="category"
        name="category"
        :options="categoryOptions"
      />
    </AppFlex>

    <AppTabs
      v-if="category"
      name="Association viewing mode"
      :tabs="[
        {
          id: 'summary',
          text: 'Summary',
          icon: 'clipboard',
          tooltip: 'Top few associations and high level details',
        },
        {
          id: 'table',
          text: 'Table',
          icon: 'table',
          tooltip: 'All association data, in tabular form',
        },
      ]"
    >
      <!-- summary view of associations -->
      <template #summary>
        <AssociationsSummary :node="node" :category="category" />
      </template>

      <!-- table view of associations -->
      <template #table>
        <AssociationsTable :node="node" :category="category" />
      </template>
    </AppTabs>
  </AppSection>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import AppSelectSingle from "@/components/AppSelectSingle.vue";
import { Option, Options } from "@/components/AppSelectSingle";
import AppTabs from "@/components/AppTabs.vue";
import { Result as NodeResult } from "@/api/node-lookup";
import { getAssociationName } from "@/api/categories";
import AssociationsSummary from "./AssociationsSummary.vue";
import AssociationsTable from "./AssociationsTable.vue";

interface Props {
  // current node
  node: NodeResult;
}

const props = defineProps<Props>();

// selected category of associations to show
const category = ref<Option>();

// list of options for dropdown
const categoryOptions = computed(
  (): Options =>
    props.node.associationCounts.map((association) => ({
      id: association.id,
      name: getAssociationName(association.id),
      icon: `category-${association.id}`,
      count: association.count,
    }))
);
</script>

<style lang="scss" scoped>
.arrow {
  color: $gray;
}
.evidence-button {
  min-height: unset !important;
}
</style>
