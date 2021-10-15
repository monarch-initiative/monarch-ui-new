import router, { routes } from "@/router";
import { axe, toHaveNoViolations } from "jest-axe";
import App from "@/App.vue";
import { mountComponent } from "..";

expect.extend(toHaveNoViolations);

// get list of page paths to check
const pages = routes.map((route) => route.path);

test(
  "Page accessibility checks",
  async () => {
    const wrapper = await mountComponent(App);
    for (const page of pages) {
      router.push(page);
      await router.isReady();
      const results = await axe(wrapper.element);
      console.log(`\n========== Testing page ${page} ==========\n`);
      expect(results).toHaveNoViolations();
    }
  },
  // allow multiple seconds per page
  pages.length * 10 * 1000
);
