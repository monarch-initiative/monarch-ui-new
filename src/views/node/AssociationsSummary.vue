<template>
  <!-- status -->
  <AppStatus v-if="status" :status="status" />

  <!-- results -->
  <template v-else>
    <strong>Top {{ associations.length }} associations</strong>

    <!-- result -->
    <div
      class="result"
      v-for="(association, index) in associations"
      :key="index"
    >
      <AppFlex direction="col" gap="small" class="details">
        <!-- primary result info -->
        <AppFlex gap="small" hAlign="left" class="title">
          <span>{{ node.name }}</span>
          <AppIcon
            class="arrow"
            :icon="
              association.relation.inverse
                ? 'arrow-left-long'
                : 'arrow-right-long'
            "
          />
          <AppLink :to="association.relation.iri" :noIcon="true">{{
            association.relation.name
          }}</AppLink>
          <AppIcon
            class="arrow"
            :icon="
              association.relation.inverse
                ? 'arrow-left-long'
                : 'arrow-right-long'
            "
          />
          <AppLink
            :to="`/${association.object.category}/${association.object.id}`"
            >{{ association.object.name }}</AppLink
          >
        </AppFlex>

        <!-- secondary result info -->
        <AppFlex hAlign="left" class="secondary">
          <span>XX supporting evidence</span>
          <span>XX frequency</span>
          <span>XX publications</span>
        </AppFlex>
      </AppFlex>

      <AppButton
        class="evidence"
        text="Evidence"
        icon="eye"
        color="secondary"
        v-tippy="'View supporting evidence for this association'"
      />
    </div>
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

        // catch case where no association categories available
        if (!this.node.associationCounts.length)
          throw new ApiError("No association info available", "warning");

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
  watch: {
    category() {
      this.getAssociations();
    },
  },
  mounted() {
    this.getAssociations();
  },
});
</script>

<style lang="scss" scoped>
.result {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 40px;
}

.arrow {
  color: $gray;
}

.details {
  flex-grow: 1;
}

.secondary {
  color: $gray;
}

.evidence {
  min-width: unset !important;
  min-height: unset !important;
}
</style>
