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
      const match = document.querySelector(selector);
      if (match) resolve(match);
      else window.setTimeout(check, 50);
    };
    check();
  });
