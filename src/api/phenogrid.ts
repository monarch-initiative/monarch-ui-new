import { waitFor } from "./../util/dom";
import { cleanError } from "./index";
import { biolink } from ".";
// import "phenogrid/dist/phenogrid-bundle.css";
import "./phenogrid.css";
import Phenogrid from "phenogrid";

// mount phenogrid to dom element with options
export const mountPhenogrid = async (
  selector: string,
  xAxis: PhenogridOptions["gridSkeletonData"]["xAxis"],
  yAxis: PhenogridOptions["gridSkeletonData"]["yAxis"],
  mode = "compare"
): Promise<void> => {
  try {
    await waitFor("#phenogrid");

    Phenogrid.createPhenogridForElement(document.querySelector(selector), {
      serverURL: biolink + "/",
      forceBiolink: true,
      appURL: window.location.origin,
      gridSkeletonData: {
        title: " ",
        xAxis,
        yAxis,
      },
      selectedCalculation: 0,
      selectedSort: "Frequency",
      geneList: xAxis,
      owlSimFunction: mode,
    });

    patchSvg(await waitFor("#phenogrid_svg"));
  } catch (error) {
    console.error(error);
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

// fix incorrect phenogrid svg sizing
const patchSvg = (svg: Element, padding = 20) => {
  const { x, y, width, height } = (svg as SVGSVGElement).getBBox();
  // set view box to bbox, essentially fitting view to content
  const viewBox = [
    x - padding,
    y - padding,
    width + padding * 2,
    height + padding * 2,
  ]
    .map((v) => Math.round(v))
    .join(" ");

  svg.setAttribute("viewBox", viewBox);
  svg.removeAttribute("width");
  svg.removeAttribute("height");
};
