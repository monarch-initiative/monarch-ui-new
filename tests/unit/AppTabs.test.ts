import { mount } from "./../setup";
import AppTabs from "@/components/AppTabs.vue";

/** some example props for each test */
const props = {
  name: "Tab group",
  tabs: [
    { id: "apple", text: "Apple", icon: "asterisk" },
    { id: "banana", text: "Banana", icon: "cogs" },
    { id: "cherry", text: "Cherry", icon: "home" },
  ],
  default: "banana",
};

/** some example slots for each test */
const slots = {
  apple: "I'm a little apple",
  banana: "I'm a little banana",
  cherry: "I'm a little cherry",
};

test("Renders default", async () => {
  const wrapper = mount(AppTabs, { props, slots });
  const button = wrapper.find("button[tabindex='0']");
  expect(button.text()).toContain(props.tabs[1].text);
  const content = wrapper;
  expect(content.text()).not.toContain(slots.apple);
  expect(content.text()).toContain(slots.banana);
});

test("Switches by mouse", async () => {
  const wrapper = mount(AppTabs, { props, slots });
  const button = wrapper.find("button");
  const content = wrapper;
  await button.trigger("click");
  expect(content.text()).toContain(slots.apple);
});

test("Switches by keyboard", async () => {
  const wrapper = mount(AppTabs, {
    props,
    slots,
    attachTo: document.body,
  });
  const button = wrapper.find("button");
  const content = wrapper;
  await button.trigger("click");
  expect(content.text()).toContain(slots.apple);
  await button.trigger("keydown", { key: "ArrowLeft" });
  expect(content.text()).toContain(slots.cherry);
  await button.trigger("keydown", { key: "ArrowLeft" });
  expect(content.text()).toContain(slots.banana);
  await button.trigger("keydown", { key: "ArrowRight" });
  expect(content.text()).toContain(slots.cherry);
});
