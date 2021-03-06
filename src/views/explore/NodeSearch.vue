<!--
  node search tab on explore page

  search for nodes in knowledge graph
-->

<template>
  <AppWrapper tag="AppSection" :wrap="$route.name !== 'Home'">
    <!-- examples -->
    <AppFlex>
      <span>Try:</span>
      <AppButton
        v-for="(text, index) of examples"
        :key="index"
        :text="text"
        design="small"
        @click="doExample(text)"
      />
    </AppFlex>

    <!-- search box -->
    <AppInput
      ref="searchBox"
      :model-value="search"
      placeholder="Search for a gene, disease, phenotype, etc."
      icon="search"
      @change="onChange"
      @focus="onFocus"
    />

    <!-- filters -->
    <AppFlex v-if="Object.keys(availableFilters).length">
      <template v-for="(filter, name, index) in availableFilters" :key="index">
        <AppSelectMulti
          v-if="filter.length"
          v-model="activeFilters[name]"
          v-tippy="`${startCase(name)} filter`"
          :name="`${name}`"
          :options="availableFilters[name]"
          :show-counts="showCounts"
          @change="onFilterChange"
        />
      </template>
    </AppFlex>
  </AppWrapper>

  <AppSection v-if="$route.name !== 'Home'">
    <!-- status -->
    <AppStatus v-if="isLoading" code="loading">Loading results</AppStatus>
    <AppStatus v-else-if="isError" code="error"
      >Error loading results</AppStatus
    >
    <AppStatus v-else-if="!results.results.length" code="warning"
      >No results</AppStatus
    >

    <!-- results -->
    <AppFlex
      v-for="(result, index) in results.results"
      :key="index"
      direction="col"
      gap="small"
      h-align="stretch"
    >
      <div class="title">
        <AppIcon
          v-tippy="startCase(result.category)"
          :icon="`category-${kebabCase(result.category)}`"
          class="type"
        />
        <AppLink
          :to="`/${kebabCase(result.category)}/${result.id}`"
          class="name"
        >
          <span v-html="result.highlight"></span>
        </AppLink>
        <AppButton
          v-tippy="'Node ID (click to copy)'"
          class="id"
          :text="result.id"
          icon="hashtag"
          design="small"
          :copy="true"
          color="secondary"
        />
      </div>
      <p v-tippy="'Click to expand'" class="truncate-3" tabindex="0">
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
    <AppFlex v-if="results.results.length" direction="col">
      <div>
        <strong>{{ from + 1 }}</strong> to <strong>{{ to + 1 }}</strong> of
        <strong>{{ results.count }}</strong> results
      </div>
      <AppFlex gap="small">
        <template v-for="(list, index) of pages" :key="index">
          <button
            v-for="pageNumber of list"
            :key="pageNumber"
            v-tippy="`Go to page ${pageNumber + 1} of results`"
            class="page-button"
            :disabled="pageNumber === page"
            @click="page = pageNumber"
          >
            {{ pageNumber + 1 }}
          </button>
          <span v-if="index !== pages.length - 1">...</span>
        </template>
      </AppFlex>
    </AppFlex>
  </AppSection>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { isEqual, kebabCase, startCase, uniq } from "lodash";
import AppInput from "@/components/AppInput.vue";
import AppStatus from "@/components/AppStatus.vue";
import AppWrapper from "@/components/AppWrapper.vue";
import { getSearchResults, Results } from "@/api/node-search";
import AppSelectMulti from "@/components/AppSelectMulti.vue";
import { Options } from "@/components/AppSelectMulti";
import { useRoute, useRouter } from "vue-router";
import { filtersToQuery } from "@/api/facets";
import { useQuery } from "@/util/composables";

/** route info */
const router = useRouter();
const route = useRoute();

/** example searches */
const examples = ["Marfan Syndrome", "Multicystic Kidney Dysplasia", "SSH"];

/** default filters to show before anything typed in */
/*
const defaultFilters = {
  category: [
    { id: "gene" },
    { id: "disease" },
    { id: "phenotype" },
    { id: "genotype" },
    { id: "variant" },
  ],
};
*/

/** submitted search text */
const search = ref(String(route.query.search || ""));
/** current page number */
const page = ref(0);
/** results per page */
const perPage = ref(10);
/** filters (facets) for search */
const availableFilters = ref<Record<string, Options>>({});
const activeFilters = ref<Record<string, Options>>({});

/** when user focuses text box */
async function onFocus() {
  /** navigate to explore page */
  await router.push({ ...route, name: "Explore" });
  /** refocus box */
  document?.querySelector("input")?.focus();
}

/** when user "submits" text box */
function onChange(value: string) {
  search.value = value;
  page.value = 0;
  getResults(true);
}

/** when user changes active filters */
function onFilterChange() {
  page.value = 0;
  getResults(false);
}

/** enter in clicked example and search */
function doExample(value: string) {
  search.value = value;
  getResults(true);
}

/** get search results */
const {
  query: getResults,
  data: results,
  isLoading,
  isError,
} = useQuery(
  async function (
    /**
     * whether to perform "fresh" search, without filters/pagination/etc. true
     * when search text changes, false when filters/pagination/etc change.
     */
    fresh: boolean
  ): Promise<Results> {
    /** get results from api */
    const response = await getSearchResults(
      search.value,
      fresh ? undefined : filtersToQuery(availableFilters.value),
      fresh ? undefined : filtersToQuery(activeFilters.value),
      fresh ? undefined : from.value
    );

    return response;
  },

  /** default value */
  { count: 0, results: [], facets: {} },

  /** on success */
  (response, [fresh]) => {
    /** update filters from facets returned from api, if a "fresh" search */
    if (fresh) {
      availableFilters.value = { ...response.facets };
      activeFilters.value = { ...response.facets };
    }
  }
);

/** "x of n" pages */
const from = computed((): number => page.value * perPage.value);
const to = computed(
  (): number => from.value + results.value.results.length - 1
);

/** pages of results */
const pages = computed((): Array<Array<number>> => {
  /** get full list of pages */
  const pages = Array(Math.ceil(results.value.count / perPage.value))
    .fill(0)
    .map((_, i) => i);

  /** make shorter pages list */
  let list = [
    /** first few pages */
    0,
    1,
    2,
    /** current few pages */
    page.value - 1,
    page.value,
    page.value + 1,
    /** last few pages */
    pages.length - 3,
    pages.length - 2,
    pages.length - 1,
  ];

  /** sort, deduplicate, and clamp list */
  list.sort((a, b) => a - b);
  list = uniq(list).filter((page) => page >= 0 && page <= pages.length - 1);

  /** split into sub lists where page numbers are not sequential */
  const splitList: Array<Array<number>> = [[]];
  for (let index = 0; index < list.length; index++) {
    if (list[index - 1] && list[index] - list[index - 1] > 1)
      splitList.push([]);
    splitList[splitList.length - 1].push(list[index]);
  }

  return splitList;
});

/** when route changes */
watch(
  () => route,
  () => {
    /** update search text from route (if not already) */
    const fromUrl = String(route.query.search || "");
    if (search.value !== fromUrl) {
      search.value = fromUrl;
      getResults(true);
    }
  }
);

/** when search changes */
watch(search, async () => {
  /** update url */
  const query: Record<string, string> = {};
  if (search.value) query.search = search.value;
  await router.push({ ...route, name: "Explore", query });
});

/** when start page changes */
watch(from, () => getResults(false));

/** hide counts in filter dropdowns if any filtering being done */
const showCounts = computed(() =>
  isEqual(activeFilters.value, availableFilters.value)
);

/** search on page load */
onMounted(() => getResults(true));
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  gap: 15px;
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

.page-button {
  height: 30px;
  padding: 0 3px;
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
