import { createApp } from "vue";
import App from "@/App.vue";
import components from "@/global/components";
import mixins from "@/global/mixins";
import plugins from "@/global/plugins";
import "wicg-inert";

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
