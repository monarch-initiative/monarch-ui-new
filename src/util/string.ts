// truncate string above certain length
export const truncate = (value = "", limit = 20): string =>
  value.length > limit ? value.slice(0, limit - 3) + "..." : value;

// collapse whitespace in string
export const collapse = (value = ""): string =>
  value.replace(/\s+/g, " ").trim();

// insert html word break opportunities, for use on long strings such as urls
export const breakUrl = (value = ""): string =>
  // non-alphanumeric char followed by alphanumeric char
  value.replaceAll(/([^A-Za-z0-9])([A-Za-z0-9])/g, "$1<wbr/>$2");
