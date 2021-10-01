import { mount } from "@vue/test-utils";
import { axe, toHaveNoViolations } from "jest-axe";
import Home from "@/views/Home.vue";
import { mountOptions } from "../";

expect.extend(toHaveNoViolations);

describe("Page accessibility checks", () => {
  it("Home page", async () => {
    const wrapper = mount(Home, mountOptions);
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
