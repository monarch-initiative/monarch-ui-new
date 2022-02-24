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
  const button = wrapper.find("button[aria-label*='Sort by Name']");
  await button.trigger("click");
  expect(emitted(wrapper, "sort")[0]).toEqual({
    key: "name",
    direction: "down",
  });
});

test("Changes filter", async () => {
  const wrapper = mount(AppTable, { ...mountOptions, props });
  const button = wrapper.find("button[aria-label*='Filter by Score']");
  await button.trigger("click");
  const option = wrapper.find("tr[role='option']");
  await option.trigger("click");
  expect(emitted(wrapper, "filter")).toEqual([1, []]);
});
