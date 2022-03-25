<template>
  <AppSection>
    <AppHeading icon="lightbulb">Overview</AppHeading>

    <AppFlex hAlign="left" direction="col">
      <!-- synonyms -->
      <template v-if="node.synonyms.length">
        <div class="detail">Also Known As</div>
        <AppFlex hAlign="left" gap="small">
          <span v-for="(synonym, index) in node.synonyms" :key="index">{{
            synonym
          }}</span>
        </AppFlex>
      </template>

      <!-- symbol (gene specific) -->
      <template v-if="node.symbol">
        <div class="detail">Symbol</div>
        <p>{{ node.symbol }}</p>
      </template>

      <!-- authors (publication specific) -->
      <template v-if="node.authors?.length">
        <div class="detail">Authors</div>
        <p>{{ node.authors.join(", ") }}</p>
      </template>

      <!-- paragraph description -->
      <template v-if="node.description">
        <div class="detail">Description</div>
        <p
          class="description truncate-10"
          tabindex="0"
          v-html="node.description.trim()"
          v-tippy="'Click to expand'"
        ></p>
      </template>
    </AppFlex>
  </AppSection>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Result } from "@/api/node-lookup";

// basic, high level information about node
export default defineComponent({
  props: {
    // current node
    node: {
      type: Object as PropType<Result>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.detail {
  width: 100%;
  margin-top: 5px;
  margin-bottom: -5px;
  text-align: left;
  font-weight: 600;
}

.description {
  width: 100%;
  overflow-x: auto;
  white-space: pre-line;
}
</style>
