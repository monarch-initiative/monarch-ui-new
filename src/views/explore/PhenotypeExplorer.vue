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
      v-if="bMode.id.includes('genes')"
      name="Second set taxon"
      :options="bTaxonOptions"
      v-model="bTaxon"
    />
  </AppFlex>

  <AppSelectTags
    v-if="bMode.id.includes('these phenotypes')"
    name="Second set of phenotypes"
    :options="getPhenotypes"
    v-model="bPhenotypes"
    placeholder="Select phenotypes"
    :tooltip="multiTooltip"
    @getOptions="(option, options) => getOptions(option, options, 'b')"
    :description="description(bPhenotypes, bGeneratedFrom)"
  />

  <AppFlex>
    <!-- example button -->
    <AppButton text="try an example" design="small" @click="doExample()" />

    <!-- run analysis -->
    <AppButton text="Analyze" icon="bars-progress" @click="runAnalysis" />
  </AppFlex>

  <hr />

  <!-- analysis status -->
  <AppStatus v-if="status" :status="status" />

  <!-- analysis top results -->
  <AppFlex v-else-if="results.matches.length">
    <!-- heading -->
    <strong v-if="results.matches.length === 1">Top match</strong>
    <strong v-else
      >Top {{ Math.min(results.matches.length, 10) }} matches</strong
    >

    <!-- list of results -->
    <div
      v-for="(match, index) in results.matches.slice(0, 10)"
      :key="index"
      class="match"
    >
      <!-- ring score -->
      <AppRing
        :score="match.score"
        :min="results.minScore"
        :max="results.maxScore"
        v-tippy="'Similarity score'"
      />

      <AppFlex direction="col" hAlign="left" gap="small" class="details">
        <!-- primary match info -->
        <div class="primary">
          <AppIcon
            :icon="`category-${match.category}`"
            v-tippy="startCase(match.category)"
          />

          <!-- if name of match is + separated list of phenotype ids, link to each one separately -->
          <template v-if="match.name.includes(' + ')">
            <template
              v-for="(id, index) of match.name.split(' + ')"
              :key="index"
            >
              <AppLink :to="`/${kebabCase(match.category)}/${id}`">
                {{ id }}
              </AppLink>
              <span v-if="index !== match.name.split(' + ').length - 1">
                +
              </span>
            </template>
          </template>

          <!-- otherwise, just show details as normal -->
          <template v-else>
            <AppLink :to="`/${kebabCase(match.category)}/${match.id}`">
              {{ match.name }}
            </AppLink>
          </template>
        </div>

        <!-- secondary match info -->
        <div class="secondary">
          <span>{{ match.id }}</span>
          <span v-if="match.taxon">&nbsp; | &nbsp;{{ match.taxon }}</span>
        </div>
      </AppFlex>
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

  <!-- phenogrid results -->
  <template v-if="results.matches.length">
    <strong>Phenotype Similarity Comparison</strong>
    <div id="phenogrid"></div>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { startCase, kebabCase, isEqual } from "lodash";
import { getData } from "@/router";
import AppSelectTags from "@/components/AppSelectTags.vue";
import AppSelectSingle from "@/components/AppSelectSingle.vue";
import AppRing from "@/components/AppRing.vue";
import {
  compareSetToTaxon,
  compareSetToSet,
  getPhenotypes,
  CompareResult,
  getTaxonIdFromName,
  getTaxonScientificFromName,
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
  { id: "phenotypes from all genes of ..." },
  { id: "phenotypes from all human diseases" },
  { id: "these phenotypes ..." },
];
const bTaxonOptions = [
  { id: "mouse" },
  { id: "zebrafish" },
  { id: "fruitfly" },
  { id: "nematode" },
  { id: "frog" },
];

const exampleAPhenotypes = [
  { id: "HP:0004970" },
  { id: "HP:0004933" },
  { id: "HP:0004927" },
];

const exampleBPhenotypes = [
  { id: "HP:0004872" },
  { id: "HP:0012499" },
  { id: "HP:0002650" },
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
      results: { matches: [] } as CompareResult,
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
        if (this.bMode.id.includes("these phenotypes"))
          this.results = await compareSetToSet(
            this.aPhenotypes.map(({ id }) => id),
            this.bPhenotypes.map(({ id }) => id)
          );
        else
          this.results = await compareSetToTaxon(
            this.aPhenotypes.map(({ id }) => id),
            this.bMode.id.includes("diseases") ? "human" : this.bTaxon.id
          );

        // run phenogrid, attach to div container
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
      const mode = this.bMode.id.includes("these phenotypes")
        ? "compare"
        : "search";

      // use first group of phenotypes for y axis
      const yAxis = this.aPhenotypes;

      // use second taxon id or group of phenotypes as x axis
      let xAxis = [];
      if (mode === "compare") xAxis = this.bPhenotypes;
      else {
        const taxon = this.bMode.id.includes("diseases")
          ? "human"
          : this.bTaxon.id;
        xAxis = [
          {
            id: getTaxonIdFromName(taxon),
            name: getTaxonScientificFromName(taxon),
          },
        ];
      }
      // call phenogrid
      mountPhenogrid("#phenogrid", xAxis, yAxis, mode);
    },
    // clear/reset results
    clearResults() {
      this.results = { matches: [] };
    },
    // get description to show below phenotypes select box
    description(phenotypes: Options, generatedFrom: GeneratedFrom): string {
      const description = [];

      // number of phenotypes
      description.push(`${phenotypes.length} selected`);

      // to avoid misleading text, only show if lists match exactly
      if (isEqual(generatedFrom.options, phenotypes))
        description.push(
          `generated from "${
            generatedFrom.option?.name || generatedFrom.option?.id
          }"`
        );
      return `(${description.join(", ")})`;
    },
    getPhenotypes,
    startCase,
    kebabCase,
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
    const phenotypes = getData() as Options;
    if (phenotypes) {
      this.aPhenotypes = phenotypes;
      this.aGeneratedFrom = {
        option: { id: "text annotator" },
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
  align-items: center;
  width: 100%;
  gap: 40px;
}

.details {
  flex-grow: 1;

  svg {
    margin-right: 10px;
    vertical-align: middle;
  }
}

.secondary {
  color: $gray;
}

@media (max-width: 600px) {
  .match {
    flex-direction: column;
    gap: 20px;
    margin: 10px 0;
  }
}

#phenogrid {
  width: 100%;
}
</style>
