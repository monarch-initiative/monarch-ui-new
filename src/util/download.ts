export const downloadJson = (data = {}, filename = "data"): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename + ".json";
  link.click();
  window.URL.revokeObjectURL(url);
};
