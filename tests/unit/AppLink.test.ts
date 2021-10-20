import { mount } from "@vue/test-utils";
import AppLink from "@/components/AppLink.vue";
import { mountOptions } from "../setup";

test("Renders as link", async () => {
  const props = { to: "https://google.com/" };
  const wrapper = await mount(AppLink, { ...mountOptions, props });
  expect(wrapper.find("a").exists()).toBeTruthy();
});

test("Renders as router-link", async () => {
  const props = { to: "/about" };
  const wrapper = await mount(AppLink, { ...mountOptions, props });
  expect(wrapper.findComponent({ name: "router-link" }).exists()).toBeTruthy();
});
