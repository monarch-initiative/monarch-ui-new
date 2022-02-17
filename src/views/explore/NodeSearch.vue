<template>
  <AppInput
    ref="searchBox"
    placeholder="Search for a gene, disease, phenotype, etc."
    icon="search"
    v-model="search"
    @input="onInput"
    @change="onChange"
  />

  <!-- filters -->
  <AppFlex v-if="Object.keys(availableFilters).length">
    <template v-for="(filter, name, index) in availableFilters" :key="index">
      <AppSelectMulti
        v-if="filter.length"
        :name="name"
        :options="availableFilters[name]"
        v-model="activeFilters[name]"
        @change="onFilterChange"
      />
    </template>
  </AppFlex>

  <!-- status -->
  <AppStatus v-if="status" ref="status" :status="status" />

  <!-- results -->
  <AppFlex
    v-for="(result, index) in results"
    :key="index"
    direction="col"
    gap="small"
    class="result"
  >
    <div class="title">
      <AppIcon
        :icon="`category-${kebabCase(result.category || 'unknown')}`"
        v-tooltip="`Category: ${capitalize(result.category || 'unknown')}`"
      />
      <AppLink :to="`/explore/`">
        <span v-html="result.highlight"></span>
      </AppLink>
      <AppButton
        :text="result.id"
        icon="hashtag"
        design="small"
        :copy="true"
        color="secondary"
      />
    </div>
    <p class="truncate-3" tabindex="0">
      {{ result.description || "No description available" }}
    </p>
    <p v-if="result.altNames?.length" class="names truncate-1" tabindex="0">
      {{ result.altNames.join(" &nbsp; ") }}
    </p>
    <p v-if="result.altIds?.length" class="ids truncate-1" tabindex="0">
      {{ result.altIds.join(" &nbsp; ") }}
    </p>
  </AppFlex>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { debounce, kebabCase, capitalize } from "lodash";
import AppInput from "@/components/AppInput.vue";
import AppStatus from "@/components/AppStatus.vue";
import { ApiError } from "@/api";
import { getNodeSearchResults, Result } from "@/api/node-search";
import { Status } from "@/components/AppStatus";
import AppSelectMulti from "@/components/AppSelectMulti.vue";
import { Options } from "@/components/AppSelectMulti";

// get search results
const getResults = async function (
  this: InstanceType<typeof NodeSearch>,
  useFilters: boolean,
  pushHistory: boolean
) {
  // cancel any pending debounced calls
  debouncedGetResults.cancel();

  // push permanent history entry
  if (pushHistory) {
    const query: Record<string, string> = {};
    if (this.search) query.search = this.search;
    this.$router.push({ ...this.$route, name: "Explore", query });
  }

  // loading...
  this.status = { code: "loading", text: "Loading results" };
  this.results = [];

  try {
    // get results from api
    const { results, facets } = await getNodeSearchResults(
      this.search,
      ...(useFilters ? [this.availableFilters, this.activeFilters] : [])
    );
    this.results = results;

    // if search text changed, run query with no filters, and update available
    // filters from facet response

    // update filters based on facets from api
    if (!useFilters) {
      this.availableFilters = { ...facets };
      this.activeFilters = { ...facets };
    }

    // clear status
    this.status = null;
  } catch (error) {
    // error...
    this.status = error as ApiError;
    // clear results and filters
    this.results = [];
    this.availableFilters = {};
    this.activeFilters = {};
  }
};

// debounced version of push
const debouncedGetResults = debounce(getResults, 1000);

// const defaultFilters = {
//   category: [
//     { value: "gene" },
//     { value: "genotype" },
//     { value: "variant" },
//     { value: "phenotype" },
//     { value: "disease" },
//   ],
// };

// node search explore mode
const NodeSearch = defineComponent({
  components: {
    AppInput,
    AppStatus,
    AppSelectMulti,
  },
  data() {
    return {
      // current search text
      search: String(this.$route.query.search || ""),
      // search results
      results: [] as Result["results"],
      // status of query
      status: null as Status | null,
      // filters (facets) for search
      availableFilters: {} as Record<string, Options>,
      activeFilters: {} as Record<string, Options>,
    };
  },
  watch: {
    // when route changes
    $route() {
      // update search text from route (if not already)
      const fromUrl = String(this.$route.query.search || "");
      if (this.search !== fromUrl) {
        this.search = fromUrl;
        getResults.call(this, false, false);
      }
    },
  },
  methods: {
    // when user types in text box
    onInput() {
      debouncedGetResults.call(this, false, true);
    },
    // when user "submits" text box
    onChange() {
      getResults.call(this, false, true);
    },
    // when user changes active filters
    onFilterChange() {
      // update search
      debouncedGetResults.call(this, true, false);
    },
    kebabCase,
    capitalize,
  },
  mounted() {
    // instantly submit
    getResults.call(this, true, false);
  },
});

export default NodeSearch;
</script>

<style lang="scss" scoped>
.result {
  align-items: stretch;
}

.title {
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;

  svg {
    font-size: 2rem;
  }
}

.names,
.ids {
  text-align: left;
  font-size: 0.9rem;
  color: $dark-gray;

  span {
    width: 100%;
  }
}
</style>

<style>
.hilite {
  font-style: normal;
  font-weight: 600;
}
</style>
