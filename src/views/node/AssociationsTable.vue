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

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { startCase } from "lodash";
import { Option } from "@/components/AppSelectSingle";
import AppStatus from "@/components/AppStatus.vue";
import { Status } from "@/components/AppStatus";
import AppTable from "@/components/AppTable.vue";
import { Cols } from "@/components/AppTable";
import { Result as NodeResult } from "@/api/node-lookup";
import {
  getAssociations,
  Result as AssociationsResult,
} from "@/api/node-associations";
import { ApiError } from "@/api";
import { downloadJson } from "@/util/download";
import { push } from "@/components/TheSnackbar.vue";

// table (full) associations
export default defineComponent({
  components: {
    AppStatus,
    AppTable,
  },
  props: {
    // current node
    node: {
      type: Object as PropType<NodeResult>,
      required: true,
    },
    // selected association category
    category: {
      type: Object as PropType<Option>,
      required: true,
    },
  },
  data() {
    return {
      // association data
      associations: [] as AssociationsResult["associations"],
      // total number of associations
      count: 0,
      // status of query
      status: null as Status | null,
      // table state
      perPage: 5,
      start: 0,
      search: "",
    };
  },
  computed: {
    // table columns
    cols(): Cols {
      return [
        {
          id: "subject",
          key: "subject",
          heading: startCase(this.node.category),
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
          heading: startCase(this.category.id),
          width: "minmax(150px, 1fr)",
        },
        {
          id: "evidence",
          key: "evidence",
          heading: "Evidence",
          width: "min-content",
          align: "center",
        },
      ];
    },
  },
  methods: {
    // get table association data
    async getAssociations() {
      try {
        // loading...
        this.status = { code: "loading", text: "Loading association data" };

        // catch case where no association categories available
        if (!this.node.associationCounts.length)
          throw new ApiError("No association info available", "warning");

        // get association data
        const { count, associations } = await getAssociations(
          this.node.id,
          this.node.category,
          this.category.id,
          this.perPage,
          this.start,
          this.search
        );
        this.count = count;
        this.associations = associations;

        // clear status
        this.status = null;
      } catch (error) {
        // error...
        this.status = error as ApiError;
        this.count = 0;
        this.associations = [];
      }
    },
    // download table data
    async download() {
      // max rows to try to query
      const max = 100000;

      // warn user
      push(
        `Downloading data for ${Math.min(this.count, max)} table entries.` +
          (this.count >= 100 ? " This may take a minute." : "")
      );

      // attempt to request all rows
      const response = await getAssociations(
        this.node.id,
        this.node.category,
        this.category.id,
        max,
        0
      );
      downloadJson(response);
    },
  },
  watch: {
    category() {
      this.getAssociations();
    },
    perPage() {
      this.getAssociations();
    },
    start() {
      this.getAssociations();
    },
    search() {
      this.getAssociations();
    },
  },
  mounted() {
    this.getAssociations();
  },
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
.arrow {
  color: $gray;
}
.evidence-button {
  min-height: unset !important;
}
</style>
