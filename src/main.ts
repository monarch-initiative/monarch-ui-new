import { createApp } from "vue";
import { setupWorker } from "msw";
import "wicg-inert";
import App from "@/App.vue";
import components from "@/global/components";
import plugins from "@/global/plugins";
import { handlers } from "../tests/fixtures";
import "@/global/meta";

/** create main app object */
let app = createApp(App);

/** register plugins/middleware */
for (const [plugin, options] of plugins) app = app.use(plugin, options);

/** register global components */
for (const [name, Component] of Object.entries(components))
  app = app.component(name, Component);

/** render app */
const startApp = () => app.mount("#app");

/** mock api for local development */
const mock = false;
// const mock = process.env.NODE_ENV === "development";

/** start app */
if (mock)
  setupWorker(...handlers)
    .start()
    .then(startApp);
else startApp();
