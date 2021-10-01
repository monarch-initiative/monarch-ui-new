import { Component } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Section from "@/components/Section.vue";
import Button from "@/components/Button.vue";
import Markdownify from "@/components/Markdownify.vue";

// list of components we want to be available in any vue file without importing them
const globalComponents: Record<string, Component> = {
  FontAwesomeIcon,
  Section,
  Button,
  Markdownify,
};

export default globalComponents;
