// restart an element's CSS animations programmatically
export const restartAnimations = (element: Element): void => {
  if (element instanceof Element)
    for (const animation of element.getAnimations()) {
      animation.cancel();
      animation.play();
    }
};

// wait for element matching selector to appear, check several times per sec
export const waitFor = async (selector = ""): Promise<Element> =>
  new Promise((resolve) => {
    const check = () => {
      const match = document?.querySelector(selector);
      if (match) resolve(match);
      else window.setTimeout(check, 50);
    };
    check();
  });

// find index of first element "in view" (intuitively)
export const firstInView = (elements: Array<HTMLElement>): number => {
  // go up from bottom until we find element that starts in top majority of screen
  for (const [index, element] of Object.entries(elements).reverse())
    if (element.getBoundingClientRect().top < window.innerHeight * 0.75)
      return Number(index);

  return -1;
};
