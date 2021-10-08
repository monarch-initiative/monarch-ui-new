import { nextTick } from "vue";
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
  // get place to redirect to from session storage (saved from 404 page)
  const redirect = window.sessionStorage.redirect;
  if (redirect && redirect !== to.path) {
    console.info({ redirect });
    delete window.sessionStorage.redirect;
    return redirect;
  } else {
    // cancel redirect
    return null;
  }
};

// list of routes and corresponding components
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    beforeEnter: redirect404,
  },
  {
    path: "/home",
    redirect: "/",
  },
  {
    path: "/explore",
    name: "Explore",
    component: Explore,
  },
  {
    path: "/tools",
    name: "Tools",
    component: Tools,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/cite",
    name: "Cite",
    component: Cite,
  },
  {
    path: "/team",
    name: "Team",
    component: Team,
  },
  {
    path: "/help",
    name: "Help",
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

// set document title after route
router.afterEach((to) => {
  // https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  nextTick(() => {
    const page = typeof to.name === "string" ? to.name : "";
    document.title = process.env.VUE_APP_TITLE_SHORT + " - " + page;
  });
});

export default router;
