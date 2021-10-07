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
import Team from "@/views/about/Team.vue";
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
    path: "/team",
    name: "team",
    component: Team,
  },
  {
    path: "/help",
    name: "help",
    component: Help,
  },
];

const scrollBehavior: RouterScrollBehavior = (to) => {
  if (to.hash) {
    // get target element of hash
    let target = document.querySelector(window.location.hash);
    if (!target) return;

    // move target to parent section element if this is first child
    if (
      target === target.parentElement?.firstElementChild &&
      target.parentElement?.tagName
    )
      target = target.parentElement;

    // get offset to account for header
    const offset = document.querySelector("header")?.clientHeight || 0;

    return {
      el: target,
      top: offset,
    };
  }
};

// router object
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior,
});

export default router;
