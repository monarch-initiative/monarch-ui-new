import { mount } from "@vue/test-utils";
import AppButton from "@/components/AppButton.vue";
import { mountOptions } from ".";

it("Renders as link", () => {
  const props = { text: "Test link", to: "https://google.com/" };
  const wrapper = mount(AppButton, { ...mountOptions, props });
  expect(wrapper.find("a").exists()).toBeTruthy();
});

it("Renders as button", () => {
  const props = { text: "Test link", click: () => null };
  const wrapper = mount(AppButton, { ...mountOptions, props });
  expect(wrapper.find("button").exists()).toBeTruthy();
});
