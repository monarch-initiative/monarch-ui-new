import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

// list of routes and corresponding components
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
];

// router object
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
