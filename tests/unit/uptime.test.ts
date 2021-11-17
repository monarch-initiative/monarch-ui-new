import { mount } from "@vue/test-utils";
import { mountOptions, flush } from "../setup";
import Help from "@/views/help/Help.vue";

test("Help page renders uptimerobot statuses", async () => {
  // mount and wait until async rendering is done
  const wrapper = mount(Help, mountOptions);

  // wait for async rendering to finish
  await flush();

  // check that various statuses exist. fixture data contains all possible
  // status types from uptimerobot. check that all of them get converted to and
  // displayed as appropriate status components.
  expect(wrapper.find("[data-code='success']").exists()).toBeTruthy();
  expect(wrapper.find("[data-code='paused']").exists()).toBeTruthy();
  expect(wrapper.find("[data-code='error']").exists()).toBeTruthy();
  expect(wrapper.find("[data-code='unknown']").exists()).toBeTruthy();
});
