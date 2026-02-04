import { getBase64, generateId } from "../../utils/common";
import {
  getPhotoshapeDepthLabel,
  beginPhotoshapeEditSession,
  advanceToNextUnvisited,
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

  const moveFlowControls = (panelId) => {
    const controls = document.getElementById("photoshape-flow-controls");
    const panel = document.getElementById(panelId);
    const anchor = panel?.querySelector(".photoshape-flow-anchor");
    if (controls && anchor) {
      anchor.appendChild(controls);
    }
  };

  let photoshapeFlowActive = false;
  let photoshapeFlowReady = false;
  let photoshapeStep = 1;

  const setPhotoshapeFlowActive = (active) => {
    photoshapeFlowActive = active;
    if (stepUI.container) {
      stepUI.container.style.display = active ? "block" : "none";
    }
  };

  const setPhotoshapeStep = (step, options = {}) => {
    photoshapeStep = step;

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

    if (stepUI.steps && stepUI.steps.length) {
      stepUI.steps.forEach((el) => {
        const stepNum = parseInt(el.getAttribute("data-photoshape-step"), 10);
        if (!Number.isNaN(stepNum)) {
          el.style.opacity = stepNum <= photoshapeStep ? "1" : "0.35";
          el.style.fontWeight = stepNum === photoshapeStep ? "700" : "400";
        }
      });
    }
  };

  const setEditing = (on, restore = false) => {
    if (on && !state.display2D) {
      saveCameraView();
      resetCameraToTopView();
    }
    window.__editingPoints = on;
    callback1(on);
    if (!on && restore) {
      restoreCameraView();
    }
  };

  const syncDepthInputs = () => {
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

  const getDepthPanelId = () => {
    if (!selected) return "polygon-depth-panel";
    return selected.kind === "photoshape"
      ? "photoshape-depth-panel"
      : "polygon-depth-panel";
  };

  const photoshapeSession = {
    ids: [],
    order: [],
    index: 0,
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
    document.getElementById("photoshape-step-note").style.display = "none";
    document.getElementById("photoshape-button").style.display = "none";
    setPhotoshapeFlowActive(false);
    photoshapeFlowReady = false;
  };

  const cleanupPhotoshapeUI = () => {
    const remaining = shapesArray.some((s) => s?.source === "photoshape");
    if (!remaining) {
      photoshapeSession.ids = [];
      photoshapeSession.index = 0;
      setPhotoshapeStep(1, {
        note: "Upload an image to start.",
        canBack: false,
        canNext: false,
        nextLabel: "Edit",
      });
      hidePhotoshapeUI();
    }
  };

  window.__photoshapeCleanup = cleanupPhotoshapeUI;
  window.__photoshapeExit = () => {
    setEditing(false, true);

    setPhotoshapeFlowActive(false);
    photoshapeFlowReady = false;

    setPhotoshapeStep(1, {
      note: "Upload an image to start.",
      canBack: false,
      canNext: false,
      nextLabel: "Edit",
    });

    const note = document.getElementById("photoshape-step-note");
    if (note) note.style.display = "none";

    const btn = document.getElementById("photoshape-button");
    if (btn) btn.style.display = "none";
  };

  photoshapeSession.visited = new Set();
  photoshapeSession.remaining = 0;

  const startPhotoshapeEditFlow = () => {
    if (!photoshapeSession.ids.length) return;
    if (!state.display2D) {
      saveCameraView();
      resetCameraToTopView();
    }
    document.getElementById("photoshape-step-note").style.display = "flex";
    document.getElementById("photoshape-button").style.display = "flex";

    setPhotoshapeFlowActive(true);
    beginSession();
    setEditing(true);
    setPhotoshapeStep(3, {
      note: `Edit outline: shape ${photoshapeSession.index + 1
        } of ${photoshapeSession.order.length || photoshapeSession.ids.length}`,
      canBack: true,
      canNext: true,
      nextLabel: "Depth",
    });

    showPanelFromLeft("upload-photo-panel");
    moveFlowControls("upload-photo-panel");
  };

  setPhotoshapeFlowActive(false);
  setPhotoshapeStep(1, {
    note: "Upload an image to start.",
    canBack: false,
    canNext: false,
    nextLabel: "Edit",
  });

  if (stepUI.back) {
    stepUI.back.addEventListener("click", () => {
      if (!photoshapeFlowActive) return;
      if (photoshapeStep === 4) {
        setEditing(true);
        setPhotoshapeStep(3, {
          note: `Edit outline: shape ${photoshapeSession.index + 1
            } of ${photoshapeSession.order.length || photoshapeSession.ids.length}`,
          canBack: true,
          canNext: true,
          nextLabel: "Depth",
        });
        if (!state.display2D) restoreCameraView();
        showPanelFromLeft("upload-photo-panel");
      } else if (photoshapeStep === 3) {
        setEditing(false, true);
        setPhotoshapeStep(2, {
          note: "Outline ready. Click Edit to adjust points.",
          canBack: true,
          canNext: true,
          nextLabel: "Edit",
        });
      } else if (photoshapeStep === 2) {
        setPhotoshapeStep(1, {
          note: "Upload an image to start.",
          canBack: false,
          canNext: false,
          nextLabel: "Edit",
        });
      }
    });
  }

  if (stepUI.next) {
    stepUI.next.addEventListener("click", () => {
      if (!photoshapeFlowActive) return;

      if (photoshapeStep === 2) {
        beginSession();
        setEditing(true);
        setPhotoshapeStep(3, {
          note: `Edit outline: shape ${photoshapeSession.index + 1
            } of ${photoshapeSession.order.length || photoshapeSession.ids.length}`,
          canBack: true,
          canNext: true,
          nextLabel: "Depth",
        });
        showPanelFromLeft("upload-photo-panel");
        moveFlowControls("upload-photo-panel");
        return;
      }

      if (photoshapeStep === 3) {
        setEditing(false);
        syncDepthInputs();
        setPhotoshapeStep(4, {
          note: `Adjust depth: shape ${photoshapeSession.index + 1
            } of ${photoshapeSession.order.length || photoshapeSession.ids.length}`,
          canBack: true,
          canNext: true,
          nextLabel: getPhotoshapeDepthLabel(photoshapeSession),
        });
        showPanelFromRight(getDepthPanelId());
        moveFlowControls(getDepthPanelId());
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
          setPhotoshapeStep(3, {
            note: `Edit outline: shape ${photoshapeSession.index + 1
              } of ${photoshapeSession.order.length || photoshapeSession.ids.length}`,
            canBack: true,
            canNext: true,
            nextLabel: "Depth",
          });
          showPanelFromLeft("upload-photo-panel");
          moveFlowControls("upload-photo-panel");
          return;
        }
        setEditing(false, true);
        setPhotoshapeStep(2, {
          note: "Outline ready. Click Edit to adjust again.",
          canBack: true,
          canNext: true,
          nextLabel: "Edit",
        });
        setPhotoshapeFlowActive(false);
        document.getElementById("photoshape-step-note").style.display = "none";
        document.getElementById("photoshape-button").style.display = "none";
        if (selected) {
          showPanelFromRight(selected.kind + "-panel");
        }
      }
    });
  }

  const editShapeButton = document.querySelector("#edit-shape");
  if (editShapeButton) {
    editShapeButton.addEventListener("click", () => {
      startPhotoshapeEditFlow();
    });
  }

  document.querySelector("#upload-photo-input").onchange = (e) => {
    photoshapeSession.ids = [];
    photoshapeSession.index = 0;

    setPhotoshapeFlowActive(true);
    setPhotoshapeStep(1, {
      note: "Upload an image to start.",
      canBack: false,
      canNext: false,
      nextLabel: "Edit",
    });
    photoshapeFlowReady = false;
    document.getElementById("photoshape-step-note").style.display = "flex";
    document.getElementById("photoshape-button").style.display = "flex";
    setEditing(false, true);
    moveFlowControls("upload-photo-panel");

    document.querySelector("#back-button").removeAttribute("disabled");
    document.querySelector("#back-button").onclick = () => {
      document.querySelector("#back-button").setAttribute("disabled", "");
      document.getElementById("photoshape-step-note").style.display = "none";
      document.getElementById("photoshape-button").style.display = "none";
      showPanelFromLeft("main-panel");
      setEditing(false, true);
      selected = null;
      setPhotoshapeFlowActive(false);
      photoshapeFlowReady = false;
      setPhotoshapeStep(1, {
        note: "Upload an image to start.",
        canBack: false,
        canNext: false,
        nextLabel: "Edit",
      });
    };

    document.querySelector("#edit-shape").onclick = () => {
      startPhotoshapeEditFlow();
    };

    const file = e.target.files[0];
    if (file) {
      const imgElement = document.getElementById("upload-photo-img");
      const reader = new FileReader();
      setPhotoshapeStep(2, {
        note: "Removing background and detecting outline...",
        canBack: true,
        canNext: false,
        nextLabel: "Edit",
      });

      reader.onload = function (ev) {
        imgElement.src = ev.target.result;
        uploadImage(file, ev.target.result);
      };
      reader.readAsDataURL(file);
    }

    function uploadImage(fileParam, imageSrc) {
      setPhotoshapeStep(2, {
        note: "Removing background and detecting outline...",
        canBack: true,
        canNext: false,
        nextLabel: "Edit",
      });

      getBase64(fileParam)
        .then((base64Image) => {
          const REMOVE_BG_KEY = import.meta.env.VITE_REMOVE_BG_KEY || "";
          return fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": "y7X524wbiR3cUWL9AinkUAqq",
            },
            body: JSON.stringify({
              image_file_b64: base64Image,
            }),
          });
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to remove background");
          }
          return response.blob();
        })
        .then((blob) => {
          const formData = new FormData();
          formData.append("image", blob, "image.png");

          const CONTOUR_API_BASE =
            import.meta.env.VITE_CONTOUR_API_BASE || "http://localhost:5000";

          return fetch(`${CONTOUR_API_BASE}/detect_contours`, {
            method: "POST",
            body: formData,
          });
        })
        .then((response) => response.json())
        .then((data) => {
          const contoursData = data?.contours;
          if (contoursData) {
            createShape(contoursData, imageSrc);
          } else {
            console.error("Contours data is null");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    function createShape(contoursData, imageSrc) {
      const imgElement = document.querySelector("#upload-photo-img");

      imgElement.onload = () => {
        photoshapeSession.ids = [];
        photoshapeSession.index = 0;

        contoursData.forEach((contour, index) => {
          let shape = {
            id: generateId(),
            kind: "polygon",
            x: -225,
            y: -225,
            sizeZ: 300 * millimeters,
            sizeX: 200 * millimeters,
            sizeY: 250 * millimeters,
            points: contour,
            rotation: 0,
            free: true,
            source: "photoshape",
            cornerRadius: defaultCornerRadius,
          };

          shapesArray.push(shape);
          photoshapeSession.ids.push(shape.id);

          if (index === 0) {
            selected = shape;
            showPanelFromRight(selected.kind + "-panel");
            doCsg();
            callback(selected);
          }
        });
        commit();
        photoshapeSession.index = 0;
        beginSession();

        photoshapeFlowReady = true;
        setPhotoshapeFlowActive(true);
        setPhotoshapeStep(2, {
          note: "Outline ready. Click Edit to adjust points.",
          canBack: true,
          canNext: true,
          nextLabel: "Edit",
        });
        showPanelFromLeft("upload-photo-panel");
      };
      imgElement.src = imageSrc;
    }
  };
};
