import { emitted } from "./../setup";
import { mount } from "../setup";
import AppTextbox from "@/components/AppTextbox.vue";

/** two-way bound state */
const vModel = { modelValue: "dummy text" };

test("Button clears text", async () => {
  const wrapper = mount(AppTextbox, undefined, vModel);
  await wrapper.find("button").trigger("click");
  expect(emitted(wrapper)[0]).toBe("");
});
