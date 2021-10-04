import router from "@/router";
import globalComponents from "@/global/components";
import directives from "@/global/directives";

// mock window functions
window.scrollTo = jest.fn();

// standard options for mounting components
export const mountOptions = {
  global: {
    components: globalComponents,
    directives,
    mocks: {
      $route: "home",
      $router: {
        push: jest.fn(),
      },
    },
    plugins: [router],
  },
};
