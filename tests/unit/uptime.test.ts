import { axiosMock } from "./../fixtures/api-mocks";
import { flushPromises, mount } from "@vue/test-utils";
import { mountOptions } from "../setup";
import Help from "@/views/help/Help.vue";

test("Help page renders uptimerobot statuses", async () => {
  // mount and wait until async rendering is done
  const wrapper = mount(Help, mountOptions);
  await flushPromises();

  // check that one axios POST mock has happened (get uptimerobot statuses)
  expect(axiosMock.history.post.length).toBe(1);

  // check that various statuses exist. fixture data contains all possible
  // status types from uptimerobot. check that all of them get converted to and
  // displayed as appropriate status components.
  expect(wrapper.find("[data-code='success']").exists()).toBeTruthy();
  expect(wrapper.find("[data-code='paused']").exists()).toBeTruthy();
  expect(wrapper.find("[data-code='error']").exists()).toBeTruthy();
  expect(wrapper.find("[data-code='unknown']").exists()).toBeTruthy();
});
