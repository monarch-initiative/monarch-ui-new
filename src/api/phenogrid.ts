import { waitFor } from "./../util/dom";
import { cleanError } from "./index";
import { biolink } from ".";
/** import "phenogrid/dist/phenogrid-bundle.css"; */
import "./phenogrid.css";
import Phenogrid from "phenogrid";

/** mount phenogrid to dom element with options */
export const mountPhenogrid = async (
  selector: string,
  xAxis: Array<{ id?: string; name?: string }>,
  yAxis: Array<{ id?: string; name?: string }>,
  mode = "compare"
): Promise<void> => {
  try {
    /**
     * wait for phenogrid container to render on mount, and clear any previous
     * phenogrid instances from showing
     */
    (await waitFor("#phenogrid")).innerHTML = "";

    /** map in particular way based on mode, per ui 2.0 */
    const modifiedXAxis = xAxis.map(({ id = "", name = "" }) =>
      mode === "compare" ? [id] : { groupId: id, groupName: name }
    );

    Phenogrid.createPhenogridForElement(document?.querySelector(selector), {
      serverURL: biolink + "/",
      forceBiolink: true,
      appURL: window.location.origin,
      gridSkeletonData: {
        title: " ",
        xAxis: modifiedXAxis,
        yAxis: yAxis.map(({ id = "", name = "" }) => ({ id, term: name })),
      },
      selectedCalculation: 0,
      selectedSort: "Frequency",
      geneList: modifiedXAxis,
      owlSimFunction: mode,
    });

    patchSvg(await waitFor("#phenogrid_svg"));
  } catch (error) {
    throw cleanError(error);
  }
};

/** SHIMS FOR PHENOGRID */

/** typescript definition */
export interface PhenogridDefinition {
  createPhenogridForElement: (
    element: HTMLElement | null,
    options: {
      serverURL: string;
      forceBiolink: boolean;
      appURL: string;
      gridSkeletonData: {
        title: string;
        xAxis: Array<{ groupId: string; groupName: string } | Array<string>>;
        yAxis: Array<{ id: string; term: string }>;
      };
      selectedCalculation: number;
      selectedSort: string;
      geneList: Array<{ groupId: string; groupName: string } | Array<string>>;
      owlSimFunction: string;
    }
  ) => void;
}

/** fix incorrect svg sizing */
const patchSvg = (svg: Element, padding = 20) => {
  const { x, y, width, height } = (svg as SVGSVGElement).getBBox();
  /** set view box to bbox, essentially fitting view to content */
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
