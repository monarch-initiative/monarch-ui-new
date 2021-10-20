import { mount } from "@vue/test-utils";
import router, { routes } from "@/router";
import { axe, toHaveNoViolations } from "jest-axe";
import { mountOptions } from "../setup";
import App from "@/App.vue";

expect.extend(toHaveNoViolations);

// get list of page paths to check
const pages = routes.map((route) => route.path);
// const pages = ["/sources"];

test(
  "Page accessibility checks",
  async () => {
    const wrapper = mount(App, mountOptions);
    for (const page of pages) {
      router.push(page);
      await router.isReady();
      const results = await axe(wrapper.element);
      console.log(`\n========== Testing page ${page} ==========\n`);
      expect(results).toHaveNoViolations();
    }
  },
  // allow plenty of seconds per page
  pages.length * 10 * 1000
);
