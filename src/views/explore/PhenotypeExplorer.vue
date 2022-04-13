<!--
  phenotype explorer tab on explore page

  compare sets of phenotypes and genes/diseases
-->

<template>
  <!-- description -->
  <template v-if="$route.name !== 'Home'">
    <p>
      Construct two sets of phenotypes and see various comparisons between them.
      You can use this to find phenotypically similar diseases or genes in a
      variety of organisms and visualize their overlap.
    </p>

    <hr />
  </template>

  <strong>Compare these phenotypes ...</strong>

  <!-- set A -->
  <AppSelectTags
    v-model="aPhenotypes"
    name="First set of phenotypes"
    :options="getPhenotypes"
    placeholder="Select phenotypes"
    :tooltip="multiTooltip"
    :description="description(aPhenotypes, aGeneratedFrom)"
    @get-options="(option, length) => getOptions(option, length, 'a')"
  />

  <!-- set B -->
  <AppFlex gap="small">
    <strong>... to</strong>
    <AppSelectSingle
      v-model="bMode"
      name="Second set mode"
      :options="bModeOptions"
    />
    <AppSelectSingle
      v-if="bMode.id.includes('genes')"
      v-model="bTaxon"
      name="Second set taxon"
      :options="bTaxonOptions"
    />
  </AppFlex>

  <AppSelectTags
    v-if="bMode.id.includes('these phenotypes')"
    v-model="bPhenotypes"
    name="Second set of phenotypes"
    :options="getPhenotypes"
    placeholder="Select phenotypes"
    :tooltip="multiTooltip"
    :description="description(bPhenotypes, bGeneratedFrom)"
    @get-options="(option, options) => getOptions(option, options, 'b')"
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
      v-for="(match, matchIndex) in results.matches.slice(0, 10)"
      :key="matchIndex"
      class="match"
    >
      <!-- ring score -->
      <AppRing
        v-tippy="'Similarity score'"
        :score="match.score"
        :min="results.minScore"
        :max="results.maxScore"
      />

      <AppFlex direction="col" h-align="stretch" gap="small" class="details">
        <!-- primary match info -->
        <div class="primary truncate">
          <AppIcon
            v-tippy="startCase(match.category)"
            :icon="`category-${match.category}`"
          />

          <!-- if name of match is + separated list of phenotype ids, link to each one separately -->
          <template v-if="match.name.includes(' + ')">
            <template
              v-for="(id, idIndex) of match.name.split(' + ')"
              :key="idIndex"
            >
              <AppLink :to="`/${kebabCase(match.category)}/${id}`">
                {{ id }}
              </AppLink>
              <span v-if="idIndex !== match.name.split(' + ').length - 1">
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
        <div class="secondary truncate">
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

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
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
import { snackbar } from "@/components/TheSnackbar";
import { mountPhenogrid } from "@/api/phenogrid";

// common tooltip explaining how to use multi-select component
const multiTooltip = `In this box, you can select phenotypes in 3 ways:<br>
  <ol>
    <li>Search for individual phenotypes</li>
    <li>Search for genes/diseases and get their associated phenotypes</li>
    <li>Paste comma-separated phenotype IDs</li>
  </ol>`;

// options for mode of second set
const bModeOptions = [
  { id: "phenotypes from all genes of ..." },
  { id: "phenotypes from all human diseases" },
  { id: "these phenotypes ..." },
];

// taxon options for second set
const bTaxonOptions = [
  { id: "mouse" },
  { id: "zebrafish" },
  { id: "fruitfly" },
  { id: "nematode" },
  { id: "frog" },
];

// example data
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

// first set of phenotypes
const aPhenotypes = ref([] as Options);
// "generated from" helpers after selecting gene or disease
const aGeneratedFrom = ref({} as GeneratedFrom);
// selected mode of second set
const bMode = ref(bModeOptions[0]);
// selected taxon for second set
const bTaxon = ref(bTaxonOptions[0]);
// second set of phenotypes
const bPhenotypes = ref([] as Options);
// "generated from" helpers after selecting gene or disease
const bGeneratedFrom = ref({} as GeneratedFrom);
// status of analysis
const status = ref(null as Status | null);
// analysis results
const results = ref({ matches: [] } as CompareResult);

// example phenotype set comparison
function doExample() {
  aPhenotypes.value = exampleAPhenotypes;
  bPhenotypes.value = exampleBPhenotypes;
  bMode.value = bModeOptions[2];
}

// run comparison analysis
async function runAnalysis() {
  // loading...
  status.value = { code: "loading", text: "Analyzing phenotypes" };
  results.value = { matches: [] };

  try {
    // run appropriate analysis based on selected mode
    if (bMode.value.id.includes("these phenotypes"))
      results.value = await compareSetToSet(
        aPhenotypes.value.map(({ id }) => id),
        bPhenotypes.value.map(({ id }) => id)
      );
    else
      results.value = await compareSetToTaxon(
        aPhenotypes.value.map(({ id }) => id),
        bMode.value.id.includes("diseases") ? "human" : bTaxon.value.id
      );

    // run phenogrid, attach to div container
    runPhenogrid();

    // clear status
    status.value = null;
  } catch (error) {
    // error...
    status.value = error as ApiError;
    results.value = { matches: [] };
  }
}

// when multi select component runs get options function
function getOptions(option: Option, options: Options, set: string) {
  // notify
  if (options.length === 0) snackbar("No associated phenotypes found");
  else snackbar(`Selected ${options.length} phenotypes`);

  // set "generated from" helpers
  if (set === "a") aGeneratedFrom.value = { option, options };
  else if (set === "b") bGeneratedFrom.value = { option, options };
}

// show phenogrid results
function runPhenogrid() {
  // which biolink /sim endpoint to use
  const mode = bMode.value.id.includes("these phenotypes")
    ? "compare"
    : "search";

  // use first group of phenotypes for y axis
  const yAxis = aPhenotypes.value;

  // use second taxon id or group of phenotypes as x axis
  let xAxis = [];
  if (mode === "compare") xAxis = bPhenotypes.value;
  else {
    const taxon = bMode.value.id.includes("diseases")
      ? "human"
      : bTaxon.value.id;
    xAxis = [
      {
        id: getTaxonIdFromName(taxon),
        name: getTaxonScientificFromName(taxon),
      },
    ];
  }
  // call phenogrid
  mountPhenogrid("#phenogrid", xAxis, yAxis, mode);
}

// clear/reset results
function clearResults() {
  results.value = { matches: [] };
}

// get description to show below phenotypes select box
function description(
  phenotypes: Options,
  generatedFrom: GeneratedFrom
): string {
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
}

// clear results when inputs are changed to avoid de-sync
watch([aPhenotypes, bMode, bTaxon, bPhenotypes], clearResults, { deep: true });

// fill in phenotype ids from text annotator
onMounted(() => {
  const phenotypes = getData() as Options;
  if (phenotypes) {
    aPhenotypes.value = phenotypes;
    aGeneratedFrom.value = {
      option: { id: "text annotator" },
      options: phenotypes,
    };
  }
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
  width: 0;
  text-align: left;

  svg {
    margin-right: 10px;
    vertical-align: middle;
  }
}
.primary {
  text-align: left;
}

.secondary {
  color: $gray;
  text-align: left;
}

@media (max-width: 600px) {
  .match {
    flex-direction: column;
    gap: 20px;
    margin: 10px 0;
  }

  .details {
    width: 100%;
  }
}

#phenogrid {
  width: 100%;
}
</style>
