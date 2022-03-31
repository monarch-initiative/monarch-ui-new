import { mount, emitted } from "../setup";
import AppTable from "@/components/AppTable.vue";

// some example props
const props = {
  cols: [
    {
      id: "name",
      key: "name",
      heading: "Name",
      align: "left",
      sortable: true,
    },
    {
      id: "score",
      key: "score",
      heading: "Score",
      availableFilters: [{ id: "numbers" }, { id: "nulls" }],
      activeFilters: [{ id: "numbers" }],
      sortable: true,
    },
    {
      id: "details",
      key: "details",
      heading: "Details",
      align: "left",
      sortable: true,
    },
    {
      id: "arbitrary",
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
  sort: { id: "score", direction: "up" },
  perPage: 10,
  start: 1,
  total: 123,
  search: "",
};

test("Changes sort", async () => {
  const wrapper = mount(AppTable, { props });
  await wrapper.findAll("thead button").at(0)?.trigger("click");
  expect(emitted(wrapper, "sort")[0]).toEqual({
    id: "name",
    direction: "down",
  });
});

test("Changes filter", async () => {
  const wrapper = mount(AppTable, { props });
  await wrapper.findAll("thead button").at(2)?.trigger("click");
  await wrapper.find("[role='option']").trigger("click");
  expect(emitted(wrapper, "filter")).toEqual([1, []]);
  await wrapper.findAll("[role='option']").at(1)?.trigger("click");
  expect(emitted(wrapper, "filter")).toEqual([1, [{ id: "nulls" }]]);
});

test("Changes per page", async () => {
  const wrapper = mount(AppTable, { props });
  await wrapper.find(".controls div:nth-child(1) button").trigger("click");
  await wrapper.find("[role='option']").trigger("click");
  expect(emitted(wrapper, "perPage")).toEqual([5]);
});

test("Changes pages", async () => {
  const wrapper = mount(AppTable, { props });
  const nav = wrapper.findAll(".controls div:nth-child(2) button");
  await nav.at(1)?.trigger("click");
  expect(emitted(wrapper, "start"));
  await nav.at(2)?.trigger("click");
  expect(emitted(wrapper, "start"));
  await nav.at(3)?.trigger("click");
  expect(emitted(wrapper, "start"));
  await nav.at(4)?.trigger("click");
  expect(emitted(wrapper, "start"));
});

test("Changes search", async () => {
  const wrapper = mount(AppTable, { props });
  await wrapper.find("input").setValue("test search");
  expect(emitted(wrapper, "search")).toEqual(["test search"]);
});

test("Downloads", async () => {
  const wrapper = mount(AppTable, { props });
  await wrapper.find(".controls div:nth-child(3) button").trigger("click");
  expect(emitted(wrapper, "download")).toEqual([]);
});
