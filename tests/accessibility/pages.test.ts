import router from "@/router";
import { axe, toHaveNoViolations } from "jest-axe";
import App from "@/App.vue";
import { mountComponent } from "..";

expect.extend(toHaveNoViolations);

const pages = ["home", "explore", "tools", "about", "help"];

test(
  "Page accessibility checks",
  async () => {
    const wrapper = await mountComponent(App);
    for (const page of pages) {
      router.push("/" + page);
      await router.isReady();
      const results = await axe(wrapper.element);
      expect(results).toHaveNoViolations();
    }
  },
  60 * 1000
);
