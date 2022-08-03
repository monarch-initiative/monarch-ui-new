<!--
  link that adds breadcrumb to breadcrumb list when clicked
-->

<template>
  <AppLink :to="to" :state="{ breadcrumbs: [...breadcrumbs, breadcrumb] }">
    <slot />
  </AppLink>
</template>

<script setup lang="ts">
import { breadcrumbs } from "@/global/breadcrumbs";

interface Props {
  /** location to link to */
  to: string;
  /** "current" breadcrumb to add list */
  breadcrumb: Record<string, unknown>;
}

defineProps<Props>();
</script>
