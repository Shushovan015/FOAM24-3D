import { getBoundingBox } from "./threeFunctions";

export const getPhotoshapeNextLabel = (session) =>
    session.index < session.order.length - 1 ? "Next" : "Finish";

export const getPhotoshapeDepthLabel = (session) =>
  session.index < session.order.length - 1 ? "Save & Next Shape" : "Save & Finish";

const buildSessionOrder = (session, shapesArray) =>
  session.ids
    .map((id) => shapesArray.find((s) => s.id === id))
    .filter(Boolean)
    .sort((a, b) => getBoundingBox(a).minX - getBoundingBox(b).minX)
    .map((s) => s.id);

const rotateOrderToSelectedFirst = (order, selectedId) => {
  if (!selectedId) return order;
  const idx = order.indexOf(selectedId);
  if (idx <= 0) return order;
  return order.slice(idx).concat(order.slice(0, idx));
};

export const rebuildOrderAndIndex = (session, shapesArray, selected) => {
  session.order = buildSessionOrder(session, shapesArray);

  if (selected && selected.id) {
    const idx = session.order.indexOf(selected.id);
    session.index = idx !== -1 ? idx : 0;
  } else {
    session.index = 0;
  }
};

export const beginPhotoshapeEditSession = (session, shapesArray, selected) => {
  const sortedOrder = buildSessionOrder(session, shapesArray);
  session.order = rotateOrderToSelectedFirst(sortedOrder, selected?.id);
  session.index = 0;
};

export const selectPhotoshapeByIndex = (
  idx,
  session,
  shapesArray,
  setSelected,
  callback,
  showPanelFromRight
) => {
  if (!session.order.length) return false;
  if (idx < 0 || idx >= session.order.length) return false;

  const id = session.order[idx];
  const nextShape = shapesArray.find((s) => s.id === id);
  if (!nextShape) return false;

  setSelected(nextShape);
  session.index = idx;
  callback(nextShape);

  showPanelFromRight(nextShape.kind + "-panel");
  return true;
};

export const advanceToNextUnvisited = (
  session,
  shapesArray,
  selected,
  setSelected,
  callback,
  showPanelFromRight
) => {
  // Keep existing traversal order, but remove deleted/missing shapes.
  const existingIds = new Set(shapesArray.map((s) => s?.id).filter(Boolean));
  session.order = session.order.filter((id) => existingIds.has(id));
  if (!session.order.length) return false;

  // Sync pointer to currently selected shape when possible.
  if (selected?.id) {
    const idx = session.order.indexOf(selected.id);
    if (idx !== -1) session.index = idx;
  }

  session.index = Math.max(0, Math.min(session.index, session.order.length - 1));

  const nextIdx = session.index + 1;
  if (nextIdx >= session.order.length) return false;

  return selectPhotoshapeByIndex(
    nextIdx,
    session,
    shapesArray,
    setSelected,
    callback,
    showPanelFromRight
  );
};

export const movePhotoshapeFlowControls = (panelId) => {
    const controls = document.getElementById("photoshape-flow-controls");
    const panel = document.getElementById(panelId);
    const anchor = panel?.querySelector(".photoshape-flow-anchor");
    if (controls && anchor) {
        anchor.appendChild(controls);
    }
};

export const setPhotoshapeFlowVisibility = (stepUI, active) => {
    if (stepUI?.container) {
        stepUI.container.style.display = active ? "block" : "none";
    }
};

export const renderPhotoshapeStep = (stepUI, step, options = {}) => {
    if (!stepUI) return;

    if (stepUI.note && typeof options.note === "string") {
        stepUI.note.textContent = options.note;
    }
    if (stepUI.back && typeof options.canBack === "boolean") {
        stepUI.back.disabled = !options.canBack;
    }
    if (stepUI.next && typeof options.canNext === "boolean") {
        stepUI.next.disabled = !options.canNext;
    }
    if (stepUI.next && typeof options.nextLabel === "string") {
        stepUI.next.textContent = options.nextLabel;
    }
    if (stepUI.back && typeof options.backLabel === "string") {
        stepUI.back.textContent = options.backLabel;
    }

    if (Array.isArray(stepUI.steps) && stepUI.steps.length) {
        stepUI.steps.forEach((el) => {
            const stepNum = parseInt(el.getAttribute("data-photoshape-step"), 10);
            if (!Number.isNaN(stepNum)) {
                el.style.opacity = stepNum <= step ? "1" : "0.35";
                el.style.fontWeight = stepNum === step ? "700" : "400";
            }
        });
    }
};

export const simplifyPhotoshapeContourPoints = (pts, simplifyFn, maxPoints = 150) => {
    if (!Array.isArray(pts)) return pts;
    return simplifyFn(pts, maxPoints);
};

export const setPhotoshapeEditingMode = ({
    on,
    restore = false,
    state,
    callback1,
    saveCameraView,
    resetCameraToTopView,
    restoreCameraView,
}) => {
    if (on && !state.display2D) {
        saveCameraView();
        resetCameraToTopView();
    }

    if (window.__setPointEditUi) {
        window.__setPointEditUi(on);
    } else {
        window.__editingPoints = on;
    }

    callback1(on);

    if (!on && restore) {
        restoreCameraView();
    }
};

export const syncPhotoshapeDepthInputs = (selected) => {
    if (!selected) return;

    const depthInput =
        document.querySelector("#polygon-depth-input") ||
        document.querySelector("#photoshape-depth-input");
    const depthSlider =
        document.querySelector("#polygon-depth-slider") ||
        document.querySelector("#photoshape-depth-slider");

    if (depthInput) depthInput.value = selected.sizeZ;
    if (depthSlider) depthSlider.value = selected.sizeZ;
};

export const getPhotoshapeDepthPanelId = (selected) => {
    if (!selected) return "polygon-depth-panel";
    return selected.kind === "photoshape"
        ? "photoshape-depth-panel"
        : "polygon-depth-panel";
};

export const setPhotoshapeAuxUiVisible = (visible) => {
    const note = document.getElementById("photoshape-step-note");
    const btn = document.getElementById("photoshape-button");

    if (note) note.style.display = visible ? "flex" : "none";
    if (btn) btn.style.display = visible ? "flex" : "none";
};

export const resetPhotoshapeSessionState = (session) => {
    session.ids = [];
    session.order = [];
    session.index = 0;
    if (session.visited && typeof session.visited.clear === "function") {
        session.visited.clear();
    }
    session.remaining = 0;
};

const polygonAreaAbs = (points) => {
  if (!Array.isArray(points) || points.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area) * 0.5;
};

const getContourBounds = (points) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of points) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY };
};

const dedupeConsecutivePoints = (points) => {
  if (!Array.isArray(points) || !points.length) return [];
  const out = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const a = out[out.length - 1];
    const b = points[i];
    if (a[0] !== b[0] || a[1] !== b[1]) out.push(b);
  }
  if (out.length > 2) {
    const first = out[0];
    const last = out[out.length - 1];
    if (first[0] === last[0] && first[1] === last[1]) out.pop();
  }
  return out;
};

const contourPerimeter = (points) => {
  if (!Array.isArray(points) || points.length < 2) return 0;
  let p = 0;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    p += Math.hypot(x2 - x1, y2 - y1);
  }
  return p;
};

const perpendicularDistance = (p, a, b) => {
  const [px, py] = p;
  const [ax, ay] = a;
  const [bx, by] = b;
  const dx = bx - ax;
  const dy = by - ay;

  if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay);

  const t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy);
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
};

const rdp = (points, epsilon) => {
  if (points.length < 3) return points;

  let maxDist = 0;
  let index = -1;
  const start = points[0];
  const end = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(points[i], start, end);
    if (d > maxDist) {
      maxDist = d;
      index = i;
    }
  }

  if (maxDist <= epsilon || index === -1) {
    return [start, end];
  }

  const left = rdp(points.slice(0, index + 1), epsilon);
  const right = rdp(points.slice(index), epsilon);
  return left.slice(0, -1).concat(right);
};

export const clampPhotoshapeFitAccuracy = (v) =>
  Math.max(1, Math.min(100, Number(v) || 75));

const epsilonFactorForAccuracy = (accuracy) => {
  const a = clampPhotoshapeFitAccuracy(accuracy);
  const minFactor = 0.0004; 
  const maxFactor = 0.02;   
  return minFactor + ((100 - a) / 99) * (maxFactor - minFactor);
};

export const simplifyContourByAccuracy = (contour, accuracy) => {
  const pts = dedupeConsecutivePoints(contour);
  if (pts.length < 4) return pts;

  const perimeter = contourPerimeter(pts);
  const eps = Math.max(0.5, perimeter * epsilonFactorForAccuracy(accuracy));

  const closed = pts.concat([pts[0]]);
  const simplifiedClosed = rdp(closed, eps);

  const simplified = dedupeConsecutivePoints(simplifiedClosed);
  return simplified.length >= 3 ? simplified : pts;
};

const isLikelyBackgroundContour = (points, imageWidth, imageHeight) => {
  const area = polygonAreaAbs(points);
  const imageArea = imageWidth * imageHeight;
  if (area > imageArea * 0.55) return true;

  const b = getContourBounds(points);
  const bw = b.maxX - b.minX;
  const bh = b.maxY - b.minY;
  const near = 2;

  const touchesBorder =
    b.minX <= near ||
    b.minY <= near ||
    b.maxX >= imageWidth - near ||
    b.maxY >= imageHeight - near;

  if (touchesBorder && bw > imageWidth * 0.85 && bh > imageHeight * 0.85) {
    return true;
  }

  return false;
};

export const mapImagePointToFoamLocal = (x, y, foam, imageWidth, imageHeight) => {
  const left = foam.x - foam.sizeX / 2;
  const top = foam.y + foam.sizeY / 2;
  const worldX = left + (x / imageWidth) * foam.sizeX;
  const worldY = top - (y / imageHeight) * foam.sizeY;
  return [worldX - foam.x, worldY - foam.y];
};

export const mapImageContourToFoamLocalPoints = (
  contour,
  foam,
  imageWidth,
  imageHeight
) =>
  contour
    .map(([x, y]) => mapImagePointToFoamLocal(x, y, foam, imageWidth, imageHeight))
    .filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));

export const applyPhotoshapeFitAccuracyToShape = (shape, fitAccuracy, foam) => {
  if (!shape || shape.source !== "photoshape" || !shape._draft) return false;
  if (!Array.isArray(shape._rawContourImage) || shape._rawContourImage.length < 3) return false;
  if (!shape._contourImageWidth || !shape._contourImageHeight) return false;

  const acc = clampPhotoshapeFitAccuracy(fitAccuracy);
  const simplified = simplifyContourByAccuracy(shape._rawContourImage, acc);
  const mapped = mapImageContourToFoamLocalPoints(
    simplified,
    foam,
    shape._contourImageWidth,
    shape._contourImageHeight
  );

  if (mapped.length < 3) return false;

  const b = getContourBounds(mapped);
  shape.points = mapped;
  shape.sizeX = Math.max(1, b.maxX - b.minX);
  shape.sizeY = Math.max(1, b.maxY - b.minY);
  shape.photoshapeFitAccuracy = acc;
  shape._pointsDirty = true;
  return true;
};

export const createPhotoshapeShapesFromContours = ({
  contoursData,
  generateId,
  millimeters,
  defaultCornerRadius,
  imageSrc,
  foam,
  imageWidth,
  imageHeight,
  fitAccuracy = 75,
}) => {
  if (!Array.isArray(contoursData)) return [];
  if (!foam || !imageWidth || !imageHeight) return [];

  const minAreaPx = Math.max(80, imageWidth * imageHeight * 0.0006);

  return contoursData
    .map((rawContour) => {
      if (!Array.isArray(rawContour) || rawContour.length < 3) return null;
      if (polygonAreaAbs(rawContour) < minAreaPx) return null;
      if (isLikelyBackgroundContour(rawContour, imageWidth, imageHeight)) return null;

      const acc = clampPhotoshapeFitAccuracy(fitAccuracy);
      const simplified = simplifyContourByAccuracy(rawContour, acc);
      const mapped = mapImageContourToFoamLocalPoints(
        simplified,
        foam,
        imageWidth,
        imageHeight
      );
      if (mapped.length < 3) return null;

      const b = getContourBounds(mapped);

      return {
        id: generateId(),
        kind: "polygon",
        x: foam.x,
        y: foam.y,
        sizeZ: 300 * millimeters,
        sizeX: Math.max(1, b.maxX - b.minX),
        sizeY: Math.max(1, b.maxY - b.minY),
        points: mapped,
        rotation: 0,
        free: true,
        source: "photoshape",
        cornerRadius: defaultCornerRadius,
        photoshapeImageSrc: imageSrc || null,
        _draft: true,

        photoshapeFitAccuracy: acc,
        _rawContourImage: rawContour.map(([x, y]) => [x, y]),
        _contourImageWidth: imageWidth,
        _contourImageHeight: imageHeight,
      };
    })
    .filter(Boolean);
};

export const appendPhotoshapeShapes = (shapesArray, session, createdShapes) => {
  createdShapes.forEach((shape) => {
    shapesArray.push(shape);
    session.ids.push(shape.id);
  });
};


export const getPhotoshapeStepUploadConfig = () => ({
    note: "Upload an image to start.",
    canBack: false,
    canNext: false,
    nextLabel: "Edit",
});

export const getPhotoshapeStepProcessingConfig = () => ({
    note: "Removing background and detecting outline...",
    canBack: true,
    canNext: false,
    nextLabel: "Edit",
});

export const getPhotoshapeStepReadyConfig = () => ({
  note: "Outline ready. Click Start Editing to review each shape once.",
  canBack: false, 
  canNext: true,
  backLabel: "Back to Upload",
  nextLabel: "Start Editing",
});


export const getPhotoshapeStepEditConfig = (session) => ({
  note: getPhotoshapeEditStepNote(session),
  canBack: true,
  canNext: true,
  backLabel: "Back to Detect",
  nextLabel: "Next Step",
});

export const getPhotoshapeStepDepthConfig = (session) => ({
  note: getPhotoshapeDepthStepNote(session),
  canBack: true,
  canNext: true,
  backLabel: "Back to Outline",
  nextLabel: getPhotoshapeDepthLabel(session),
});

export const getPhotoshapeEditStepNote = (session) =>
    `Edit outline: shape ${session.index + 1} of ${session.order.length || session.ids.length}`;

export const getPhotoshapeDepthStepNote = (session) =>
    `Adjust depth: shape ${session.index + 1} of ${session.order.length || session.ids.length}`;
