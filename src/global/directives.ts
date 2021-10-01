import { Directive } from "vue";
import tooltip from "@/directives/tooltip";
import heading from "@/directives/heading";

// list of global directives
const directives: Record<string, Directive> = {
  tooltip,
  heading,
};

export default directives;
