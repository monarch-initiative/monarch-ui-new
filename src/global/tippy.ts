import { Instance } from "tippy.js";

// when tippy instances attached to element
const onCreate = (instance: Instance): void => {
  if (
    // element has no text
    !(instance.reference as HTMLElement).innerText?.trim() &&
    // element has no aria label already
    !instance.reference.getAttribute("aria-label") &&
    // tooltip content is plain string
    typeof instance.props.content === "string"
  )
    // set aria label from tooltip content as fallback
    instance.reference.setAttribute("aria-label", instance.props.content);
};

// cancel show if no content to show
const onShow = (instance: Instance): boolean =>
  !!String(instance.props.content).trim();

// return false to inspect popup for debugging
const onHide = (): boolean => true;

export const options = {
  directive: "tippy",
  component: "tippy",
  defaultProps: {
    delay: 100,
    duration: 200,
    offset: [13, 13],
    allowHTML: true,
    onCreate,
    onShow,
    onHide,
  },
};
