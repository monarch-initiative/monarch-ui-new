import { createApp } from "vue";
import "wicg-inert";
import App from "@/App.vue";
import components from "@/global/components";
import plugins from "@/global/plugins";
import { handlers } from "../tests/fixtures";
import "@/global/meta";

/** log env variables for debugging */
console.info(process.env);

/** create main app object */
let app = createApp(App);

/** register plugins/middleware */
for (const [plugin, options] of plugins) app = app.use(plugin, options);

/** register global components */
for (const [name, Component] of Object.entries(components))
  app = app.component(name, Component);

(async () => {
  /** mock api for local development */
  if (process.env.NODE_ENV === "development") {
    const { setupWorker } = await import("msw");
    await setupWorker(...handlers).start();
  }

  /** start app */
  app.mount("#app");
})();
