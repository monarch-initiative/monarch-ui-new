import { mount, emitted } from "../setup";
import AppSelectSingle from "@/components/AppSelectSingle.vue";

// some example props for each test
const props = {
  name: "Single select",
  options: ["apple", "banana", "cherry"],
  modelValue: "banana",
};

test("Opens/closes on click", async () => {
  const wrapper = mount(AppSelectSingle, { props });
  const button = wrapper.find("button");
  await button.trigger("click");
  expect(wrapper.find("[role='listbox']").exists()).toBe(true);
  await button.trigger("click");
  expect(wrapper.find("[role='listbox']").exists()).toBe(false);
  await button.trigger("click");
  expect(wrapper.find("[role='listbox']").exists()).toBe(true);
  await button.trigger("blur");
  expect(wrapper.find("[role='listbox']").exists()).toBe(false);
});

test("Selects by click", async () => {
  const wrapper = mount(AppSelectSingle, { props });
  const button = wrapper.find("button");
  await button.trigger("click");
  const option = wrapper.find("[role='option']");
  await option.trigger("click");
  expect(wrapper.find("[role='listbox']").exists()).toBe(false);
  expect(emitted(wrapper)[0]).toEqual(props.options[0]);
});

test("Selects by keyboard", async () => {
  const wrapper = mount(AppSelectSingle, { props });
  const button = wrapper.find("button");
  await button.trigger("focus");
  await button.trigger("keydown", { key: "ArrowDown" });
  expect(emitted(wrapper)[0]).toEqual(props.options[2]);
  await button.trigger("keydown", { key: "ArrowDown" });
  expect(emitted(wrapper)[0]).toEqual(props.options[0]);
  await button.trigger("keydown", { key: "ArrowDown" });
  expect(emitted(wrapper)[0]).toEqual(props.options[1]);
  await button.trigger("click");
  await button.trigger("keydown", { key: "ArrowDown" });
  await button.trigger("keydown", { key: "ArrowDown" });
  await button.trigger("keydown", { key: "ArrowDown" });
  await button.trigger("keydown", { key: "ArrowDown" });
  await button.trigger("keydown", { key: "Enter" });
  expect(emitted(wrapper)[0]).toEqual(props.options[2]);
});
