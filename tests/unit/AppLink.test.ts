import AppLink from "@/components/AppLink.vue";
import { mountComponent } from "..";

test("Renders as link", async () => {
  const props = { to: "https://google.com/" };
  const wrapper = await mountComponent(AppLink, { props });
  expect(wrapper.find("a").exists()).toBeTruthy();
});

test("Renders as router-link", async () => {
  const props = { to: "/about" };
  const wrapper = await mountComponent(AppLink, { props });
  expect(wrapper.findComponent({ name: "router-link" }).exists()).toBeTruthy();
});
