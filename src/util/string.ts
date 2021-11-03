// truncate string above certain length
export const truncate = (value = "", limit = 20): string =>
  value.length > limit ? value.slice(0, limit - 3) + "..." : value;

// collapse whitespace in string
export const collapse = (value = ""): string =>
  value.replace(/\s+/g, " ").trim();
