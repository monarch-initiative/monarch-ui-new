<!--
  dev page for experimenting with design and behavior of components. also a 
  place for seeing all variations at once to check for coherence. not included
  in production build of site.
-->
<template>
  <AppSection>
    <AppHeading>Testbed</AppHeading>
  </AppSection>

  <!-- table component -->
  <AppSection>
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
    <AppInput icon="search" />
    <AppInput :multi="true" icon="search" />
  </AppSection>

  <!-- single select component -->
  <AppSection>
    <AppHeading>Single Select</AppHeading>

    <AppFlex direction="col">
      <span>{{ singleSelectValue }}</span>
      <AppSelectSingle
        name="Fruit"
        :options="singleSelectOptions"
        v-model="singleSelectValue"
      />
    </AppFlex>
  </AppSection>

  <!-- multi select component -->
  <AppSection>
    <AppHeading>Multi Select</AppHeading>

    <AppFlex direction="col">
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
    </AppFlex>
  </AppSection>

  <!-- button component -->
  <AppSection>
    <AppHeading>Button</AppHeading>

    <AppFlex v-for="(row, index) of buttons" :key="index">
      <AppButton
        v-for="(props, index) of row"
        :key="index"
        to="/"
        @click="alert"
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
import AppInput from "@/components/AppInput.vue";
import AppSelectMulti from "@/components/AppSelectMulti.vue";
import AppSelectSingle from "@/components/AppSelectSingle.vue";
import AppStatus from "@/components/AppStatus.vue";
import AppTable from "@/components/AppTable.vue";
import AppTabs from "@/components/AppTabs.vue";
import { Cols, Rows } from "@/components/AppTable";
import { omit, pick } from "lodash";

export default defineComponent({
  components: {
    AppInput,
    AppSelectMulti,
    AppSelectSingle,
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
            availableFilters: [{ value: "numbers" }, { value: "nulls" }],
            activeFilters: [{ value: "numbers" }],
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
        "apple",
        "banana",
        "cherry",
        "durian",
        "elderberry",
        "fig",
        "grape",
        "honeydew",
      ],
      singleSelectValue: "durian",
      multiSelectOptions: [
        { value: "fruits", count: 0 },
        { value: "vegetables", count: 7 },
        { value: "colors", count: 42 },
        { value: "animals", count: 999 },
        { value: "cars" },
        { value: "schools" },
        { value: "appliances" },
      ],
      multiSelectValue: [{ value: "vegetables" }],
    };
  },
  methods: {
    alert() {
      window.alert("alert");
    },
    omit,
    pick,
  },
});
</script>
