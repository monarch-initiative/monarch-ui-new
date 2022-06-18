<!--
  floating header at top of every page
-->

<template>
  <header :data-home="home">
    <!-- header background visualization -->
    <TheNexus v-if="home" />

    <!-- title bar -->
    <div class="title" :title="version">
      <!-- logo image and text -->
      <AppLink
        v-tippy="home ? '' : 'Homepage'"
        :to="home ? '' : '/'"
        class="logo"
        :data-home="home"
      >
        <TheLogo class="image" />
        <!-- make logo text the h1 on homepage -->
        <component :is="home ? 'h1' : 'div'" class="text">
          Monarch
          <br />
          Initiative
        </component>
      </AppLink>

      <!-- nav toggle button -->
      <button
        class="button"
        :aria-expanded="expanded"
        :aria-label="
          expanded ? 'Close navigation menu' : 'Expand navigation menu'
        "
        @click="expanded = !expanded"
      >
        <AppIcon :icon="expanded ? 'times' : 'bars'" />
      </button>
    </div>

    <!-- navigation bar -->
    <nav :data-home="home" :data-expanded="expanded">
      <AppLink
        v-tippy="'Dive right in and use Monarch'"
        class="link"
        to="/explore"
      >
        Explore
      </AppLink>
      <AppLink
        v-tippy="'Citing, licensing, sources, and other info'"
        class="link"
        to="/about"
      >
        About
      </AppLink>
      <AppLink
        v-tippy="'Feedback, docs, guides, contact, and more'"
        class="link"
        to="/help"
      >
        Help
      </AppLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import TheNexus from "./TheNexus.vue";
import TheLogo from "@/assets/TheLogo.vue";
import { version } from "../../package.json";
import { useRoute } from "vue-router";

/** route info */
const route = useRoute();

/** is nav menu expanded */
const expanded = ref(false);

/** is home page (big) version */
const home = computed((): boolean => route.name === "Home");

/** close nav when page changes */
watch(
  () => route,
  () => {
    expanded.value = false;
  }
);
</script>

<style lang="scss" scoped>
$wrap: 750px;

/** header */

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: $theme-dark;
  color: $white;
  z-index: 10;
}

@media (max-width: $wrap) {
  header {
    flex-direction: column;
  }
}

header[data-home="true"] {
  justify-content: center;

  @media (min-width: $wrap) {
    position: relative;
    min-height: 300px;
  }

  @media (max-width: $wrap) {
    justify-content: space-between;
  }
}

/** title bar (containing logo and nav toggle button) */

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /** background: radial-gradient($theme-dark 40%, transparent 70%); */
}

.button {
  width: 50px;
  height: 50px;
}

@media (min-width: $wrap) {
  .button {
    display: none;
  }
}

@media (max-width: $wrap) {
  .title {
    width: 100%;
  }
}

/** logo image and text */

.logo {
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: $white;
  text-decoration: none;
}

.image {
  height: 50px;
  padding: 5px;
}

.text {
  margin: 0;
  padding: 5px;
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.logo[data-home="true"] {
  @media (min-width: $wrap) {
    & {
      flex-direction: column;
    }

    .image {
      height: 70px;
    }

    .text {
      font-size: 1.1rem;
    }
  }
}

/** navigation bar */

nav {
  display: flex;
  padding: 15px;
  gap: 10px;
}

.link {
  position: relative;
  width: 100%;
  padding: 10px;
  color: $white;
  text-decoration: none;
  text-align: center;

  &:after {
    content: "";
    position: absolute;
    left: 50%;
    right: 50%;
    bottom: 0;
    height: 2px;
    background: $white;
    transition: left $fast, right $fast;
  }

  &:hover:after {
    left: 5px;
    right: 5px;
  }
}

@media (max-width: $wrap) {
  nav {
    flex-direction: column;
    position: unset;
    padding: 10px;
    width: 100%;
  }

  nav[data-expanded="false"] {
    display: none;
  }

  .link {
    margin: 0;
  }
}

@media (min-width: $wrap) {
  nav[data-home="true"] {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
