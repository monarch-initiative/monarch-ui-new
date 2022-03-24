import { nextTick } from "vue";
import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouterScrollBehavior,
  NavigationGuard,
  RouteLocation,
} from "vue-router";
import { lowerCase, clone } from "lodash";
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
import { lookupNode } from "@/api/node-lookup";

// handle redirects on 404
const redirect404: NavigationGuard = async (to): Promise<string | void> => {
  // look for redirect in session storage (saved from 404 page)
  const redirect = window.sessionStorage.redirect;
  if (redirect) {
    delete window.sessionStorage.redirect;
    return redirect;
  }

  // otherwise, try to lookup node id and infer category
  const id = to.path.slice(1) as string;
  if (id) {
    const node = await lookupNode(id);
    return `/${node.category}/${id}`;
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
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: Home,
    beforeEnter: redirect404,
  },
  {
    path: "/",
    name: "Home",
    component: Home,
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
  {
    path: "/:category/:id",
    name: "Node",
    component: Node,
  },

  ...testRoutes,
];

// vue-router's scroll behavior handler
const scrollBehavior: RouterScrollBehavior = async (
  to,
  from,
  savedPosition
) => {
  // https://github.com/vuejs/vue-router-next/issues/1147
  await sleep();

  // scroll to previous position if exists
  if (savedPosition) return savedPosition;

  // scroll to hash
  return getHashScroll(to);
};

// get target element of url hash and scroll offset
const getHashScroll = (
  to: RouteLocation | Location
): { el: Element; top: number } | undefined => {
  // get hash
  const hash = to.hash;
  if (!hash) return;

  // get target element of hash
  let target = document?.getElementById(to.hash.slice(1));
  if (!target) return;

  // move target to parent section element if first child
  const parent = target.parentElement;
  if (parent?.tagName === "SECTION" && target.matches(":first-child"))
    target = parent;

  // get offset to account for header
  const offset = document?.querySelector("header")?.clientHeight || 0;

  return { el: target, top: offset };
};

// scroll to hash
export const scrollToHash = (): void => {
  const scroll = getHashScroll(window.location);
  if (!scroll) return;
  const { el, top } = scroll;
  el.scrollIntoView(true);
  window.scrollBy(0, -top);
};

// navigation history object
const history = createWebHistory(process.env.BASE_URL);

// router object
const router = createRouter({
  history,
  routes,
  scrollBehavior,
});

// set document title after route
router.afterEach(async ({ name, query, params, hash }) => {
  // https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  await nextTick();

  // get name of page (route name prop)
  const page = typeof name === "string" ? name : "";

  // get "sub page" (e.g. explore mode hash)
  const subpage = lowerCase(hash.slice(1));

  // get extra details from url params
  let details = "";
  if (query.search) details = `"${query.search}"`;
  if (params.id) details = `${params.id}`;

  // combine into document title
  if (document)
    document.title = [process.env.VUE_APP_TITLE_SHORT, page, subpage, details]
      .filter((part) => part)
      .join(" - ");
});

// close any open tooltips on route change
router.beforeEach(() => {
  hideAll();
});

export default router;

// dirty way to allow passing arbitrary data with router.push
// will no longer be needed once this vue-router RFC is implemented:
// https://github.com/vuejs/rfcs/discussions/400
let routeData: unknown = null;
export const setData = (data: unknown): void => {
  routeData = data;
};
export const getData = (): unknown => {
  const copy = clone(routeData);
  routeData = null; // reset after data consumed once
  return copy;
};
