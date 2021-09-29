<template>
  <div class="title">
    <Logo :big="big" />
    <Button
      class="button"
      :icon="expanded ? 'times' : 'bars'"
      @click="$emit('toggle')"
      :aria-label="
        expanded ? 'Collapse navigation menu' : 'Expand navigation menu'
      "
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Logo from "@/components/Logo.vue";

// animated logo, app title, and nav toggle button
export default defineComponent({
  props: {
    big: Boolean,
    expanded: Boolean,
  },
  emits: ["toggle"],
  components: {
    Logo,
  },
});
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-between;
}

.button {
  display: none;
}

@media (max-width: $nav) {
  .title {
    width: 100%;
  }

  .button {
    display: unset;
  }
}
</style>
