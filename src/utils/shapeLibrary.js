import { generateId } from "./common";

const STORAGE_KEY = "myShapes";

export function loadShapeLibrary() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveShapeToLibrary(shape, name) {
  if (!shape || typeof shape !== "object") return;
  const items = loadShapeLibrary();
  const entry = {
    id: generateId(),
    name: name || `${shape.kind || "shape"}-${new Date().toISOString().slice(0, 19)}`,
    shape: shape,
  };
  items.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function removeShapeFromLibrary(entryId) {
  const items = loadShapeLibrary().filter((s) => s.id !== entryId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function cloneShapeForInsert(shape) {
  const clean = JSON.parse(JSON.stringify(shape));
  clean.id = generateId();
  delete clean.controlPoints;
  delete clean._controlPointsSetup;
  delete clean._controlPointHandlersInitialized;
  delete clean.cleanup;
  delete clean._dragOriginalPoints;
  return clean;
}
