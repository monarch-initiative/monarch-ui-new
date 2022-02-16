<template>
  <AppInput
    ref="searchBox"
    placeholder="Search for a gene, disease, phenotype, etc."
    icon="search"
    v-model="search"
    @submit="onSubmit"
  />

  <!-- filters -->
  <AppFlex>
    <AppSelectMulti
      v-for="(filter, name, index) in availableFilters"
      :key="index"
      :name="name"
      :options="availableFilters[name]"
      v-model="activeFilters[name]"
    />
  </AppFlex>

  <!-- status -->
  <AppStatus v-if="status" ref="status" :status="status" />

  <!-- results -->
  <AppFlex
    v-for="(result, index) in results.slice(0, cutoff)"
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

  <!-- show more button -->
  <AppButton
    v-if="cutoff < results.length"
    design="small"
    icon="angle-down"
    text="Show More"
    @click="cutoff += 10"
  />
</template>

<script lang="ts">
import { defineComponent, nextTick } from "vue";
import { debounce, kebabCase, capitalize } from "lodash";
import AppInput from "@/components/AppInput.vue";
import AppStatus from "@/components/AppStatus.vue";
import { ApiError } from "@/api";
import { getNodeSearchResults, Result } from "@/api/node-search";
import { Status } from "@/components/AppStatus";
import AppSelectMulti from "@/components/AppSelectMulti.vue";
import { Options } from "@/components/AppSelectMulti";
import { syncLog } from "@/util/debug";

// push permanent history entry
const pushHistory = function (
  this: InstanceType<typeof NodeSearch>,
  route?: string
) {
  // cancel any pending debounced calls
  debouncedPushHistory.cancel();

  // get push props
  const name = route || this.$route.name || "";
  // if force nav'ing, keep already-typed-in search value "invisibly" (not in url)
  const props = {
    [route ? "params" : "query"]: { search: this.search },
  };
  const hash = this.$route.hash;

  // only force nav if something has been searched
  // (needed for when user clicks home page link from explore page with search)
  if (route && !this.search) return;

  // push history entry to router
  this.$router.push({ name, ...props, hash });
};

// debounced version of push history
const debouncedPushHistory = debounce(pushHistory, 1000);

// get search results
const getResults = async function (this: InstanceType<typeof NodeSearch>) {
  debouncedGetResults.cancel();

  // loading...
  this.status = { code: "loading", text: "Loading results" };

  try {
    // get results from api
    const { results, facets } = await getNodeSearchResults(this.search, {
      category: this.categories,
      taxon: this.taxons,
    });
    this.results = results;

    // update filters based on facets from api
    this.availableFilters = { ...facets };
    this.activeFilters = { ...facets };

    // reset cutoff
    this.cutoff = 10;

    // clear status
    this.status = null;
  } catch (error) {
    // error...
    this.status = error as ApiError;
    this.results = [];
  }
};

// debounced version of push
const debouncedGetResults = debounce(getResults, 1000);

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
      search: this.getSearch(),
      // search results
      results: [] as Result["results"],
      // status of query
      status: null as Status | null,
      // filters (facets) for search
      availableFilters: {} as Record<string, Options>,
      activeFilters: {} as Record<string, Options>,
      // how many results to display
      cutoff: 10,
    };
  },
  watch: {
    // when search text changes
    search() {
      // update route
      if (this.$route.name === "Home") pushHistory.call(this, "Explore");
      else debouncedPushHistory.call(this);

      // update search results
      debouncedGetResults.call(this);
    },
    // when route changes
    $route() {
      // update search text from url
      this.search = this.getSearch();
    },
    // when filters change
    categories() {
      debouncedGetResults.call(this);
    },
    taxons() {
      debouncedGetResults.call(this);
    },
  },
  computed: {
    categories(): string {
      syncLog(this.activeFilters.category);
      return (this.activeFilters.category || [])
        .map(({ value }) => value)
        .filter((value) => value)
        .sort()
        .join(",");
    },
    taxons(): string {
      syncLog(this.activeFilters.taxon_label);
      return (this.activeFilters.taxon_label || [])
        .map(({ value }) => value)
        .filter((value) => value)
        .sort()
        .join(",");
    },
  },
  methods: {
    // get search text from route params (invisible) or query (url params)
    getSearch() {
      return String(
        this.$route.params.search || this.$route.query.search || ""
      );
    },
    // "instant" submit
    onSubmit(event: Event) {
      // https://bugs.chromium.org/p/chromium/issues/detail?id=1297334#c4
      nextTick(() => {
        if (document.contains(event.target as Node)) pushHistory.call(this);
        getResults.call(this);
      });
    },
    kebabCase,
    capitalize,
  },
  mounted() {
    // if already-typed-in search text passed to route, focus search box on
    // page load so user can continue typing
    if (this.$route.params.search)
      (this.$refs.searchBox as typeof AppInput).focus();

    // search on page load
    debouncedGetResults.call(this);
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
