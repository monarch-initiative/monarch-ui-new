import { mount, VueWrapper, MountingOptions } from "@vue/test-utils";
import {
  Component,
  ComponentPublicInstance,
  ComponentCustomProps,
  ComponentOptionsWithObjectProps,
} from "vue";
import router from "@/router";
import components from "@/global/components";
import directives from "@/global/directives";
import "@/global/icons";

// wrapper function for vue-test-utils mount, with extra setup before mounting
export const mountComponent = async (
  component: Component,
  other?: MountingOptions<ComponentCustomProps>
): Promise<VueWrapper<ComponentPublicInstance>> => {
  // setup router
  router.push("/");
  await router.isReady();

  // mock window functions
  window.scrollTo = jest.fn();

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
