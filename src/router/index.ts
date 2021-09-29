import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Explore from "../views/Explore.vue";
import Tools from "../views/Tools.vue";
import About from "../views/About.vue";
import Help from "../views/Help.vue";

// list of routes and corresponding components
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/explore",
    name: "explore",
    component: Explore,
  },
  {
    path: "/tools",
    name: "tools",
    component: Tools,
  },
  {
    path: "/about",
    name: "about",
    component: About,
  },
  {
    path: "/help",
    name: "help",
    component: Help,
  },
];

// router object
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
