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
                :icon="
                  'arrow-' + (sort?.key === col.key ? sort?.direction : 'down')
                "
                design="small"
                :color="sort?.key === col.key ? 'primary' : 'secondary'"
                @click.stop="emitSort(col)"
                v-tippy="'Sort by ' + col.heading"
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
                  icon="filter"
                  design="small"
                  v-bind="kebabify(props)"
                  v-tippy="'Filter by ' + col.heading"
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
          :modelValue="{ id: String(perPage || 5) }"
          @update:modelValue="(value) => emitPerPage(value.id)"
        />
      </div>
      <div>
        <AppButton
          :disabled="start <= 0"
          icon="angle-double-left"
          design="small"
          @click="clickFirst"
          v-tippy="'Go to first page'"
        />
        <AppButton
          :disabled="start - perPage < 0"
          icon="angle-left"
          design="small"
          @click="clickPrev"
          v-tippy="'Go to previous page'"
        />
        <span>{{ start + 1 }} &mdash; {{ end }} of {{ total }}</span>
        <AppButton
          :disabled="start + perPage > total"
          icon="angle-right"
          design="small"
          @click="clickNext"
          v-tippy="'Go to next page'"
        />
        <AppButton
          :disabled="start + perPage > total"
          icon="angle-double-right"
          design="small"
          @click="clickLast"
          v-tippy="'Go to last page'"
        />
      </div>
      <div>
        <AppInput
          class="search"
          icon="search"
          :modelValue="search"
          @change="emitSearch"
          v-tippy="'Search table data'"
        />
        <AppButton
          icon="download"
          design="small"
          @click="emitDownload"
          v-tippy="'Download table data'"
        />
      </div>
    </div>
  </AppFlex>
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
  emits: ["sort", "filter", "perPage", "start", "search", "download"],
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
    sort: {
      type: Object as PropType<Sort>,
      default: null,
    },
    // items per page
    perPage: {
      type: Number,
      required: true,
    },
    // starting item index
    start: {
      type: Number,
      required: true,
    },
    // total number of items
    total: {
      type: Number,
      required: true,
    },
    // text being searched
    search: {
      type: String,
      default: "",
    },
    // whether table is disabled (e.g. loading)
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // when user clicks to first page
    clickFirst() {
      this.$emit("start", 0);
    },
    // when user clicks to previous page
    clickPrev() {
      this.$emit("start", this.start - this.perPage);
    },
    // when user clicks to next page
    clickNext() {
      this.$emit("start", this.start + this.perPage);
    },
    // when user clicks to last page
    clickLast() {
      this.$emit("start", Math.floor(this.total / this.perPage) * this.perPage);
    },
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
      this.$emit("start", 0);
    },

    // when user types in search
    emitSearch(value: string) {
      this.$emit("search", value);
      this.$emit("start", 0);
    },
    // when user clicks download
    emitDownload() {
      this.$emit("download");
    },
    kebabify,
  },
  computed: {
    // ending item index
    end(): number {
      return this.start + this.rows.length;
    },
    // grid column template widths
    widths(): string {
      return this.cols.map((col) => col.width || "auto").join(" ");
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
