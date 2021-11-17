import { flushPromises, mount } from "@vue/test-utils";
import AppFeedbackForm from "@/components/AppFeedbackForm.vue";
import { mountOptions, axiosMock } from "../setup";

test("Submits correctly when filled out", async () => {
  // mount
  const wrapper = mount(AppFeedbackForm, mountOptions);

  // fill out feedback textarea
  const textarea = wrapper.find("textarea");
  const testMessage = "Test message";
  await textarea.setValue(testMessage);

  // try to submit
  await wrapper.find("button").element.focus(); // focus submit button to simulate "explicit" submit, see form submit function
  await wrapper.find("form").trigger("submit.prevent");
  expect(wrapper.emitted()).toHaveProperty("submit");

  // check that api was mocked correctly
  expect(axiosMock.history.post.length).toBe(1);
  expect(axiosMock.history.post[0].data.includes(testMessage));

  // wait for async rendering to finish
  await flushPromises();

  // test status message and expect to be success
  const link = wrapper.find(".status a");
  expect(link.attributes("href")).toBeTruthy();
});
