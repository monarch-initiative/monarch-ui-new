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
        v-tooltip="'Alumni group'"
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
    <p>The Monarch Initiative is funded by:</p>
    <ul>
      <li>
        OFFICE OF THE DIRECTOR, NATIONAL INSTITUTES OF HEALTH
        <br />
        <AppLink to="https://reporter.nih.gov/project-details/10173498">
          The Monarch Initiative: Linking diseases to model organism
          resources</AppLink
        >
        <br />
        2R24OD011883-10A1
      </li>
      <li>
        NATIONAL HUMAN GENOME RESEARCH INSTITUTE, Center of Excellence in Genome
        Sciences
        <br />
        <AppLink to="https://reporter.nih.gov/project-details/10448140">
          A phenomics-first resource for interpretation of variants
        </AppLink>
        <br />
        7RM1HG010860-02
      </li>
      <li>
        NATIONAL HUMAN GENOME RESEARCH INSTITUTE
        <br />
        <AppLink to="https://reporter.nih.gov/project-details/10269338">
          The Human Phenotype Ontology: Accelerating Computational Integration
          of Clinical Data for Genomics</AppLink
        >
        <br />
        1U24HG011449-01A1
      </li>
    </ul>
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
