import router from "@/router";
import store from "@/store";
import tippy from "vue-tippy";
import "tippy.js/dist/tippy.css";
import "tippy.js/dist/border.css";
import { Plugin } from "vue";

// list of global plugins and their options
const plugins: Array<[Plugin, unknown]> = [
  [router, {}],
  [store, {}],
  [
    tippy,
    {
      directive: "tippy",
      component: "tippy",
      defaultProps: {
        delay: 100,
        duration: 200,
        allowHTML: true,
        // cancel show if no content to show
        onShow: ({ props }: { props: { content: unknown } }) =>
          !!String(props.content).trim(),
        // onHide: () => false, // for inspecting while debugging
      },
    },
  ],
];

export default plugins;
