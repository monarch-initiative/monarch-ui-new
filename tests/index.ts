import router from "@/router";
import globalComponents from "@/global/components";

// options for mounting components
export const mountOptions = {
  global: {
    components: globalComponents,
    mocks: {
      $route: "home",
      $router: {
        push: jest.fn(),
      },
    },
    plugins: [router],
  },
};
