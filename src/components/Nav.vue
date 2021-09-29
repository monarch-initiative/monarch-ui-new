<template>
  <nav :data-big="big" :data-expanded="expanded">
    <router-link class="link" to="/explore">Explore</router-link>
    <router-link class="link" to="/tools">Tools</router-link>
    <router-link class="link" to="/about">About</router-link>
    <router-link class="link" to="/help">Help</router-link>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// main navigation bar
export default defineComponent({
  props: {
    big: Boolean,
    expanded: Boolean,
  },
});
</script>

<style lang="scss" scoped>
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

@media (max-width: $nav) {
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

@media (min-width: $nav + 1) {
  nav[data-big="true"] {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
