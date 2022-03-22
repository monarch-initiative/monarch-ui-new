<template>
  <!-- status -->
  <template v-if="status">
    <AppHeading>Node</AppHeading>
    <AppStatus :status="status" />
  </template>

  <!-- results -->
  <template v-else>
    <AppSection design="fill">
      <AppFlex dir="column" size="small">
        <AppHeading>
          <AppIcon
            :icon="`category-${kebabCase(node.category || '')}`"
            fallback="category-unknown"
            class="type"
            v-tippy="startCase(node.category || 'unknown')"
          />
          <span>
            {{ node.name }}
          </span>
        </AppHeading>
        <AppFlex>
          <AppButton
            design="small"
            color="secondary"
            icon="puzzle-piece"
            :text="node.category"
          />
          <AppButton
            design="small"
            color="secondary"
            icon="hashtag"
            :text="node.id"
            :copy="true"
            v-tippy="'Node ID. Click to copy.'"
          />
        </AppFlex>
      </AppFlex>
    </AppSection>

    <AppSection>Hello World</AppSection>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { kebabCase, startCase } from "lodash";
import { lookupNode, Result } from "@/api/node-lookup";
import { Status } from "@/components/AppStatus";
import { ApiError } from "@/api";
import AppStatus from "@/components/AppStatus.vue";

export default defineComponent({
  data() {
    return {
      // info/metadata about node
      node: {} as Result,
      // status of query
      status: null as Status | null,
    };
  },
  methods: {
    kebabCase,
    startCase,
  },
  async mounted() {
    try {
      // loading...
      this.status = { code: "loading", text: "Loading results" };
      // get results
      this.node = await lookupNode(
        this.$route.params.id as string,
        this.$route.params.category as string
      );
      // clear status
      this.status = null;
    } catch (error) {
      // error...
      this.status = error as ApiError;
    }
  },
  components: { AppStatus },
});
</script>

<style lang="scss" scoped>
section:first-child {
  div,
  span,
  button {
    color: $off-black !important;
  }
}

h1 {
  font-size: 1.2rem;

  svg {
    position: relative;
    top: -2px;
    margin-right: 20px;
    color: $theme-dark;
    vertical-align: middle;
  }
}
</style>
