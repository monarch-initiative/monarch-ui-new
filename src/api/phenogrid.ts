import { cleanError } from "./index";
import { biolink } from ".";
// import "phenogrid/dist/phenogrid-bundle.css";
import Phenogrid from "phenogrid";

// mount phenogrid to dom element with options
export const mountPhenogrid = (
  selector: string,
  title = "",
  xAxis: PhenogridOptions["gridSkeletonData"]["xAxis"],
  yAxis: PhenogridOptions["gridSkeletonData"]["yAxis"],
  mode = "compare"
): void => {
  console.log("hi");
  try {
    Phenogrid.createPhenogridForElement(document.querySelector(selector), {
      serverURL: biolink,
      forceBiolink: true,
      appURL: window.location.origin,
      gridSkeletonData: {
        title,
        xAxis,
        yAxis,
      },
      selectedCalculation: 0,
      selectedSort: "Frequency",
      geneList: xAxis,
      owlSimFunction: mode,
    });
  } catch (error) {
    throw cleanError(error);
  }
};

// TYPESCRIPT SHIM FOR PHENOGRID
// when (if) we rewrite phenogrid from scratch, do it in typescript and this
// will no longer be needed
interface PhenogridOptions {
  serverURL: string;
  forceBiolink: boolean;
  appURL: string;
  gridSkeletonData: {
    title: string;
    xAxis: Array<{ groupId: string; groupName: string }>;
    yAxis: Array<{ id: string; term: string }>;
  };
  selectedCalculation: number;
  selectedSort: string;
  geneList: Array<{ groupId: string; groupName: string }>;
  owlSimFunction: string;
}
export interface PhenogridDefinition {
  createPhenogridForElement: (
    element: HTMLElement | null,
    options: PhenogridOptions
  ) => void;
}
