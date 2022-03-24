<template>
  <AppSection>
    <AppHeading icon="clipboard-list">Details</AppHeading>

    <AppFlex hAlign="left" direction="col">
      <!-- main identifier -->
      <template v-if="node.iri">
        <div class="detail">IRI</div>
        <AppLink :to="node.iri">Link</AppLink>
      </template>

      <!-- inheritance -->
      <template v-if="node.inheritance.length">
        <div class="detail">Heritability</div>
        <AppFlex hAlign="left" gap="small">
          <AppLink
            v-for="(inheritance, index) of node.inheritance"
            :key="index"
            :to="inheritance.link"
            v-tippy="inheritance.id"
            >{{ inheritance.name }}</AppLink
          >
        </AppFlex>
      </template>

      <!-- modifiers -->
      <template v-if="node.modifiers.length">
        <div class="detail">Clinical Modifiers</div>
        <p>{{ node.modifiers.join("&nbsp; · &nbsp;") }}</p>
      </template>

      <!-- taxon -->
      <template v-if="node.taxon.id">
        <div class="detail">Taxon</div>
        <AppLink :to="node.taxon.link" v-tippy="node.taxon.id">{{
          node.taxon.name
        }}</AppLink>
      </template>

      <!-- external references -->
      <template v-if="node.xrefs.length">
        <div class="detail">External References</div>
        <AppFlex hAlign="left" gap="small">
          <AppLink
            v-for="(xref, index) of node.xrefs"
            :key="index"
            :to="xref.link"
            >{{ xref.id }}</AppLink
          >
        </AppFlex>
      </template>
    </AppFlex>
  </AppSection>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Result } from "@/api/node-lookup";

// more detailed metadata/information about node
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
