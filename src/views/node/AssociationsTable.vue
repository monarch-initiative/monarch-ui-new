<!--
  node page associations section, table mode. all associations.
-->

<template>
  <div class="container">
    <!-- status -->
    <AppStatus v-if="status" :status="status" />

    <!-- results -->
    <AppTable
      :cols="cols"
      :rows="associations"
      :perPage="perPage"
      :start="start"
      :total="count"
      :search="search"
      @perPage="(value) => (perPage = value)"
      @start="(value) => (start = value)"
      @search="(value) => (search = value)"
      @download="download"
      :disabled="!!status"
    >
      <!-- "object" (current node) -->
      <template #subject="{ cell }">
        {{ cell.name }}
      </template>

      <!-- type of association/relation -->
      <template #relation="{ cell }">
        <AppIcon
          class="arrow"
          :icon="cell.inverse ? 'arrow-left-long' : 'arrow-right-long'"
        />
        <AppLink class="truncate" :to="cell.iri" :noIcon="true">{{
          cell.name
        }}</AppLink>
        <AppIcon
          class="arrow"
          :icon="cell.inverse ? 'arrow-left-long' : 'arrow-right-long'"
        />
      </template>

      <!-- "subject" (what current node has an association with) -->
      <template #object="{ cell }">
        <AppLink class="truncate" :to="`/${cell.category}/${cell.id}`">{{
          cell.name
        }}</AppLink>
      </template>

      <!-- button to show evidence -->
      <template #evidence>
        <AppButton
          class="evidence-button"
          icon="eye"
          color="secondary"
          v-tippy="'View supporting evidence for this association'"
        />
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { startCase } from "lodash";
import { Option } from "@/components/AppSelectSingle";
import AppStatus from "@/components/AppStatus.vue";
import { Status } from "@/components/AppStatus";
import AppTable from "@/components/AppTable.vue";
import { Cols } from "@/components/AppTable";
import { Result as NodeResult } from "@/api/node-lookup";
import {
  getTabulatedAssociations,
  Result as AssociationsResult,
} from "@/api/node-associations";
import { ApiError } from "@/api";
import { downloadJson } from "@/util/download";
import { push } from "@/components/TheSnackbar";

interface Props {
  // current node
  node: NodeResult;
  // selected association category
  category: Option;
}

const props = defineProps<Props>();

// association data
const associations = ref<AssociationsResult["associations"]>([]);
// total number of associations
const count = ref(0);
// table state
const perPage = ref(5);
const start = ref(0);
const search = ref("");
// status of query
const status = ref<Status | null>(null);

// table columns
const cols = computed(
  (): Cols => [
    {
      id: "subject",
      key: "subject",
      heading: startCase(props.node.category),
    },
    {
      id: "relation",
      key: "relation",
      heading: "Association",
      width: "min-content",
    },
    {
      id: "object",
      key: "object",
      heading: startCase(props.category.id),
      width: "minmax(150px, 1fr)",
    },
    {
      id: "evidence",
      key: "evidence",
      heading: "Evidence",
      width: "min-content",
      align: "center",
    },
  ]
);

// get table association data
async function getAssociations() {
  try {
    // loading...
    status.value = { code: "loading", text: "Loading association data" };

    // catch case where no association categories available
    if (!props.node.associationCounts.length)
      throw new ApiError("No association info available", "warning");

    // get association data
    const response = await getTabulatedAssociations(
      props.node.id,
      props.node.category,
      props.category.id,
      perPage.value,
      start.value,
      search.value
    );
    count.value = response.count;
    associations.value = response.associations;

    // clear status
    status.value = null;
  } catch (error) {
    // error...
    status.value = error as ApiError;
    count.value = 0;
    associations.value = [];
  }
}

// download table data
async function download() {
  // max rows to try to query
  const max = 100000;

  // warn user
  push(
    `Downloading data for ${Math.min(count.value, max)} table entries.` +
      (count.value >= 100 ? " This may take a minute." : "")
  );

  // attempt to request all rows
  const response = await getTabulatedAssociations(
    props.node.id,
    props.node.category,
    props.category.id,
    max,
    0
  );
  downloadJson(response);
}

// get associations when category or table state changes
watch([() => props.category, perPage, start, search], getAssociations);

// get associations on load
onMounted(getAssociations);
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;

  .status {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
.arrow {
  color: $gray;
}
.evidence-button {
  min-height: unset !important;
}
</style>
