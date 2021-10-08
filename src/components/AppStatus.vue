<template>
  <div class="status" :aria-label="status">
    <AppIcon class="icon" :icon="icon" :data-status="status" />
    <div>{{ text }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// font awesome icons for statuses
const icons: Record<string, string> = {
  loading: "circle-notch",
  success: "check-circle",
  error: "times-circle",
};

export default defineComponent({
  props: {
    // url to query and check status of
    url: String,
    // text to show under status icon
    text: String,
  },
  emits: ["error"],
  data() {
    return {
      status: "loading",
    };
  },
  computed: {
    icon() {
      return icons[this.status || "loading"];
    },
  },
  async mounted() {
    try {
      const response = await fetch(this.url || "");
      if (!response.ok) throw new Error(`${this.url} Response not OK`);
      this.status = "success";
    } catch (error) {
      this.status = "error";
      this.$emit("error");
    }
  },
});
</script>

<style lang="scss" scoped>
.status {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  margin: 20px;
}

.icon {
  font-size: 1.5rem;

  &[data-status="loading"] {
    color: $gray;
    animation: spin 1s linear forwards infinite;
  }

  &[data-status="success"] {
    color: $success;
  }

  &[data-status="error"] {
    color: $error;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
