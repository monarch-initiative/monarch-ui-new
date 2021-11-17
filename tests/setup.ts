import { MountingOptions } from "@vue/test-utils";
import { ComponentCustomProps } from "vue";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import router from "@/router";
import components from "@/global/components";
import mixins from "@/global/mixins";
import plugins from "@/global/plugins";
import directives from "@/global/directives";
import { fixtures } from "./fixtures";
import "@/global/icons";

// mock window functions
window.scrollTo = jest.fn();

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

// api call mocks
export const axiosMock = new MockAdapter(axios);
for (const [method, url, , response] of fixtures) {
  if (method === "POST") axiosMock.onPost(url).reply(200, response);
  else axiosMock.onGet(url).reply(200, response);
}
