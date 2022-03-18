import { mount, apiCall } from "../setup";
import TheFeedbackForm from "@/components/TheFeedbackForm.vue";

test("Submits correctly when filled out", async () => {
  // mount
  const wrapper = mount(TheFeedbackForm);

  // fill out feedback textarea
  const textarea = wrapper.find("textarea");
  const testMessage = "Test message";
  await textarea.setValue(testMessage);

  // try to submit
  await wrapper.find("button").element.focus(); // focus submit button to simulate "explicit" submit, see form submit function
  await wrapper.find("form").trigger("submit.prevent");
  expect(wrapper.emitted()).toHaveProperty("submit");

  // wait for api calls to mock
  await apiCall();

  // test status message and expect to be success
  const link = wrapper.find(".status a");
  expect(link.attributes("href")).toBeTruthy();
});
