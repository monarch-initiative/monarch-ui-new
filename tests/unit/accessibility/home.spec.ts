import App from "@/views/Home.vue";

import { mount } from "@vue/test-utils";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

const mockRouter = {
  push: jest.fn(),
};

describe("Page accessibility checks", () => {
  it("Home page", async () => {
    const wrapper = mount(App, {
      global: {
        mocks: {
          $route: "home",
          $router: mockRouter,
        },
      },
    });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
