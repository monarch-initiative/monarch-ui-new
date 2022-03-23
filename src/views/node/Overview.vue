<template>
  <AppSection>
    <AppHeading icon="lightbulb">Overview</AppHeading>

    <AppFlex hAlign="left" direction="col">
      <!-- synonyms -->
      <template v-if="node.synonyms.length">
        <div class="detail">Also Known As</div>
        <p>{{ node.synonyms.join("&nbsp; · &nbsp;") }}</p>
      </template>

      <!-- paragraph description -->
      <template v-if="node.description">
        <div class="detail">Description</div>
        <p v-html="node.description"></p>
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
</style>
