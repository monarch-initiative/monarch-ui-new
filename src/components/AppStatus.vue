<template>
  <AppLink :to="link" class="status" :data-code="code" :aria-label="code">
    <AppIcon class="icon" :icon="icon" />
    <span v-if="text" class="text">{{ text }}</span>
  </AppLink>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Status } from "@/types/status";

// icons for status codes
const icons: Record<string, string> = {
  loading: "loading",
  paused: "pause-circle",
  success: "check-circle",
  warning: "exclamation-circle",
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
}

// icon

.icon {
  font-size: 1.5rem;
}

.status[data-code="loading"] .icon {
  color: $gray;
}

.status[data-code="paused"] .icon {
  color: $gray;
}

.status[data-code="success"] .icon {
  color: $success;
}

.status[data-code="warning"] .icon {
  color: $warning;
}

.status[data-code="error"] .icon {
  color: $error;
}

.status[data-code="unknown"] .icon {
  color: $gray;
}

// text

.text {
  text-align: left;
  color: $dark-gray;
}
</style>
