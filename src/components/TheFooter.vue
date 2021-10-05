<template>
  <footer>
    <div class="social">
      <AppLink
        v-for="(item, index) in social"
        :key="index"
        :to="item.to"
        :subtitle="item.subtitle"
        v-tooltip="item.subtitle"
      >
        <AppIcon :icon="item.icon" />
      </AppLink>
    </div>
    <div class="license">
      <span>Monarch Intiative {{ new Date().getFullYear() }}</span>
      <span>&nbsp; · &nbsp;</span>
      <a href="" class="license">BSD-3 License</a>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import social from "@/global/social.yaml";

export default defineComponent({
  data() {
    return {
      // social icons data
      social,
    };
  },
});
</script>

<style lang="scss" scoped>
$wrap: 500px;

footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: $theme-dark;
  color: $white;
  font-size: 0.9rem;
}

a {
  color: $white;
  transition: opacity $fast;
}

.social {
  display: flex;
}

.social a {
  padding: 10px;
}

.social:hover a {
  opacity: 0.2;
}

.social:hover a:hover {
  opacity: 1;
}

.license {
  text-align: center;
  line-height: $spacing;
}

@media (max-width: $wrap) {
  footer {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
