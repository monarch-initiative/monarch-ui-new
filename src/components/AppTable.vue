<!--
  raw/controlled table component. takes pre-sorted/filtered/paginated/etc data
  from parent and simply displays it, with minimal logic

  references:
  https://adamlynch.com/flexible-data-tables-with-css-grid/
-->

<template>
  <div class="container">
    <!-- status -->
    <AppStatus v-if="status" :status="status" />

    <!-- table data -->
    <AppFlex direction="col" :data-disabled="!!status">
      <div
        ref="table"
        class="table"
        :data-left="arrivedState.left"
        :data-right="arrivedState.right"
        :data-expanded="expanded"
      >
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
                :data-divider="col.id === 'divider'"
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
                  :style="{ opacity: sort?.id === col.id ? 1 : 0.35 }"
                  @click.stop="emitSort(col)"
                />
                <AppSelectMulti
                  v-if="
                    availableFilters &&
                    activeFilters &&
                    availableFilters[col.id] &&
                    activeFilters[col.id] &&
                    availableFilters[col.id]?.length
                  "
                  v-slot="slotProps"
                  :name="'Filter by ' + col.heading"
                  :options="availableFilters[col.id]"
                  :model-value="activeFilters[col.id]"
                  @change="(value) => emitFilter(col.id, value)"
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
                :data-divider="col.id === 'divider'"
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

      <div class="controls">
        <!-- left side controls -->
        <div>
          <span v-if="showControls">Per page</span>
          <AppSelectSingle
            v-if="showControls"
            name="Rows per page"
            :options="[
              { id: '5' },
              { id: '10' },
              { id: '20' },
              { id: '50' },
              { id: '100' },
              { id: '500' },
            ]"
            :model-value="{ id: String(perPage || 5) }"
            @update:model-value="(value) => emitPerPage(value.id)"
          />
        </div>

        <!-- center controls -->
        <div>
          <AppButton
            v-if="showControls"
            v-tippy="'Go to first page'"
            :disabled="start <= 0"
            icon="angle-double-left"
            design="small"
            @click="clickFirst"
          />
          <AppButton
            v-if="showControls"
            v-tippy="'Go to previous page'"
            :disabled="start - perPage < 0"
            icon="angle-left"
            design="small"
            @click="clickPrev"
          />
          <span v-if="showControls"
            >{{ start + 1 }} &mdash; {{ end }} of {{ total }}</span
          >
          <AppButton
            v-if="showControls"
            v-tippy="'Go to next page'"
            :disabled="start + perPage > total"
            icon="angle-right"
            design="small"
            @click="clickNext"
          />
          <AppButton
            v-if="showControls"
            v-tippy="'Go to last page'"
            :disabled="start + perPage > total"
            icon="angle-double-right"
            design="small"
            @click="clickLast"
          />
        </div>

        <!-- right side controls -->
        <div>
          <AppInput
            v-if="showControls"
            v-tippy="'Search table data'"
            class="search"
            icon="search"
            :model-value="search"
            @change="emitSearch"
          />
          <AppButton
            v-if="showControls"
            v-tippy="'Download table data'"
            icon="download"
            design="small"
            @click="emitDownload"
          />
          <AppButton
            v-tippy="expanded ? 'Collapse table' : 'Expand table to full width'"
            :icon="expanded ? 'minimize' : 'maximize'"
            design="small"
            @click="expanded = !expanded"
          />
        </div>
      </div>
    </AppFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useEventListener, useScroll } from "@vueuse/core";
import { Col, Cols, Rows, Sort } from "./AppTable";
import AppInput from "./AppInput.vue";
import AppSelectMulti from "./AppSelectMulti.vue";
import AppSelectSingle from "./AppSelectSingle.vue";
import AppStatus from "./AppStatus.vue";
import { Options } from "./AppSelectMulti";
import { kebabify } from "@/util/object";
import { Filters } from "@/api/facets";
import { Status } from "./AppStatus";
import { closeToc } from "./TheTableOfContents";

interface Props {
  // info for each column of table
  cols: Cols;
  // list of table rows, i.e. the table data
  rows: Rows;
  // sort key and direction
  sort?: Sort;
  // items per page
  perPage?: number;
  // starting item index
  start: number;
  // total number of items
  total: number;
  // text being searched
  search?: string;
  // filters
  availableFilters?: Filters;
  activeFilters?: Filters;
  // status to show on top of table (e.g. loading)
  status?: Status | null;
  // whether to show certain controls
  // (temp solution, needed b/c this is a controlled component and cannot
  // paginate/search/etc on its own where needed yet)
  showControls?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  perPage: 5,
  sort: undefined,
  search: "",
  availableFilters: undefined,
  activeFilters: undefined,
  status: null,
  showControls: true,
});

interface Emits {
  // when sort changes
  (event: "sort", sort: Sort): void;
  // when filter changes
  (event: "filter", colId: Col["id"], value: Options): void;
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

// whether table is expanded to be full width
const expanded = ref(false);
// table reference
const table = ref<HTMLElement | null>(null);

// table scroll state
const { arrivedState } = useScroll(table, { offset: { left: 10, right: 10 } });

// force table scroll to update
function updateScroll() {
  table.value?.dispatchEvent(new Event("scroll"));
}
onMounted(updateScroll);
watch(expanded, updateScroll);
useEventListener("resize", updateScroll);

// close table of contents when expanding
watch(expanded, () => {
  if (expanded.value) closeToc();
});

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
      newSort = null;
    } else {
      newSort = { id: col.id, direction: "down" };
    }
  } else {
    newSort = { id: col.id, direction: "down" };
  }

  emit("sort", newSort);
}

// when user changes a filter
function emitFilter(colId: Col["id"], value: Options) {
  emit("filter", colId, value);
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

.table {
  width: 100%;
  overflow-x: auto;
  transition: mask-image $fast;

  &[data-left="false"][data-right="true"] {
    --webkit-mask-image: linear-gradient(to left, black 90%, transparent);
    mask-image: linear-gradient(to left, black 90%, transparent);
  }

  &[data-right="false"][data-left="true"] {
    --webkit-mask-image: linear-gradient(to right, black 90%, transparent);
    mask-image: linear-gradient(to right, black 90%, transparent);
  }

  &[data-left="false"][data-right="false"] {
    --webkit-mask-image: linear-gradient(
      to left,
      transparent,
      black 10%,
      black 90%,
      transparent
    );
    mask-image: linear-gradient(
      to left,
      transparent,
      black 10%,
      black 90%,
      transparent
    );
  }

  &[data-expanded="true"] {
    position: relative;
    left: 0;
    width: calc(100vw - 80px);
    transform: translateX(0);

    td,
    th {
      max-width: unset;
    }
  }
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
  max-width: 300px;

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

  &[data-divider="true"] {
    padding: 0;
    width: 2px;
    margin: 0 5px;
    background: $light-gray;
  }
}

// heading cells
th {
  padding-bottom: 10px;
  font-weight: 400;
  text-transform: capitalize;
}

th > span {
  font-weight: 600;
}

// body cells
td {
  border-bottom: solid 2px $light-gray;
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
    max-width: 150px;
  }
}

[data-disabled] {
  transition: opacity $fast;
}

[data-disabled="true"] {
  opacity: 0.2;
}
</style>
