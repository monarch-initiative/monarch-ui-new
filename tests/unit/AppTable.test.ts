import { mount } from "@vue/test-utils";
import AppTable from "@/components/AppTable.vue";
import { mountOptions, emitted } from "../setup";

// some example props
const props = {
  cols: [
    {
      key: "name",
      heading: "Name",
      align: "left",
      sortable: true,
    },
    {
      key: "score",
      heading: "Score",
      availableFilters: [{ value: "numbers" }, { value: "nulls" }],
      activeFilters: [{ value: "numbers" }],
      sortable: true,
    },
    {
      key: "details",
      heading: "Details",
      align: "left",
      sortable: true,
    },
    {
      key: "arbitrary",
      heading: "Arbitrary",
      align: "right",
    },
  ],
  rows: [
    { name: "abc", score: 9, details: [1, 2] },
    { name: "def", score: -1, details: [2, 1, 3] },
    { name: "def", score: 2, details: [1] },
    { name: "abc", score: 4, details: [2, 1] },
    { name: "ghi", score: NaN, details: [1] },
  ],
  sort: { key: "score", direction: "up" },
  perPage: 10,
  start: 1,
  end: 11,
  total: 123,
  search: "",
};

test("Changes sort", async () => {
  const wrapper = mount(AppTable, { ...mountOptions, props });
  await wrapper.find("button[aria-label*='by name' i]").trigger("click");
  expect(emitted(wrapper, "sort")[0]).toEqual({
    key: "name",
    direction: "down",
  });
});

test("Changes filter", async () => {
  const wrapper = mount(AppTable, { ...mountOptions, props });
  await wrapper
    .find("button[aria-label*='filter' i][aria-label*='score' i]")
    .trigger("click");
  await wrapper.find("tr[role='option']").trigger("click");
  expect(emitted(wrapper, "filter")).toEqual([1, []]);
  await wrapper.findAll("tr[role='option']").at(1)?.trigger("click");
  expect(emitted(wrapper, "filter")).toEqual([1, [{ value: "nulls" }]]);
});

test("Changes per page", async () => {
  const wrapper = mount(AppTable, { ...mountOptions, props });
  await wrapper.find("button[aria-label*='rows per page' i]").trigger("click");
  await wrapper.find("div[role='option']").trigger("click");
  expect(emitted(wrapper, "perPage")).toEqual([5]);
});

test("Changes pages", async () => {
  const wrapper = mount(AppTable, { ...mountOptions, props });
  await wrapper.find("button[aria-label*='first' i]").trigger("click");
  expect(emitted(wrapper, "first")).toEqual([]);
  await wrapper.find("button[aria-label*='previous' i]").trigger("click");
  expect(emitted(wrapper, "prev")).toEqual([]);
  await wrapper.find("button[aria-label*='next' i]").trigger("click");
  expect(emitted(wrapper, "next")).toEqual([]);
  await wrapper.find("button[aria-label*='last' i]").trigger("click");
  expect(emitted(wrapper, "last")).toEqual([]);
});

test("Changes search", async () => {
  const wrapper = mount(AppTable, { ...mountOptions, props });
  await wrapper.find("input").setValue("test search");
  expect(emitted(wrapper, "search")).toEqual(["test search"]);
});

test("Downloads", async () => {
  const wrapper = mount(AppTable, { ...mountOptions, props });
  await wrapper.find("button[aria-label*='download' i]").trigger("click");
  expect(emitted(wrapper, "download")).toEqual([]);
});
