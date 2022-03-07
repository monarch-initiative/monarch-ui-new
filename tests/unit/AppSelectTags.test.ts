import { mount, emitted } from "../setup";
import AppSelectTags from "@/components/AppSelectTags.vue";

// some example props for each test
const props = {
  name: "Tags select",
  options: (search: string) =>
    [
      { value: "fruits" },
      { value: "vegetables", count: 7 },
      { value: "colors", count: 42 },
      { value: "animals" },
    ].filter((entry) => entry.value.includes(search)),
  modelValue: [{ value: "animals" }],
};

// expected type of emitted update:modelValue events
type T = Array<unknown>;

test("Buttons click to deselect", async () => {
  const wrapper = mount(AppSelectTags, { props });
  await wrapper.find("button").trigger("click");
  expect(emitted<T>(wrapper)[0].length).toEqual(0);
});

test("Types to search", async () => {
  const wrapper = mount(AppSelectTags, { props });
  await wrapper.find("input").trigger("focus");
  expect(wrapper.findAll("[role='option']").length).toBe(3);
  await wrapper.find("input").setValue("veg");
  expect(wrapper.findAll("[role='option']").length).toBe(1);
});

test("Clicks to select", async () => {
  const wrapper = mount(AppSelectTags, { props });
  await wrapper.find("input").trigger("focus");
  await wrapper.findAll("[role='option']").at(0)?.trigger("click");
  expect(emitted<T>(wrapper)[0].length).toEqual(2);
  await wrapper.findAll("[role='option']").at(0)?.trigger("click");
  expect(emitted<T>(wrapper)[0].length).toEqual(3);
  await wrapper.findAll("[role='option']").at(0)?.trigger("click");
  expect(emitted<T>(wrapper)[0].length).toEqual(4);
});

test("Selects by keyboard", async () => {
  const wrapper = mount(AppSelectTags, { props });
  const input = wrapper.find("input");
  await input.trigger("focus");
  await input.trigger("keydown", { key: "ArrowUp" });
  await input.trigger("keydown", { key: "Enter" });
  expect(emitted<T>(wrapper)[0].length).toEqual(2);
  await input.trigger("keydown", { key: "ArrowUp" });
  await input.trigger("keydown", { key: "Enter" });
  expect(emitted<T>(wrapper)[0].length).toEqual(3);
});
