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
              :color="sort?.key === col.key ? 'primary' : 'secondary'"
              @click.stop="emitSort(col)"
              v-tooltip="'Sort by ' + col.heading"
            />
            <AppSelectMulti
              v-if="
                col.availableFilters &&
                col.activeFilters &&
                col.availableFilters?.length
              "
              :name="'Filter by ' + col.heading"
              :options="col.availableFilters"
              :modelValue="col.activeFilters"
              @update:modelValue="(value) => emitFilter(colIndex, value)"
              v-slot="props"
            >
              <AppButton
                v-tooltip="'Filter by ' + col.heading"
                icon="filter"
                design="small"
                v-bind="kebabify(props)"
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
      <span>Per page</span>
      <AppSelectSingle
        name="Rows per page"
        :options="['5', '10', '20', '50', '100']"
        :modelValue="String(perPage || 5)"
        @update:modelValue="(value) => emitPerPage(value)"
      />
    </div>
    <div>
      <AppButton
        icon="angle-double-left"
        design="small"
        @click="emitFirst"
        v-tooltip="'Go to first page'"
      />
      <AppButton
        icon="angle-left"
        design="small"
        @click="emitPrev"
        v-tooltip="'Go to previous page'"
      />
      <span
        >{{ start || "?" }} &mdash; {{ end || "?" }} of
        {{ total || "??" }}</span
      >
      <AppButton
        icon="angle-right"
        design="small"
        @click="emitNext"
        v-tooltip="'Go to next page'"
      />
      <AppButton
        icon="angle-double-right"
        design="small"
        @click="emitLast"
        v-tooltip="'Go to last page'"
      />
    </div>
    <div>
      <AppInput
        class="search"
        icon="search"
        :modelValue="search"
        @update:modelValue="(value) => emitSearch(value)"
      />
      <AppButton
        icon="download"
        design="small"
        @click="emitDownload"
        v-tooltip="'Download table data'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Col, Cols, Rows, Sort } from "./AppTable";
import AppInput from "./AppInput.vue";
import AppSelectMulti from "./AppSelectMulti.vue";
import AppSelectSingle from "./AppSelectSingle.vue";
import { Options } from "./AppSelectMulti";
import { kebabify } from "@/util/object";

// reference:
// https://adamlynch.com/flexible-data-tables-with-css-grid/

// raw/controlled table component. takes pre-sorted/filtered/paginated/etc data
// from parent and simply displays it, with minimal logic
export default defineComponent({
  components: {
    AppInput,
    AppSelectMulti,
    AppSelectSingle,
  },
  emits: [
    "sort",
    "filter",
    "perPage",
    "first",
    "prev",
    "next",
    "last",
    "search",
    "download",
  ],
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
    // sort key and direction
    sort: {} as PropType<Sort>,
    // items per page
    perPage: Number,
    // starting item index
    start: Number,
    // ending item index
    end: Number,
    // total number of items
    total: Number,
    // text being searched
    search: String,
  },
  methods: {
    // when user clicks a sort button
    emitSort(col: Col) {
      let newSort: Sort;

      // toggle sort direction
      if (this.sort?.key === col.key) {
        if (this.sort?.direction === "down")
          newSort = { key: col.key, direction: "up" };
        else if (this.sort?.direction === "up") {
          newSort = {};
        } else {
          newSort = { key: col.key, direction: "down" };
        }
      } else {
        newSort = { key: col.key, direction: "down" };
      }

      this.$emit("sort", newSort);
    },
    // when user changes a filter
    emitFilter(colIndex: number, value: Options) {
      this.$emit("filter", colIndex, value);
    },
    // when user changes rows per page
    emitPerPage(value: string) {
      this.$emit("perPage", Number(value));
    },
    // when user clicks to first page
    emitFirst() {
      this.$emit("first");
    },
    // when user clicks to previous page
    emitPrev() {
      this.$emit("prev");
    },
    // when user clicks to next page
    emitNext() {
      this.$emit("next");
    },
    // when user clicks to last page
    emitLast() {
      this.$emit("last");
    },
    // when user types in search
    emitSearch(value: string) {
      this.$emit("search", value);
    },
    // when user clicks download
    emitDownload() {
      this.$emit("download");
    },
    kebabify,
  },
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
</style>
