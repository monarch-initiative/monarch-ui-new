<template>
  <!-- overview -->
  <p>
    Request a feature, report a bug, or chat with us about Monarch. Need help?
    View our <AppLink to="/help">help page</AppLink> for detailed documentation
    and FAQs.
  </p>
  <p>
    Submitting this form starts a discussion on our
    <AppLink to="https://github.com/monarch-initiative/helpdesk"
      >help desk</AppLink
    >
    with all of the information here. You'll get a link to the discussion once
    it's created.
  </p>

  <!-- form -->
  <form>
    <!-- fields for user to fill out -->
    <div class="fields">
      <AppInput title="Name" description="So we can address you" />
      <AppInput title="Email" description="So we can follow up with you" />
      <AppInput title="GitHub username" description="So we can tag you" />
      <AppInput
        class="feedback"
        title="Feedback"
        description="Give as many details as possible! Some info (below) included automatically."
        :required="true"
        :multi="true"
      />
    </div>

    <!-- auto-submitted details -->
    <div class="details">
      <template v-for="(value, key) in details" :key="key">
        <span>{{ key }}</span>
        <span>{{ value }}</span>
      </template>
    </div>

    <!-- finish up -->
    <AppButton text="Submit" icon="paper-plane" />
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import parser from "ua-parser-js";
import AppInput from "@/components/AppInput.vue";

export default defineComponent({
  components: {
    AppInput,
  },
  data() {
    return {
      details: {},
    };
  },
  mounted() {
    // get browser/device/os/etc details from ua parser  library
    const { browser, device, os, engine, cpu } = parser();

    // make map of desired properties in desired stringified format
    this.details = {
      Page: this.$route.fullPath,
      Browser: `${browser.name || ""} ${browser.version || ""}`,
      Device: `${device.vendor || ""} ${device.model || ""} (${
        device.type || ""
      })`,
      OS: `${os.name || ""} ${os.version || ""} (${cpu.architecture || ""})`,
      Engine: `${engine.name || ""} ${engine.version || ""}`,
    };
  },
});
</script>

<style lang="scss" scoped>
form {
  margin-top: 40px;
}

.fields {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 40px;
}

.feedback {
  grid-column: 1 / span 3;
}

@media (max-width: 600px) {
  .fields {
    grid-template-columns: 1fr;
  }

  .feedback {
    grid-column: unset;
  }
}

.details {
  display: grid;
  grid-template-columns: 0.5fr 1fr 0.5fr 1fr;
  gap: 10px;
  justify-items: flex-start;
  margin: 30px 0;
  color: $dark-gray;
  text-align: left;

  & > *:nth-child(odd) {
    font-weight: 500;
  }
}
</style>
