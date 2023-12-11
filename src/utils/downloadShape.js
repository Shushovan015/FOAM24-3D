export function downloadShape(shape) {
  // Convert JSON data to a Blob
  const blob = new Blob([JSON.stringify(shape)], {
    type: "application/json",
  });
  // Create a download link element
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);

  // Set the file name for the downloaded JSON file
  downloadLink.download = "data.json";

  // Append the download link to the document
  document.body.appendChild(downloadLink);

  // Programmatically trigger a click event on the download link
  downloadLink.click();

  // Remove the download link from the document
  document.body.removeChild(downloadLink);
}
