import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "@/icons";
import Markdownify from "@/components/Markdownify.vue";

createApp(App)
  // middleware
  .use(store)
  .use(router)
  // register global components
  .component("fa", FontAwesomeIcon)
  .component("markdownify", Markdownify)
  // render app
  .mount("#app");
