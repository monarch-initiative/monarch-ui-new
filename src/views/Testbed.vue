<!--
  dev page for experimenting with design and behavior of components. also a 
  place for seeing all variations at once to check for coherence. not included
  in production build of site.
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
    <span>{{ table.cols.map(({ activeFilters }) => activeFilters) }}</span>
    <AppTable
      v-bind="table"
      @sort="(value) => (table.sort = value)"
      @filter="
        (colIndex, value) => (table.cols[colIndex].activeFilters = value)
      "
      @perPage="(value) => (table.perPage = value)"
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
      name="Fruit"
      :options="singleSelectOptions"
      v-model="singleSelectValue"
    />
  </AppSection>

  <!-- multi select component -->
  <AppSection>
    <AppHeading>Multi Select</AppHeading>
    <span>{{ multiSelectValue }}</span>
    <AppSelectMulti
      name="Category"
      :options="multiSelectOptions"
      v-model="multiSelectValue"
    />
    <AppSelectMulti
      name="Category"
      :options="multiSelectOptions"
      v-model="multiSelectValue"
      v-slot="props"
    >
      <AppButton icon="filter" v-bind="props" design="small" />
    </AppSelectMulti>
  </AppSection>

  <!-- tags select component -->
  <AppSection>
    <AppHeading>Tags Select</AppHeading>
    <span>{{ tagsSelectValue }}</span>
    <AppSelectTags
      name="Dessert"
      placeholder="Search for a dessert"
      :options="tagsSelectOptions"
      v-model="tagsSelectValue"
    />
  </AppSection>

  <!-- button component -->
  <AppSection>
    <AppHeading>Button</AppHeading>
    <AppFlex v-for="(row, index) of buttons" :key="index">
      <AppButton
        v-for="(props, index) of row"
        :key="index"
        to="/"
        @click="log"
        v-bind="props"
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

<script lang="ts">
import { defineComponent } from "vue";
import { omit, pick } from "lodash";
import AppInput from "@/components/AppInput.vue";
import AppRing from "@/components/AppRing.vue";
import AppSelectMulti from "@/components/AppSelectMulti.vue";
import AppSelectSingle from "@/components/AppSelectSingle.vue";
import AppSelectTags from "@/components/AppSelectTags.vue";
import AppStatus from "@/components/AppStatus.vue";
import AppTable from "@/components/AppTable.vue";
import AppTabs from "@/components/AppTabs.vue";
import { Cols, Rows } from "@/components/AppTable";
import { sleep } from "@/util/debug";

export default defineComponent({
  components: {
    AppInput,
    AppRing,
    AppSelectMulti,
    AppSelectSingle,
    AppSelectTags,
    AppStatus,
    AppTable,
    AppTabs,
  },
  data() {
    const buttons = [];
    for (const design of ["normal", "circle", "small"]) {
      for (const color of ["primary", "secondary"]) {
        const row = [];
        for (const [text, icon] of [
          ["Text", ""],
          ["Text", "download"],
          ["", "download"],
        ]) {
          row.push({ design, color, text, icon });
        }
        buttons.push(row);
      }
    }

    return {
      buttons,
      table: {
        cols: [
          {
            key: "name",
            heading: "Name",
            align: "left",
            sortable: true,
          },
          {
            key: "score",
            heading: "Score",
            availableFilters: [{ id: "numbers" }, { id: "nulls" }],
            activeFilters: [{ id: "numbers" }],
            sortable: true,
          },
          {
            key: "details",
            heading: "Details",
            align: "left",
            sortable: true,
          },
          {
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
        sort: { key: "score", direction: "up" },
        perPage: 10,
        start: 1,
        end: 11,
        total: 123,
        search: "",
      },
      singleSelectOptions: [
        { id: "apple" },
        { id: "banana" },
        { id: "cherry" },
        { id: "durian" },
        { id: "elderberry" },
        { id: "fig" },
        { id: "grape" },
        { id: "honeydew" },
      ],
      singleSelectValue: { id: "durian" },
      multiSelectOptions: [
        { id: "fruits", count: 0 },
        { id: "vegetables", count: 7 },
        { id: "colors", count: 42 },
        { id: "animals", count: 999 },
        { id: "cars" },
        { id: "schools" },
        { id: "appliances" },
      ],
      multiSelectValue: [{ id: "vegetables" }],
      tagsSelectOptions: async (search = "") => {
        await sleep(200);
        return [
          { id: "ice cream", icon: "home" },
          { id: "candy", icon: "database", count: "8 phenotypes" },
          { id: "gummies", icon: "download", count: "4 phenotypes" },
          { id: "brownies", icon: "puzzle-piece", count: "1 phenotype" },
          { id: "cookies", icon: "comment" },
        ].filter(({ id }) => id.includes(search));
      },
      tagsSelectValue: [
        { id: "candy", icon: "database", count: "8 phenotypes" },
      ],
    };
  },
  methods: {
    log: console.info,
    omit,
    pick,
  },
});
</script>
