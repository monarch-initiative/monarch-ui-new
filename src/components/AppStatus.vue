<template>
  <AppLink
    :to="status?.link || ''"
    class="status"
    :data-code="status?.code || ''"
    :aria-label="status?.code || ''"
  >
    <AppIcon class="icon" :icon="icon" />
    <span class="text">{{ status?.text || "" }} <slot /></span>
  </AppLink>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

// possible properties of a status for status component
export const Codes = [
  "loading",
  "success",
  "warning",
  "error",
  "paused",
  "unknown",
] as const;

export interface Status {
  code?: typeof Codes[number];
  text?: string;
  link?: string;
}

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
    // status object
    status: Object as PropType<Status>,
  },
  computed: {
    icon() {
      return icons[this.status?.code || "unknown"];
    },
  },
});
</script>

<style lang="scss" scoped>
.status {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 10px;
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
  color: $gray;
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
  color: $off-black;
  line-height: $spacing;
}
</style>
