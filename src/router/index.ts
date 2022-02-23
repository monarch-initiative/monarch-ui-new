import { nextTick } from "vue";
import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouterScrollBehavior,
  NavigationGuard,
} from "vue-router";
import { lowerCase, startCase } from "lodash";
import { hideAll } from "tippy.js";
import Home from "@/views/Home.vue";
import Explore from "@/views/explore/Explore.vue";
import About from "@/views/about/About.vue";
import Overview from "@/views/about/Overview.vue";
import Sources from "@/views/about/Sources.vue";
import Cite from "@/views/about/Cite.vue";
import Team from "@/views/about/Team.vue";
import Publications from "@/views/about/Publications.vue";
import Terms from "@/views/about/Terms.vue";
import Help from "@/views/help/Help.vue";
import Feedback from "@/views/help/Feedback.vue";
import Node from "@/views/node/Node.vue";
import Testbed from "@/views/Testbed.vue";
import { sleep } from "@/util/debug";
import { categories } from "@/api/categories";

// handle redirects on 404
const redirect404 = (): string | void => {
  // look for redirect in session storage (saved from 404 page)
  const redirect = window.sessionStorage.redirect;
  if (redirect) {
    delete window.sessionStorage.redirect;
    return redirect;
  }
};

// handle redirects on node page
const redirectNode: NavigationGuard = (to) => {
  // legacy reroute for referral traffic from GARD
  // https://github.com/monarch-initiative/monarch-ui/issues/325
  if (to.fullPath.startsWith("/disease/Orphanet:")) {
    const id = Array.isArray(to.params.id) ? to.params.id[0] : to.params.id;
    return { path: `/disease/${id.replace("Orphanet", "ORPHA")}` };
  }
};

// test pages to only include during development
let testRoutes: Array<RouteRecordRaw> = [];
if (process.env.NODE_ENV === "development")
  testRoutes = [{ path: "/testbed", name: "Testbed", component: Testbed }];

// list of routes and corresponding components
// CHECK PUBLIC/SITEMAP.XML AND KEEP IN SYNC
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
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/overview",
    name: "Overview",
    component: Overview,
  },
  {
    path: "/sources",
    name: "Sources",
    component: Sources,
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

  // node pages
  ...categories.map((category) => ({
    path: `/${category}/:id`,
    name: `Node ${startCase(category)}`,
    component: Node,
    beforeEnter: redirectNode,
  })),

  ...testRoutes,
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

  if (to.hash) {
    // get target element of hash
    let target = document?.getElementById(to.hash.slice(1));

    if (target) {
      // move target to parent section element if first child
      const parent = target.parentElement;
      if (parent?.tagName === "SECTION" && target.matches(":first-child"))
        target = parent;

      // get offset to account for header
      const offset = document.querySelector("header")?.clientHeight || 0;

      return { el: target, top: offset };
    }
  }
};

// router object
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior,
});

// set document title after route
router.afterEach(({ name, query, hash }) => {
  // https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  nextTick(() => {
    // get name of page
    const page = typeof name === "string" ? name : "";

    // get "sub page"
    const subpage = lowerCase(hash.slice(1));

    // get extra details from url params
    let details = "";
    if (query.search) details = `"${query.search}"`;

    // combine into document title
    document.title = [process.env.VUE_APP_TITLE_SHORT, page, subpage, details]
      .filter((part) => part)
      .join(" - ");
  });
});

// close any open tooltips on route change
router.beforeEach(() => {
  hideAll();
});

export default router;
