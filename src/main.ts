import { createApp, Component } from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "@/icons";
import Markdownify from "@/components/Markdownify.vue";

// list of components we want to be available anywhere without importing them
export const globalComponents: Record<string, Component> = {
  fa: FontAwesomeIcon,
  markdownify: Markdownify,
};

// create main app object
let app = createApp(App);

// add middleware
app = app.use(store).use(router);

// register global components
for (const [name, Component] of Object.entries(globalComponents))
  app = app.component(name, Component);

// render app
app.mount("#app");
