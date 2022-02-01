// wait
export const sleep = async (ms = 0): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

// force browser to synchronously log large objects and proxy objects
// sorta... https://stackoverflow.com/questions/23392111/console-log-async-or-sync/59309473#59309473
export const syncLog = (...args: Array<unknown>): void => {
  try {
    args = args.map((arg) => JSON.parse(JSON.stringify(arg)));
    console.log(...args);
  } catch (error) {
    console.log("Error trying to console.logSync()", ...args);
  }
};
