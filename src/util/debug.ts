export const sleep = async (ms = 0): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));
