<!--
  node page title section, at top, below header. basic identifying info of node.
-->

<template>
  <AppSection design="fill" class="section">
    <AppFlex dir="column" gap="small">
      <AppHeading :icon="`category-${kebabCase(node.category)}`">
        {{ node.name }}
      </AppHeading>
      <AppFlex>
        <AppButton
          v-tippy="'The category/type of this node'"
          design="small"
          color="secondary"
          :text="startCase(node.category)"
        />
        <AppButton
          v-tippy="'The ID of this node. Click to copy.'"
          design="small"
          color="secondary"
          icon="hashtag"
          :text="node.id"
          :copy="true"
        />
        <span
          v-if="node.id !== node.originalId"
          v-tippy="
            'The original ID you visited, which resolved to a different ID.'
          "
          class="original-id"
        >
          {{ node.originalId }}
        </span>
      </AppFlex>
    </AppFlex>
  </AppSection>
</template>

<script setup lang="ts">
import { kebabCase, startCase } from "lodash";
import { Result } from "@/api/node-lookup";

interface Props {
  // current node
  node: Result;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.section {
  padding-top: 30px !important;
  padding-bottom: 30px !important;
}

.button {
  color: $off-black !important;
}

h1 {
  font-size: 1.2rem;
}

.original-id {
  color: $dark-gray;
  font-style: italic;
  font-size: 0.9rem;
}
</style>
