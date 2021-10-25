import { Directive } from "vue";
import tooltip from "@/directives/tooltip";

// list of global directives
const directives: Record<string, Directive> = {
  tooltip,
};

export default directives;
