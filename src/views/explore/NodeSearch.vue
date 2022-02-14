<template>
  <AppInput
    ref="searchBox"
    placeholder="Search for a gene, disease, phenotype, etc."
    icon="search"
    v-model="search"
    @submit="onSubmit"
  />
</template>
<script lang="ts">
import { debounce } from "lodash";
import { defineComponent, nextTick } from "vue";
import AppInput from "../../components/AppInput.vue";

// navigate to explore page and push new history entry
const pushAndNav = function (this: InstanceType<typeof NodeSearch>) {
  // only navigate if something has been searched
  // (needed for when user clicks home page link from explore page with search)
  if (this.search)
    this.$router.push({
      name: "Explore",
      // keep already-typed-in search value "invisibly" (not in url)
      params: { search: this.search || undefined },
      hash: this.$route.hash,
    });
};

// push permanent history entry
const push = function (this: InstanceType<typeof NodeSearch>) {
  this.$router.push({
    name: this.$route.name || "",
    query: { search: this.search || undefined },
    hash: this.$route.hash,
  });
  // vue router will not push if already on desired url to avoid duplicate
  // history entries
};

// debounced version of push
const debouncedPush = debounce(push, 1000);

// node search explore mode
const NodeSearch = defineComponent({
  components: {
    AppInput,
  },
  data() {
    return {
      // current search text
      search: this.getSearch(),
    };
  },
  watch: {
    // when search text changes
    search() {
      // update route
      if (this.$route.name === "Home") pushAndNav.call(this);
      else debouncedPush.call(this);
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
      // because onchange fires for some reason right before it is unmounted,
      // wait one tick, check if input still in dom, then push
      nextTick(() => {
        if (document.contains(event.target as Node)) push.call(this);
      });
    },
  },
  mounted() {
    // if already-typed-in search text passed to route, focus search box on
    // page load so user can continue typing
    if (this.$route.params.search)
      (this.$refs.searchBox as typeof AppInput).focus();
  },
});

export default NodeSearch;
</script>
