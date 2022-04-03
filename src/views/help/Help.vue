<!--
  help landing page
-->

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
    <AppStatus v-if="status" :status="status" />

    <!-- indiviual statuses -->
    <AppGallery v-else size="small">
      <AppStatus
        class="status"
        v-for="(uptime, index) in uptimes"
        :key="index"
        :status="uptime"
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

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getUptimes } from "@/api/uptime";
import { Status } from "@/components/AppStatus";
import AppStatus from "@/components/AppStatus.vue";
import { ApiError } from "@/api";

// list of status checks to display
const uptimes = ref<Array<Status>>([]);
// overall status of query
const status = ref<Status | null>(null);

onMounted(async () => {
  // loading...
  status.value = { code: "loading", text: "Loading service statuses" };

  try {
    // get statuses from uptimerobot api
    uptimes.value = await getUptimes();

    // clear status
    status.value = null;
  } catch (error) {
    // error...
    status.value = error as ApiError;
  }
});
</script>

<style lang="scss" scoped>
.status {
  justify-content: flex-start;
  gap: 10px;
  padding: 0;
}
</style>
