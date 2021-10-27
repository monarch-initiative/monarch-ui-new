/* eslint-disable */
// generic typescript types for files

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.yaml" {
  const data: any;
  export default data;
}

declare module "*.md" {
  const data: string;
  export default data;
}

declare module "*.txt" {
  const data: string;
  export default data;
}
