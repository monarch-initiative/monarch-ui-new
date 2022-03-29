<template>
  <!-- status -->
  <AppStatus v-if="status" :status="status" />

  <!-- results -->
  <template v-else>
    {{ associations }}
  </template>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import AppStatus from "@/components/AppStatus.vue";
import { Status } from "@/components/AppStatus";
import { Result as NodeResult } from "@/api/node-lookup";
import { Option } from "@/components/AppSelectSingle";
import {
  getTopAssociations,
  Result as AssociationsResult,
} from "@/api/node-associations";
import { ApiError } from "@/api";

// summary (top few) associations
export default defineComponent({
  components: {
    AppStatus,
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
      // status of query
      status: null as Status | null,
    };
  },
  methods: {
    // get summary association data
    async getAssociations() {
      try {
        // loading...
        this.status = { code: "loading", text: "Loading association data" };
        this.associations = [];

        // get association data
        this.associations = await getTopAssociations(
          this.node.id,
          this.node.category,
          this.category.id
        );

        // clear status
        this.status = null;
      } catch (error) {
        // error...
        this.status = error as ApiError;
        this.associations = [];
      }
    },
  },
  mounted() {
    this.getAssociations();
  },
});
</script>
