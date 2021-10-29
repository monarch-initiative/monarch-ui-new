<template>
  <!-- main links -->
  <AppSection>
    <AppHeading>Help</AppHeading>
    <p class="center">
      Request a feature, report a bug, or chat with us about anything
      Monarch-related.
    </p>
    <AppTile
      icon="comment"
      title="Feedback Form"
      subtitle="Right here, no account required"
      to="/feedback"
    />
    <AppTile
      icon="comments"
      title="Help Desk"
      subtitle="If you have a GitHub account"
      to="https://github.com/monarch-initiative/helpdesk"
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

  <!-- api and service statuses -->
  <AppSection>
    <AppHeading>Status</AppHeading>
    <p v-if="loading" class="center">
      <AppStatus code="loading" text="Loading service statuses" />
    </p>
    <p v-else-if="error" class="center">
      <AppStatus code="warning" :text="error" />
    </p>
    <AppGallery v-else class="status">
      <AppStatus
        v-for="(status, index) in statuses"
        :key="index"
        :code="status.code"
        :text="status.text"
        :link="status.link"
      />
    </AppGallery>
    <AppButton
      to="https://stats.uptimerobot.com/XPRo9s4BJ5"
      text="More Details"
      icon="arrow-right"
    />
  </AppSection>

  <!-- last resort contact methods -->
  <AppSection>
    <p class="center">
      If you still need help, or for general inquires, you can
      <AppLink to="mailto:info@monarchinitiative.org">email us</AppLink> or
      <AppLink to="https://twitter.com/MonarchInit">tweet us</AppLink>.
    </p>
  </AppSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getStatuses } from "@/api/uptime";
import { Status } from "@/types/status";
import AppStatus from "@/components/AppStatus.vue";

export default defineComponent({
  components: {
    AppStatus,
  },
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
.status {
  justify-items: flex-start;
  gap: 20px !important;
}
</style>
