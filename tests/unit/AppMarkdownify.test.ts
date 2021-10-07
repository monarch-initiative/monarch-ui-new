import { mount } from "@vue/test-utils";
import AppMarkdownify from "@/components/AppMarkdownify.vue";
import { mountOptions } from ".";

it("Renders some simple markdown", () => {
  const props = { source: "**Hello** _World_ [test link](google.com)" };
  const wrapper = mount(AppMarkdownify, { ...mountOptions, props });
  expect(wrapper.find("strong").exists()).toBeTruthy(); // look for bold
  expect(wrapper.find("em").exists()).toBeTruthy(); // look for italics
  expect(wrapper.find("a").exists()).toBeTruthy(); // look for link
});
