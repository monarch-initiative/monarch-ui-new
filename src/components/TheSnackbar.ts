// push a notification to snackbar
export const push = (message: string): unknown =>
  window.dispatchEvent(new CustomEvent("snackbar", { detail: message }));
