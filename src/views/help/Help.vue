<template>
  <!-- main links -->
  <AppSection>
    <AppHeading>Help</AppHeading>
    <p>
      Request a feature, report a bug, or chat with us about anything
      Monarch-related.
    </p>
    <AppFlex gap="big">
      <AppTile
        icon="comment"
        title="Feedback Form"
        subtitle="Right here, no account required, one-way"
        to="/feedback"
      />
      <AppTile
        icon="comments"
        title="Help Desk"
        subtitle="On GitHub, requires account, two-way"
        to="https://github.com/monarch-initiative/helpdesk"
      />
    </AppFlex>
  </AppSection>

  <!-- tutorials/faqs -->
  <AppSection>
    <AppHeading>How to use this website</AppHeading>
    <AppGallery>
      <AppPlaceholder />
      <AppPlaceholder />
      <AppPlaceholder />
      <AppPlaceholder />
      <AppPlaceholder />
      <AppPlaceholder />
    </AppGallery>
  </AppSection>

  <!-- api and service statuses -->
  <AppSection>
    <AppHeading>Status</AppHeading>
    <!-- main status of all checks -->
    <p v-if="status">
      <AppStatus :status="status" />
    </p>
    <!-- indiviual statuses -->
    <AppGallery v-else size="small">
      <AppStatus
        v-for="(status, index) in statuses"
        :key="index"
        :status="status"
        design="plain"
      />
    </AppGallery>
    <!-- link to uptime bot site for full details -->
    <AppButton
      to="https://stats.uptimerobot.com/XPRo9s4BJ5"
      text="More Details"
      icon="arrow-right"
    />
  </AppSection>

  <!-- last resort contact methods -->
  <AppSection>
    <p>
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

// help landing page
export default defineComponent({
  components: {
    AppStatus,
  },
  data() {
    return {
      // list of status checks to display
      statuses: [] as Array<Status>,
      // overall status of query
      status: null as Status | null,
    };
  },
  async mounted() {
    // get statuses from uptimerobot api
    this.status = {
      code: "loading",
      text: "Loading service statuses",
    };
    try {
      this.statuses = await getStatuses();
      this.status = null;
    } catch (error) {
      this.status = { code: "error", text: (error as Error).message };
    }
  },
});
</script>
