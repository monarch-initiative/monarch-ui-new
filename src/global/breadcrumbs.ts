import { ref } from "vue";
import { Node } from "@/api/node-lookup";
import { Association } from "@/api/node-associations";

interface Breadcrumb {
  node: Node;
  relation: Association["relation"];
}

/** breadcrumbs object for breadcrumbs section on node page */
export const breadcrumbs = ref<Array<Breadcrumb>>([]);

/** keep breadcrumbs global variable in sync with history.state.breadcrumbs */
export const updateBreadcrumbs = () => {
  try {
    breadcrumbs.value = JSON.parse(window.history.state.breadcrumbs);
  } catch (error) {
    console.warn("Bad breadcrumbs state");
    breadcrumbs.value = [];
  }
};
