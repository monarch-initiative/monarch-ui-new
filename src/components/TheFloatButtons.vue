<template>
  <div class="float" :style="{ bottom: nudge + 'px' }">
    <transition name="fade">
      <AppButton
        v-if="showJump"
        design="circle"
        class="button"
        icon="angle-up"
        v-tooltip="'Jump to top of page'"
        @click="jump()"
      />
    </transition>
    <transition name="fade">
      <AppButton
        v-if="showFeedback"
        design="circle"
        class="button"
        icon="comment"
        @click="showModal = true"
        v-tooltip="'Give us feedback on this page!'"
      />
    </transition>
    <AppModal v-model="showModal" label="Feedback form">
      <TheFeedbackForm :modal="true" />
    </AppModal>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from "vue";
import AppModal from "@/components/AppModal.vue";
import TheFeedbackForm from "@/components/TheFeedbackForm.vue";

let mutationObserver: MutationObserver;

// buttons that float on side of page for handy functions
export default defineComponent({
  components: {
    AppModal,
    TheFeedbackForm,
  },
  data() {
    return {
      // whether to show jump button
      showJump: false,
      // whether to show feedback form button
      showFeedback: true,
      // whether to show feedback modal
      showModal: false,
      // how much to push buttons upward to make room for footer if in view
      nudge: 0,
    };
  },
  methods: {
    // update data state
    update() {
      // get dimensions of footer
      const footerEl = document?.querySelector("footer");
      if (!footerEl) return;
      const footer = footerEl.getBoundingClientRect();

      // show jump button if user has scrolled far down enough
      this.showJump = window.scrollY > window.innerHeight * 0.1;
      // show feedback button if user not already on dedicated feedback page
      this.showFeedback =
        ((this.$route.name || "") as string).toLowerCase() !== "feedback";

      // calculate nudge
      this.nudge = Math.max(
        0,
        footer.height + window.innerHeight - footer.bottom
      );
    },
    jump() {
      // jump to top of page
      window.scrollTo(0, 0);
    },
  },
  watch: {
    // run update when route changes (after page finished rendering)
    $route: {
      handler: function () {
        nextTick(this.update);
      },
      deep: true,
    },
  },
  mounted() {
    // run initial update (after page finished rendering)
    nextTick(this.update);

    // listen for events that would affect calcs in update and run update
    window.addEventListener("scroll", this.update);
    window.addEventListener("resize", this.update);
    mutationObserver = new MutationObserver(this.update);
    mutationObserver.observe(document?.body, { subtree: true, childList: true });
  },
  beforeUnmount() {
    // detach/cleanup event listeners
    window.removeEventListener("scroll", this.update);
    window.removeEventListener("resize", this.update);
    if (mutationObserver) mutationObserver.disconnect();
  },
});
</script>

<style lang="scss" scoped>
.float {
  --spacing: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  gap: var(--spacing);
  position: fixed;
  right: 0;
  padding: var(--spacing);
  z-index: 20;
}

.button {
  font-size: 0.9rem;
}
</style>
