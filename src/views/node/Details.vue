<template>
  <AppSection>
    <AppHeading icon="clipboard-list">Details</AppHeading>

    <AppDetails>
      <!-- main identifier -->
      <AppDetail :blank="!node.iri" title="IRI">
        <AppLink :to="node.iri">{{ node.iri.split("/").pop() }}</AppLink>
      </AppDetail>

      <!-- inheritance -->
      <AppDetail :blank="!node.inheritance.length" title="Heritability">
        <AppFlex hAlign="left" gap="small">
          <AppLink
            v-for="(inheritance, index) of node.inheritance"
            :key="index"
            :to="inheritance.link"
            v-tippy="inheritance.id"
            >{{ inheritance.name }}</AppLink
          >
        </AppFlex>
      </AppDetail>

      <!-- modifiers -->
      <AppDetail :blank="!node.modifiers.length" title="Clinical Modifiers">
        <p>{{ node.modifiers.join("&nbsp; | &nbsp;") }}</p>
      </AppDetail>

      <!-- taxon (gene specific)-->
      <AppDetail
        v-if="node.category === 'gene'"
        :blank="!node.taxon?.id"
        title="Taxon"
      >
        <AppLink :to="node.taxon?.link" v-tippy="node?.taxon?.id">{{
          node.taxon?.name
        }}</AppLink>
      </AppDetail>

      <!-- external references -->
      <AppDetail
        :blank="!node.xrefs.length"
        title="External References"
        :big="true"
      >
        <AppFlex hAlign="left" gap="small">
          <AppLink
            v-for="(xref, index) of node.xrefs"
            :key="index"
            :to="xref.link"
            >{{ xref.id }}</AppLink
          >
        </AppFlex>
      </AppDetail>
    </AppDetails>
  </AppSection>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Result } from "@/api/node-lookup";
import AppDetail from "@/components/AppDetail.vue";
import AppDetails from "@/components/AppDetails.vue";

// more detailed metadata/information about node
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
