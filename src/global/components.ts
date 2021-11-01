import AppButton from "@/components/AppButton.vue";
import AppGallery from "@/components/AppGallery.vue";
import AppHeading from "@/components/AppHeading.vue";
import AppIcon from "@/components/AppIcon.vue";
import AppLink from "@/components/AppLink.vue";
import AppMarkdown from "@/components/AppMarkdown.vue";
import AppPlaceholder from "@/components/AppPlaceholder.vue";
import AppSection from "@/components/AppSection.vue";
import AppTile from "@/components/AppTile.vue";

// list of components we want to be available in any vue file without importing
// only include components used very repetitively
const globalComponents = {
  AppButton,
  AppGallery,
  AppHeading,
  AppIcon,
  AppLink,
  AppMarkdown,
  AppPlaceholder,
  AppSection,
  AppTile,
};

export default globalComponents;

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    AppButton: typeof AppButton;
    AppGallery: typeof AppGallery;
    AppHeading: typeof AppHeading;
    AppIcon: typeof AppIcon;
    AppLink: typeof AppLink;
    AppMarkdown: typeof AppMarkdown;
    AppPlaceholder: typeof AppPlaceholder;
    AppSection: typeof AppSection;
    AppTile: typeof AppTile;
  }
}
