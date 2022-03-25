<template>
  <AppSection>
    <AppHeading icon="sitemap">Hierarchy</AppHeading>

    <!-- results -->
    <div
      v-if="
        node.hierarchy.superClasses.length ||
        node.hierarchy.equivalentClasses.length ||
        node.hierarchy.subClasses.length
      "
      class="hierarchy"
    >
      <!-- nodes that are "parents" of node -->
      <template v-if="node.hierarchy.superClasses.length">
        <AppFlex
          hAlign="left"
          v-tippy="`Nodes that are &quot;parents&quot; of this node`"
        >
          <AppIcon icon="angle-up" />
          <span>Super-classes</span>
        </AppFlex>
        <AppFlex hAlign="left" gap="small">
          <AppLink
            v-for="(_class, index) in node.hierarchy.superClasses"
            :key="index"
            :to="'/' + _class.id"
            >{{ _class.name || _class.id }}</AppLink
          >
        </AppFlex>
      </template>

      <!-- nodes that are "siblings" of node -->
      <template v-if="node.hierarchy.equivalentClasses.length">
        <AppFlex
          hAlign="left"
          v-tippy="`Nodes that are &quot;siblings&quot; of this node`"
        >
          <AppIcon icon="equals" />
          <span>Equivalent classes</span>
        </AppFlex>
        <AppFlex hAlign="left" gap="small">
          <AppLink
            v-for="(_class, index) in node.hierarchy.equivalentClasses"
            :key="index"
            :to="'/' + _class.id"
            >{{ _class.name || _class.id }}</AppLink
          >
        </AppFlex>
      </template>

      <!-- nodes that are "children" of node -->
      <template v-if="node.hierarchy.subClasses.length">
        <AppFlex
          hAlign="left"
          v-tippy="`Nodes that are &quot;children&quot; of this node`"
        >
          <AppIcon icon="angle-down" />
          <span>Sub-classes</span>
        </AppFlex>
        <AppFlex hAlign="left" gap="small">
          <AppLink
            v-for="(_class, index) in node.hierarchy.subClasses"
            :key="index"
            :to="'/' + _class.id"
            >{{ _class.name || _class.id }}</AppLink
          >
        </AppFlex>
      </template>
    </div>

    <!-- empty status -->
    <AppStatus
      v-else
      :status="{ code: 'warning', text: 'No hierarchy info available' }"
    />
  </AppSection>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Result } from "@/api/node-lookup";
import AppStatus from "@/components/AppStatus.vue";

// hierarchy info about node
export default defineComponent({
  props: {
    // current node
    node: {
      type: Object as PropType<Result>,
      required: true,
    },
  },
  components: { AppStatus },
});
</script>

<style lang="scss" scoped>
.hierarchy {
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: flex-start;
  gap: 40px;
  width: 100%;
  text-align: left;
}

@media (max-width: 700px) {
  .hierarchy {
    justify-content: flex-start;
    grid-template-columns: unset;
    gap: 20px;
  }
}
</style>
