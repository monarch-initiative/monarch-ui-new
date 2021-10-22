<template>
  <!-- main links -->
  <AppSection>
    <AppHeading>Help</AppHeading>
    <AppTile
      icon="comment"
      title="Feedback Form"
      subtitle="Request a feature, report a bug, etc."
    />
    <AppTile
      icon="hands-helping"
      title="Help Desk"
      subtitle="A central place for users to talk with us"
    />
    <p>
      If you have a GitHub account, know the relevant respository, and have a
      specific feature request or bug report, you can also directly
      <AppLink to="https://github.com/monarch-initiative"
        >create an issue on GitHub</AppLink
      >. If you’re not sure, please use the methods above; we’ll funnel your
      request to the appropriate place from there.
    </p>
  </AppSection>

  <!-- api and service statuses -->
  <AppSection>
    <AppHeading>Statuses</AppHeading>
    <p v-if="loading" class="center">
      <AppStatus code="loading" text="Loading service statuses" />
    </p>
    <p v-else-if="error" class="center">
      <AppStatus code="warning" :text="error" />
    </p>
    <div v-else class="statuses">
      <AppStatus
        v-for="(status, index) in statuses"
        :key="index"
        :code="status.code"
        :text="status.text"
        :link="status.link"
        design="big"
      />
    </div>
    <AppButton
      to="https://stats.uptimerobot.com/XPRo9s4BJ5"
      text="More Details"
      icon="arrow-right"
    />
  </AppSection>

  <!-- docs -->
  <AppSection>
    <AppHeading>How to use Monarch</AppHeading>
    <AppGallery>
      <AppPlaceholder />
      <AppPlaceholder />
      <AppPlaceholder />
      <AppPlaceholder />
      <AppPlaceholder />
      <AppPlaceholder />
    </AppGallery>
    <AppButton to="/tools" text="API and Tools" icon="tools" />
    <AppButton to="/sources" text="Ontologies and Datasets" icon="database" />
  </AppSection>

  <!-- last resort contact methods -->
  <AppSection>
    <p class="center">
      If you still need help, or for general inquires, you can
      <AppLink to="mailto:info@monarchinitiative.org">email us</AppLink> or
      <AppLink to="https://twitter.com/MonarchInit">tweet us</AppLink>
    </p>
  </AppSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getStatuses } from "@/api/uptime";
import { Status } from "@/types/status";

export default defineComponent({
  data() {
    return {
      // list of status checks to display
      statuses: [] as Array<Status>,
      // whether we're still loading statuses
      loading: true,
      // whether an error has occurred trying to query uptimerobot
      error: "",
    };
  },
  async mounted() {
    // get statuses from uptimerobot api
    try {
      this.statuses = await getStatuses();
    } catch (error) {
      this.error = (error as Error).message;
    }
    this.loading = false;
  },
});
</script>

<style lang="scss" scoped>
.statuses {
  display: grid;
  grid-template-columns: repeat(auto-fit, 100px);
  grid-template-rows: repeat(auto-fit, 80px);
  gap: 30px;
  justify-content: center;
  align-items: flex-start;
  justify-items: center;
  margin: 40px 0;
}
</style>
