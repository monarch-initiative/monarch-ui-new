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
import { debounce, DebouncedFunc } from "lodash";
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
      showFeedback: false,
      // whether to show feedback modal
      showModal: false,
    };
  },
  methods: {
    onScroll() {
      // if page is long and user has scrolled far down enough
      const downEnough = window.scrollY > window.innerHeight * 0.25;

      // if user has scrolled to bottom of page
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.body.clientHeight -
          (document.querySelector("footer")?.clientHeight || 0);

      // show/hide buttons based on scroll
      this.showJump = downEnough && !atBottom;
      this.showFeedback =
        !atBottom && String(this.$route.name).toLowerCase() !== "feedback";
    },
    jump() {
      // jump to top of page
      window.scrollTo(0, 0);
    },
  },
  computed: {
    // debounced version of on scroll listener for performance
    debounced(): DebouncedFunc<() => void> {
      return debounce(this.onScroll, 100, { leading: true, maxWait: 100 });
    },
  },
  mounted() {
    window.addEventListener("scroll", this.debounced);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.debounced);
  },
});
</script>

<style lang="scss" scoped>
.float {
  --spacing: 20px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing);
  position: fixed;
  right: var(--spacing);
  bottom: var(--spacing);
  z-index: 2;

  @media (max-width: 600px) {
    --spacing: 10px;
  }
}

.button {
  margin: 0 !important;
}
</style>
