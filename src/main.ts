import { createApp } from "vue";
import App from "@/App.vue";
import components from "@/global/components";
import mixins from "@/global/mixins";
import plugins from "@/global/plugins";
import directives from "@/global/directives";
import "wicg-inert";

// create main app object
let app = createApp(App);

// register directives
for (const [name, directive] of Object.entries(directives))
  app = app.directive(name, directive);

// register mixins
for (const mixin of mixins) app = app.mixin(mixin);

// register plugins/middleware
for (const plugin of plugins) app = app.use(plugin);

// register global components
for (const [name, Component] of Object.entries(components))
  app = app.component(name, Component);

// render app
app.mount("#app");
