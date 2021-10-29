<template>
  <!-- overview -->
  <p class="center">
    Request a feature, report a bug, or chat with us about anything
    Monarch-related.
  </p>

  <!-- form -->
  <form @submit="onSubmit">
    <!-- fields for user to fill out -->
    <div class="fields">
      <AppInput
        title="Name"
        description="So we can address you"
        placeholder="Jane Smith"
        v-model="name"
      />
      <AppInput
        title="Email"
        description="So we can follow up with you"
        placeholder="jane.smith@gmail.com"
        type="email"
        v-model="email"
      />
      <AppInput
        title="GitHub username"
        description="So we can tag you"
        placeholder="@janesmith"
        v-model="github"
      />
      <AppInput
        class="feedback"
        title="Feedback"
        description="Give as many details as possible"
        placeholder=""
        :required="true"
        :multi="true"
        v-model="feedback"
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
    <p>
      Submitting this form starts a <strong>public</strong> discussion on our
      <AppLink to="https://github.com/monarch-initiative/helpdesk"
        >help desk</AppLink
      >
      on GitHub with <em>all of the information above</em>. You'll get a link to
      the discussion once it's created.
    </p>
    <AppButton text="Submit" icon="paper-plane" type="submit" />
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import parser from "ua-parser-js";
import AppInput from "@/components/AppInput.vue";
import { truncate, collapse } from "@/util/string";

export default defineComponent({
  components: {
    AppInput,
  },
  data() {
    return {
      // user's name
      name: "",
      // user's email
      email: "",
      // user's github name
      github: "",
      // user's freeform feedback
      feedback: "",
      // list of automatic details to record
      details: {},
    };
  },
  mounted() {
    // get browser/device/os/etc details from ua parser  library
    const { browser, device, os, engine, cpu } = parser();

    // filter and join strings together
    const concat = (...array: Array<string | undefined>) =>
      array.filter((e) => e && e !== "()").join(" ");

    // make map of desired properties in desired stringified format
    this.details = {
      Page: this.$route.fullPath,
      Browser: concat(browser.name, browser.version),
      Device: concat(device.vendor, device.model, device.type),
      OS: concat(os.name, os.version, cpu.architecture),
      Engine: concat(engine.name, engine.version),
    };
  },
  methods: {
    onSubmit(event: Event) {
      // prevent default post and navigation from form submission
      event.preventDefault();

      // only proceed if submitted through button, not "implicitly" (enter press)
      const active = document.activeElement;
      if (active && active.getAttribute("type") !== "submit") return;

      // (lightly) sanitize inputs
      this.github = "@" + this.github.replaceAll("@", "");

      // make issue title (unclear what char limit is?)
      const title = [
        "Feedback form",
        truncate(this.name, 20),
        truncate(collapse(this.feedback), 60),
      ].join(" - ");

      // make issue body markdown
      const body = [
        "**Name**",
        this.name,
        "",
        "**Email**",
        this.email,
        "",
        "**GitHub Username**",
        this.github,
        "",
        "",
        this.feedback,
      ].join("\n");

      console.log(title);
      console.log(body);
    },
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
  margin: 50px 0;
  color: $dark-gray;
  text-align: left;

  & > *:nth-child(odd) {
    font-weight: 600;
  }
}
</style>
