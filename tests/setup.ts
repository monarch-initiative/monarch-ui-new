import { MountingOptions } from "@vue/test-utils";
import { ComponentCustomProps } from "vue";
import router from "@/router";
import components from "@/global/components";
import mixins from "@/global/mixins";
import plugins from "@/global/plugins";
import directives from "@/global/directives";
import { axiosMock } from "./fixtures/api-mocks";
import "@/global/icons";

// mock global/window/browser functions
window.scrollTo = jest.fn();
HTMLCanvasElement.prototype.getContext = jest.fn();
window.ResizeObserver = jest
  .fn()
  .mockImplementation(() => ({ observe: jest.fn() }));

// run before each test
beforeEach(async () => {
  // set default route and wait until ready
  router.push("/");
  await router.isReady();

  // reset mock history so number of get/post/etc calls start at 0 for each test
  axiosMock.resetHistory();
});

// standard mounting options
export const mountOptions: MountingOptions<ComponentCustomProps> = {
  global: {
    components,
    mixins,
    directives,
    plugins,
  },
};
