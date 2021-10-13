import AppButton from "@/components/AppButton.vue";
import { mountComponent } from "..";

test("Renders as link", async () => {
  const props = { text: "Test link", to: "https://google.com/" };
  const wrapper = await mountComponent(AppButton, { props });
  expect(wrapper.find("a").exists()).toBeTruthy();
});

test("Renders as button", async () => {
  const props = { text: "Test link", click: () => null };
  const wrapper = await mountComponent(AppButton, { props });
  expect(wrapper.find("button").exists()).toBeTruthy();
});
