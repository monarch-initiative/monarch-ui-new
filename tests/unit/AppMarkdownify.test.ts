import AppMarkdown from "@/components/AppMarkdown.vue";
import { mountComponent } from "..";

test("Renders some simple markdown", async () => {
  const props = { source: "**Hello** _World_ [test link](google.com)" };
  const wrapper = await mountComponent(AppMarkdown, { props });
  expect(wrapper.find("strong").exists()).toBeTruthy(); // look for bold
  expect(wrapper.find("em").exists()).toBeTruthy(); // look for italics
  expect(wrapper.find("a").exists()).toBeTruthy(); // look for link
});
