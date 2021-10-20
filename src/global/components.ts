import { Component } from "vue";
import AppSection from "@/components/AppSection.vue";
import AppLink from "@/components/AppLink.vue";
import AppIcon from "@/components/AppIcon.vue";
import AppButton from "@/components/AppButton.vue";
import AppInput from "@/components/AppInput.vue";
import AppPlaceholder from "@/components/AppPlaceholder.vue";
import AppGallery from "@/components/AppGallery.vue";
import AppTile from "@/components/AppTile.vue";
import AppMarkdown from "@/components/AppMarkdown.vue";
import AppStatus from "@/components/AppStatus.vue";
import AppCitation from "@/components/AppCitation.vue";
import AppMember from "@/components/AppMember.vue";
import AppAccordion from "@/components/AppAccordion.vue";
import AppDetail from "@/components/AppDetail.vue";
import AppCheckbox from "@/components/AppCheckbox.vue";

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
  AppMarkdown,
  AppStatus,
  AppCitation,
  AppMember,
  AppAccordion,
  AppDetail,
  AppCheckbox,
};

export default globalComponents;
