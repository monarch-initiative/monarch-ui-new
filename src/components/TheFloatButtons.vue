<template>
  <div class="float" :style="{ bottom: nudge + 'px' }">
    <transition name="fade">
      <AppButton
        v-if="showJump"
        class="button"
        icon="angle-up"
        v-tooltip="'Jump to top of page'"
        @click="jump()"
      />
    </transition>
    <transition name="fade">
      <AppButton
        v-if="showFeedback"
        class="button"
        icon="comment"
        @click="showModal = true"
        v-tooltip="'Give us feedback on this page!'"
      />
    </transition>
    <AppModal v-model="showModal">
      <AppFeedbackForm :modal="true" />
    </AppModal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppModal from "@/components/AppModal.vue";
import AppFeedbackForm from "@/components/AppFeedbackForm.vue";

// floating button that lets user conveniently jump to top of page
export default defineComponent({
  components: {
    AppModal,
    AppFeedbackForm,
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
    update() {
      // get dimensions of footer
      const footerEl = document.querySelector("footer");
      if (!footerEl) return;
      const footer = footerEl.getBoundingClientRect();

      // if user has scrolled far down enough
      const downEnough = window.scrollY > window.innerHeight * 0.25;

      // if user has scrolled to bottom of page (and not at top)
      const atBottom =
        window.scrollY > 0 &&
        footer.bottom < footer.height / 2 + window.innerHeight;

      // if user already on dedicated feedback page
      const onFeedback =
        ((this.$route.name || "") as string).toLowerCase() === "feedback";

      // show/hide buttons based on scroll
      this.showJump = downEnough && !atBottom;
      this.showFeedback = !onFeedback && !atBottom;

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
  mounted() {
    window.addEventListener("scroll", this.update);
    window.addEventListener("resize", this.update);
  },
  updated() {
    this.update();
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.update);
    window.removeEventListener("resize", this.update);
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
  padding-right: 0;
  z-index: 2;
}

.button {
  margin: 0 !important;
  border-radius: 3px 0 0 3px !important;
}
</style>
