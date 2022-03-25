<template>
  <AppSection>
    <AppHeading icon="lightbulb">Overview</AppHeading>

    <AppDetails>
      <!-- synonyms -->
      <AppDetail :blank="!node.synonyms.length" title="Also Known As">
        <p>{{ node.synonyms.join(" | ") }}</p>
      </AppDetail>

      <!-- symbol (gene specific) -->
      <AppDetail
        v-if="node.category === 'gene'"
        :blank="!node.symbol"
        title="Symbol"
      >
        <p>{{ node.symbol }}</p>
      </AppDetail>

      <!-- authors (publication specific) -->
      <AppDetail
        v-if="node.category === 'publication'"
        :blank="!node.authors?.length"
        title="Authors"
      >
        <p>{{ node.authors?.join(", ") }}</p>
      </AppDetail>

      <!-- paragraph description -->
      <AppDetail :blank="!node.description" title="Description" :big="true">
        <p
          class="description truncate-10"
          tabindex="0"
          v-html="node.description.trim()"
          v-tippy="'Click to expand'"
        ></p>
      </AppDetail>
    </AppDetails>
  </AppSection>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Result } from "@/api/node-lookup";
import AppDetails from "@/components/AppDetails.vue";
import AppDetail from "@/components/AppDetail.vue";

// basic, high level information about node
export default defineComponent({
  components: {
    AppDetails,
    AppDetail,
  },
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
.description {
  width: 100%;
  overflow-x: auto;
  white-space: pre-line;
}
</style>
