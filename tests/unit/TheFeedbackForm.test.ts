import { mount, apiCall } from "../setup";
import TheFeedbackForm from "@/components/TheFeedbackForm.vue";

test("Submits correctly when filled out", async () => {
  /** mount */
  const wrapper = mount(TheFeedbackForm, { attachTo: document.body });

  /** fill out feedback textarea */
  const textarea = wrapper.find("textarea");
  const testMessage = "Test message";
  await textarea.setValue(testMessage);

  /** submit form. pass fake submit event (see form submit code). */
  await wrapper.find("form").trigger("submit", { submitter: "non-null value" });

  /** wait for api calls to mock */
  await apiCall();

  /** test status message and expect to be success */
  const link = wrapper.find(".status a");
  expect(link.attributes("href")).toBeTruthy();
});
