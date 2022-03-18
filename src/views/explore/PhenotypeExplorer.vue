<template>
  <strong>Compare these phenotypes ...</strong>

  <!-- set A -->
  <AppSelectTags
    name="First set of phenotypes"
    :options="getPhenotypes"
    v-model="aPhenotypes"
    placeholder="Select phenotypes"
    :tooltip="multiTooltip"
    @getOptions="(option, length) => getOptions(option, length, 'a')"
    :description="description(aPhenotypes, aGeneratedFrom)"
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
    @getOptions="(option, options) => getOptions(option, options, 'b')"
    :description="description(bPhenotypes, bGeneratedFrom)"
  />

  <!-- example button -->
  <AppButton text="try an example" design="small" @click="doExample()" />

  <!-- run analysis -->
  <AppButton text="Analyze" icon="bars-progress" @click="runAnalysis" />

  <hr />

  <!-- analysis status -->
  <AppStatus v-if="status" :status="status" />

  <!-- analysis results -->
  <template v-else-if="results.matches.length">
    <!-- top results -->
    <AppFlex>
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
          <AppIcon
            :icon="`category-${match.category}`"
            v-tippy="startCase(match.category)"
          />
          <AppLink :to="match.id">
            {{ match.label }}
          </AppLink>
        </div>
      </div>
    </AppFlex>

    <!-- phenogrid results -->
    <div id="phenogrid"></div>
  </template>

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
import { startCase, isEqual } from "lodash";
import AppSelectTags from "@/components/AppSelectTags.vue";
import AppSelectSingle from "@/components/AppSelectSingle.vue";
import AppRing from "@/components/AppRing.vue";
import {
  compareSetToGene,
  compareSetToSet,
  getPhenotypes,
  Results,
  getTaxonId,
} from "@/api/phenotype-explorer";
import { Status } from "@/components/AppStatus";
import AppStatus from "@/components/AppStatus.vue";
import { ApiError } from "@/api";
import { Option, Options } from "@/components/AppSelectTags";
import { push } from "@/components/TheSnackbar.vue";
import { mountPhenogrid } from "@/api/phenogrid";

// tooltip explaining how to use multi-select component
const multiTooltip = `In this box, you can select phenotypes in 3 ways:<br>
  <ol>
    <li>Search for individual phenotypes</li>
    <li>Search for genes/diseases and get their associated phenotypes</li>
    <li>Paste comma-separated phenotype IDs</li>
  </ol>`;

const bModeOptions = [
  "phenotypes from all human diseases",
  "phenotypes from all genes of ...",
  "these phenotypes ...",
];
const bTaxonOptions = ["mouse", "zebrafish", "fruitfly", "nematode", "frog"];

const exampleAPhenotypes = [
  { value: "HP:0004970" },
  { value: "HP:0004933" },
  { value: "HP:0004927" },
];

const exampleBPhenotypes = [
  { value: "HP:0004872" },
  { value: "HP:0012499" },
  { value: "HP:0002650" },
];

interface GeneratedFrom {
  option?: Option;
  options?: Options;
}

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
      aPhenotypes: [] as Options,
      // "generated from" helpers after selecting gene or disease
      aGeneratedFrom: {} as GeneratedFrom,
      // options for mode of second set
      bModeOptions,
      // selected mode of second set
      bMode: bModeOptions[0],
      // taxon options for second set
      bTaxonOptions,
      // selected taxon for second set
      bTaxon: bTaxonOptions[0],
      // second set of phenotypes
      bPhenotypes: [] as Options,
      // "generated from" helpers after selecting gene or disease
      bGeneratedFrom: {} as GeneratedFrom,
      // common tooltip for multi-select component
      multiTooltip,
      // status of analysis
      status: null as Status | null,
      // analysis results
      results: { matches: [] } as Results,
    };
  },
  methods: {
    // example phenotype set comparison
    doExample() {
      this.aPhenotypes = exampleAPhenotypes;
      this.bPhenotypes = exampleBPhenotypes;
      this.bMode = bModeOptions[2];
    },
    // run comparison analysis
    async runAnalysis() {
      // loading...
      this.status = { code: "loading", text: "Analyzing phenotypes" };
      this.results = { matches: [] };

      try {
        // run appropriate analysis based on selected mode
        if (this.bMode.includes("phenotypes from"))
          this.results = await compareSetToGene(
            this.aPhenotypes.map(({ value }) => String(value)),
            this.bMode.includes("diseases") ? "human" : this.bTaxon
          );
        else
          this.results = await compareSetToSet(
            this.aPhenotypes.map(({ value }) => String(value)),
            this.bPhenotypes.map(({ value }) => String(value))
          );

        this.runPhenogrid();

        // clear status
        this.status = null;
      } catch (error) {
        // error...
        this.status = error as ApiError;
        this.results = { matches: [] };
      }
    },
    // when multi select component runs get options function
    getOptions(option: Option, options: Options, set: string) {
      // notify
      if (options.length === 0) push("No associated phenotypes found");
      else push(`Selected ${options.length} phenotypes`);

      // set "generated from" helpers
      if (set === "a") this.aGeneratedFrom = { option, options };
      else if (set === "b") this.bGeneratedFrom = { option, options };
    },
    // show phenogrid results
    runPhenogrid() {
      // which biolink /sim endpoint to use
      const mode = this.bMode.includes("phenotypes from")
        ? "compare"
        : "search";

      // use first group of phenotypes for y axis
      const yAxis = this.aPhenotypes.map(({ value, label }) => ({
        id: String(value),
        term: label || "",
      }));

      // use second taxon id or group of phenotypes as x axis
      let xAxis = [];
      if (mode === "compare")
        xAxis = this.bPhenotypes.map(({ value, label }) => ({
          groupId: String(value),
          groupName: label || "",
        }));
      else {
        const taxon = this.bMode.includes("diseases") ? "human" : this.bTaxon;
        xAxis = [{ groupId: getTaxonId(taxon), groupName: taxon }];
      }

      // call phenogrid
      mountPhenogrid("#phenogrid", "Phenogrid Results", xAxis, yAxis, mode);
    },
    // clear/reset results
    clearResults() {
      this.results = { matches: [] };
    },
    // get description to show below phenotypes select box
    description(phenotypes: Options, generatedFrom: GeneratedFrom): string {
      const description = [];
      description.push(`${phenotypes.length} selected`);
      if (isEqual(generatedFrom.options, phenotypes)) {
        if (generatedFrom.option?.label)
          description.push(`generated from "${generatedFrom.option?.label}"`);
        // don't quote raw ids (just for aesthetics)
        else if (generatedFrom.option?.value)
          description.push(`generated from ${generatedFrom.option?.value}`);
      }
      return `(${description.join(", ")})`;
    },
    getPhenotypes,
    startCase,
    isEqual,
  },
  computed: {},
  watch: {
    // clear results when inputs are changed to avoid de-sync
    aPhenotypes: { handler: "clearResults", deep: true },
    bMode: { handler: "clearResults" },
    bTaxon: { handler: "clearResults" },
    bPhenotypes: { handler: "clearResults", deep: true },
  },
  mounted() {
    // fill in phenotype ids from text annotator
    if (this.$route.params.phenotypes) {
      const phenotypes = (this.$route.params.phenotypes as Array<string>).map(
        (phenotype) => ({ value: phenotype })
      );
      this.aPhenotypes = phenotypes;
      this.aGeneratedFrom = {
        option: { value: "text annotator" },
        options: phenotypes,
      };
    }
  },
});
</script>

<style lang="scss" scoped>
.weak {
  color: $gray;
  text-align: center;
}

.match {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 40px;
}

.match-details {
  flex-grow: 1;
  gap: 10px;
  text-align: left;

  svg {
    margin-right: 10px;
    vertical-align: middle;
  }
}

@media (max-width: 600px) {
  .match {
    flex-direction: column;
    gap: 20px;
    margin: 10px 0;
  }
}
</style>
