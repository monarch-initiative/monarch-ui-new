<!--
  node page associations section, summary mode. top few associations.
-->

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

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import AppStatus from "@/components/AppStatus.vue";
import { Status } from "@/components/AppStatus";
import { Result as NodeResult } from "@/api/node-lookup";
import { Option } from "@/components/AppSelectSingle";
import {
  getTopAssociations,
  Result as AssociationsResult,
} from "@/api/node-associations";
import { ApiError } from "@/api";

interface Props {
  // current node
  node: NodeResult;
  // selected association category
  category: Option;
}

const props = defineProps<Props>();

// association data
const associations = ref<AssociationsResult["associations"]>([]);
// status of query
const status = ref<Status | null>(null);

// get summary association data
async function getAssociations() {
  try {
    // loading...
    status.value = { code: "loading", text: "Loading association data" };
    associations.value = [];

    // catch case where no association categories available
    if (!props.node.associationCounts.length)
      throw new ApiError("No association info available", "warning");

    // get association data
    associations.value = await getTopAssociations(
      props.node.id,
      props.node.category,
      props.category.id
    );

    // clear status
    status.value = null;
  } catch (error) {
    // error...
    status.value = error as ApiError;
    associations.value = [];
  }
}

// get associations when category changes
watch(() => props.category, getAssociations);

// get associations on load
onMounted(getAssociations);
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
