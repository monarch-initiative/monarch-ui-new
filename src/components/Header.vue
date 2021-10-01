<template>
  <header :data-big="big">
    <!-- title bar -->
    <div class="title">
      <!-- logo image and text -->
      <router-link to="/" class="logo" :data-big="big">
        <Logo class="image" />
        <div class="text">Monarch<br />Intiative</div>
      </router-link>

      <!-- nav toggle button -->
      <Button
        class="button"
        :icon="expanded ? 'times' : 'bars'"
        @click="expanded = !expanded"
        :aria-label="
          expanded ? 'Collapse navigation menu' : 'Expand navigation menu'
        "
      />
    </div>

    <!-- navigation bar -->
    <nav :data-big="big" :data-expanded="expanded">
      <router-link class="link" to="/explore">Explore</router-link>
      <router-link class="link" to="/tools">Tools</router-link>
      <router-link class="link" to="/about">About</router-link>
      <router-link class="link" to="/help">Help</router-link>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Logo from "@/assets/Logo.vue";

export default defineComponent({
  components: {
    Logo,
  },
  data() {
    return {
      // is nav menu expanded
      expanded: false,
    };
  },
  computed: {
    // is big version (home page)
    big() {
      return this.$route.name === "home";
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
}

@media (max-width: $wrap) {
  header {
    flex-direction: column;
  }
}

header[data-big="true"] {
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
}

.button {
  display: none;
}

@media (max-width: $wrap) {
  .title {
    width: 100%;
  }

  .button {
    display: unset;
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
  padding: 5px;
  font-size: 1rem;
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
  .logo[data-big="true"] {
    flex-direction: column;
  }

  .logo[data-big="true"] .image {
    height: 70px;
  }

  .logo[data-big="true"] .text {
    font-size: 1.1rem;
  }
}

// navigation bar

nav {
  display: flex;
  padding: 20px;
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
    padding: 10px;
    width: 100%;
  }

  nav[data-expanded="false"] {
    display: none;
  }
}

@media (min-width: $wrap) {
  nav[data-big="true"] {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
