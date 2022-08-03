import { ref } from "vue";
import { Node } from "@/api/node-lookup";
import { Association } from "@/api/node-associations";

interface Breadcrumb {
  node: Node;
  relation: Association["relation"];
}

/** breadcrumbs object for breadcrumbs section on node page */
export const breadcrumbs = ref<Array<Breadcrumb>>([]);
