export const isExternalUrl = (url = ""): boolean =>
  url.startsWith("http") || url.startsWith("ftp") || url.startsWith("mailto:");
