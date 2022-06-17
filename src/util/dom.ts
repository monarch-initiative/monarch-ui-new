/** restart an element's CSS animations programmatically */
export const restartAnimations = (element: Element): void => {
  if (element instanceof Element)
    for (const animation of element.getAnimations()) {
      animation.cancel();
      animation.play();
    }
};

/** wait for element matching selector to appear (checking several times per sec). when found, return found element and run callback with element */
export const waitFor = async (
  selector = "",
  callback?: (element: Element) => void
): Promise<Element> =>
  new Promise((resolve) => {
    const check = () => {
      const match = document?.querySelector(selector);
      if (match) {
        resolve(match);
        if (callback) callback(match);
      } else window.setTimeout(check, 50);
    };
    check();
  });

/** find index of first element "in view". model behavior off of wikiwand.com. */
export const firstInView = (elements: Array<HTMLElement>): number => {
  const offset = document.querySelector("header")?.clientHeight || 0;
  for (let index = elements.length - 1; index >= 0; index--)
    if (elements[index].getBoundingClientRect().top < offset + 100)
      return index;
  return 0;
};
