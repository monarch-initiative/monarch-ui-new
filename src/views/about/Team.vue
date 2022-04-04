<!--
  about team page

  all monarch-related team members and info about them
-->

<template>
  <!-- brief intro -->
  <AppSection>
    <AppHeading>Team</AppHeading>
    <p>
      Monarch is made possible thanks to a diverse and dedicated team of
      biologists, scientists, and programmers from various schools and
      institutes.
    </p>
    <p>
      <template v-for="(group, index) in team" :key="index">
        <AppLink :to="'#' + kebabCase(group.name)">{{ group.name }}</AppLink>
        <span v-if="index !== team.length - 1"> · </span>
      </template>
    </p>
  </AppSection>

  <!-- list each group -->
  <AppSection v-for="(group, groupIndex) in team" :key="groupIndex" width="big">
    <AppHeading>
      {{ group.name }}
      <AppIcon
        class="icon"
        icon="history"
        v-if="group.alumni"
        v-tippy="'Alumni group'"
      />
    </AppHeading>
    <AppLink v-if="group.link" :to="group.link" :aria-label="group.name">
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
        :role="member.role"
        :link="member.link"
        :alumni="group.alumni || member.alumni"
      />
    </AppGallery>
  </AppSection>

  <!-- funding sources -->
  <AppSection>
    <AppHeading>Funding</AppHeading>
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

<script setup lang="ts">
import { kebabCase } from "lodash";
import AppMember from "@/components/AppMember.vue";
import teamData from "./team.json";

// define types manually because typescript can't infer them completely correctly
const team = teamData as Array<{
  name: string;
  image: string;
  link: string;
  alumni?: boolean;
  members: Array<{
    name: string;
    role?: string;
    link?: string;
    alumni?: boolean;
  }>;
}>;

// get group img src with fallback if not found
function getSrc(image: string) {
  try {
    return require(`@/assets/team/groups/${image}`);
  } catch (error) {
    return false;
  }
}
</script>

<style lang="scss" scoped>
.image {
  display: block;
  max-width: 100%;
  max-height: 60px;
}

.icon {
  margin-left: 10px;
}
</style>
