import { nextTick } from "vue";
import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouterScrollBehavior,
} from "vue-router";
import { hideAll } from "tippy.js";
import Home from "@/views/Home.vue";
import Explore from "@/views/explore/Explore.vue";
import Tools from "@/views/tools/Tools.vue";
import About from "@/views/about/About.vue";
import Cite from "@/views/about/Cite.vue";
import Team from "@/views/about/Team.vue";
import Publications from "@/views/about/Publications.vue";
import Sources from "@/views/about/Sources.vue";
import Terms from "@/views/about/Terms.vue";
import Help from "@/views/help/Help.vue";
import Feedback from "@/views/help/Feedback.vue";
import Testbed from "@/views/Testbed.vue";
import { sleep } from "@/util/debug";

// handle redirect from 404
const redirect404 = (): string | void => {
  // look for redirect in session storage (saved from 404 page)
  const redirect = window.sessionStorage.redirect;
  if (redirect) {
    delete window.sessionStorage.redirect;
    return redirect;
  }
};

// list of routes and corresponding components
export const routes: Array<RouteRecordRaw> = [
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
    path: "/publications",
    name: "Publications",
    component: Publications,
  },
  {
    path: "/sources",
    name: "Sources",
    component: Sources,
  },
  {
    path: "/terms",
    name: "Terms",
    component: Terms,
  },
  {
    path: "/help",
    name: "Help",
    component: Help,
  },
  {
    path: "/feedback",
    name: "Feedback",
    component: Feedback,
  },

  // test routes (pages to only include during development)
  ...(process.env.NODE_ENV === "development"
    ? [
        {
          path: "/testbed",
          name: "Testbed",
          component: Testbed,
        },
      ]
    : []),
];

const scrollBehavior: RouterScrollBehavior = async (
  to,
  from,
  savedPosition
) => {
  // https://github.com/vuejs/vue-router-next/issues/1147
  await sleep();

  // scroll to previous position if exists
  if (savedPosition) return savedPosition;

  // default return
  let result: ReturnType<RouterScrollBehavior> = { left: 0, top: 0 };

  if (to.hash) {
    // get target element of hash
    let target = document.getElementById(to.hash.slice(1));

    if (target) {
      // move target to parent section element if first child
      const parent = target.parentElement;
      if (parent?.tagName === "SECTION" && target.matches(":first-child"))
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

// close any open tooltips on route change
router.beforeEach(() => {
  hideAll();
});

export default router;
