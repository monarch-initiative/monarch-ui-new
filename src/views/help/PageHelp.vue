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
    <AppStatus v-if="isLoading" code="loading">Loading checks</AppStatus>
    <AppStatus v-if="isError" code="error">Error loading checks</AppStatus>

    <!-- indiviual statuses -->
    <AppGallery size="small">
      <AppStatus
        v-for="(uptime, index) in uptimes"
        :key="index"
        class="status"
        :code="uptime.code"
        :link="uptime.link"
        >{{ uptime.text }}</AppStatus
      >
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
import { onMounted } from "vue";
import { getUptimes } from "@/api/uptime";
import AppStatus from "@/components/AppStatus.vue";
import { useQuery } from "@/util/composables";

/** list of status checks to display */
const { query, data: uptimes, isLoading, isError } = useQuery(getUptimes, []);

onMounted(query);
</script>

<style lang="scss" scoped>
.status {
  justify-content: flex-start;
  gap: 10px;
  padding: 0;
}
</style>
