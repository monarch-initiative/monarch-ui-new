<template>
  <!-- main links -->
  <AppSection>
    <h1>Help</h1>
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

  <!-- docs -->
  <AppSection>
    <h2 v-heading>How to use Monarch</h2>
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

  <!-- api statuses -->
  <AppSection>
    <AppStatus
      v-for="(check, index) in checks"
      :key="index"
      :url="check.url"
      :text="check.text"
      @error="this.error = true"
    />
    <p class="center" v-if="error">
      We’re aware of a problem and working to resolve the issue as fast as we
      can
    </p>
    <AppButton
      to="https://status.monarchinitiative.org/"
      text="More Details"
      icon="arrow-right"
    />
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

// dummy status checks. include one failure.
const checks = [
  { url: "https://monarchinitiative.org/", text: "BioLink API" },
  { url: "https://monarchinitiative.org/", text: "BioLink API" },
  { url: "https://monarchinitiative.org/", text: "BioLink API" },
  { url: "https://google.org/", text: "BioLink API" },
];

export default defineComponent({
  data() {
    return {
      // list of status checks to perform
      checks,
      // whether an error has occurred in one of the checks
      error: false,
    };
  },
});
</script>
