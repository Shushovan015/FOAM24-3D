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
  defaultCornerRadius
  // createEditor
) => {
  const stepUI = {
    container: document.querySelector("#photoshape-stepper"),
    steps: Array.from(document.querySelectorAll("[data-photoshape-step]")),
    note: document.querySelector("#photoshape-step-note"),
    back: document.querySelector("#photoshape-step-back"),
    next: document.querySelector("#photoshape-step-next"),
  };

  let photoshapeFlowActive = false;
  let photoshapeFlowReady = false;
  let photoshapeStep = 1;
  const MAX_PHOTOSHAPE_POINTS = 150;

  const simplifyPhotoshapePoints = (pts) =>
    simplifyPhotoshapeContourPoints(pts, simplifyPointsForDrag, MAX_PHOTOSHAPE_POINTS);

  const setPhotoshapeFlowActive = (active) => {
    photoshapeFlowActive = active;
    setPhotoshapeFlowVisibility(stepUI, active);
  };

  const setPhotoshapeStep = (step, options = {}) => {
    photoshapeStep = step;
    renderPhotoshapeStep(stepUI, photoshapeStep, options);
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
    setPhotoshapeAuxUiVisible(false);
    setPhotoshapeFlowActive(false);
    photoshapeFlowReady = false;
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

    setPhotoshapeAuxUiVisible(false);
  };

  photoshapeSession.visited = new Set();
  photoshapeSession.remaining = 0;

  const startPhotoshapeEditFlow = () => {
    if (!photoshapeSession.ids.length) return;
    if (!state.display2D) {
      saveCameraView();
      resetCameraToTopView();
    }
    setPhotoshapeAuxUiVisible(true);
    setPhotoshapeFlowActive(true);
    beginSession();
    setEditing(true);
    goStepEdit();
    openEditPanel();
  };

  setPhotoshapeFlowActive(false);
  goStepUpload();

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
          setEditing(true);
          goStepEdit();
          openEditPanel();
          return;
        }
        setEditing(false, true);
        goStepReady();
        setPhotoshapeFlowActive(false);
        setPhotoshapeAuxUiVisible(false);
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

  document.querySelector("#upload-photo-input").onchange = (e) => {
    resetPhotoshapeSessionState(photoshapeSession);
    setPhotoshapeFlowActive(true);
    goStepUpload();
    photoshapeFlowReady = false;
    setPhotoshapeAuxUiVisible(true);
    setEditing(false, true);
    movePhotoshapeFlowControls("upload-photo-panel");

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
    };

    const file = e.target.files[0];
    if (file) {
      const imgElement = document.getElementById("upload-photo-img");
      const reader = new FileReader();
      goStepProcessing();

      reader.onload = function (ev) {
        const imageSrc = ev.target.result;
        imgElement.src = imageSrc;
        goStepProcessing();
        uploadAndDetectContours(file)
          .then((contoursData) => {
            if (!contoursData) {
              console.error("Contours data is null");
              return;
            }
            createShape(contoursData, imageSrc);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      };
      reader.readAsDataURL(file);

    }

    function createShape(contoursData, imageSrc) {
      const imgElement = document.querySelector("#upload-photo-img");
      imgElement.onload = () => {
        resetPhotoshapeSessionState(photoshapeSession);
        const createdShapes = createPhotoshapeShapesFromContours({
          contoursData,
          simplifyPhotoshapePoints,
          generateId,
          millimeters,
          defaultCornerRadius,
        });
        if (!createdShapes.length) {
          console.error("No valid contours to create shapes");
          setPhotoshapeFlowActive(false);
          setPhotoshapeAuxUiVisible(false);
          goStepUpload();
          return;
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
      };
      imgElement.src = imageSrc;
    }
  };
};
