import { mount } from "@vue/test-utils";
import AppSelectMulti from "@/components/AppSelectMulti.vue";
import { mountOptions, emitted } from "../setup";

// some example props for each test
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

// expected type of emitted update:modelValue events
type T = Array<unknown>;

test("Selects by click", async () => {
  const wrapper = mount(AppSelectMulti, { ...mountOptions, props });
  const button = wrapper.find("button");
  await button.trigger("click");
  await wrapper.findAll("[role='option']").at(0)?.trigger("click");
  expect(emitted<T>(wrapper)[0].length).toEqual(2);
  await wrapper.findAll("[role='option']").at(2)?.trigger("click");
  expect(emitted<T>(wrapper)[0].length).toEqual(3);
  await wrapper.findAll("[role='option']").at(3)?.trigger("click");
  expect(emitted<T>(wrapper)[0].length).toEqual(4);
});

test("Selects by keyboard", async () => {
  const wrapper = mount(AppSelectMulti, { ...mountOptions, props });
  const button = wrapper.find("button");
  await button.trigger("click");
  await button.trigger("keydown", { key: "ArrowUp" });
  await button.trigger("keydown", { key: "Enter" });
  expect(emitted<T>(wrapper)[0].length).toEqual(2);
  await button.trigger("keydown", { key: "ArrowUp" });
  await button.trigger("keydown", { key: "ArrowUp" });
  await button.trigger("keydown", { key: "Enter" });
  expect(emitted<T>(wrapper)[0].length).toEqual(3);
  await button.trigger("keydown", { key: "ArrowUp" });
  await button.trigger("keydown", { key: "Enter" });
  expect(emitted<T>(wrapper)[0].length).toEqual(4);
});

test("Selects all by click", async () => {
  const wrapper = mount(AppSelectMulti, { ...mountOptions, props });
  const button = wrapper.find("button");
  await button.trigger("click");
  const option = wrapper.find("[role='menuitem']");
  await option.trigger("click");
  expect(emitted<T>(wrapper)[0].length).toEqual(4);
  await option.trigger("click");
  expect(emitted<T>(wrapper)[0].length).toEqual(0);
});
