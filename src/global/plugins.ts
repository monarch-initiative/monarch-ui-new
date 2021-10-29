import { Plugin } from "vue";
import router from "@/router";
import store from "@/store";
import VueFinalModal from "vue-final-modal";

// list of global plugins
const plugins: Array<Plugin> = [router, store, VueFinalModal];

export default plugins;
