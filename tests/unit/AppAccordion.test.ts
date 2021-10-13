import AppAccordion from "@/components/AppAccordion.vue";
import { mountComponent } from "..";

test("Expands and collapses", async () => {
  const slots = { title: "Test accordion", content: "Hello world" };
  const wrapper = await mountComponent(AppAccordion, { slots });
  const button = wrapper.find("button");
  expect(wrapper.text()).not.toContain("Hello world");
  await button.trigger("click");
  expect(wrapper.text()).toContain("Hello world");
});
