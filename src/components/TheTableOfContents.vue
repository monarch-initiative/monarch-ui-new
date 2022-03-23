<template>
  <AppFlex
    direction="col"
    gap="none"
    hAlign="stretch"
    class="toc"
    :style="{ top: nudge + 'px' }"
    :data-expanded="expanded"
    role="doc-toc"
    aria-label="Page table of contents"
    @click.stop
  >
    <!-- toggle button -->
    <AppFlex gap="none" hAlign="left" class="title">
      <button
        class="button"
        @click="expanded = !expanded"
        :aria-expanded="expanded"
        v-tippy="
          expanded ? 'Close table of contents' : 'Expand table of contents'
        "
      >
        <AppIcon :icon="expanded ? 'times' : 'bars'" />
      </button>
      <span v-if="expanded" class="title-text">Table of Contents</span>
    </AppFlex>

    <template v-if="expanded">
      <div class="spacer"></div>

      <!-- entries -->
      <AppLink
        v-for="(entry, index) in entries"
        :key="index"
        :to="'#' + entry.id"
        class="entry"
        :data-active="active === index"
        @click="active = index"
        @keydown="active = index"
        :aria-current="active === index"
      >
        <AppIcon :icon="entry.icon" class="entry-icon" />
        <span class="entry-text truncate">{{ entry.text }}</span>
      </AppLink>

      <div class="spacer"></div>

      <!-- options -->
      <AppCheckbox
        v-model="oneAtATime"
        text="Show single section"
        v-tippy="'Only show one section at a time'"
      />
    </template>
  </AppFlex>
</template>

<script lang="ts">
import { defineComponent, nextTick } from "vue";
import AppCheckbox from "./AppCheckbox.vue";
import variables from "../global/variables.scss";
import { firstInView } from "@/util/dom";

type Entries = Array<{
  section: HTMLElement;
  id: string;
  icon: string;
  text: string;
}>;

// desired width of toc
const width = 250;

// screen width at which certain behaviors and styles change
const compact = () =>
  window.innerWidth < width * 2 + (parseInt(variables.section) || 1000);

let mutationObserver: MutationObserver;

export default defineComponent({
  components: {
    AppCheckbox,
  },
  data() {
    return {
      // toc entries
      entries: [] as Entries,
      // whether toc is open or not
      expanded: !compact(),
      // how much to push downward to make room for header if in view
      nudge: 0,
      // whether to only show one section at a time
      oneAtATime: false,
      // active (in view, or selected) section
      active: 0,
    };
  },
  methods: {
    // update toc position
    updatePosition() {
      // get dimensions of header and "sub-header" (e.g. first section on node page)
      const headerEl = document?.querySelector("header");
      const subHeaderEl = document?.querySelector("main > section:first-child");
      if (!headerEl || !subHeaderEl) return;
      const header = headerEl.getBoundingClientRect();
      const subHeader = subHeaderEl.getBoundingClientRect();

      // calculate nudge
      this.nudge = Math.max(
        header.top + header.height,
        subHeader.top + subHeader.height
      );

      // find in view section
      if (!this.oneAtATime)
        this.active = firstInView(this.entries.map(({ section }) => section));
    },
    // update toc entries
    updateEntries() {
      this.entries = Array.from(
        // get all headings except top level one
        document?.querySelectorAll("h2[id], h3[id]") || []
      ).map((element) =>
        // get relevant props from heading
        ({
          section: (element.closest("section") as HTMLElement) || null,
          id: element.getAttribute("id") || "",
          icon:
            element.querySelector("[data-icon]")?.getAttribute("data-icon") ||
            "",
          text: (element as HTMLElement).innerText || "",
        })
      );
    },
    // hide/show sections based on active
    hideShow() {
      for (const [index, { section }] of Object.entries(this.entries))
        if (section)
          section.style.display =
            this.active === Number(index) || !this.oneAtATime ? "" : "none";
    },
    // when user clicks "off" of toc panel
    onWindowClick() {
      if (compact()) this.expanded = false;
    },
  },
  watch: {
    oneAtATime() {
      this.hideShow();
    },
    active() {
      this.hideShow();
    },
  },
  mounted() {
    // run initial updatePosition (after page finished rendering)
    nextTick(this.updatePosition);

    // populate entries
    this.updateEntries();

    // listen for events that would affect position calcs
    window.addEventListener("scroll", this.updatePosition);
    window.addEventListener("resize", this.updatePosition);
    mutationObserver = new MutationObserver(() => {
      this.updatePosition();
      this.updateEntries();
    });
    mutationObserver.observe(document?.body, {
      subtree: true,
      childList: true,
    });

    // other listeners
    window.addEventListener("click", this.onWindowClick);
  },
  updated() {
    // update entries
    this.updateEntries();
  },
  beforeUnmount() {
    // detach/cleanup event listeners
    window.removeEventListener("scroll", this.updatePosition);
    window.removeEventListener("resize", this.updatePosition);
    if (mutationObserver) mutationObserver.disconnect();
    window.removeEventListener("click", this.onWindowClick);
  },
});
</script>

<style lang="scss" scoped>
.toc {
  position: fixed;
  top: 0;
  width: unset;
  background: $white;
  box-shadow: $shadow;
  z-index: 10;
}

.toc[data-expanded="true"] {
  max-width: min(var(--width), calc(100vw - 40px));
}

.button {
  width: 40px;
  height: 40px;
}

.title-text {
  padding-right: 20px;
  font-weight: 500;
}

.spacer {
  content: "";
  width: 100%;
  // height: 2px;
  // background: $light-gray;
  margin: 5px 0;
}

.entry {
  display: flex;
  align-items: center;
  height: 40px;
  text-decoration: none;
  transition: background $fast;
}

.entry[data-active="true"] {
  background: $light-gray;
}

.entry:hover {
  background: $light-gray;
}

.entry-icon {
  width: 40px;
  flex-shrink: 0;
  color: $gray;
}

.entry-text {
  flex-grow: 1;
  color: $off-black;
  text-align: left;
}

.checkbox {
  font-size: 0.9rem;
}
</style>
