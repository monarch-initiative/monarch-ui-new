<template>
  <AppSection>
    <AppHeading icon="arrows-left-right">Associations</AppHeading>

    <!-- select -->
    <AppFlex gap="small">
      <span
        >Associations between <strong>{{ node.name }}</strong> and</span
      >
      <AppSelectSingle
        name="category"
        :options="categoryOptions"
        v-model="category"
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

<script lang="ts">
import { defineComponent, PropType } from "vue";
import AppSelectSingle from "@/components/AppSelectSingle.vue";
import { Option, Options } from "@/components/AppSelectSingle";
import AppTabs from "@/components/AppTabs.vue";
import { Result as NodeResult } from "@/api/node-lookup";
import { getAssociationName } from "@/api/categories";
import AssociationsSummary from "./AssociationsSummary.vue";
import AssociationsTable from "./AssociationsTable.vue";

// associations node page section
export default defineComponent({
  components: {
    AppSelectSingle,
    AppTabs,
    AssociationsSummary,
    AssociationsTable,
  },
  props: {
    // current node
    node: {
      type: Object as PropType<NodeResult>,
      required: true,
    },
  },
  data() {
    return {
      // selected category of associations to show
      category: {} as Option,
    };
  },
  computed: {
    // list of options for dropdown
    categoryOptions(): Options {
      return this.node.associationCounts.map((association) => ({
        id: association.id,
        name: getAssociationName(association.id),
        icon: `category-${association.id}`,
        count: association.count,
      }));
    },
  },
});
</script>

<style lang="scss" scoped>
.arrow {
  color: $gray;
}
.evidence-button {
  min-height: unset !important;
}
</style>
