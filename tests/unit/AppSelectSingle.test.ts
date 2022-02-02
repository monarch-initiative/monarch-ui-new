import { ComponentPublicInstance } from "vue";
import { mount, VueWrapper } from "@vue/test-utils";
import AppSelectSingle from "@/components/AppSelectSingle.vue";
import { mountOptions } from "../setup";

// some example props for each test
type Options = Array<string>;
const props = {
  name: "Single select",
  options: ["apple", "banana", "cherry"],
  modelValue: "banana",
};

// pop last v-model value change from mounted wrapper
const lastValue = (wrapper: VueWrapper<ComponentPublicInstance>): Options =>
  (wrapper.emitted()["update:modelValue"].pop() as Array<Options>)[0];

test("Opens/closes on click", async () => {
  const wrapper = mount(AppSelectSingle, { ...mountOptions, props });
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
  const wrapper = mount(AppSelectSingle, { ...mountOptions, props });
  const button = wrapper.find("button");
  await button.trigger("click");
  const option = wrapper.find("[role='option']");
  await option.trigger("click");
  expect(wrapper.find("[role='listbox']").exists()).toBe(false);
  expect(lastValue(wrapper)).toEqual([props.options[0]]);
});

test("Selects by keyboard", async () => {
  const wrapper = mount(AppSelectSingle, { ...mountOptions, props });
  const button = wrapper.find("button");
  await button.trigger("focus");
  await button.trigger("keydown", { key: "ArrowDown" });
  expect(lastValue(wrapper)).toEqual(props.options[2]);
  await button.trigger("keydown", { key: "ArrowDown" });
  expect(lastValue(wrapper)).toEqual(props.options[0]);
  await button.trigger("keydown", { key: "ArrowDown" });
  expect(lastValue(wrapper)).toEqual(props.options[1]);
  await button.trigger("click");
  await button.trigger("keydown", { key: "ArrowDown" });
  await button.trigger("keydown", { key: "ArrowDown" });
  await button.trigger("keydown", { key: "ArrowDown" });
  await button.trigger("keydown", { key: "ArrowDown" });
  await button.trigger("keydown", { key: "Enter" });
  expect(lastValue(wrapper)).toEqual(props.options[2]);
});
