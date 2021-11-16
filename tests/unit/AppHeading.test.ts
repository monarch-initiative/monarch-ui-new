import { flushPromises, mount } from "@vue/test-utils";
import AppHeadings from "./AppHeadings.vue";
import { mountOptions } from "../setup";

const tags = "h1, h2, h3, h4";

test("Chooses heading levels correctly", async () => {
  // mount hoc
  const wrapper = mount(AppHeadings, mountOptions);

  // wait for async rendering to finish
  await flushPromises();

  // find all heading components
  const headings = wrapper.findAll(tags);

  // go through each
  for (const heading of headings) {
    // compare expected tag to actual rendered tag
    const received = heading.element.tagName.toLowerCase();
    const expected = heading.attributes("data-tag")?.toLowerCase();
    expect(received).toBe(expected);
  }
});

test("Creates heading links correctly", async () => {
  // mount hoc
  const wrapper = mount(AppHeadings, mountOptions);

  // wait for async rendering to finish
  await flushPromises();

  // find all heading components
  const headings = wrapper.findAll(tags);

  // go through each
  for (const heading of headings) {
    // compare expected link to actual rendered link
    const received = heading.attributes("id");
    const expected = heading.attributes("data-link");
    expect(received).toBe(expected);
  }
});
