<template>
  <AppSection v-if="breadcrumbs.length">
    <AppHeading icon="location-dot">Breadcrumbs</AppHeading>

    <span
      >How you got to <strong>{{ node.name }}</strong> through the Monarch
      knowledge graph</span
    >

    <AppFlex>
      <template v-for="(breadcrumb, index) of breadcrumbs" :key="index">
        <!-- node -->
        <AppFlex flow="inline" gap="small">
          <AppIcon
            v-tooltip="startCase(breadcrumb.node.category)"
            :icon="`category-${kebabCase(breadcrumb.node.category)}`"
          />
          <AppLink :to="`/${breadcrumb.node.category}/${breadcrumb.node.id}`">{{
            breadcrumb.node.name
          }}</AppLink>
        </AppFlex>

        <!-- relation -->
        <AppFlex flow="inline" gap="small">
          <AppIcon
            class="arrow"
            :icon="
              breadcrumb.relation.inverse
                ? 'arrow-left-long'
                : 'arrow-right-long'
            "
          />
          <AppLink :to="breadcrumb.relation.iri" :no-icon="true">{{
            startCase(breadcrumb.relation.name)
          }}</AppLink>
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
      <AppFlex flow="inline" gap="small">
        <AppIcon
          v-tooltip="startCase(node.category)"
          :icon="`category-${kebabCase(node.category)}`"
        />
        <strong>{{ node.name }}</strong>
      </AppFlex>
    </AppFlex>

    <!-- clear button -->
    <AppButton
      v-tooltip="'Clear breadcrumb history'"
      icon="times"
      text="Clear"
      design="small"
      @click="clear"
    />
  </AppSection>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "vue-router";
import { kebabCase, startCase } from "lodash";
import { breadcrumbs, updateBreadcrumbs } from "@/global/breadcrumbs";
import { Node } from "@/api/node-lookup";

interface Props {
  /** current node */
  node: Node;
}

defineProps<Props>();

/** route info */
const route = useRoute();

/** keep breadcrumbs global variable in sync with history.state.breadcrumbs */
watch(() => route, updateBreadcrumbs, { immediate: true, deep: true });

/** clear breadcrumbs history */
function clear() {
  /** confirmation warning not necessary since back button should return to previous state */
  window.history.pushState({}, "");
  updateBreadcrumbs();
}
</script>

<style lang="scss" scoped>
.arrow {
  color: $gray;
}
</style>
