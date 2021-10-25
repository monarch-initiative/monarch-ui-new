export const sleep = async (ms = 1000): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));
