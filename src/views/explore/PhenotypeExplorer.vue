<template>
  <strong>Compare these phenotypes ...</strong>

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
    <strong>... to</strong>
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

  <hr />

  <!-- analysis status -->
  <AppStatus v-if="status" :status="status" />

  <!-- analysis results -->
  <AppFlex v-else-if="results.matches.length">
    <strong>Top 10 matches</strong>
    <div
      v-for="(match, index) in results.matches.slice(0, 10)"
      :key="index"
      class="match"
    >
      <AppRing
        :score="match.score"
        :min="results.minScore"
        :max="results.maxScore"
        v-tippy="'Similarity score'"
      />
      <div class="match-details">
        <AppLink :to="match.id">
          {{ match.label }}
        </AppLink>
        <AppIcon
          :icon="`category-${match.category}`"
          v-tippy="startCase(match.category)"
        />
      </div>
      <AppButton
        text="See details"
        icon="eye"
        design="circle"
        color="secondary"
        @click="phenogrid(match.id)"
      />
    </div>
  </AppFlex>

  <!-- spacing for dropdown when no results -->
  <template v-else>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { startCase } from "lodash";
import AppSelectTags from "@/components/AppSelectTags.vue";
import AppSelectSingle from "@/components/AppSelectSingle.vue";
import AppRing from "@/components/AppRing.vue";
import {
  compareSetToGene,
  compareSetToSet,
  getPhenotypes,
  Results,
} from "@/api/phenotype-explorer";
import { Status } from "@/components/AppStatus";
import AppStatus from "@/components/AppStatus.vue";
import { ApiError } from "@/api";

// tooltip explaining how to use multi-select component
const multiTooltip = `In this box, you can select phenotypes in 3 ways:<br>
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

const exammpleAPhenotypes = [
  { value: "HP:0004970" },
  { value: "HP:0004933" },
  { value: "HP:0004927" },
  { value: "HP:0002108" },
  { value: "HP:0004872" },
  { value: "HP:0012499" },
  { value: "HP:0002650" },
];

const exammpleBPhenotypes = [
  { value: "FBcv:0000366" },
  { value: "FBcv:0000439" },
  { value: "FBcv:0002041" },
  { value: "FBcv:0002039" },
];

// phenotype explore mode that compares two sets of phenotypes
export default defineComponent({
  components: {
    AppSelectTags,
    AppSelectSingle,
    AppStatus,
    AppRing,
  },
  data() {
    return {
      // first set of phenotypes
      aPhenotypes: exammpleAPhenotypes,
      // options for mode of second set
      bModeOptions,
      // selected mode of second set
      bMode: bModeOptions[0],
      // taxon options for second set
      bTaxonOptions,
      // selected taxon for second set
      bTaxon: bTaxonOptions[0],
      // second set of phenotypes
      bPhenotypes: exammpleBPhenotypes,
      // common tooltip for multi-select component
      multiTooltip,
      // status of analysis
      status: null as Status | null,
      // analysis results
      results: { matches: [] } as Results,
    };
  },
  methods: {
    getPhenotypes,
    // run comparison analysis
    async runAnalysis() {
      // loading...
      this.status = { code: "loading", text: "Analyzing phenotypes" };
      this.results = { matches: [] };

      try {
        // run appropriate analysis based on selected mode
        if (this.bMode.includes("phenotypes from"))
          this.results = await compareSetToGene(
            this.aPhenotypes.map(({ value }) => value),
            this.bMode.includes("diseases") ? "human" : this.bTaxon
          );
        else
          this.results = await compareSetToSet(
            this.aPhenotypes.map(({ value }) => value),
            this.bPhenotypes.map(({ value }) => value)
          );

        // clear status
        this.status = null;
      } catch (error) {
        // error...
        this.status = error as ApiError;
        this.results = { matches: [] };
      }
    },
    // show results in phenogrid
    phenogrid(id: string) {
      console.info(id);
    },
    startCase,
  },
});
</script>

<style lang="scss" scoped>
.match {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  gap: 40px;
}

.match-details {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  gap: 10px;
}
</style>
