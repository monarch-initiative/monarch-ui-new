import { mount } from "@vue/test-utils";
import { axe, toHaveNoViolations } from "jest-axe";
import Home from "@/views/Home.vue";
import globalComponents from "@/global/components";

expect.extend(toHaveNoViolations);

// options for mounting component
const mountOptions = {
  global: {
    components: globalComponents,
    mocks: {
      $route: "home",
      $router: {
        push: jest.fn(),
      },
    },
  },
};

describe("Page accessibility checks", () => {
  it("Home page", async () => {
    const wrapper = mount(Home, mountOptions);
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
