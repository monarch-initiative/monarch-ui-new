import { Options } from "./AppSelectMulti";

// table column
export interface Col {
  // what item in row object to access as raw cell value
  key: string;
  // header display text
  heading?: string;
  // how to align column contents (both header and body) horizontally
  align?: "left" | "center" | "end";
  // width to apply to heading cell, in any valid css grid col width (px, fr, auto, minmax, etc)
  width?: string;
  // whether to allow sorting of column
  sortable?: boolean;
  // available filters for column
  availableFilters?: Options;
  // active filters for column
  activeFilters?: Options;
}

// object with arbitrary keys
export type Row = Record<string, unknown>;

// arrays of rows and cols
export type Cols = Array<Col>;
export type Rows = Array<Row>;

// sort param
interface Sort {
  key?: string;
  direction?: "up" | "down";
}
