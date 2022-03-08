<template>
  <span>Compare these phenotypes ...</span>

  <!-- set A -->
  <AppSelectTags
    name="First set of phenotypes"
    :options="getPhenotypes"
    v-model="aPhenotypes"
    placeholder="Select phenotypes"
    :tooltip="multiTooltip"
  />

  <!-- set B -->
  <AppFlex gap="small">
    <span>... to</span>
    <AppSelectSingle
      name="Second set mode"
      :options="bModeOptions"
      v-model="bMode"
    />
    <AppSelectSingle
      v-if="bMode.includes('genes')"
      name="Second set taxon"
      :options="bTaxonOptions"
      v-model="bTaxon"
    />
  </AppFlex>

  <AppSelectTags
    v-if="bMode.includes('these phenotypes')"
    name="Second set of phenotypes"
    :options="getPhenotypes"
    v-model="bPhenotypes"
    placeholder="Select phenotypes"
    :tooltip="multiTooltip"
  />

  <!-- run analysis -->
  <AppButton text="Analyze!" icon="bars-progress" @click="runAnalysis" />

  <!-- permanent placeholder when no results -->
  <AppPlaceholder v-tippy="'Click analyze to see results!'" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppSelectTags from "@/components/AppSelectTags.vue";
import AppSelectSingle from "@/components/AppSelectSingle.vue";
import { getPhenotypes } from "@/api/phenotype-explorer";

// tooltip explaining how to use multi-select component
const multiTooltip = `You can select phenotypes in 3 ways:<br>
  <ol>
    <li>Search for individual phenotypes</li>
    <li>Search for genes/diseases and get their associated phenotypes</li>
    <li>Paste comma-separated phenotype id's</li>
  </ol>`;

const bModeOptions = [
  "phenotypes from all genes of ...",
  "phenotypes from all human diseases",
  "these phenotypes ...",
];
const bTaxonOptions = ["mouse", "zebrafish", "fruitfly", "nematode", "frog"];

export default defineComponent({
  components: {
    AppSelectTags,
    AppSelectSingle,
  },
  data() {
    return {
      aPhenotypes: [],
      bModeOptions,
      bMode: bModeOptions[0],
      bTaxonOptions,
      bTaxon: bTaxonOptions[0],
      bPhenotypes: [],
      multiTooltip,
    };
  },
  methods: {
    getPhenotypes,
    // run comparison analysis
    runAnalysis() {
      console.log("hi");
    },
  },
});
</script>

<style lang="scss" scoped></style>
