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
        <AssociationsSummary :node="node" :category="category.id" />
      </template>

      <!-- table view of associations -->
      <template #table>
        <AssociationsTable :node="node" :category="category.id" />
      </template>
    </AppTabs>
  </AppSection>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import AppSelectSingle from "@/components/AppSelectSingle.vue";
import { Option, Options } from "@/components/AppSelectSingle";
import AppTabs from "@/components/AppTabs.vue";
import { Result as NodeResult } from "@/api/node-lookup";
import { getAssociationName } from "@/api/categories";
import AssociationsSummary from "./AssociationsSummary.vue";
import AssociationsTable from "./AssociationsTable.vue";

// route info
const router = useRouter();
const route = useRoute();

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

// update url from selected category
watch(category, (value, prev) =>
  // if category changed because it was set to default on page load, don't
  // create new history entry
  (prev ? router.push : router.replace)({
    ...route,
    query: { associations: category.value?.id },
  })
);

// update selected category from url
function setCategoryFromUrl() {
  if (route.query.associations)
    category.value = categoryOptions.value.find(
      (option) => option.id === route.query.associations
    );
}
watch(() => route.query.associations, setCategoryFromUrl);
onMounted(setCategoryFromUrl);
</script>

<style lang="scss" scoped>
.arrow {
  color: $gray;
}
.evidence-button {
  min-height: unset !important;
}
</style>
