import { DirectiveBinding } from "vue";
import tippy, { Instance, ReferenceElement } from "tippy.js";
import "tippy.js/dist/tippy.css";

// tooltip directive
// usage: v-tooltip="Tooltip text"
// shows a tooltip on hover or focus

const setAriaLabel = (element: ReferenceElement, tooltip: string) => {
  if (!element.getAttribute("aria-label"))
    element.setAttribute(
      "aria-label",
      ((element as HTMLElement).innerText + " - " + tooltip).toLowerCase()
    );
};

// when element created
const mounted = (
  element: ReferenceElement,
  { value }: DirectiveBinding
): void => {
  if (value) {
    tippy(element, { content: value, delay: 100, duration: 200 });
    setAriaLabel(element, value);
  }
};

// when element updated
const updated = (
  element: ReferenceElement,
  { value }: DirectiveBinding
): void => {
  if (value) (element._tippy as Instance)?.setContent(value);
  else (element._tippy as Instance)?.destroy();
  setAriaLabel(element, value);
};

// when element destroyed
const beforeUnmount = (element: ReferenceElement): void => {
  (element._tippy as Instance)?.destroy();
};

// create directive
const directive = {
  mounted,
  updated,
  beforeUnmount,
};

export default directive;
