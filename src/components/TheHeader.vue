<template>
  <header :data-home="home">
    <!-- header background visualization -->
    <TheViz />

    <!-- title bar -->
    <div class="title">
      <!-- logo image and text -->
      <AppLink
        :to="home ? '' : '/'"
        class="logo"
        :data-home="home"
        v-tooltip="home ? '' : 'Homepage'"
      >
        <Logo class="image" />
        <!-- make logo text the h1 on homepage -->
        <component :is="home ? 'h1' : 'div'" class="text">
          Monarch
          <br />
          Intiative
        </component>
      </AppLink>

      <!-- nav toggle button -->
      <button
        class="button"
        @click="expanded = !expanded"
        :aria-expanded="expanded"
        :aria-label="
          expanded ? 'Close navigation menu' : 'Expand navigation menu'
        "
      >
        <AppIcon :icon="expanded ? 'times' : 'bars'" />
      </button>
    </div>

    <!-- navigation bar -->
    <nav :data-home="home" :data-expanded="expanded">
      <AppLink
        class="link"
        to="/explore"
        v-tooltip="'Dive right in and use Monarch'"
      >
        Explore
      </AppLink>
      <AppLink
        class="link"
        to="/tools"
        v-tooltip="'Monarch\'s ecosystem of tools'"
      >
        Tools
      </AppLink>
      <AppLink
        class="link"
        to="/about"
        v-tooltip="'Citing, licensing, sources, and other info'"
      >
        About
      </AppLink>
      <AppLink
        class="link"
        to="/help"
        v-tooltip="'Feedback, docs, guides, contact, and more'"
      >
        Help
      </AppLink>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TheViz from "./TheViz.vue";
import Logo from "@/assets/Logo.vue";

export default defineComponent({
  components: {
    TheViz,
    Logo,
  },
  data() {
    return {
      // is nav menu expanded
      expanded: false,
    };
  },
  computed: {
    // is home page (big) version
    home(): boolean {
      return String(this.$route.name).toLowerCase() === "home";
    },
  },
  watch: {
    $route() {
      this.expanded = false;
    },
  },
});
</script>

<style lang="scss" scoped>
$wrap: 750px;

// header

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: $theme-dark;
  color: $white;
  z-index: 1;
}

@media (max-width: $wrap) {
  header {
    flex-direction: column;
  }
}

header[data-home="true"] {
  justify-content: center;
  min-height: 300px;

  @media (min-width: $wrap) {
    position: relative;
  }

  @media (max-width: $wrap) {
    justify-content: space-between;
    min-height: unset;
  }
}

// title bar (containing logo and nav toggle button)

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background: radial-gradient($theme-dark 40%, transparent 70%);
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

// logo image and text

.logo {
  display: flex;
  align-items: center;
  padding: 20px;
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

@media (max-width: $wrap) {
  .logo {
    padding: 10px;
  }
}

@media (min-width: $wrap) {
  .logo[data-home="true"] {
    flex-direction: column;
  }

  .logo[data-home="true"] .image {
    height: 70px;
  }

  .logo[data-home="true"] .text {
    font-size: 1.1rem;
  }
}

// navigation bar

nav {
  display: flex;
  margin: 20px;
  // background: radial-gradient($theme-dark 40%, transparent 70%);
}

.link {
  width: 100%;
  padding: 15px;
  color: $white;
  text-decoration: none;
  text-align: center;
  transition: opacity $fast;
}

nav:hover .link {
  opacity: 0.2;
}

nav:hover .link:hover {
  opacity: 1;
}

@media (max-width: $wrap) {
  nav {
    flex-direction: column;
    position: unset;
    margin: 10px;
    width: 100%;
  }

  nav[data-expanded="false"] {
    display: none;
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
