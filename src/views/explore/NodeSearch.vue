<template>
  <AppInput
    ref="searchBox"
    placeholder="Search for a gene, disease, phenotype, etc."
    icon="search"
    v-model="search"
    @input="onInput"
    @change="onChange"
    @focus="onFocus"
  />

  <template v-if="!home">
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
          :icon="`category-${kebabCase(result.category)}`"
          class="type"
          v-tooltip="`Category: ${capitalize(result.category)}`"
        />
        <AppLink :to="`/explore/`" class="name">
          <span v-html="result.highlight"></span>
        </AppLink>
        <AppButton
          class="id"
          :text="result.id"
          icon="hashtag"
          design="small"
          :copy="true"
          color="secondary"
          v-tooltip="'Node ID (click to copy)'"
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

    <!-- results nav -->
    <AppFlex v-if="results.length" direction="col">
      <div>
        <b>{{ from + 1 }}</b> to <b>{{ to + 1 }}</b> of
        <b>{{ count }}</b> results
      </div>
      <AppFlex gap="small">
        <button
          v-for="index of pages"
          :key="index"
          @click="page = index"
          class="nav-button"
          :disabled="index === page"
          v-tooltip="`Go to page ${index + 1} of results`"
        >
          {{ index + 1 }}
        </button>
      </AppFlex>
    </AppFlex>
  </template>
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
  // whether to perform "fresh" search, without filters. set to true when
  // search changing, false when filters or page number changing.
  fresh: boolean,
  // whether to push new entry to browser history
  history: boolean
) {
  // cancel any pending debounced calls
  debouncedGetResults.cancel();

  // push permanent history entry
  if (history) {
    const query: Record<string, string> = {};
    if (this.search) query.search = this.search;
    await this.$router.push({ ...this.$route, name: "Explore", query });
  }

  // loading...
  this.status = { code: "loading", text: "Loading results" };
  this.results = [];

  try {
    // get results from api
    const { count, results, facets } = await getNodeSearchResults(
      this.search,
      fresh ? undefined : this.availableFilters,
      fresh ? undefined : this.activeFilters,
      fresh ? undefined : this.from
    );
    this.results = results;
    this.count = count;

    if (fresh) {
      // update filters based on facets from api
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
    if (fresh) {
      this.availableFilters = { ...defaultFilters };
      this.activeFilters = { ...defaultFilters };
    }
  }
};

// debounced version of push
const debouncedGetResults = debounce(getResults, 1000);

const defaultFilters = {
  category: [
    { value: "gene" },
    { value: "disease" },
    { value: "phenotype" },
    { value: "genotype" },
    { value: "variant" },
  ],
};

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
      // number of results
      count: 0,
      // current page number
      page: 0,
      // results per page
      perPage: 10,
      // status of query
      status: null as Status | null,
      // filters (facets) for search
      availableFilters: { ...defaultFilters } as Record<string, Options>,
      activeFilters: { ...defaultFilters } as Record<string, Options>,
    };
  },
  watch: {
    // when route changes
    $route() {
      // update search text from route (if not already)
      const fromUrl = String(this.$route.query.search || "");
      if (this.search !== fromUrl) {
        this.search = fromUrl;
        getResults.call(this, true, false);
      }
    },
    // when start page changes
    from() {
      getResults.call(this, false, false);
    },
  },
  methods: {
    // when user focuses text box
    async onFocus() {
      // navigate to explore page
      await this.$router.push({ ...this.$route, name: "Explore" });
      // refocus box
      document.querySelector("input")?.focus();
    },
    // when user types in text box
    onInput() {
      debouncedGetResults.call(this, true, true);
    },
    // when user "submits" text box
    onChange() {
      this.page = 0;
      getResults.call(this, true, true);
    },
    // when user changes active filters
    onFilterChange() {
      this.page = 0;
      debouncedGetResults.call(this, false, false);
    },
    kebabCase,
    capitalize,
  },
  computed: {
    // is home page
    home(): boolean {
      return String(this.$route.name).toLowerCase() === "home";
    },
    // "x of n" pages
    from(): number {
      return this.page * this.perPage;
    },
    to(): number {
      return this.from + this.results.length - 1;
    },
    // pages of results
    pages(): Array<number> {
      return Array(Math.ceil(this.count / 10))
        .fill(0)
        .map((_, i) => i);
    },
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
}

.type {
  font-size: 2rem;
  flex-shrink: 0;
  flex-grow: 0;
}
.name {
  flex-grow: 1;
}

.id {
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .title {
    flex-direction: column;
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

b {
  font-weight: 600;
}

.nav-button {
  width: 20px;
  height: 30px;
  color: $theme-dark;
  border-radius: $rounded;
  transition: box-shadow $fast;

  &:hover {
    box-shadow: $outline;
  }
}
</style>

<style>
.hilite {
  font-style: normal;
  font-weight: 600;
}
</style>
