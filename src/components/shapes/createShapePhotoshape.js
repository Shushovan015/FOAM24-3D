import { generateId } from "../../utils/common";
import { uploadAndDetectContours } from "../../utils/photoshapeApi";
import {
  beginPhotoshapeEditSession,
  advanceToNextUnvisited,
  movePhotoshapeFlowControls,
  setPhotoshapeFlowVisibility,
  renderPhotoshapeStep,
  setPhotoshapeEditingMode,
  syncPhotoshapeDepthInputs,
  getPhotoshapeDepthPanelId,
  setPhotoshapeAuxUiVisible,
  resetPhotoshapeSessionState,
  createPhotoshapeShapesFromContours,
  appendPhotoshapeShapes,
  getPhotoshapeStepUploadConfig,
  getPhotoshapeStepProcessingConfig,
  getPhotoshapeStepReadyConfig,
  getPhotoshapeStepEditConfig,
  getPhotoshapeStepDepthConfig,
  applyPhotoshapeFitAccuracyToShape,
  clampPhotoshapeFitAccuracy,
  mapFoamLocalPointToImagePixel,
  applyDeferredCalibrationScaleToShape
} from "../../utils/photoshapeFlow";

import {
  saveCameraView,
  restoreCameraView,
  resetCameraToFrontView,
  resetCameraToTopView
} from "../../setup/scene";
import { state } from "../../setup/state";

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
) => {
  const getSelected = () => state.selected ?? selected ?? null;
  const setSelected = (nextSelected) => {
    selected = nextSelected ?? null;
    state.selected = selected;
  };

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
    value: document.querySelector("#photoshape-fit-value"),
  };
  const calibrationUI = {
    group: document.querySelector("#photoshape-calibration-group"),
    start: document.querySelector("#photoshape-calibration-start"),
    reset: document.querySelector("#photoshape-calibration-reset"),
    mm: document.querySelector("#photoshape-calibration-mm"),
    apply: document.querySelector("#photoshape-calibration-apply"),
    status: document.querySelector("#photoshape-calibration-status"),
    picked: document.querySelector("#photoshape-calibration-picked"),
    help: document.querySelector("#photoshape-calibration-help"),
    px: document.querySelector("#photoshape-calibration-px"),
    scale: document.querySelector("#photoshape-calibration-scale"),
    error: document.querySelector("#photoshape-calibration-error"),
    deferred: document.querySelector("#photoshape-calibration-deferred"),
  };

  const flowInfo = document.querySelector("#photoshape-flow-info");

  const uploadPreview = document.querySelector("#upload-photo-img");
  if (uploadPreview) uploadPreview.style.display = "none";

  let photoshapeFlowActive = false;
  let photoshapeFlowReady = false;
  let photoshapeStep = 1;
  if (!window.__photoshapeCalibration) {
    window.__photoshapeCalibration = {
      active: false,
      lockEditing: false,
      onPointPicked: null,
    };
  }

  const setPhotoshapeFlowActive = (active) => {
    photoshapeFlowActive = active;
    setPhotoshapeFlowVisibility(stepUI, active);
  };

  const setPhotoshapeStep = (step, options = {}) => {
    photoshapeStep = step;
    renderPhotoshapeStep(stepUI, photoshapeStep, options);
    syncCalibrationUiFromSelected();
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
    const current = getSelected();
    if (current?.photoshapeImageSrc) {
      applyFoamPhotoOverlay(current.photoshapeImageSrc);
    }
  };

  const removeFoamPhotoOverlay = () => {
    if (typeof clearFoamPhotoOverlay === "function") {
      clearFoamPhotoOverlay();
    }
  };

  const ensureCalibration = (shape) => {
    if (!shape) return null;
    if (!shape._calibration) {
      shape._calibration = {
        pointIndices: [],
        realDistanceMm: null,
        pixelDistance: null,
        mmPerPixel: null,
      };
    }
    return shape._calibration;
  };

  const isCurrentShapeCalibrated = () => {
    const current = getSelected();
    if (!current) return false;
    const c = ensureCalibration(current);
    return Number.isFinite(c.mmPerPixel) && c.mmPerPixel > 0;
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

  const showCalibrationError = (msg) => {
    if (!calibrationUI.error) return;
    calibrationUI.error.style.display = "block";
    calibrationUI.error.textContent = msg;
  };

  const clearCalibrationError = () => {
    if (!calibrationUI.error) return;
    calibrationUI.error.style.display = "none";
    calibrationUI.error.textContent = "";
  };

  const syncCalibrationUiFromSelected = () => {
    const current = getSelected();
    const visible =
      photoshapeFlowActive &&
      photoshapeStep === 3 &&
      current &&
      current.source === "photoshape" &&
      current._draft;

    if (calibrationUI.group) calibrationUI.group.style.display = visible ? "block" : "none";
    if (!visible) {
      window.__photoshapeCalibration.active = false;
      window.__photoshapeCalibration.lockEditing = false;
      window.__photoshapeCalibration.onPointPicked = null;
      return;
    }

    const c = ensureCalibration(current);
    const pickedCount = Array.isArray(c.pointIndices) ? c.pointIndices.length : 0;
    const mmValue = Number(calibrationUI.mm?.value);
    const mmValid = Number.isFinite(mmValue) && mmValue > 0;
    const calibrated = Number.isFinite(c.mmPerPixel) && c.mmPerPixel > 0;
    const canApply = pickedCount === 2 && mmValid && !calibrated;

    if (calibrationUI.picked) {
      calibrationUI.picked.textContent = `Picked: ${pickedCount} / 2 points`;
    }

    if (calibrationUI.status) {
      if (calibrated) calibrationUI.status.textContent = "Calibrated";
      else if (pickedCount < 2) calibrationUI.status.textContent = "Pick 2 points";
      else if (!mmValid) calibrationUI.status.textContent = "Enter distance (mm)";
      else calibrationUI.status.textContent = "Ready";
    }

    if (calibrationUI.help) {
      if (calibrated) calibrationUI.help.textContent = "Scale saved. Final size is applied after all shapes are finished.";
      else if (pickedCount < 2) calibrationUI.help.textContent = "Click two points on the selected shape outline.";
      else if (!mmValid) calibrationUI.help.textContent = "Two points selected. Enter known real distance in mm.";
      else calibrationUI.help.textContent = "Press Apply to save scale for this shape.";
    }

    if (calibrationUI.px) {
      calibrationUI.px.textContent = Number.isFinite(c.pixelDistance)
        ? `Pixel distance: ${c.pixelDistance.toFixed(1)} px`
        : "Pixel distance: -";
    }

    if (calibrationUI.scale) {
      calibrationUI.scale.textContent = Number.isFinite(c.mmPerPixel)
        ? `Scale: ${c.mmPerPixel.toFixed(4)} mm/px`
        : "Scale: -";
    }

    if (calibrationUI.deferred) {
      calibrationUI.deferred.style.display = calibrated ? "block" : "none";
    }

    if (calibrationUI.apply) {
      calibrationUI.apply.disabled = !canApply;
      calibrationUI.apply.textContent = calibrated ? "Calibrated" : "Apply Scale";
    }

    if (stepUI.next && photoshapeStep === 3) {
      stepUI.next.disabled = !calibrated;
    }

    current._selectedPointIndices = [...(c.pointIndices || [])];
    current._selectedPointIndex = c.pointIndices?.[0];

    window.__photoshapeCalibration.lockEditing = !calibrated;
  };

  const startCalibrationSelection = () => {
    const current = getSelected();
    if (!current || current.source !== "photoshape" || photoshapeStep !== 3) return;

    const c = ensureCalibration(current);
    c.pointIndices = [];
    c.realDistanceMm = null;
    c.pixelDistance = null;
    c.mmPerPixel = null;

    current._selectedPointIndices = [];
    delete current._selectedPointIndex;

    if (calibrationUI.mm) calibrationUI.mm.value = "";
    clearCalibrationError();

    window.__photoshapeCalibration.active = true;
    window.__photoshapeCalibration.lockEditing = true;
    window.__photoshapeCalibration.onPointPicked = ({ shape, idx }) => {
      const selected = getSelected();
      if (!selected || shape !== selected) return;

      const cal = ensureCalibration(selected);
      if (cal.pointIndices.includes(idx)) return;
      if (cal.pointIndices.length >= 2) cal.pointIndices.shift();
      cal.pointIndices.push(idx);

      selected._selectedPointIndices = [...cal.pointIndices];
      selected._selectedPointIndex = cal.pointIndices[0];

      syncCalibrationUiFromSelected();
    };

    syncCalibrationUiFromSelected();
    syncFitUiFromSelected();
  };

  const applyCalibrationForCurrent = () => {
    const shape = getSelected();
    if (!shape) return;

    const c = ensureCalibration(shape);
    if (!Array.isArray(shape.points) || shape.points.length < 3) return;

    if (!Array.isArray(c.pointIndices) || c.pointIndices.length !== 2) {
      showCalibrationError("Select 2 points and enter a valid mm value.");
      return;
    }

    const realDistanceMm = Number(calibrationUI.mm?.value);
    if (!Number.isFinite(realDistanceMm) || realDistanceMm <= 0) {
      showCalibrationError("Select 2 points and enter a valid mm value.");
      return;
    }

    const p1 = shape.points[c.pointIndices[0]];
    const p2 = shape.points[c.pointIndices[1]];
    if (!p1 || !p2) {
      showCalibrationError("Invalid selected points.");
      return;
    }

    const [p1x, p1y] = mapFoamLocalPointToImagePixel(
      p1[0], p1[1], state.foam, shape._contourImageWidth, shape._contourImageHeight
    );
    const [p2x, p2y] = mapFoamLocalPointToImagePixel(
      p2[0], p2[1], state.foam, shape._contourImageWidth, shape._contourImageHeight
    );

    const pixelDistance = Math.hypot(p2x - p1x, p2y - p1y);
    if (!Number.isFinite(pixelDistance) || pixelDistance <= 0) {
      showCalibrationError("Could not calculate pixel distance.");
      return;
    }

    c.realDistanceMm = realDistanceMm;
    c.pixelDistance = pixelDistance;
    c.mmPerPixel = realDistanceMm / pixelDistance;

    clearCalibrationError();

    window.__photoshapeCalibration.active = false;
    window.__photoshapeCalibration.lockEditing = false;
    window.__photoshapeCalibration.onPointPicked = null;

    syncCalibrationUiFromSelected();
    syncFitUiFromSelected();
  };

  const resetCalibrationForCurrent = () => {
    const shape = getSelected();
    if (!shape) return;
    const c = ensureCalibration(shape);

    c.pointIndices = [];
    c.realDistanceMm = null;
    c.pixelDistance = null;
    c.mmPerPixel = null;

    shape._selectedPointIndices = [];
    delete shape._selectedPointIndex;

    if (calibrationUI.mm) calibrationUI.mm.value = "";
    clearCalibrationError();

    window.__photoshapeCalibration.active = false;
    window.__photoshapeCalibration.lockEditing = true;
    window.__photoshapeCalibration.onPointPicked = null;

    syncCalibrationUiFromSelected();
    syncFitUiFromSelected();
  };

  const setFitUiVisible = (visible) => {
    if (fitUI.group) fitUI.group.style.display = visible ? "block" : "none";
  };

  const setFlowInfoVisible = (visible) => {
    if (flowInfo) flowInfo.style.display = visible ? "block" : "none";
  };

  const syncFitValueBadge = (v) => {
    if (fitUI.value) fitUI.value.textContent = `${clampPhotoshapeFitAccuracy(v)}%`;
  };

  const syncFitUiFromSelected = () => {
    const current = getSelected();

    const visible =
      photoshapeFlowActive &&
      photoshapeStep === 3 &&
      current &&
      current.source === "photoshape" &&
      current._draft;

    setFitUiVisible(!!visible);
    if (!visible) return;

    const calibrated = isCurrentShapeCalibrated();

    if (fitUI.slider) fitUI.slider.disabled = !calibrated;
    if (fitUI.input) fitUI.input.disabled = !calibrated;

    const v = clampPhotoshapeFitAccuracy(current.photoshapeFitAccuracy);
    if (fitUI.slider) fitUI.slider.value = String(v);
    if (fitUI.input) fitUI.input.value = String(v);
    syncFitValueBadge(v);
  };

  const syncDepthInputs = () => syncPhotoshapeDepthInputs(getSelected());

  const getDepthPanelId = () => getPhotoshapeDepthPanelId(getSelected());

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

  const beginSession = () =>
    beginPhotoshapeEditSession(photoshapeSession, shapesArray, getSelected());

  const moveToNext = () =>
    advanceToNextUnvisited(
      photoshapeSession,
      shapesArray,
      getSelected(),
      (shape) => {
        setSelected(shape);
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
    setFlowInfoVisible(false);
    if (calibrationUI.group) calibrationUI.group.style.display = "none";
    window.__photoshapeCalibration.active = false;
    window.__photoshapeCalibration.lockEditing = false;
    window.__photoshapeCalibration.onPointPicked = null;
  };

  const rollbackCurrentUploadDrafts = () => {
    const ids = new Set(photoshapeSession.ids || []);
    let removed = false;

    for (let i = shapesArray.length - 1; i >= 0; i--) {
      const s = shapesArray[i];
      if (!s || s.source !== "photoshape" || !s._draft) continue;
      if (ids.size && !ids.has(s.id)) continue;
      shapesArray.splice(i, 1);
      removed = true;
    }

    resetPhotoshapeSessionState(photoshapeSession);
    setSelected(null);

    if (removed) {
      doCsg();
      commit();
    }
  };

  const cancelPhotoshapeFlow = () => {
    setEditing(false, true);
    rollbackCurrentUploadDrafts();

    setPhotoshapeFlowActive(false);
    photoshapeFlowReady = false;
    goStepUpload();

    removeFoamPhotoOverlay();
    setPhotoshapeAuxUiVisible(false);
    setFitUiVisible(false);

    if (typeof setFlowInfoVisible === "function") {
      setFlowInfoVisible(false);
    }

    if (calibrationUI.group) calibrationUI.group.style.display = "none";
    window.__photoshapeCalibration.active = false;
    window.__photoshapeCalibration.lockEditing = false;
    window.__photoshapeCalibration.onPointPicked = null;

    const uploadInput = document.querySelector("#upload-photo-input");
    if (uploadInput) uploadInput.value = "";
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
    if (!photoshapeFlowActive && !photoshapeSession.ids.length) return;
    cancelPhotoshapeFlow();
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
    syncCalibrationUiFromSelected();
    syncFitUiFromSelected();
    openEditPanel();
  };

  setPhotoshapeFlowActive(false);
  goStepUpload();

  const onFitChanged = (nextValue) => {
    const current = getSelected();
    const v = clampPhotoshapeFitAccuracy(nextValue);
    if (fitUI.slider) fitUI.slider.value = String(v);
    if (fitUI.input) fitUI.input.value = String(v);
    syncFitValueBadge(v);

    if (!current || current.source !== "photoshape" || !current._draft) return;
    const changed = applyPhotoshapeFitAccuracyToShape(current, v, state.foam);
    if (!changed) return;

    callback(current);
    doCsg();
  };

  if (fitUI.slider) {
    fitUI.slider.addEventListener("input", () => onFitChanged(fitUI.slider.value));
  }

  if (fitUI.input) {
    fitUI.input.addEventListener("input", () => onFitChanged(fitUI.input.value));
  }

  if (stepUI.back) {
    stepUI.back.addEventListener("click", () => {
      if (!photoshapeFlowActive) return;

      if (photoshapeStep === 4) {
        setEditing(true);
        goStepEdit();
        syncCalibrationUiFromSelected();
        syncFitUiFromSelected();
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
        setFlowInfoVisible(false);
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
        syncCalibrationUiFromSelected();
        syncFitUiFromSelected();
        openEditPanel();
        return;
      }

      if (photoshapeStep === 3) {
        if (!isCurrentShapeCalibrated()) {
          showCalibrationError("Select 2 points and apply calibration before continuing.");
          syncCalibrationUiFromSelected();
          return;
        }

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
          const current = getSelected();

          if (current?.photoshapeImageSrc) {
            applyFoamPhotoOverlay(current.photoshapeImageSrc);
          }

          syncCalibrationUiFromSelected();

          const calibrated = isCurrentShapeCalibrated();
          if (!window.__photoshapeCalibration) window.__photoshapeCalibration = {};
          window.__photoshapeCalibration.lockEditing = !calibrated;
          window.__photoshapeCalibration.active = false;

          setEditing(true);
          goStepEdit();
          syncCalibrationUiFromSelected();
          syncFitUiFromSelected();
          openEditPanel();
          return;
        }
        setEditing(false, true);
        goStepReady();
        setPhotoshapeFlowActive(false);
        setPhotoshapeAuxUiVisible(false);
        photoshapeFlowReady = false;
        removeFoamPhotoOverlay();
        setFitUiVisible(false);
        setFlowInfoVisible(false);
        let scaledAny = false;
        shapesArray.forEach((s) => {
          if (s?.source === "photoshape" && s?._draft) {
            const changed = applyDeferredCalibrationScaleToShape(s, state.foam);
            if (changed) scaledAny = true;
          }
        });
        shapesArray.forEach((s) => {
          if (s?.source === "photoshape") {
            s._draft = false;
            s.photoshapeImageSrc = null;
            delete s._rawContourImage;
            delete s._contourImageWidth;
            delete s._contourImageHeight;
            delete s.photoshapeFitAccuracy;
            delete s._calibration;
            delete s._realScaleApplied;
          }
        });
        doCsg();
        commit();
        const current = getSelected();
        if (current) showPanelFromRight(current.kind + "-panel");
      }
    });
  }

  if (calibrationUI.start) calibrationUI.start.onclick = startCalibrationSelection;
  if (calibrationUI.apply) calibrationUI.apply.onclick = applyCalibrationForCurrent;
  if (calibrationUI.reset) calibrationUI.reset.onclick = resetCalibrationForCurrent;
  if (calibrationUI.mm) {
    calibrationUI.mm.addEventListener("input", () => {
      clearCalibrationError();
      syncCalibrationUiFromSelected();
    });
  }

  const editShapeButton = document.querySelector("#edit-shape");
  if (editShapeButton) {
    editShapeButton.addEventListener("click", () => {
      const current = getSelected();
      if (!current || current.source !== "photoshape") return;
      if (!photoshapeFlowActive) return;
      startPhotoshapeEditFlow();
    });
  }

  document.querySelector("#upload-photo-input").onchange = async (e) => {
    resetPhotoshapeSessionState(photoshapeSession);
    setPhotoshapeFlowActive(true);
    goStepUpload();
    setFlowInfoVisible(false);
    photoshapeFlowReady = false;
    setPhotoshapeAuxUiVisible(true);
    setEditing(false, true);
    movePhotoshapeFlowControls("upload-photo-panel");
    removeFoamPhotoOverlay();
    setFlowInfoVisible(false);

    const mainBackButton = document.querySelector("#back-button");
    mainBackButton.removeAttribute("disabled");
    mainBackButton.onclick = () => {
      mainBackButton.setAttribute("disabled", "");
      cancelPhotoshapeFlow();
      showPanelFromLeft("main-panel");
    };

    const file = e.target.files?.[0];
    if (!file) return;

    goStepProcessing();

    try {
      const { contours, imageSrc, imageWidth: apiWidth, imageHeight: apiHeight } =
        await uploadAndDetectContours(file);
      if (!Array.isArray(contours) || !contours.length) {
        throw new Error("Contours data is empty");
      }
      if (!imageSrc) {
        throw new Error("Background-removed image missing");
      }

      applyFoamPhotoOverlay(imageSrc);
      const { width: imageWidth, height: imageHeight } =
        apiWidth && apiHeight
          ? { width: apiWidth, height: apiHeight }
          : await readImageDimensions(imageSrc);

      resetPhotoshapeSessionState(photoshapeSession);

      const createdShapes = createPhotoshapeShapesFromContours({
        contoursData: contours,
        generateId,
        millimeters,
        defaultCornerRadius,
        imageSrc,
        foam: state.foam,
        imageWidth,
        imageHeight,
        fitAccuracy: 75,
      });

      if (!createdShapes.length) {
        throw new Error("No valid contours to create shapes");
      }
      appendPhotoshapeShapes(shapesArray, photoshapeSession, createdShapes);
      setSelected(createdShapes[0]);
      window.__photoshapeCalibration.active = false;
      window.__photoshapeCalibration.lockEditing = false;
      window.__photoshapeCalibration.onPointPicked = null;
      setFlowInfoVisible(true);
      syncFitValueBadge(getSelected()?.photoshapeFitAccuracy ?? 75);

      const current = getSelected();
      if (current) {
        showPanelFromRight(current.kind + "-panel");
      }
      doCsg();
      if (current) callback(current);
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
      setFlowInfoVisible(false);
    }
  };
};
