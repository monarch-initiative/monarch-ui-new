<template>
  <AppInput
    ref="searchBox"
    placeholder="Search for a gene, disease, phenotype, etc."
    icon="search"
    v-model="search"
    @submit="onSubmit"
  />

  <!-- status -->
  <AppStatus v-if="status" ref="status" :status="status" />
</template>
<script lang="ts">
import { debounce } from "lodash";
import { defineComponent, nextTick } from "vue";
import AppInput from "../../components/AppInput.vue";
import AppStatus from "../../components/AppStatus.vue";
import { ApiError } from "@/api";
import { getNodeSearchResults, Result } from "@/api/node-search";
import { Status } from "@/components/AppStatus";

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
    this.results = await getNodeSearchResults(this.search);

    // clear status
    this.status = null;
  } catch (error) {
    // error...
    this.status = error as ApiError;
  }
};

// debounced version of push
const debouncedGetResults = debounce(getResults, 1000);

// node search explore mode
const NodeSearch = defineComponent({
  components: {
    AppInput,
    AppStatus,
  },
  data() {
    return {
      // current search text
      search: this.getSearch(),
      // search results
      results: [] as Result,
      // status of query
      status: null as Status | null,
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
