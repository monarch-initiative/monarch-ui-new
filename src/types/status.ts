// possible properties of a status for status component
export const Codes = [
  "loading",
  "success",
  "warning",
  "error",
  "paused",
  "unknown",
] as const;
export interface Status {
  code?: typeof Codes[number];
  text?: string;
  link?: string;
}
