<!--
  dev page for experimenting with design and behavior of components. also a 
  place for seeing all variations at once to check for coherence.
-->

<template>
  <AppSection>
    <AppHeading>Testbed</AppHeading>
  </AppSection>

  <!-- category icons -->
  <AppSection>
    <AppHeading>Category Icons</AppHeading>
    <AppFlex>
      <AppIcon icon="category-anatomy" />
      <AppIcon icon="category-case" />
      <AppIcon icon="category-cell-line" />
      <AppIcon icon="category-disease" />
      <AppIcon icon="category-fallback" />
      <AppIcon icon="category-function" />
      <AppIcon icon="category-gene" />
      <AppIcon icon="category-genotype" />
      <AppIcon icon="category-homolog" />
      <AppIcon icon="category-interaction" />
      <AppIcon icon="category-model" />
      <AppIcon icon="category-ortholog-disease" />
      <AppIcon icon="category-ortholog-phenotype" />
      <AppIcon icon="category-pathway" />
      <AppIcon icon="category-phenotype" />
      <AppIcon icon="category-unknown" />
      <AppIcon icon="category-variant" />
    </AppFlex>
  </AppSection>

  <!-- ring component -->
  <AppSection>
    <AppHeading>Ring</AppHeading>
    <AppRing />
  </AppSection>

  <!-- table component -->
  <AppSection>
    <AppHeading>Table</AppHeading>
    <span>{{ omit(table, ["cols", "rows"]) }}</span>
    <AppTable
      v-bind="table"
      @start="(value) => (table.start = value)"
      @sort="(value) => (table.sort = value)"
      @filter="
        (colId, value) => ((table.activeFilters || {})[colId] = [...value])
      "
      @per-page="(value) => (table.perPage = value)"
      @search="(value) => (table.search = value)"
    >
      <template #arbitrary>Arbitrary slot content</template>
    </AppTable>
  </AppSection>

  <!-- input component -->
  <AppSection>
    <AppHeading>Input</AppHeading>
    <AppInput icon="search" placeholder="Single line input" />
    <AppInput :multi="true" icon="search" placeholder="Multi-line input" />
  </AppSection>

  <!-- single select component -->
  <AppSection>
    <AppHeading>Single Select</AppHeading>
    <span>{{ singleSelectValue }}</span>
    <AppSelectSingle
      v-model="singleSelectValue"
      name="Fruit"
      :options="singleSelectOptions"
    />
  </AppSection>

  <!-- multi select component -->
  <AppSection>
    <AppHeading>Multi Select</AppHeading>
    <span>{{ multiSelectValue }}</span>
    <AppSelectMulti
      v-model="multiSelectValue"
      name="Category"
      :options="multiSelectOptions"
    />
    <AppSelectMulti
      v-slot="props"
      v-model="multiSelectValue"
      name="Category"
      :options="multiSelectOptions"
    >
      <AppButton
        v-tippy="'Test button'"
        icon="filter"
        v-bind="props"
        design="small"
      />
    </AppSelectMulti>
  </AppSection>

  <!-- tags select component -->
  <AppSection>
    <AppHeading>Tags Select</AppHeading>
    <span>{{ tagsSelectValue }}</span>
    <AppSelectTags
      v-model="tagsSelectValue"
      name="Dessert"
      placeholder="Search for a dessert"
      :options="tagsSelectOptions"
    />
  </AppSection>

  <!-- button component -->
  <AppSection>
    <AppHeading>Button</AppHeading>
    <AppFlex v-for="(row, rowIndex) of buttons" :key="rowIndex">
      <AppButton
        v-for="(props, colIndex) of row"
        :key="colIndex"
        v-tippy="'Test button'"
        to="/"
        v-bind="props"
        @click="log"
      />
    </AppFlex>
  </AppSection>

  <!-- tabs component -->
  <AppSection>
    <AppHeading>Tabs</AppHeading>
    <AppTabs
      name="Tab group"
      :tabs="[
        { id: 'apple', text: 'Apple', icon: 'asterisk' },
        { id: 'banana', text: 'Banana', icon: 'cogs' },
        { id: 'cherry', text: 'Cherry', icon: 'home' },
        { id: 'durian', text: 'Durian', icon: 'puzzle-piece' },
        { id: 'elderberry', text: 'Elderberry', icon: 'tools' },
      ]"
      default="apple"
    >
      <template #apple>I'm a little apple</template>
      <template #banana>I'm a little banana</template>
      <template #cherry>I'm a little cherry</template>
      <template #durian>I'm a little durian</template>
      <template #elderberry>I'm a little elderberry</template>
    </AppTabs>
  </AppSection>

  <!-- status component -->
  <AppSection>
    <AppHeading>Status</AppHeading>
    <AppGallery>
      <AppStatus :status="{ code: 'loading', text: 'Loading some results' }" />
      <AppStatus :status="{ code: 'success', text: 'Action was a success' }" />
      <AppStatus :status="{ code: 'warning', text: 'Be careful' }" />
      <AppStatus :status="{ code: 'error', text: 'There was an error' }" />
      <AppStatus :status="{ code: 'paused', text: 'Action is paused' }" />
      <AppStatus :status="{ code: 'unknown', text: 'Unexpected result' }" />
      <AppStatus :status="{ code: 'success' }">
        <strong>Atribtrary content using slot</strong>
      </AppStatus>
    </AppGallery>
  </AppSection>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { omit } from "lodash";
import AppButton from "@/components/AppButton.vue";
import AppInput from "@/components/AppInput.vue";
import AppRing from "@/components/AppRing.vue";
import AppSelectMulti from "@/components/AppSelectMulti.vue";
import AppSelectSingle from "@/components/AppSelectSingle.vue";
import AppSelectTags from "@/components/AppSelectTags.vue";
import AppStatus from "@/components/AppStatus.vue";
import AppTable from "@/components/AppTable.vue";
import AppTabs from "@/components/AppTabs.vue";
import { Cols, Rows, Sort } from "@/components/AppTable";
import { sleep } from "@/util/debug";
import { Filters } from "@/api/facets";

type ButtonProps = InstanceType<typeof AppButton>["$props"];

/** enumerate permutations of button options */
const buttons = ref<Array<Array<ButtonProps>>>([]);
for (const design of ["normal", "circle", "small"]) {
  for (const color of ["primary", "secondary"]) {
    const row = [];
    for (const [text, icon] of [
      ["Text", ""],
      ["Text", "download"],
      ["", "download"],
    ]) {
      row.push({ design, color, text, icon } as ButtonProps);
    }
    buttons.value.push(row);
  }
}

/** table input props */
const table = ref({
  cols: [
    {
      id: "name",
      key: "name",
      heading: "Name",
      align: "left",
      sortable: true,
    },
    {
      id: "score",
      key: "score",
      heading: "Score",

      sortable: true,
    },
    {
      id: "details",
      key: "details",
      heading: "Details",
      align: "left",
      sortable: true,
    },
    {
      id: "arbitrary",
      key: "arbitrary",
      heading: "Arbitrary",
      align: "right",
    },
  ] as Cols,
  rows: [
    { name: "abc", score: 9, details: [1, 2] },
    { name: "def", score: -1, details: [2, 1, 3] },
    { name: "def", score: 2, details: [1] },
    { name: "abc", score: 4, details: [2, 1] },
    { name: "ghi", score: NaN, details: [1] },
  ] as Rows,
  sort: { id: "score", direction: "up" } as Sort,
  perPage: 10,
  start: 0,
  end: 11,
  total: 123,
  search: "",
  availableFilters: { score: [{ id: "numbers" }, { id: "nulls" }] } as Filters,
  activeFilters: { score: [{ id: "numbers" }] } as Filters,
});

/** single select */
const singleSelectOptions = ref([
  { id: "apple" },
  { id: "banana" },
  { id: "cherry" },
  { id: "durian" },
  { id: "elderberry" },
  { id: "fig" },
  { id: "grape" },
  { id: "honeydew" },
]);
const singleSelectValue = ref({ id: "durian" });

/** multi select */
const multiSelectOptions = ref([
  { id: "fruits", count: 0 },
  { id: "vegetables", count: 7 },
  { id: "colors", count: 42 },
  { id: "animals", count: 999 },
  { id: "cars" },
  { id: "schools" },
  { id: "appliances" },
]);
const multiSelectValue = ref([{ id: "vegetables" }]);

/** tags select */
const tagsSelectOptions = ref(async (search = "") => {
  await sleep(200);
  return [
    { id: "ice cream", icon: "home" },
    { id: "candy", icon: "database", count: "8 phenotypes" },
    { id: "gummies", icon: "download", count: "4 phenotypes" },
    { id: "brownies", icon: "puzzle-piece", count: "1 phenotype" },
    { id: "cookies", icon: "comment" },
  ].filter(({ id }) => id.includes(search));
});
const tagsSelectValue = ref([
  { id: "candy", icon: "database", count: "8 phenotypes" },
]);

/** util */
const log = console.info;
</script>
