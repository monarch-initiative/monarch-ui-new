<template>
  <AppLink :to="link" class="member">
    <div class="image">
      <img :src="src" :alt="name" loading="lazy" />
    </div>
    <div v-if="role" class="text">
      <div class="name">
        {{ name
        }}<span class="icon"
          ><AppIcon
            icon="history"
            v-if="alumni"
            v-tooltip="'Alumni team member'"
        /></span>
      </div>
      <div v-if="role" class="role">{{ role }}</div>
    </div>
  </AppLink>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { kebabCase, deburr } from "lodash";

// team member profile/portrait
export default defineComponent({
  props: {
    // member name
    name: String,
    // their role
    role: String,
    // link to bio
    link: String,
    // whether or not member is a past contributor
    alumni: Boolean,
  },
  computed: {
    // get member img src with fallback if not found
    src() {
      const image = kebabCase(deburr((this.name || "").toLowerCase()));
      try {
        return require(`@/assets/team/members/${image}.jpg`);
      } catch (error) {
        return require(`@/assets/team/_member.jpg`);
      }
    },
  },
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
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 999px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

.icon {
  display: inline-block;
  width: 0;

  svg {
    margin-left: 10px;
  }
}
</style>
