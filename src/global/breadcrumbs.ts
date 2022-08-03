import { ref } from "vue";
import { Association } from "@/api/node-associations";

interface Breadcrumb {
  subject: Association["subject"];
  relation: Association["relation"];
}

/** breadcrumbs object for breadcrumbs section on node page */
export const breadcrumbs = ref<Array<Breadcrumb>>([]);
