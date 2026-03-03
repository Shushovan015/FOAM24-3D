import { generateId } from "../../utils/common";
import { uploadAndDetectContours } from "../../utils/photoshapeApi";
import {
  getPhotoshapeDepthLabel,
  beginPhotoshapeEditSession,
  advanceToNextUnvisited,
  movePhotoshapeFlowControls,
  setPhotoshapeFlowVisibility,
  renderPhotoshapeStep,
  simplifyPhotoshapeContourPoints,
  setPhotoshapeEditingMode,
  syncPhotoshapeDepthInputs,
  getPhotoshapeDepthPanelId,
  setPhotoshapeAuxUiVisible,
  resetPhotoshapeSessionState,
  getPhotoshapeEditStepNote,
  getPhotoshapeDepthStepNote,
  createPhotoshapeShapesFromContours,
  appendPhotoshapeShapes,
  getPhotoshapeStepUploadConfig,
  getPhotoshapeStepProcessingConfig,
  getPhotoshapeStepReadyConfig,
  getPhotoshapeStepEditConfig,
  getPhotoshapeStepDepthConfig,
} from "../../utils/photoshapeFlow";
import {
  saveCameraView,
  restoreCameraView,
  resetCameraToFrontView,
  resetCameraToTopView
} from "../../setup/scene";
import { state } from "../../setup/state";
import { simplifyPointsForDrag } from "../../utils/threeFunctions";

export const createShapePhotoShape = (
  millimeters,
  selected,
  shapesArray,
  commit,
  showPanelFromLeft,
  showPanelFromRight,
  doCsg,
  display2D,
  callback,
  callback1,
  camera,
  renderer,
  scene,
  defaultCornerRadius,
  setFoamPhotoOverlay,
  clearFoamPhotoOverlay
  // createEditor
) => {
  const stepUI = {
    container: document.querySelector("#photoshape-stepper"),
    steps: Array.from(document.querySelectorAll("[data-photoshape-step]")),
    note: document.querySelector("#photoshape-step-note"),
    back: document.querySelector("#photoshape-step-back"),
    next: document.querySelector("#photoshape-step-next"),
  };
  const fitUI = {
    group: document.querySelector("#photoshape-fit-group"),
    slider: document.querySelector("#photoshape-fit-slider"),
    input: document.querySelector("#photoshape-fit-input"),
  };
  const uploadPreview = document.querySelector("#upload-photo-img");
  if (uploadPreview) uploadPreview.style.display = "none";

  let photoshapeFlowActive = false;
  let photoshapeFlowReady = false;
  let photoshapeStep = 1;
  const MAX_PHOTOSHAPE_POINTS = 150;

  const simplifyPhotoshapePoints = (pts) => {
    if (!Array.isArray(pts)) return pts;
    if (pts.length <= 500) return pts;
    return simplifyPhotoshapeContourPoints(pts, simplifyPointsForDrag, 500);
  };

  const setPhotoshapeFlowActive = (active) => {
    photoshapeFlowActive = active;
    setPhotoshapeFlowVisibility(stepUI, active);
  };

  const setPhotoshapeStep = (step, options = {}) => {
    photoshapeStep = step;
    renderPhotoshapeStep(stepUI, photoshapeStep, options);
    syncFitUiFromSelected();
  };

  const setEditing = (on, restore = false) =>
    setPhotoshapeEditingMode({
      on,
      restore,
      state,
      callback1,
      saveCameraView,
      resetCameraToTopView,
      restoreCameraView,
    });

  const applyFoamPhotoOverlay = (imageSrc) => {
    if (!imageSrc) return;
    if (typeof setFoamPhotoOverlay === "function") {
      setFoamPhotoOverlay(imageSrc);
    }
  };

  const applyOverlayFromSelected = () => {
    if (selected?.photoshapeImageSrc) {
      applyFoamPhotoOverlay(selected.photoshapeImageSrc);
    }
  };

  const removeFoamPhotoOverlay = () => {
    if (typeof clearFoamPhotoOverlay === "function") {
      clearFoamPhotoOverlay();
    }
  };

  const readImageDimensions = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () =>
        resolve({
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
        });
      img.onerror = reject;
      img.src = src;
    });

  const clonePoints = (pts) => (Array.isArray(pts) ? pts.map(([x, y]) => [x, y]) : []);
  const clampFit = (v) => Math.max(70, Math.min(130, Number(v) || 100));

  const setFitUiVisible = (visible) => {
    if (fitUI.group) fitUI.group.style.display = visible ? "flex" : "none";
  };

  const ensureShapeFitBase = (shape) => {
    if (!shape || shape.source !== "photoshape") return;
    if (!Array.isArray(shape._fitBasePoints) || shape._fitBasePoints.length < 3) {
      shape._fitBasePoints = clonePoints(shape.points);
    }
    if (typeof shape.photoshapeFitValue !== "number") {
      shape.photoshapeFitValue = 100;
    }
  };

  const applyFitToShape = (shape, fitValue) => {
    if (!shape || shape.source !== "photoshape" || !shape._draft) return;
    ensureShapeFitBase(shape);

    const v = clampFit(fitValue);
    const scale = v / 100;
    const base = shape._fitBasePoints;
    if (!Array.isArray(base) || base.length < 3) return;

    let cx = 0;
    let cy = 0;
    for (const [x, y] of base) {
      cx += x;
      cy += y;
    }
    cx /= base.length;
    cy /= base.length;

    shape.points = base.map(([x, y]) => [cx + (x - cx) * scale, cy + (y - cy) * scale]);
    shape.photoshapeFitValue = v;
    shape._pointsDirty = true;
  };

  const syncFitUiFromSelected = () => {
    const visible =
      photoshapeFlowActive &&
      photoshapeStep === 3 &&
      selected &&
      selected.source === "photoshape" &&
      selected._draft;

    setFitUiVisible(!!visible);
    if (!visible) return;

    ensureShapeFitBase(selected);
    const v = clampFit(selected.photoshapeFitValue);
    if (fitUI.slider) fitUI.slider.value = String(v);
    if (fitUI.input) fitUI.input.value = String(v);
  };

  const syncDepthInputs = () => syncPhotoshapeDepthInputs(selected);

  const getDepthPanelId = () => getPhotoshapeDepthPanelId(selected);

  const photoshapeSession = {
    ids: [],
    order: [],
    index: 0,
  };

  const goStepUpload = () => setPhotoshapeStep(1, getPhotoshapeStepUploadConfig());
  const goStepProcessing = () => setPhotoshapeStep(2, getPhotoshapeStepProcessingConfig());
  const goStepReady = () => setPhotoshapeStep(2, getPhotoshapeStepReadyConfig());
  const goStepEdit = () => setPhotoshapeStep(3, getPhotoshapeStepEditConfig(photoshapeSession));
  const goStepDepth = () => setPhotoshapeStep(4, getPhotoshapeStepDepthConfig(photoshapeSession));

  const openEditPanel = () => {
    showPanelFromLeft("upload-photo-panel");
    movePhotoshapeFlowControls("upload-photo-panel");
  };

  const openDepthPanel = () => {
    const depthPanelId = getDepthPanelId();
    showPanelFromRight(depthPanelId);
    movePhotoshapeFlowControls(depthPanelId);
  };

  const setSessionDraftState = (isDraft) => {
    photoshapeSession.ids.forEach((id) => {
      const shape = shapesArray.find((s) => s.id === id);
      if (!shape) return;
      shape._draft = isDraft;
    });
  };

  const clearSessionOverlayRefs = () => {
    photoshapeSession.ids.forEach((id) => {
      const shape = shapesArray.find((s) => s.id === id);
      if (!shape) return;
      shape.photoshapeImageSrc = null;
    });
  };

  const beginSession = () =>
    beginPhotoshapeEditSession(photoshapeSession, shapesArray, selected);

  const moveToNext = () =>
    advanceToNextUnvisited(
      photoshapeSession,
      shapesArray,
      selected,
      (shape) => {
        selected = shape;
      },
      callback,
      showPanelFromRight
    );

  const hidePhotoshapeUI = () => {
    removeFoamPhotoOverlay();
    setPhotoshapeAuxUiVisible(false);
    setPhotoshapeFlowActive(false);
    photoshapeFlowReady = false;
    setFitUiVisible(false);
  };

  const cleanupPhotoshapeUI = () => {
    const remaining = shapesArray.some((s) => s?.source === "photoshape");
    if (!remaining) {
      photoshapeSession.ids = [];
      photoshapeSession.index = 0;
      goStepUpload();
      hidePhotoshapeUI();
    }
  };

  window.__photoshapeCleanup = cleanupPhotoshapeUI;
  window.__photoshapeExit = () => {
    setEditing(false, true);

    setPhotoshapeFlowActive(false);
    photoshapeFlowReady = false;

    goStepUpload();
    removeFoamPhotoOverlay();

    setPhotoshapeAuxUiVisible(false);
    setFitUiVisible(false);
  };

  photoshapeSession.visited = new Set();
  photoshapeSession.remaining = 0;

  const startPhotoshapeEditFlow = () => {
    if (!photoshapeSession.ids.length) return;
    if (!state.display2D) {
      saveCameraView();
      resetCameraToTopView();
    }
    applyOverlayFromSelected();
    setPhotoshapeAuxUiVisible(true);
    setPhotoshapeFlowActive(true);
    beginSession();
    setEditing(true);
    goStepEdit();
    openEditPanel();
  };

  setPhotoshapeFlowActive(false);
  goStepUpload();

  if (fitUI.slider) {
    fitUI.slider.addEventListener("input", () => {
      const v = clampFit(fitUI.slider.value);
      if (fitUI.input) fitUI.input.value = String(v);
      if (selected && selected.source === "photoshape" && selected._draft) {
        applyFitToShape(selected, v);
        callback(selected);
        doCsg();
      }
    });
  }

  if (fitUI.input) {
    fitUI.input.addEventListener("input", () => {
      const v = clampFit(fitUI.input.value);
      if (fitUI.slider) fitUI.slider.value = String(v);
      if (selected && selected.source === "photoshape" && selected._draft) {
        applyFitToShape(selected, v);
        callback(selected);
        doCsg();
      }
    });
  }

  if (stepUI.back) {
    stepUI.back.addEventListener("click", () => {
      if (!photoshapeFlowActive) return;

      if (photoshapeStep === 4) {
        setEditing(true);
        goStepEdit();
        if (!state.display2D) restoreCameraView();
        openEditPanel();
        return;
      }

      if (photoshapeStep === 3) {
        setEditing(false, true);
        goStepReady();
        return;
      }

      if (photoshapeStep === 2) {
        goStepUpload();
        removeFoamPhotoOverlay();
      }

    });
  }

  if (stepUI.next) {
    stepUI.next.addEventListener("click", () => {
      if (!photoshapeFlowActive) return;

      if (photoshapeStep === 2) {
        beginSession();
        setEditing(true);
        goStepEdit();
        openEditPanel();
        return;
      }

      if (photoshapeStep === 3) {
        setEditing(false);
        syncDepthInputs();
        goStepDepth();
        openDepthPanel();
        if (!state.display2D) {
          saveCameraView();
          resetCameraToFrontView();
        }
        return;
      }

      if (photoshapeStep === 4) {
        const moved = moveToNext();
        if (moved) {
          if (selected?.photoshapeImageSrc) {
            applyFoamPhotoOverlay(selected.photoshapeImageSrc);
          }
          setEditing(true);
          goStepEdit();
          openEditPanel();
          return;
        }

        setEditing(false, true);
        goStepReady();
        setPhotoshapeFlowActive(false);
        setPhotoshapeAuxUiVisible(false);

        removeFoamPhotoOverlay();

        shapesArray.forEach((s) => {
          if (s?.source === "photoshape") {
            s._draft = false;
            s.photoshapeImageSrc = null;
            delete s._fitBasePoints;
            delete s.photoshapeFitValue;
          }
        });
        setFitUiVisible(false);

        doCsg();
        commit();

        if (selected) showPanelFromRight(selected.kind + "-panel");
      }
    });
  }

  const editShapeButton = document.querySelector("#edit-shape");
  if (editShapeButton) {
    editShapeButton.addEventListener("click", () => {
      if (!selected || selected.source !== "photoshape") return;
      if (!photoshapeFlowActive) return;
      startPhotoshapeEditFlow();
    });
  }

  document.querySelector("#upload-photo-input").onchange = async (e) => {
    resetPhotoshapeSessionState(photoshapeSession);
    setPhotoshapeFlowActive(true);
    goStepUpload();
    photoshapeFlowReady = false;
    setPhotoshapeAuxUiVisible(true);
    setEditing(false, true);
    movePhotoshapeFlowControls("upload-photo-panel");
    removeFoamPhotoOverlay();

    document.querySelector("#back-button").removeAttribute("disabled");
    document.querySelector("#back-button").onclick = () => {
      document.querySelector("#back-button").setAttribute("disabled", "");
      setPhotoshapeAuxUiVisible(false);
      showPanelFromLeft("main-panel");
      setEditing(false, true);
      selected = null;
      setPhotoshapeFlowActive(false);
      photoshapeFlowReady = false;
      goStepUpload();
      removeFoamPhotoOverlay();
    };

    const file = e.target.files?.[0];
    if (!file) return;

    goStepProcessing();

    try {
      const { contours, imageSrc } = await uploadAndDetectContours(file);
      if (!Array.isArray(contours) || !contours.length) {
        throw new Error("Contours data is empty");
      }
      if (!imageSrc) {
        throw new Error("Background-removed image missing");
      }

      applyFoamPhotoOverlay(imageSrc);
      const { width: imageWidth, height: imageHeight } =
        await readImageDimensions(imageSrc);

      resetPhotoshapeSessionState(photoshapeSession);

      const createdShapes = createPhotoshapeShapesFromContours({
        contoursData: contours,
        simplifyPhotoshapePoints,
        generateId,
        millimeters,
        defaultCornerRadius,
        imageSrc,
        foam: state.foam,
        imageWidth,
        imageHeight,
      });

      if (!createdShapes.length) {
        throw new Error("No valid contours to create shapes");
      }

      appendPhotoshapeShapes(shapesArray, photoshapeSession, createdShapes);
      selected = createdShapes[0];

      showPanelFromRight(selected.kind + "-panel");
      doCsg();
      callback(selected);
      commit();

      photoshapeSession.index = 0;
      beginSession();

      photoshapeFlowReady = true;
      setPhotoshapeFlowActive(true);
      goStepReady();
      openEditPanel();
    } catch (error) {
      console.error("Error:", error);
      removeFoamPhotoOverlay();
      setPhotoshapeFlowActive(false);
      setPhotoshapeAuxUiVisible(false);
      goStepUpload();
    }
  };
};
