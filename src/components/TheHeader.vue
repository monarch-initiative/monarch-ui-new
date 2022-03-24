<template>
  <header :data-home="home">
    <!-- header background visualization -->
    <TheNexus v-if="home" />

    <!-- title bar -->
    <div class="title">
      <!-- logo image and text -->
      <AppLink
        :to="home ? '' : '/'"
        class="logo"
        :data-home="home"
        v-tippy="home ? '' : 'Homepage'"
        :title="version"
      >
        <Logo class="image" />
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
        v-tippy="'Dive right in and use Monarch'"
      >
        Explore
      </AppLink>
      <AppLink
        class="link"
        to="/about"
        v-tippy="'Citing, licensing, sources, and other info'"
      >
        About
      </AppLink>
      <AppLink
        class="link"
        to="/help"
        v-tippy="'Feedback, docs, guides, contact, and more'"
      >
        Help
      </AppLink>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TheNexus from "./TheNexus.vue";
import Logo from "@/assets/Logo.vue";
import packageJson from "../../package.json";

export default defineComponent({
  components: {
    TheNexus,
    Logo,
  },
  data() {
    return {
      // version of app
      version: packageJson.version,
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
  min-height: 0;
  background: $theme-dark;
  color: $white;
  z-index: 10;
  transition: min-height $fast;
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
    min-height: 0;
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
  padding: 20px;
  gap: 10px;
  // background: radial-gradient($theme-dark 40%, transparent 70%);
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
