import { Component } from "vue";
import AppSection from "@/components/AppSection.vue";
import AppLink from "@/components/AppLink.vue";
import AppIcon from "@/components/AppIcon.vue";
import AppButton from "@/components/AppButton.vue";
import AppInput from "@/components/AppInput.vue";
import AppPlaceholder from "@/components/AppPlaceholder.vue";
import AppGallery from "@/components/AppGallery.vue";
import AppTile from "@/components/AppTile.vue";
import AppMarkdownify from "@/components/AppMarkdownify.vue";
import AppStatus from "@/components/AppStatus.vue";
import AppCitation from "@/components/AppCitation.vue";
import AppMember from "@/components/AppMember.vue";

// list of components we want to be available in any vue file without importing them
const globalComponents: Record<string, Component> = {
  AppSection,
  AppLink,
  AppIcon,
  AppButton,
  AppInput,
  AppPlaceholder,
  AppGallery,
  AppTile,
  AppMarkdownify,
  AppStatus,
  AppCitation,
  AppMember,
};

export default globalComponents;
