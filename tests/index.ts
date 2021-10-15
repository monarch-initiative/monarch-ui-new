import { mount, VueWrapper, MountingOptions } from "@vue/test-utils";
import {
  Component,
  ComponentPublicInstance,
  ComponentCustomProps,
  ComponentOptionsWithObjectProps,
} from "vue";
import fetchMock from "jest-fetch-mock";
import router from "@/router";
import components from "@/global/components";
import directives from "@/global/directives";
import "@/global/icons";

import obo from "./fixtures/obo.txt";

// mock window functions
window.scrollTo = jest.fn();
fetchMock.enableMocks();

// api call mocks
fetchMock.mockIf(/obo.+ontologies/, async () => obo);

// wrapper function for vue-test-utils mount, with extra setup before mounting
export const mountComponent = async (
  component: Component,
  other?: MountingOptions<ComponentCustomProps>
): Promise<VueWrapper<ComponentPublicInstance>> => {
  // setup router
  router.push("/");
  await router.isReady();

  // options for vue-test-utils mount function
  const mountOptions: MountingOptions<ComponentCustomProps> = {
    // standard options
    global: {
      components,
      directives,
      mocks: {
        $route: "home",
      },
      plugins: [router],
    },
    // merge in extra options
    ...other,
  };

  return mount(component as ComponentOptionsWithObjectProps, mountOptions);
};
