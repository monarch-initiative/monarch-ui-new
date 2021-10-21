<template>
  <component
    :is="link ? 'AppLink' : 'div'"
    :to="link"
    class="status"
    :data-code="code"
    :data-design="design"
  >
    <AppIcon class="icon" :icon="icon" :aria-label="code" />
    <span class="text">{{ text }}</span>
  </component>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Status } from "@/types/status";

// font awesome icons for status codes
const icons: Record<string, string> = {
  loading: "loading",
  paused: "pause-circle",
  success: "check-circle",
  error: "times-circle",
  unknown: "question-circle",
};

// an icon, text, and link showing the status of something
export default defineComponent({
  props: {
    // status code
    code: String as PropType<Status["code"]>,
    // text to show under status icon
    text: String,
    // where to link to for more details about status
    link: String,
    // visual design
    // default: horizontal layout
    // "big": vertical layout with bigger icon and text
    design: String,
  },

  computed: {
    icon() {
      return icons[this.code || "unknown"];
    },
  },
});
</script>

<style lang="scss" scoped>
.status {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 20px;
  text-decoration: none;

  &[data-code="loading"] {
    color: $gray;
  }

  &[data-code="paused"] {
    color: $gray;
  }

  &[data-code="success"] {
    color: $success;
  }

  &[data-code="error"] {
    color: $error;
  }

  &[data-code="unknown"] {
    color: $warning;
  }

  &[data-design="big"] {
    flex-direction: column;
    margin: 0;
  }
}

.icon {
  font-size: 1.5rem;
  color: currentColor;
}

.text {
  font-size: 1.1rem;
  text-align: left;
}

.status[data-design="big"] .icon {
  font-size: 2rem;
}

.status[data-design="big"] .text {
  color: $black;
  text-align: center;
}
</style>
