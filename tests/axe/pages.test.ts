import router, { routes } from "@/router";
import { axe, toHaveNoViolations } from "jest-axe";
import { mount, flush } from "../setup";
import App from "@/App.vue";

// add axe to jest
expect.extend(toHaveNoViolations);

// get list of page paths to check
const pages = routes.map((route) => route.path);
// const pages = ["/feedback"];

test(
  "Page accessibility checks",
  async () => {
    // mount app
    const wrapper = mount(App);

    // go through each page/route
    for (const page of pages) {
      // log progress
      console.info(`\n========== Testing page ${page} ==========\n`);

      // navigate to new page
      router.push(page);
      await router.isReady();

      // wait until async rendering is done
      await flush();

      // analyze rendered html with axe
      const results = await axe(wrapper.element);
      expect(results).toHaveNoViolations();
    }
  },
  // allow plenty of seconds per page
  pages.length * 20 * 1000
);
