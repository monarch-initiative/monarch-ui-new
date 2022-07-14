import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouterScrollBehavior,
  NavigationGuard,
} from "vue-router";
import { clone } from "lodash";
import { hideAll } from "tippy.js";
import PageHome from "@/views/PageHome.vue";
import PageExplore from "@/views/explore/PageExplore.vue";
import PageAbout from "@/views/about/PageAbout.vue";
import PageOverview from "@/views/about/PageOverview.vue";
import PageSources from "@/views/about/PageSources.vue";
import PageCite from "@/views/about/PageCite.vue";
import PageTeam from "@/views/about/PageTeam.vue";
import PagePublications from "@/views/about/PagePublications.vue";
import PageTerms from "@/views/about/PageTerms.vue";
import PageHelp from "@/views/help/PageHelp.vue";
import PageFeedback from "@/views/help/PageFeedback.vue";
import PageNode from "@/views/node/PageNode.vue";
import PageTestbed from "@/views/PageTestbed.vue";
import { sleep } from "@/util/debug";
import { lookupNode } from "@/api/node-lookup";
import descriptions from "@/router/descriptions.json";

/** list of routes and corresponding components. */
/** KEEP IN SYNC WITH PUBLIC/SITEMAP.XML */
export const routes: Array<RouteRecordRaw> = [
  /** home page */
  {
    path: "/",
    name: "Home",
    component: PageHome,
    beforeEnter: (async () => {
      /** look for redirect in session storage (saved from public/404.html page) */
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

  /** top level pages */
  {
    path: "/explore",
    name: "Explore",
    component: PageExplore,
  },
  {
    path: "/about",
    name: "About",
    component: PageAbout,
  },
  {
    path: "/help",
    name: "Help",
    component: PageHelp,
  },

  /** about pages */
  {
    path: "/overview",
    name: "Overview",
    component: PageOverview,
  },
  {
    path: "/sources",
    name: "Sources",
    component: PageSources,
  },
  {
    path: "/cite",
    name: "Cite",
    component: PageCite,
  },
  {
    path: "/team",
    name: "Team",
    component: PageTeam,
  },
  {
    path: "/publications",
    name: "Publications",
    component: PagePublications,
  },
  {
    path: "/terms",
    name: "Terms",
    component: PageTerms,
  },

  /** help pages */
  {
    path: "/feedback",
    name: "Feedback",
    component: PageFeedback,
  },

  /** node pages */
  {
    path: "/:category/:id",
    name: "Node",
    component: PageNode,
  },
  {
    path: "/:id",
    name: "NodeRaw",
    component: PageHome,
    beforeEnter: (async (to) => {
      /** try to lookup node id and infer category */
      const id = to.path.slice(1) as string;
      if (id) {
        const node = await lookupNode(id);
        return `/${node.category}/${id}`;
      }
    }) as NavigationGuard,
  },

  /** test pages (comment this out when we release app) */
  {
    path: "/testbed",
    name: "Testbed",
    component: PageTestbed,
  },

  /** if no other route match found (404) */
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: PageHome,
  },
];

/** merge in route descriptions */
routes.forEach(
  (route) =>
    (route.meta = {
      description: (descriptions as Record<string, string>)[
        String(route.name || "")
      ],
    })
);

/** vue-router's scroll behavior handler */
const scrollBehavior: RouterScrollBehavior = async (
  to,
  from,
  savedPosition
) => {
  /** https://github.com/vuejs/vue-router-next/issues/1147 */
  await sleep();

  /** scroll to previous position if exists */
  if (savedPosition) return savedPosition;

  /** get hash */
  const hash = to.hash;
  if (!hash) return;

  /** get element corresponding to hash */
  const element = document?.getElementById(to.hash.slice(1));
  if (!element) return;

  console.log("hi");

  return { el: getTarget(element), top: getOffset(), behavior: "smooth" };
};

/** given element, get (possibly) modified target */
const getTarget = (element: Element): Element => {
  /** move target to parent section element if first child */
  if (
    element.parentElement?.tagName === "SECTION" &&
    element.matches(":first-child")
  )
    return element.parentElement;

  /** move target to previous horizontal rule */
  if (
    element.previousElementSibling instanceof HTMLElement &&
    element.previousElementSibling?.tagName === "HR"
  )
    return element.previousElementSibling;

  return element;
};

/** get offset to account for header */
const getOffset = () => document?.querySelector("header")?.clientHeight || 0;

/** scroll to element */
export const scrollToElement = async (element?: Element | null) => {
  if (!element) return;

  /** wait for everything to render fully and page to expand to full height */
  await sleep(500);

  window.scrollTo({
    top:
      getTarget(element).getBoundingClientRect().top +
      window.scrollY -
      getOffset(),
    behavior: "smooth",
  });
};

/** scroll to hash */
export const scrollToHash = () =>
  scrollToElement(document?.getElementById(window.location.hash.slice(1)));

/** navigation history object */
const history = createWebHistory(process.env.BASE_URL);

/** router object */
const router = createRouter({
  history,
  routes,
  scrollBehavior,
});

/** close any open tooltips on route change */
router.beforeEach(() => {
  hideAll();
});

export default router;

/**
 * dirty way to allow passing arbitrary data with router.push. will no longer be
 * needed once this vue-router RFC is implemented:
 * https://github.com/vuejs/rfcs/discussions/400
 */
let routeData: unknown = null;

/** attach data to be consumed after route change */
export const setData = (data: unknown): void => {
  routeData = data;
};

/** consume data set before route change */
export const getData = (): unknown => {
  const copy = clone(routeData);
  routeData = null; /** reset after data consumed once */
  return copy;
};
