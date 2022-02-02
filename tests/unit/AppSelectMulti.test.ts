import { ComponentPublicInstance } from "vue";
import { mount, VueWrapper } from "@vue/test-utils";
import AppSelectMulti from "@/components/AppSelectMulti.vue";
import { mountOptions } from "../setup";

// some example props for each test
type Options = Array<Record<string, unknown>>;
const props = {
  name: "Multi select",
  options: [
    { value: "fruits", count: 0 },
    { value: "vegetables", count: 7 },
    { value: "colors", count: 42 },
    { value: "animals", count: 999 },
  ],
  modelValue: [{ value: "vegetables" }],
};

// pop last v-model value change from mounted wrapper
const lastValue = (wrapper: VueWrapper<ComponentPublicInstance>): Options =>
  (wrapper.emitted()["update:modelValue"].pop() as Array<Options>)[0];

test("Opens/closes on click", async () => {
  const wrapper = mount(AppSelectMulti, { ...mountOptions, props });
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
  const wrapper = mount(AppSelectMulti, { ...mountOptions, props });
  const button = wrapper.find("button");
  await button.trigger("click");
  await wrapper.findAll("[role='option']").at(0)?.trigger("click");
  expect(lastValue(wrapper).length).toEqual(2);
  await wrapper.findAll("[role='option']").at(2)?.trigger("click");
  expect(lastValue(wrapper).length).toEqual(3);
  await wrapper.findAll("[role='option']").at(3)?.trigger("click");
  expect(lastValue(wrapper).length).toEqual(4);
});

test("Selects by keyboard", async () => {
  const wrapper = mount(AppSelectMulti, { ...mountOptions, props });
  const button = wrapper.find("button");
  await button.trigger("click");
  await button.trigger("keydown", { key: "ArrowUp" });
  await button.trigger("keydown", { key: "Enter" });
  expect(lastValue(wrapper).length).toEqual(2);
  await button.trigger("keydown", { key: "ArrowUp" });
  await button.trigger("keydown", { key: "ArrowUp" });
  await button.trigger("keydown", { key: "Enter" });
  expect(lastValue(wrapper).length).toEqual(3);
  await button.trigger("keydown", { key: "ArrowUp" });
  await button.trigger("keydown", { key: "Enter" });
  expect(lastValue(wrapper).length).toEqual(4);
});

test("Selects all by click", async () => {
  const wrapper = mount(AppSelectMulti, { ...mountOptions, props });
  const button = wrapper.find("button");
  await button.trigger("click");
  const option = wrapper.find("[role='menuitem']");
  await option.trigger("click");
  expect(lastValue(wrapper).length).toEqual(4);
  await option.trigger("click");
  expect(lastValue(wrapper).length).toEqual(0);
});
