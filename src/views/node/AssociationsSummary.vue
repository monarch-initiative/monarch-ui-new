<!--
  node page associations section, summary mode. top few associations.
-->

<template>
  <!-- status -->
  <AppStatus v-if="status" :status="status" />

  <!-- results -->
  <template v-else>
    <span>Top {{ associations.length }} association(s)</span>

    <!-- result -->
    <div
      v-for="(association, index) in associations"
      :key="index"
      class="result"
    >
      <AppFlex direction="col" gap="small" class="details">
        <!-- primary result info -->
        <AppFlex gap="small" h-align="left" class="title">
          <span class="truncate">{{ node.name }}</span>
          <AppIcon
            class="arrow"
            :icon="
              association.relation.inverse
                ? 'arrow-left-long'
                : 'arrow-right-long'
            "
          />
          <AppLink :to="association.relation.iri" :no-icon="true">{{
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
        <AppFlex h-align="left" class="secondary">
          <span
            >{{ association.supportCount }} piece(s) of supporting
            evidence</span
          >
        </AppFlex>
      </AppFlex>

      <AppButton
        v-tippy="
          association.id === selectedAssociation?.id
            ? 'Viewing supporting evidence. Click again to hide.'
            : 'View supporting evidence for this association'
        "
        class="evidence"
        text="Evidence"
        :aria-selected="association.id === selectedAssociation?.id"
        :icon="association.id === selectedAssociation?.id ? 'check' : 'flask'"
        :color="
          association.id === selectedAssociation?.id ? 'primary' : 'secondary'
        "
        @click="
          emit(
            'select',
            association.id === selectedAssociation?.id ? undefined : association
          )
        "
      />
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import AppStatus from "@/components/AppStatus.vue";
import { Status } from "@/components/AppStatus";
import { Result as NodeResult } from "@/api/node-lookup";
import {
  getTopAssociations,
  Result as AssociationsResult,
  Association,
} from "@/api/node-associations";
import { ApiError } from "@/api";

interface Props {
  /** current node */
  node: NodeResult;
  /** selected association category */
  selectedCategory: string;
  /** selected association id */
  selectedAssociation?: Association;
}

const props = defineProps<Props>();

interface Emits {
  /** change selected association */
  (event: "select", value?: Association): void;
}

const emit = defineEmits<Emits>();

/** association data */
const associations = ref<AssociationsResult["associations"]>([]);
/** status of query */
const status = ref<Status | null>(null);

/** get summary association data */
async function getAssociations() {
  try {
    /** loading... */
    status.value = { code: "loading", text: "Loading association data" };
    associations.value = [];

    /** catch case where no association categories available */
    if (!props.node.associationCounts.length)
      throw new ApiError("No association info available", "warning");

    /** get association data */
    associations.value = await getTopAssociations(
      props.node.id,
      props.node.category,
      props.selectedCategory
    );

    /** clear status */
    status.value = null;
  } catch (error) {
    /** error... */
    status.value = error as ApiError;
    associations.value = [];
  }
}

/** get associations when category changes */
watch(() => props.selectedCategory, getAssociations);

/** get associations on load */
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
  width: 0;
  flex-grow: 1;
  text-align: left;
}

.secondary {
  color: $gray;
}

.evidence {
  min-width: unset !important;
  min-height: unset !important;
}
</style>
