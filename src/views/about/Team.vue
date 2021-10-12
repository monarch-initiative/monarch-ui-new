<template>
  <!-- brief intro -->
  <AppSection>
    <h1>Team</h1>
    <p>
      Monarch is made possible thanks to a diverse and dedicated team of
      biologists, scientists, and programmers from various schools and
      institutes.
    </p>
    <p class="center">
      <template v-for="(group, index) in team" :key="index">
        <a :href="'#' + toKebabCase(group.name)">{{ group.name }}</a>
        <span v-if="index !== team.length - 1"> · </span>
      </template>
    </p>
  </AppSection>

  <!-- list each group -->
  <AppSection v-for="(group, groupIndex) in team" :key="groupIndex" width="big">
    <h2 v-heading>
      {{ group.name }}
      <AppIcon
        class="icon"
        icon="history"
        v-if="group.alumni"
        v-tooltip="'Previous group'"
      />
    </h2>
    <AppLink :to="group.link">
      <img
        v-if="getSrc(group.image)"
        class="image"
        :src="getSrc(group.image)"
        :alt="group.name"
        loading="lazy"
      />
    </AppLink>
    <AppGallery>
      <AppMember
        v-for="(member, memberIndex) in group.members"
        :key="memberIndex"
        :name="member.name"
        :image="member.image"
        :role="member.role"
        :link="member.link"
        :alumni="group.alumni || member.alumni"
      />
    </AppGallery>
  </AppSection>

  <!-- funding sources -->
  <AppSection>
    <h2 v-heading>Funding</h2>
    <AppGallery>
      <AppPlaceholder />
      <AppPlaceholder />
      <AppPlaceholder />
      <AppPlaceholder />
      <AppPlaceholder />
      <AppPlaceholder />
    </AppGallery>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </p>
  </AppSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { kebabCase } from "lodash";
import team from "./team.yaml";

export default defineComponent({
  data() {
    return {
      // list of team data
      team,
    };
  },
  methods: {
    // get group img src with fallback if not found
    getSrc(image: string) {
      try {
        return require(`@/assets/team/groups/${image}`);
      } catch (error) {
        return false;
      }
    },
    // expose toKebabCase
    toKebabCase(name: string) {
      return kebabCase(name);
    },
  },
});
</script>

<style lang="scss" scoped>
.image {
  display: block;
  max-width: 100%;
  max-height: 60px;
  margin: 60px auto;
}

.icon {
  margin-left: 10px;
}
</style>
