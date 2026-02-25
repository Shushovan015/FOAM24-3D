import { getBoundingBox } from "./threeFunctions";

export const getPhotoshapeNextLabel = (session) =>
    session.index < session.order.length - 1 ? "Next" : "Finish";

export const getPhotoshapeDepthLabel = (session) =>
    session.index < session.order.length - 1 ? "Next Shape" : "Finish";

export const rebuildOrderAndIndex = (session, shapesArray, selected) => {
    session.order = session.ids
        .map((id) => shapesArray.find((s) => s.id === id))
        .filter(Boolean)
        .sort((a, b) => getBoundingBox(a).minX - getBoundingBox(b).minX)
        .map((s) => s.id);

    if (selected && selected.id) {
        const idx = session.order.indexOf(selected.id);
        session.index = idx !== -1 ? idx : 0;
    } else {
        session.index = 0;
    }
};

export const beginPhotoshapeEditSession = (session, shapesArray, selected) => {
    rebuildOrderAndIndex(session, shapesArray, selected);
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
    rebuildOrderAndIndex(session, shapesArray, selected);

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

export const createPhotoshapeShapesFromContours = ({
  contoursData,
  simplifyPhotoshapePoints,
  generateId,
  millimeters,
  defaultCornerRadius,
}) => {
  if (!Array.isArray(contoursData)) return [];

  return contoursData
    .map((contour) => {
      const simplified = simplifyPhotoshapePoints(contour);
      if (!Array.isArray(simplified) || simplified.length < 3) return null;

      return {
        id: generateId(),
        kind: "polygon",
        x: -225,
        y: -225,
        sizeZ: 300 * millimeters,
        sizeX: 200 * millimeters,
        sizeY: 250 * millimeters,
        points: simplified,
        rotation: 0,
        free: true,
        source: "photoshape",
        cornerRadius: defaultCornerRadius,
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
  note: "Outline ready. Click Edit to adjust points.",
  canBack: true,
  canNext: true,
  nextLabel: "Edit",
});

export const getPhotoshapeStepEditConfig = (session) => ({
  note: getPhotoshapeEditStepNote(session),
  canBack: true,
  canNext: true,
  nextLabel: "Depth",
});

export const getPhotoshapeStepDepthConfig = (session) => ({
  note: getPhotoshapeDepthStepNote(session),
  canBack: true,
  canNext: true,
  nextLabel: getPhotoshapeDepthLabel(session),
});

export const getPhotoshapeEditStepNote = (session) =>
    `Edit outline: shape ${session.index + 1} of ${session.order.length || session.ids.length}`;

export const getPhotoshapeDepthStepNote = (session) =>
    `Adjust depth: shape ${session.index + 1} of ${session.order.length || session.ids.length}`;
