<template>
  <!-- heading -->
  <div v-if="modal" class="heading">Feedback Form</div>

  <!-- overview info -->
  <p v-if="!status" class="center">
    Request a feature, report a bug, or chat with us about anything
    Monarch-related.
  </p>

  <!-- form -->
  <form @submit.prevent="onSubmit">
    <!-- fields for user to fill out -->
    <div class="fields">
      <AppInput
        title="Name"
        description="So we can address you"
        placeholder="Jane Smith"
        v-model.trim="name"
      />
      <AppInput
        title="Email"
        description="So we can follow up with you"
        placeholder="jane.smith@gmail.com"
        type="email"
        v-model.trim="email"
      />
      <AppInput
        title="GitHub username"
        description="So we can tag you"
        placeholder="@janesmith"
        v-model.trim="github"
      />
      <AppInput
        class="feedback"
        title="Feedback"
        description="Please give us as many details as possible!"
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
    <p class="center">
      <!-- result status -->
      <AppStatus v-if="status" :status="status">
        <AppLink v-if="link" :to="link"
          >View your submitted feedback here.</AppLink
        >
      </AppStatus>
      <!-- submit button -->
      <AppButton text="Submit" icon="paper-plane" type="submit" />
    </p>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import parser from "ua-parser-js";
import AppInput from "@/components/AppInput.vue";
import { Status } from "@/types/status";
import { truncate, collapse } from "@/util/string";
import { postFeedback } from "@/api/feedback";
import AppStatus from "./AppStatus.vue";

export default defineComponent({
  components: {
    AppInput,
    AppStatus,
  },
  props: {
    // whether form is in a modal
    modal: Boolean,
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
      // result of submitting form
      status: null as Status | null,
      // link to created issue
      link: "",
    };
  },
  computed: {
    // list of automatic details to record
    details() {
      // get browser/device/os/etc details from ua parser  library
      const { browser, device, os, engine, cpu } = parser();

      // filter and join strings together
      const concat = (...array: Array<string | undefined>) =>
        array.filter((e) => e && e !== "()").join(" ");

      // make map of desired properties in desired stringified format
      return {
        Page: this.$route.fullPath,
        Browser: concat(browser.name, browser.version),
        Device: concat(device.vendor, device.model, device.type),
        OS: concat(os.name, os.version, cpu.architecture),
        Engine: concat(engine.name, engine.version),
      };
    },
  },
  persist: {
    keys: ["name", "email", "github", "feedback"],
    namespace: "feedback-form",
  },
  methods: {
    async onSubmit() {
      // only proceed if submitted through button, not "implicitly" (enter press)
      const active = document.activeElement;
      if (active && active.getAttribute("type") !== "submit") return;

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
        "**Details**",
        ...Object.entries(this.details).map(
          ([key, value]) => `${key}: ${value}`
        ),
        "",
        "",
        this.feedback,
      ].join("\n");

      // loading...
      this.status = {
        code: "loading",
        text: "Submitting feedback",
      };

      try {
        // post feedback and get link of created issue
        this.link = await postFeedback(title, body);

        // success...
        this.status = {
          code: "success",
          text: "Feedback submitted successfully!",
        };

        // clear form data from storage after successful submit
        (this as unknown as { clearPersist: () => void })?.clearPersist();
      } catch (error) {
        // error...
        this.status = { code: "error", text: (error as Error).message };
      }
    },
  },
  mounted() {
    // reset status when reloading form
    this.status = null;
  },
});
</script>

<style lang="scss" scoped>
.heading {
  margin-bottom: 30px;
  font-size: 1.3rem;
  text-align: center;
  font-weight: 600;
}

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

@media (max-width: 700px) {
  .fields {
    grid-template-columns: 1fr;
  }

  .feedback {
    grid-column: unset;
  }
}

.details {
  display: grid;
  grid-template-columns: 100px 1fr 100px 1fr;
  gap: 10px;
  justify-items: flex-start;
  margin: 50px 0;
  color: $dark-gray;
  text-align: left;

  & > *:nth-child(odd) {
    font-weight: 600;
  }

  @media (max-width: 800px) {
    grid-template-columns: 100px 1fr;
  }

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
}
</style>
