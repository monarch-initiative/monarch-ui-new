<template>
  <div class="float">
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
      // whether to show feedback button
      showFeedback: true,
      // whether to show feedback modal
      showModal: false,
    };
  },
  methods: {
    showOrHide() {
      // show/hide buttons based on scroll
      this.showJump = window.scrollY > window.innerHeight * 0.25;
    },
    jump() {
      // jump to top of page
      window.scrollTo(0, 0);
    },
  },
  mounted() {
    this.showOrHide();
    window.addEventListener("scroll", this.showOrHide);
    window.addEventListener("resize", this.showOrHide);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.showOrHide);
    window.removeEventListener("resize", this.showOrHide);
  },
});
</script>

<style lang="scss" scoped>
.float {
  --spacing: 10px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing);
  position: fixed;
  right: var(--spacing);
  bottom: var(--spacing);
  z-index: 2;
}

.button {
  margin: 0 !important;
}
</style>
