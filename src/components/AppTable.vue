<!--
  raw/controlled table component. takes pre-sorted/filtered/paginated/etc data
  from parent and simply displays it, with minimal logic

  references:
  https://adamlynch.com/flexible-data-tables-with-css-grid/
-->

<template>
  <AppFlex direction="col">
    <div class="table" :data-disabled="disabled">
      <table
        :aria-colcount="cols.length"
        :aria-rowcount="rows.length"
        :style="{ gridTemplateColumns: widths }"
      >
        <!-- head -->
        <thead>
          <tr>
            <th
              v-for="(col, colIndex) in cols"
              :key="colIndex"
              :aria-sort="ariaSort"
              :data-align="col.align || 'left'"
            >
              <span>
                {{ col.heading }}
              </span>
              <AppButton
                v-if="col.sortable"
                v-tippy="'Sort by ' + col.heading"
                :icon="
                  'arrow-' + (sort?.id === col.id ? sort?.direction : 'down')
                "
                design="small"
                :color="sort?.id === col.id ? 'primary' : 'secondary'"
                @click.stop="emitSort(col)"
              />
              <AppSelectMulti
                v-if="
                  col.availableFilters &&
                  col.activeFilters &&
                  col.availableFilters?.length
                "
                v-slot="slotProps"
                :name="'Filter by ' + col.heading"
                :options="col.availableFilters"
                :model-value="col.activeFilters"
                @update:model-value="(value) => emitFilter(colIndex, value)"
              >
                <AppButton
                  v-tippy="'Filter by ' + col.heading"
                  icon="filter"
                  design="small"
                  v-bind="kebabify(slotProps)"
                />
              </AppSelectMulti>
            </th>
          </tr>
        </thead>

        <!-- body -->
        <tbody>
          <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
            <td
              v-for="(col, colIndex) in cols"
              :key="colIndex"
              :aria-rowindex="rowIndex + 1"
              :aria-colindex="colIndex + 1"
              :data-align="col.align || 'left'"
            >
              <!-- if slot w/ name == col id, use to custom format/template cell -->
              <slot
                v-if="$slots[col.id]"
                :name="col.id"
                :row="row"
                :col="col"
                :cell="col.key ? row[col.key] : {}"
              />
              <!-- otherwise, just display raw cell value -->
              <template v-else-if="col.key">
                {{ row[col.key] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="controls" :data-disabled="disabled">
      <div>
        <span>Per page</span>
        <AppSelectSingle
          name="Rows per page"
          :options="[
            { id: '5' },
            { id: '10' },
            { id: '20' },
            { id: '50' },
            { id: '100' },
          ]"
          :model-value="{ id: String(perPage || 5) }"
          @update:model-value="(value) => emitPerPage(value.id)"
        />
      </div>
      <div>
        <AppButton
          v-tippy="'Go to first page'"
          :disabled="start <= 0"
          icon="angle-double-left"
          design="small"
          @click="clickFirst"
        />
        <AppButton
          v-tippy="'Go to previous page'"
          :disabled="start - perPage < 0"
          icon="angle-left"
          design="small"
          @click="clickPrev"
        />
        <span>{{ start + 1 }} &mdash; {{ end }} of {{ total }}</span>
        <AppButton
          v-tippy="'Go to next page'"
          :disabled="start + perPage > total"
          icon="angle-right"
          design="small"
          @click="clickNext"
        />
        <AppButton
          v-tippy="'Go to last page'"
          :disabled="start + perPage > total"
          icon="angle-double-right"
          design="small"
          @click="clickLast"
        />
      </div>
      <div>
        <AppInput
          v-tippy="'Search table data'"
          class="search"
          icon="search"
          :model-value="search"
          @change="emitSearch"
        />
        <AppButton
          v-tippy="'Download table data'"
          icon="download"
          design="small"
          @click="emitDownload"
        />
      </div>
    </div>
  </AppFlex>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Col, Cols, Rows, Sort } from "./AppTable";
import AppInput from "./AppInput.vue";
import AppSelectMulti from "./AppSelectMulti.vue";
import AppSelectSingle from "./AppSelectSingle.vue";
import { Options } from "./AppSelectMulti";
import { kebabify } from "@/util/object";

interface Props {
  // info for each column of table
  cols: Cols;
  // list of table rows, i.e. the table data
  rows: Rows;
  // sort key and direction
  sort?: Sort | null;
  // items per page
  perPage: number;
  // starting item index
  start: number;
  // total number of items
  total: number;
  // text being searched
  search?: string;
  // whether table is disabled (e.g. loading)
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  sort: null,
  search: "",
  disabled: false,
});

interface Emits {
  // when sort changes
  (event: "sort", sort: Sort): void;
  // when filter changes
  (event: "filter", colIndex: number, value: Options): void;
  // when per page changes
  (event: "perPage", value: number): void;
  // when start row changes
  (event: "start", row: number): void;
  // when search changes
  (event: "search", value: string): void;
  // when user requests download
  (event: "download"): void;
}

const emit = defineEmits<Emits>();

// when user clicks to first page
function clickFirst() {
  emit("start", 0);
}

// when user clicks to previous page
function clickPrev() {
  emit("start", props.start - props.perPage);
}

// when user clicks to next page
function clickNext() {
  emit("start", props.start + props.perPage);
}

// when user clicks to last page
function clickLast() {
  emit("start", Math.floor(props.total / props.perPage) * props.perPage);
}

// when user clicks a sort button
function emitSort(col: Col) {
  let newSort: Sort;

  // toggle sort direction
  if (props.sort?.id === col.id) {
    if (props.sort?.direction === "down")
      newSort = { id: col.id, direction: "up" };
    else if (props.sort?.direction === "up") {
      newSort = {};
    } else {
      newSort = { id: col.id, direction: "down" };
    }
  } else {
    newSort = { id: col.id, direction: "down" };
  }

  emit("sort", newSort);
}

// when user changes a filter
function emitFilter(colIndex: number, value: Options) {
  emit("filter", colIndex, value);
}

// when user changes rows per page
function emitPerPage(value: string) {
  emit("perPage", Number(value));
  emit("start", 0);
}

// when user types in search
function emitSearch(value: string) {
  emit("search", value);
  emit("start", 0);
}

// when user clicks download
function emitDownload() {
  emit("download");
}

// ending item index
const end = computed((): number => props.start + props.rows.length);

// grid column template widths
const widths = computed((): string =>
  props.cols.map((col) => col.width || "auto").join(" ")
);

// aria sort direction attribute
const ariaSort = computed(() => {
  if (props.sort?.direction === "up") return "ascending";
  if (props.sort?.direction === "down") return "descending";
  return "none";
});
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  overflow-x: auto;
}

table {
  display: grid;
  border-collapse: collapse;
}

// ignore top level semantic elements in grid layout
thead,
tbody,
tr {
  display: contents;
}

// all cells
th,
td {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;

  &[data-align="left"] {
    justify-content: flex-start;
    text-align: left;
  }

  &[data-align="center"] {
    justify-content: center;
    text-align: center;
  }

  &[data-align="right"] {
    justify-content: flex-end;
    text-align: right;

    button {
      order: -1;
    }
  }
}

// heading cells
th {
  margin-bottom: 10px;
  font-weight: 400;
}

th > span {
  font-weight: 600;
}

// body cells
td {
  border-bottom: solid 1px $light-gray;
}

.controls {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  width: 100%;

  & > * {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  @media (max-width: 600px) {
    flex-direction: column;
  }

  .search {
    --height: 30px;
  }
}

[data-disabled] {
  transition: opacity $fast;
}

[data-disabled="true"] {
  opacity: 0.2;
}
</style>
