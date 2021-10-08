import {
  createRouter,
  createWebHistory,
  RouteLocationNormalized,
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

// handle redirect from 404
const redirect404 = (to: RouteLocationNormalized) => {
  const redirect = sessionStorage.redirect;
  if (redirect) {
    console.info({ redirect });
    delete sessionStorage.redirect;
    return redirect;
  } else {
    return to;
  }
};

// list of routes and corresponding components
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: Home,
    redirect: redirect404,
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

const scrollBehavior: RouterScrollBehavior = (to, from, savedPosition) => {
  // scroll to previous position if exists
  if (savedPosition) return savedPosition;

  // default return
  let result: ReturnType<RouterScrollBehavior> = { left: 0, top: 0 };

  if (to.hash) {
    // get target element of hash
    let target = document.querySelector(to.hash);

    if (target) {
      // move target to parent section element if first child
      const parent = target.parentElement;
      if (parent?.tagName === "section" && target.matches(":first-child"))
        target = parent;

      // get offset to account for header
      const offset = document.querySelector("header")?.clientHeight || 0;

      result = { el: target, top: offset };
    }
  }

  return result;
};

// router object
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior,
});

export default router;
