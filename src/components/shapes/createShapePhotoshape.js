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
  // createEditor
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
  const flowInfo = document.querySelector("#photoshape-flow-info");

  const uploadPreview = document.querySelector("#upload-photo-img");
  if (uploadPreview) uploadPreview.style.display = "none";

  let photoshapeFlowActive = false;
  let photoshapeFlowReady = false;
  let photoshapeStep = 1;

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
          const current = getSelected();
          if (current?.photoshapeImageSrc) {
            applyFoamPhotoOverlay(current.photoshapeImageSrc);
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
        photoshapeFlowReady = false;
        removeFoamPhotoOverlay();
        setFitUiVisible(false);
        setFlowInfoVisible(false);
        shapesArray.forEach((s) => {
          if (s?.source === "photoshape") {
            s._draft = false;
            s.photoshapeImageSrc = null;
            delete s._rawContourImage;
            delete s._contourImageWidth;
            delete s._contourImageHeight;
            delete s.photoshapeFitAccuracy;
          }
        });
        doCsg();
        commit();
        const current = getSelected();
        if (current) showPanelFromRight(current.kind + "-panel");
      }
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
