export function downloadShape(shape, filename = "shape.json") {
  const blob = new Blob([JSON.stringify(shape)], {
    type: "application/json",
  });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = filename;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
