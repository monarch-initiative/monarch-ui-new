import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import globalComponents from "@/global/components";
import directives from "@/global/directives";

// create main app object
let app = createApp(App);

// register directives
for (const [name, directive] of Object.entries(directives))
  app = app.directive(name, directive);

// add middleware
app = app.use(store).use(router);

// register global components
for (const [name, Component] of Object.entries(globalComponents))
  app = app.component(name, Component);

// render app
app.mount("#app");
