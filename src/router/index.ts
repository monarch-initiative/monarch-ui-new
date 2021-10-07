import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouterScrollBehavior,
} from "vue-router";
import Home from "@/views/Home.vue";
import Explore from "@/views/explore/Explore.vue";
import Tools from "@/views/tools/Tools.vue";
import About from "@/views/about/About.vue";
import Cite from "@/views/about/Cite.vue";
import Help from "@/views/help/Help.vue";

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
    path: "/cite",
    name: "cite",
    component: Cite,
  },
  {
    path: "/help",
    name: "help",
    component: Help,
  },
];

const scrollBehavior: RouterScrollBehavior = (to) => {
  if (to.hash) return { el: to.hash };
  else return { left: 0, top: 0 };
};

// router object
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior,
});

export default router;
