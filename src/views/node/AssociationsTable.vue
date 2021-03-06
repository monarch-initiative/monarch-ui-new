<!--
  node page associations section, table mode. all associations.
-->

<template>
  <!-- status -->
  <AppStatus v-if="isLoading" code="loading"
    >Loading tabulated association data</AppStatus
  >
  <AppStatus v-else-if="isError" code="error"
    >Error loading tabulated association data</AppStatus
  >

  <!-- results -->
  <AppTable
    v-else
    v-model:per-page="perPage"
    v-model:start="start"
    v-model:search="search"
    :cols="cols"
    :rows="associations.associations"
    :total="associations.count"
    :sort="sort"
    :available-filters="availableFilters"
    :active-filters="activeFilters"
    @download="download"
    @sort="(value) => (sort = value)"
    @filter="onFilterChange"
  >
    <!-- "subject" (current node) -->
    <template #subject="{ cell }">
      <span class="truncate">
        {{ cell.name }}
      </span>
    </template>

    <!-- type of association/relation -->
    <template #relation="{ cell }">
      <AppIcon
        class="arrow"
        :icon="cell.inverse ? 'arrow-left-long' : 'arrow-right-long'"
      />
      <AppLink class="truncate" :to="cell.iri" :no-icon="true">{{
        startCase(cell.name)
      }}</AppLink>
      <AppIcon
        class="arrow"
        :icon="cell.inverse ? 'arrow-left-long' : 'arrow-right-long'"
      />
    </template>

    <!-- "object" (what current node has an association with) -->
    <template #object="{ cell }">
      <AppLink class="truncate" :to="`/${cell.category}/${cell.id}`">{{
        cell.name
      }}</AppLink>
    </template>

    <!-- button to show evidence -->
    <template #evidence="{ cell, row }">
      <AppButton
        v-tippy="
          row.id === selectedAssociation?.id
            ? 'Viewing supporting evidence. Click again to hide.'
            : 'View supporting evidence for this association'
        "
        class="evidence"
        :text="String(cell)"
        :aria-pressed="row.id === selectedAssociation?.id"
        :icon="row.id === selectedAssociation?.id ? 'check' : 'flask'"
        :color="row.id === selectedAssociation?.id ? 'primary' : 'secondary'"
        @click="
          emit('select', row.id === selectedAssociation?.id ? undefined : row)
        "
      />
    </template>

    <!-- extra columns -->

    <!-- taxon specific -->
    <template #taxon="{ cell }">
      <span class="truncate">
        {{ cell?.name }}
      </span>
    </template>

    <!-- phenotype specific -->
    <template #frequency="{ cell }">
      <AppLink v-if="cell" class="truncate" :to="cell?.link" :no-icon="true">
        {{ cell?.name }}
      </AppLink>
    </template>

    <template #onset="{ cell }">
      <AppLink v-if="cell" class="truncate" :to="cell?.link" :no-icon="true">
        {{ cell?.name }}
      </AppLink>
    </template>

    <!-- publication specific -->
    <!-- no template needed because info just plain text -->
  </AppTable>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { startCase } from "lodash";
import AppTable from "@/components/AppTable.vue";
import AppStatus from "@/components/AppStatus.vue";
import { Col, Cols, Sort } from "@/components/AppTable";
import { Node } from "@/api/node-lookup";
import { getTabulatedAssociations, Association } from "@/api/node-associations";
import { downloadJson } from "@/util/download";
import { snackbar } from "@/components/TheSnackbar";
import { Filters, filtersToQuery } from "@/api/facets";
import { Options } from "@/components/AppSelectMulti";
import { useQuery } from "@/util/composables";

interface Props {
  /** current node */
  node: Node;
  /** selected association category */
  selectedCategory: string;
  /** selected association id */
  selectedAssociation?: Association;
}

const props = defineProps<Props>();

interface Emits {
  /** change selected association */
  (event: "select", value?: Association): void;
}

const emit = defineEmits<Emits>();

/** table state */
const sort = ref<Sort>();
const perPage = ref(5);
const start = ref(0);
const search = ref("");
const availableFilters = ref<Filters>({});
const activeFilters = ref<Filters>({});

/** table columns */
const cols = computed((): Cols => {
  /** standard columns, always present */
  const baseCols: Cols = [
    {
      id: "subject",
      key: "subject",
      heading: props.node.category,
      width: "1fr",
      sortable: true,
    },
    {
      id: "relation",
      key: "relation",
      heading: "Association",
      width: "1fr",
      sortable: true,
    },
    {
      id: "object",
      key: "object",
      heading: props.selectedCategory,
      width: "1fr",
      sortable: true,
    },
    {
      id: "evidence",
      key: "supportCount",
      heading: "Evidence",
      width: "min-content",
      align: "center",
    },
  ];

  /** extra, supplemental columns for certain association types */
  const extraCols: Cols = [];

  /** taxon column. exists for many categories, so just add if any row has taxon. */
  if (associations.value.associations.some((association) => association.taxon))
    extraCols.push({
      id: "taxon",
      key: "taxon",
      heading: "Taxon",
      width: "max-content",
    });

  /** phenotype specific columns */
  if (props.selectedCategory === "phenotype") {
    extraCols.push(
      {
        id: "frequency",
        key: "frequency",
        heading: "Frequency",
        sortable: true,
      },
      {
        id: "onset",
        key: "onset",
        heading: "Onset",
        sortable: true,
      }
    );
  }

  /** publication specific columns */
  if (props.selectedCategory === "publication")
    extraCols.push(
      {
        id: "author",
        key: "author",
        heading: "Author",
        width: "max-content",
      },
      {
        id: "year",
        key: "year",
        heading: "Year",
        align: "center",
        width: "max-content",
      },
      {
        id: "publisher",
        key: "publisher",
        heading: "Publisher",
        width: "max-content",
      }
    );

  /** filter out extra columns with nothing in them (all rows for that col falsey) */
  /*
  extraCols = extraCols.filter((col) =>
    associations.value.some((association) => association[col.key || ""])
  );
  */

  /** put divider to separate base cols from extra cols */
  if (extraCols[0]) extraCols.unshift({ id: "divider" });

  return [...baseCols, ...extraCols];
});

/** when user changes active filters */
function onFilterChange(colId: Col["id"], value: Options) {
  if (activeFilters.value && activeFilters.value[colId]) {
    activeFilters.value[colId] = value;
    getAssociations(false);
  }
}

/** get table association data */
const {
  query: getAssociations,
  data: associations,
  isLoading,
  isError,
} = useQuery(
  async function (
    /**
     * whether to perform "fresh" search, without filters/pagination/etc. true
     * when search text changes, false when filters/pagination/etc change.
     */
    fresh: boolean
  ) {
    /** catch case where no association categories available */
    if (!props.node.associationCounts.length)
      throw new Error("No association info available");

    /** get association data */
    const response = await getTabulatedAssociations(
      props.node.id,
      props.node.category,
      props.selectedCategory,
      perPage.value,
      start.value,
      search.value,
      sort.value,
      fresh ? undefined : filtersToQuery(availableFilters.value),
      fresh ? undefined : filtersToQuery(activeFilters.value)
    );

    return response;
  },

  /** default value */
  { count: 0, associations: [], facets: {} },

  /** on success */
  (response, [fresh]) => {
    /** update filters from facets returned from api, if a "fresh" search */
    if (fresh) {
      availableFilters.value = { ...response.facets };
      activeFilters.value = { ...response.facets };
    }
  }
);

/** download table data */
async function download() {
  /** max rows to try to query */
  const max = 100000;

  /** warn user */
  snackbar(
    `Downloading data for ${Math.min(
      associations.value.count,
      max
    )} table entries.` +
      (associations.value.count >= 100 ? " This may take a minute." : "")
  );

  /** attempt to request all rows */
  const response = await getTabulatedAssociations(
    props.node.id,
    props.node.category,
    props.selectedCategory,
    max,
    0
  );
  downloadJson(response);
}

/** get associations when category or table state changes */
watch(
  () => props.selectedCategory,
  () => getAssociations(true)
);
watch([() => props.selectedCategory, perPage, start, search, sort], () =>
  getAssociations(false)
);

/** get associations on load */
onMounted(() => getAssociations(true));
</script>

<style lang="scss" scoped>
.arrow {
  color: $gray;
}

.evidence {
  width: 100%;
  min-height: unset !important;
}
</style>
