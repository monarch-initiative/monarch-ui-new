import { nextTick } from "vue";
import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouterScrollBehavior,
  NavigationGuard,
  RouteLocation,
} from "vue-router";
import { startCase, clone } from "lodash";
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

// list of routes and corresponding components
// CHECK PUBLIC/SITEMAP.XML AND KEEP IN SYNC
export const routes: Array<RouteRecordRaw> = [
  // home page
  {
    path: "/",
    name: "Home",
    component: Home,
    beforeEnter: (async () => {
      // look for redirect in session storage (saved from public/404.html page)
      const redirect = window.sessionStorage.redirect;
      if (redirect) {
        console.info(`Redirecting to ${redirect}`);
        delete window.sessionStorage.redirect;
        return redirect;
      }
    }) as NavigationGuard,
  },
  {
    path: "/home",
    redirect: "/",
  },

  // top level pages
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
    path: "/help",
    name: "Help",
    component: Help,
  },

  // about pages
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

  // help pages
  {
    path: "/feedback",
    name: "Feedback",
    component: Feedback,
  },

  // node pages
  {
    path: "/:category/:id",
    name: "Node",
    component: Node,
  },
  {
    path: "/:id",
    name: "NodeRaw",
    component: Home,
    beforeEnter: (async (to) => {
      // try to lookup node id and infer category
      const id = to.path.slice(1) as string;
      if (id) {
        const node = await lookupNode(id);
        return `/${node.category}/${id}`;
      }
    }) as NavigationGuard,
  },

  // test pages (comment this out when we release app)
  {
    path: "/testbed",
    name: "Testbed",
    component: Testbed,
  },

  // if no other route match found (404)
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: Home,
  },
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

  // separated parts of tab title
  const parts = [];

  // title of app
  parts.push(process.env.VUE_APP_TITLE_SHORT);

  // name of page (route name prop)
  if (name) parts.push(name);

  // node page params (e.g. disease and HP:12345)
  if (params?.category) parts.push(params.category);
  if (params?.id) parts.push(params.id);

  // explore mode (e.g. #text-annotator)
  if (name === "Explore" && hash) parts.push(startCase(hash.slice(1)));

  // search (e.g. ?search=marfan+syndrome)
  if (query.search) parts.push(`"${query.search}"`);

  // combine into document title
  if (document) document.title = parts.join(" · ");
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
