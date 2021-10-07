import router from "@/router";
import globalComponents from "@/global/components";
import directives from "@/global/directives";

// mock window functions
window.scrollTo = jest.fn();

// standard options for mounting
export const mountOptions = {
  global: {
    components: globalComponents,
    directives,
    mocks: {
      $route: "home",
    },
    plugins: [router],
  },
};
