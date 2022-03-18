/* eslint-disable */
// generic typescript types for files

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "phenogrid" {
  import type { PhenogridDefinition } from "@/api/phenogrid";
  const phenogrid: PhenogridDefinition;
  export default phenogrid;
}
