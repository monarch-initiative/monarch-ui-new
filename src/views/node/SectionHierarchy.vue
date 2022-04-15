<!--
  node page hierarchy section. super/sub/equivalent classes of current node.
-->

<template>
  <AppSection>
    <AppHeading icon="sitemap">Hierarchy</AppHeading>

    <AppDetails>
      <!-- nodes that are "parents" of node -->
      <AppDetail
        title="Super-classes"
        icon="angle-up"
        :blank="!node.hierarchy.superClasses.length"
        :big="true"
        :v-tippy="`Nodes that are &quot;parents&quot; of this node`"
      >
        <AppFlex class="flex" h-align="left" gap="small">
          <AppLink
            v-for="(_class, index) in node.hierarchy.superClasses"
            :key="index"
            :to="'/' + _class.id"
            >{{ _class.name || _class.id }}</AppLink
          >
        </AppFlex>
      </AppDetail>

      <!-- nodes that are "siblings" of node -->
      <AppDetail
        title="Equivalent classes"
        icon="equals"
        :blank="!node.hierarchy.equivalentClasses.length"
        :big="true"
        :v-tippy="`Nodes that are &quot;siblings&quot; of this node`"
      >
        <AppFlex class="flex" h-align="left" gap="small">
          <AppLink
            v-for="(_class, index) in node.hierarchy.equivalentClasses"
            :key="index"
            :to="'/' + _class.id"
            >{{ _class.name || _class.id }}</AppLink
          >
        </AppFlex>
      </AppDetail>

      <!-- nodes that are "children" of node -->
      <AppDetail
        title="Sub-classes"
        icon="angle-down"
        :blank="!node.hierarchy.subClasses.length"
        :big="true"
        :v-tippy="`Nodes that are &quot;children&quot; of this node`"
      >
        <AppFlex class="flex" h-align="left" gap="small">
          <AppLink
            v-for="(_class, index) in node.hierarchy.subClasses"
            :key="index"
            :to="'/' + _class.id"
            >{{ _class.name || _class.id }}</AppLink
          >
        </AppFlex>
      </AppDetail>
    </AppDetails>
  </AppSection>
</template>

<script setup lang="ts">
import { Result } from "@/api/node-lookup";
import AppDetails from "@/components/AppDetails.vue";
import AppDetail from "@/components/AppDetail.vue";

interface Props {
  // current node
  node: Result;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.flex {
  column-gap: 20px !important;
}
</style>
