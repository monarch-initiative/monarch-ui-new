import { uniqBy } from "lodash";
import { biolink, request } from ".";

/** graph info to construct hierarchy (from backend) */
interface _Hierarchy {
  nodes: [
    {
      id: string;
      lbl: string;
    }
  ];
  edges: [
    {
      sub: string;
      pred: string;
      obj: string;
    }
  ];
}

/** "part of" relationship type */
const partOf = "BFO:0000050";

/** lookup hierarchy info for a node id */
export const getHierarchy = async (
  id = "",
  category = ""
): Promise<Hierarchy> => {
  const superClasses: Array<Class> = [];
  const equivalentClasses: Array<Class> = [];
  const subClasses: Array<Class> = [];

  /** make query params */
  const params = {
    relationship_type: ["disease", "phenotype", "anatomy", "function"].includes(
      category
    )
      ? /** only do subclass and "part of" for certain node types */
        ["equivalentClass", "subClassOf", partOf]
      : /** otherwise just look for equivalent classes */
        "equivalentClass",
  };

  /** make query */
  const url = `${biolink}/graph/edges/from/${id}`;
  const response = await request<_Hierarchy>(url, params);
  const { nodes, edges } = response;

  /** take id of subject or object and find associated node label */
  const idToClass = (id = ""): Class => ({
    id,
    name: nodes.find((node) => node.id === id)?.lbl || "",
  });

  /** populate super/equivalent/sub classes */
  for (const { sub, pred, obj } of edges) {
    if (pred === "subClassOf" || pred === partOf) {
      if (sub === id) superClasses.push(idToClass(obj));
      else if (obj === id) subClasses.push(idToClass(sub));
    } else if (pred === "equivalentClass") {
      if (sub === id) equivalentClasses.push(idToClass(obj));
      else equivalentClasses.push(idToClass(sub));
    }
  }

  return {
    superClasses: uniqBy(superClasses, "id"),
    equivalentClasses: uniqBy(equivalentClasses, "id"),
    subClasses: uniqBy(subClasses, "id"),
  };
};

type Class = { id: string; name: string };

/** hierarchy (for frontend) */
export interface Hierarchy {
  superClasses: Array<Class>;
  equivalentClasses: Array<Class>;
  subClasses: Array<Class>;
}
