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
      :url="false"
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
      @change="association = undefined"
    >
      <!-- summary view of associations -->
      <template #summary>
        <AssociationsSummary
          :node="node"
          :selected-category="category.id"
          :selected-association="association"
          @select="(value) => (association = value)"
        />
      </template>

      <!-- table view of associations -->
      <template #table>
        <AssociationsTable
          :node="node"
          :selected-category="category.id"
          :selected-association="association"
          @select="(value) => (association = value)"
        />
      </template>
    </AppTabs>
  </AppSection>

  <!-- evidence viewer of association -->
  <EvidenceViewer
    v-if="association"
    :node="node"
    :selected-association="association"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import AppSelectSingle from "@/components/AppSelectSingle.vue";
import { Option, Options } from "@/components/AppSelectSingle";
import AppTabs from "@/components/AppTabs.vue";
import { Node } from "@/api/node-lookup";
import { getAssociationLabel } from "@/api/categories";
import { Association } from "@/api/node-associations";
import AssociationsSummary from "./AssociationsSummary.vue";
import AssociationsTable from "./AssociationsTable.vue";
import EvidenceViewer from "./EvidenceViewer.vue";

/** route info */
const router = useRouter();
const route = useRoute();

interface Props {
  /** current node */
  node: Node;
}

const props = defineProps<Props>();

/** selected category of associations to show */
const category = ref<Option>();
/** selected association id */
const association = ref<Association>();

/** list of options for dropdown */
const categoryOptions = computed(
  (): Options =>
    props.node.associationCounts.map((association) => ({
      id: association.id,
      name: getAssociationLabel(association.id),
      icon: `category-${association.id}`,
      count: association.count,
    }))
);

/** deselect association when selected category changes */
watch(category, () => (association.value = undefined));

/** update url from selected category */
watch(category, (value, prev) =>
  /**
   * if category changed because it was set to default on page load, don't
   * create new history entry
   */
  (prev ? router.push : router.replace)({
    ...route,
    query: { associations: category.value?.id },
  })
);

/** update selected category from url */
function setCategoryFromUrl() {
  if (route.query.associations)
    category.value = categoryOptions.value.find(
      (option) => option.id === route.query.associations
    );
}
watch(() => route.query.associations, setCategoryFromUrl);
onMounted(setCategoryFromUrl);

/** auto-select first category */
watch(
  categoryOptions,
  () => {
    /** if no category selected, and no category about to be selected from url */
    if (!category.value && !route.query.associations)
      category.value = categoryOptions.value[0];
  },
  { immediate: true }
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
