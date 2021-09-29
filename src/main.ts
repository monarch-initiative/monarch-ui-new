import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import "normalize.css";
import "@/global/icons";
import globalComponents from "@/global/components";
import "@/global/styles.scss";

// create main app object
let app = createApp(App);

// add middleware
app = app.use(store).use(router);

// register global components
for (const [name, Component] of Object.entries(globalComponents))
  app = app.component(name, Component);

// render app
app.mount("#app");
