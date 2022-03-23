<template>
  <AppSection design="fill" class="section">
    <AppFlex dir="column" gap="small">
      <AppHeading
        :icon="`category-${kebabCase(node.category || '')}`"
        fallbackIcon="category-unknown"
      >
        {{ node.name }}
      </AppHeading>
      <AppFlex>
        <AppButton
          design="small"
          color="secondary"
          :text="startCase(node.category || 'unknown')"
        />
        <AppButton
          design="small"
          color="secondary"
          icon="hashtag"
          :text="node.id"
          :copy="true"
          v-tippy="'Node ID. Click to copy.'"
        />
      </AppFlex>
    </AppFlex>
  </AppSection>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { kebabCase, startCase } from "lodash";
import { Result } from "@/api/node-lookup";

export default defineComponent({
  props: {
    // current node
    node: {
      type: Object as PropType<Result>,
      required: true,
    },
  },
  methods: {
    kebabCase,
    startCase,
  },
});
</script>

<style lang="scss" scoped>
.section {
  padding: 30px !important;
}

.button {
  color: $off-black !important;
}

h1 {
  font-size: 1.2rem;
}
</style>
