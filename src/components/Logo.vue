<template>
  <router-link to="/" class="logo" :data-big="big">
    <LogoIcon class="image" />
    <div class="text">Monarch<br />Intiative</div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LogoIcon from "@/assets/LogoImage.vue";

// animated logo and app title
export default defineComponent({
  props: {
    big: Boolean,
  },
  components: {
    LogoIcon,
  },
});
</script>

<style lang="scss" scoped>
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

@media (max-width: $nav) {
  .logo {
    padding: 10px;
  }
}

@media (min-width: $nav + 1) {
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
</style>
