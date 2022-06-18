<!--
  team member profile/portrait
-->

<template>
  <AppLink :to="link || ''" class="member">
    <div class="image">
      <div class="portrait">
        <img :src="src" :alt="name" loading="lazy" />
      </div>
      <AppIcon
        v-if="alumni"
        v-tippy="'Alumni team member'"
        icon="history"
        class="icon"
      />
    </div>
    <div v-if="role" class="text">
      <div class="name">{{ name }}</div>
      <div v-if="role" class="role">{{ role }}</div>
    </div>
  </AppLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { kebabCase, deburr } from "lodash";

interface Props {
  /** member name */
  name: string;
  /** their role */
  role?: string;
  /** link to bio */
  link?: string;
  /** whether or not member is a past contributor */
  alumni?: boolean;
}

const props = defineProps<Props>();

/** get member img src with fallback if not found */
const src = computed(() => {
  const image = kebabCase(deburr((props.name || "").toLowerCase()));
  try {
    return require(`@/assets/team/members/${image}.jpg`);
  } catch (error) {
    return require(`@/assets/team/_member.jpg`);
  }
});
</script>

<style lang="scss" scoped>
.member {
  display: inline-flex;
  align-items: center;
  gap: 30px;
  max-width: 100%;
  color: $black;
  text-decoration: none;
}

a.member:hover {
  color: $theme;
}

.image {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;

  .portrait {
    width: 100%;
    height: 100%;
    border-radius: 999px;
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .icon {
    position: absolute;
    /** align to 45 degree edge of circle (for aesthetics) */
    left: 14%;
    top: 14%;
    width: 15px;
    height: 15px;
    padding: 7px;
    background: $white;
    border-radius: 999px;
    /** align center */
    transform: translate(-50%, -50%);
  }
}

.text {
  text-align: left;
}

.name {
  font-size: 1.1rem;
  font-weight: 500;
}

.name,
.role {
  margin: 10px 0;
}
</style>
