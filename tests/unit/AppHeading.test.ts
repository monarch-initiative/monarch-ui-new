import { nextTick } from "vue";
import { mount } from "../setup";
import AppHeadings from "./AppHeadings.vue";

const tags = "h1, h2, h3";

test("Chooses heading levels correctly", async () => {
  /** mount test component */
  const wrapper = mount(AppHeadings);
  await nextTick();

  /** find all heading components */
  const headings = wrapper.findAll(tags);

  /** compare expected tag to actual rendered tag */
  expect(headings.at(0)?.element.tagName).toBe("H1");
  expect(headings.at(1)?.element.tagName).toBe("H2");
  expect(headings.at(2)?.element.tagName).toBe("H3");
});

test("Creates heading links correctly", async () => {
  /** mount hoc */
  const wrapper = mount(AppHeadings);
  await nextTick();

  /** find all heading components */
  const headings = wrapper.findAll(tags);

  /** compare expected link to actual rendered link */
  expect(headings.at(0)?.attributes("id")).toContain("abc-def-gih");
  expect(headings.at(0)?.find("a").attributes("href")).toContain(
    "#abc-def-gih"
  );
  expect(headings.at(1)?.attributes("id")).toContain("123-alphabet-street");
  expect(headings.at(1)?.find("a").attributes("href")).toContain(
    "#123-alphabet-street"
  );
  expect(headings.at(2)?.attributes("id")).toContain("aeo");
  expect(headings.at(2)?.find("a").attributes("href")).toContain("#aeo");
});
