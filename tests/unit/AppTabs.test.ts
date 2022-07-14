import { mount, emitted } from "./../setup";
import AppTabs from "@/components/AppTabs.vue";

/** some example props for each test */
const props = {
  name: "Tab group",
  modelValue: "banana",
  tabs: [
    { id: "apple", text: "Apple", icon: "asterisk" },
    { id: "banana", text: "Banana", icon: "cogs" },
    { id: "cherry", text: "Cherry", icon: "home" },
  ],
};

test("Renders properly", async () => {
  const wrapper = mount(AppTabs, { props });
  const button = wrapper.find("button[tabindex='0']");
  expect(button.text()).toContain(props.tabs[1].text);
});

test("Switches by mouse", async () => {
  const wrapper = mount(AppTabs, { props });
  const button = wrapper.find("button");
  await button.trigger("click");
  expect(emitted(wrapper)).toEqual(["apple"]);
});

test("Switches by keyboard", async () => {
  const wrapper = mount(AppTabs, {
    props,
    attachTo: document.body,
  });
  const button = wrapper.find("button");
  await button.trigger("click");
  expect(emitted(wrapper)).toEqual(["apple"]);
  await button.trigger("keydown", { key: "ArrowLeft" });
  expect(emitted(wrapper)).toEqual(["apple"]);
  await button.trigger("keydown", { key: "ArrowRight" });
  expect(emitted(wrapper)).toEqual(["cherry"]);
});
