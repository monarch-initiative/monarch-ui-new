import { createApp } from "vue";
import App from "@/App.vue";
import components from "@/global/components";
import mixins from "@/global/mixins";
import plugins from "@/global/plugins";
import "wicg-inert";

// delete these when app becomes closer to stable so they're not included in bundle
import { setupWorker } from "msw";
import { handlers } from "../tests/fixtures";

// create main app object
let app = createApp(App);

// register mixins
for (const mixin of mixins) app = app.mixin(mixin);

// register plugins/middleware
for (const [plugin, options] of plugins) app = app.use(plugin, options);

// register global components
for (const [name, Component] of Object.entries(components))
  app = app.component(name, Component);

// render app
app.mount("#app");

// set up mock apis so we don't hit real apis while developing
// put VUE_APP_MOCK_API=true in .env.local file to use this
if (process.env.VUE_APP_MOCK_API === "true") setupWorker(...handlers).start();
