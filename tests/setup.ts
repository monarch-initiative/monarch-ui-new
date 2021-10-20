import { MountingOptions } from "@vue/test-utils";
import { ComponentCustomProps } from "vue";
import router from "@/router";
import components from "@/global/components";
import directives from "@/global/directives";
import "@/global/icons";

// mock window functions
window.scrollTo = jest.fn();

// run before each test
beforeEach(async () => {
  // set default route and wait until ready
  router.push("/");
  await router.isReady();
});

// standard mounting options
export const mountOptions: MountingOptions<ComponentCustomProps> = {
  global: {
    components,
    directives,
    plugins: [router],
  },
};
