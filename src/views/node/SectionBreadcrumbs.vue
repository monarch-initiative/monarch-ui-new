<template>
  <AppSection v-if="breadcrumbs.length">
    <AppHeading icon="location-dot">Breadcrumbs</AppHeading>

    <span
      >How you got to <strong>{{ node.name }}</strong> through the Monarch
      knowledge graph</span
    >

    <AppFlex>
      <template v-for="(breadcrumb, index) of breadcrumbs" :key="index">
        <!-- subject -->
        <AppLink
          class="truncate"
          :to="`/${breadcrumb.subject.category}/${breadcrumb.subject.id}`"
          >{{ breadcrumb.subject.name }}</AppLink
        >

        <!-- relation -->
        <AppFlex flow="inline" gap="tiny">
          <AppIcon
            class="arrow"
            :icon="
              breadcrumb.relation.inverse
                ? 'arrow-left-long'
                : 'arrow-right-long'
            "
          />
          <AppLink
            class="truncate"
            :to="breadcrumb.relation.iri"
            :no-icon="true"
            >{{ startCase(breadcrumb.relation.name) }}</AppLink
          >
          <AppIcon
            class="arrow"
            :icon="
              breadcrumb.relation.inverse
                ? 'arrow-left-long'
                : 'arrow-right-long'
            "
          />
        </AppFlex>
      </template>

      <!-- ending/current node -->
      <strong>{{ node.name }}</strong>
    </AppFlex>
  </AppSection>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "vue-router";
import { startCase } from "lodash";
import { breadcrumbs } from "@/global/breadcrumbs";
import { Node } from "@/api/node-lookup";

interface Props {
  /** current node */
  node: Node;
}

defineProps<Props>();

/** route info */
const route = useRoute();

/** keep breadcrumbs global variable in sync with history.state.breadcrumbs */
watch(
  () => route,
  () => {
    try {
      breadcrumbs.value = JSON.parse(window.history.state.breadcrumbs);
    } catch (error) {
      console.warn("Bad breadcrumbs state");
      breadcrumbs.value = [];
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.arrow {
  color: $gray;
}
</style>
