import { DirectiveBinding } from "vue";
import tippy, { Instance, ReferenceElement } from "tippy.js";
import "tippy.js/dist/tippy.css";

// tooltip directive
// usage: v-tooltip="Tooltip text"
// shows a tooltip on hover or focus

// util to set aria label from tooltip and element text
const setAriaLabel = (element: ReferenceElement, tooltip: string) => {
  if (!element.getAttribute("aria-label"))
    element.setAttribute(
      "aria-label",
      ((element as HTMLElement).innerText + " - " + tooltip).toLowerCase()
    );
};

// util to add word break for long tooltips
const setBreak = (element: ReferenceElement, wordBreak = false) => {
  const popper = element._tippy?.popper?.querySelector(
    ".tippy-content"
  ) as HTMLElement;
  if (popper) popper.dataset.break = String(wordBreak);
};

// when element created
const mounted = (
  element: ReferenceElement,
  { value, modifiers }: DirectiveBinding
): void => {
  if (value) {
    tippy(element, { content: value, delay: 100, duration: 200 });
    setBreak(element, modifiers.break);
    setAriaLabel(element, value);
  }
};

// when element updated
const updated = (
  element: ReferenceElement,
  { value, modifiers }: DirectiveBinding
): void => {
  const tippy = element._tippy as Instance;
  if (value) tippy?.setContent(value);
  else tippy?.destroy();
  setBreak(element, modifiers.break);
  setAriaLabel(element, value);
};

// when element destroyed
const beforeUnmount = (element: ReferenceElement): void => {
  const tippy = element._tippy as Instance;
  tippy?.destroy();
};

// create directive
const directive = {
  mounted,
  updated,
  beforeUnmount,
};

export default directive;
