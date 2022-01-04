<template>
  <div class="table">
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
            :data-align="col.align"
            @click="$emit('sort', col)"
          >
            <span>
              {{ col.heading }}
            </span>
            <AppButton
              v-if="col.sortable"
              :icon="
                'arrow-' + (sort?.key === col.key ? sort?.direction : 'down')
              "
              design="small"
              :active="sort?.key === col.key"
              @click.stop="$emit('sort', col)"
              v-tooltip="'Sort by ' + col.heading"
            />
            <AppButton
              v-if="col.filterable"
              icon="filter"
              design="small"
              :active="(filters || []).some((filter) => filter.key === col.key)"
              v-tooltip="'Filter by ' + col.heading"
              @click.stop
            />
          </th>
        </tr>
      </thead>

      <!-- body -->
      <tbody>
        <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
          <td
            v-for="(col, colIndex) in cols"
            :key="colIndex"
            :aria-rowindex="rowIndex"
            :data-align="col.align"
          >
            <!-- if slot w/ name == col key, use to custom format/template cell -->
            <slot
              v-if="$slots[col.key]"
              :name="col.key"
              :row="row"
              :col="col"
              :cell="row[col.key]"
            />
            <!-- otherwise, just display raw cell value -->
            <template v-else>
              {{ row[col.key] }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="controls">
    <div>
      <span> Per Page </span>
      <span>
        {{ perPage }}
      </span>
    </div>
    <div>
      <AppButton
        icon="angle-double-left"
        design="small"
        @click="$emit('start')"
      />
      <AppButton icon="angle-left" design="small" @click="$emit('prev')" />
      <span>1 &mdash; 10 of 100</span>
      <AppButton icon="angle-right" design="small" @click="$emit('next')" />
      <AppButton
        icon="angle-double-right"
        design="small"
        @click="$emit('end')"
      />
    </div>
    <div>
      <AppButton icon="search" design="small" @click="$emit('search')" />
      <AppButton icon="download" design="small" @click="$emit('download')" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

// reference:
// https://adamlynch.com/flexible-data-tables-with-css-grid/

export interface Col {
  // what item in row object to access as raw cell value
  key: string;
  // header display text
  heading?: string;
  // how to align column contents (both header and body) horizontally
  align?: "left" | "center" | "end";
  // width to apply to heading cell, in absolute (px), remaining width (%), or "auto"
  width: string;
  // whether to allow sorting of column
  sortable?: boolean;
  // whether to allow filtering of column
  filterable?: boolean;
}

// object with arbitrary keys
export type Row = Record<string, unknown>;

// arrays of rows and cols
export type Cols = Array<Col>;
export type Rows = Array<Row>;

// sort param
interface Sort {
  key?: string;
  direction?: "up" | "down";
}

// filter param
interface Filter {
  key?: string;
  value: unknown;
}

// array of filters
export type Filters = Array<Filter>;

// raw/controlled table component
// takes pre-sorted/filtered/paginated/etc data from parent and displays it
export default defineComponent({
  props: {
    // info for each column of table
    cols: {
      required: true,
      type: Array as PropType<Cols>,
    },
    // list of table rows, i.e. the table data
    rows: {
      required: true,
      type: Array as PropType<Rows>,
    },
    // initial sort key and direction
    sort: {} as PropType<Sort>,
    // initial filter key and value
    filters: {} as PropType<Filters>,
    // items per page
    perPage: Number,
    // starting item index
    start: Number,
    // ending item index
    end: Number,
    // total number of items
    total: Number,
    // string being searched
    search: String,
  },

  emits: [
    "sort",
    "filter",
    "perPage",
    "start",
    "prev",
    "next",
    "end",
    "search",
    "download",
  ],

  computed: {
    // grid column template widths
    widths(): string {
      return this.cols
        .map((col) => col.width?.replace("%", "fr") || "auto")
        .join(" ");
    },

    // aria sort direction attribute
    ariaSort() {
      if (this.sort?.direction === "up") return "ascending";
      if (this.sort?.direction === "down") return "descending";
      return "none";
    },
  },
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
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;

  &[data-align="left"] {
    justify-content: flex-start;
  }

  &[data-align="right"] {
    justify-content: flex-end;

    button {
      order: -1;
    }
  }
}

// heading cells
th {
  margin-bottom: 10px;
  // border-bottom: solid 1px $light-gray;
  font-weight: 600;
  cursor: pointer;
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
}
</style>
