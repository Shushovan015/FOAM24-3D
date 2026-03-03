import { getBase64 } from "./common";

const REMOVE_BG_URL = "https://api.remove.bg/v1.0/removebg";
const FALLBACK_REMOVE_BG_KEY = "y7X524wbiR3cUWL9AinkUAqq";

export async function removeBackgroundFromFile(file) {
  const base64Image = await getBase64(file);
  const apiKey = import.meta.env.VITE_REMOVE_BG_KEY || FALLBACK_REMOVE_BG_KEY;

  const response = await fetch(REMOVE_BG_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      image_file_b64: base64Image,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to remove background (${response.status})`);
  }

  return response.blob();
}

export async function detectContoursFromBlob(blob) {
  const formData = new FormData();
  formData.append("image", blob, "image.png");

  const contourApiBase =
    import.meta.env.VITE_CONTOUR_API_BASE || "http://localhost:5000";

  const response = await fetch(`${contourApiBase}/detect_contours`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to detect contours (${response.status})`);
  }

  const data = await response.json();
  return data?.contours || null;
}

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export async function uploadAndDetectContours(file) {
  const blob = await removeBackgroundFromFile(file);
  const contours = await detectContoursFromBlob(blob);
  const imageSrc = await blobToDataUrl(blob); // background-removed image
  return { contours, imageSrc };
}
