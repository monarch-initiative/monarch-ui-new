// jest setup

import { MountingOptions } from "@vue/test-utils";
import { nextTick, ComponentCustomProps } from "vue";
import { setupServer } from "msw/node";
import fetch from "node-fetch";
import router from "@/router";
import components from "@/global/components";
import mixins from "@/global/mixins";
import plugins from "@/global/plugins";
import directives from "@/global/directives";
import { sleep } from "./../src/util/debug";
import { handlers } from "./fixtures";
import "@/global/icons";

// mock global/window/browser functions
window.scrollTo = jest.fn();
HTMLCanvasElement.prototype.getContext = jest.fn();
window.ResizeObserver = jest
  .fn()
  .mockImplementation(() => ({ observe: jest.fn() }));
window.fetch = jest.fn().mockImplementation(fetch);

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
    mixins,
    directives,
    plugins,
  },
};

// setup mock-service-worker for node.js (jest)
const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// util function to wait for promises, async rendering, dom updates, etc
export const flush = async (): Promise<void> => {
  await sleep(); // equivalent to flushPromises() https://github.com/vuejs/vue-test-utils-next/blob/master/src/utils/flushPromises.ts
  await sleep(); // see https://github.com/mswjs/msw/discussions/988
  await nextTick(); // for good measure, see https://github.com/vuejs/vue-test-utils-next/issues/137
  await sleep(100); // add wiggle room
};
