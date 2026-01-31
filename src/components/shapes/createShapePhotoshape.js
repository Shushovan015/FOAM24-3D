import axios from "axios";
import * as getImageOutline from "image-outline";
import { getBase64, generateId } from "../../utils/common";
import { getBoundingBox } from "../../utils/threeFunctions";

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
  scene
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
  const setEditing = (on) => {
    window.__editingPoints = on;
    callback1(on);
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

  // make it accessible for delete button flow
  window.__photoshapeCleanup = cleanupPhotoshapeUI;



  const selectPhotoshapeByIndex = (idx) => {
    if (!photoshapeSession.order.length) return false;
    if (idx < 0 || idx >= photoshapeSession.order.length) return false;

    const id = photoshapeSession.order[idx];
    const nextShape = shapesArray.find((s) => s.id === id);
    if (!nextShape) return false;

    selected = nextShape;
    photoshapeSession.index = idx;
    callback(selected);
    showPanelFromRight(selected.kind + "-panel");
    return true;
  };

  const getPhotoshapeNextLabel = () => {
    return photoshapeSession.index < photoshapeSession.order.length - 1
      ? "Next"
      : "Finish";
  };

  photoshapeSession.visited = new Set();
  photoshapeSession.remaining = 0;

  const beginPhotoshapeEditSession = () => {
    rebuildOrderAndIndex();
  };

  const startPhotoshapeEditFlow = () => {
    if (!photoshapeSession.ids.length) return;
    document.getElementById("photoshape-step-note").style.display = "flex";
    document.getElementById("photoshape-button").style.display = "flex";

    setPhotoshapeFlowActive(true);
    beginPhotoshapeEditSession();
    setEditing(true);
    setPhotoshapeStep(3, {
      note: `Edit outline: shape ${photoshapeSession.index + 1} of ${photoshapeSession.order.length || photoshapeSession.ids.length}`,
      canBack: true,
      canNext: true,
      nextLabel: "Depth",
    });

    showPanelFromLeft("upload-photo-panel");
  };

  const rebuildOrderAndIndex = () => {
    photoshapeSession.order = photoshapeSession.ids
      .map((id) => shapesArray.find((s) => s.id === id))
      .filter(Boolean)
      .sort((a, b) => getBoundingBox(a).minX - getBoundingBox(b).minX)
      .map((s) => s.id);

    if (selected && selected.id) {
      const idx = photoshapeSession.order.indexOf(selected.id);
      photoshapeSession.index = idx !== -1 ? idx : 0;
    } else {
      photoshapeSession.index = 0;
    }
  };


  const advanceToNextUnvisited = () => {
    rebuildOrderAndIndex();

    const nextIdx = photoshapeSession.index + 1;
    if (nextIdx >= photoshapeSession.order.length) return false;

    return selectPhotoshapeByIndex(nextIdx);
  };

  const getPhotoshapeDepthLabel = () => {
    return photoshapeSession.index < photoshapeSession.order.length - 1
      ? "Next Shape"
      : "Finish";
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
          note: `Edit outline: shape ${photoshapeSession.index + 1} of ${photoshapeSession.order.length || photoshapeSession.ids.length
            }`,
          canBack: true,
          canNext: true,
          nextLabel: "Depth",
        });
        showPanelFromLeft("upload-photo-panel");
      } else if (photoshapeStep === 3) {
        setEditing(false);
        setPhotoshapeStep(2, {
          note: "Outline ready. Click Edit to adjust points.",
          canBack: true,
          canNext: true,
          nextLabel: "Edit",
        })
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
        beginPhotoshapeEditSession();
        setEditing(true);
        setPhotoshapeStep(3, {
          note: `Edit outline: shape ${photoshapeSession.index + 1} of ${photoshapeSession.order.length || photoshapeSession.ids.length
            }`,
          canBack: true,
          canNext: true,
          nextLabel: "Depth",
        });
        showPanelFromLeft("upload-photo-panel");
        return;
      }

      if (photoshapeStep === 3) {
        setEditing(false);
        syncDepthInputs();
        setPhotoshapeStep(4, {
          note: `Adjust depth: shape ${photoshapeSession.index + 1} of ${photoshapeSession.order.length || photoshapeSession.ids.length
            }`,
          canBack: true,
          canNext: true,
          nextLabel: getPhotoshapeDepthLabel(),
        });
        showPanelFromRight(getDepthPanelId());
        return;
      }

      if (photoshapeStep === 4) {
        const moved = advanceToNextUnvisited();
        if (moved) {
          setEditing(true);
          setPhotoshapeStep(3, {
            note: `Edit outline: shape ${photoshapeSession.index + 1} of ${photoshapeSession.order.length || photoshapeSession.ids.length
              }`,
            canBack: true,
            canNext: true,
            nextLabel: "Depth",
          });
          showPanelFromLeft("upload-photo-panel");
          return;
        }

        setEditing(false);
        setPhotoshapeStep(2, {
          note: "Outline ready. Click Edit to adjust again.",
          canBack: true,
          canNext: true,
          nextLabel: "Edit",
        });
        setPhotoshapeFlowActive(false);
        document.getElementById("photoshape-step-note").style.display = `none`;
        document.getElementById("photoshape-button").style.display = `none`;
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
    document.getElementById("photoshape-step-note").style.display = `flex`;
    document.getElementById("photoshape-button").style.display = `flex`;
    setEditing(false);

    document.querySelector("#back-button").removeAttribute("disabled");
    document.querySelector("#back-button").onclick = () => {
      document.querySelector("#back-button").setAttribute("disabled", "");
      document.getElementById("photoshape-step-note").style.display = `none`;
      document.getElementById("photoshape-button").style.display = `none`;
      showPanelFromLeft("main-panel");
      setEditing(false);
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

      reader.onload = function (e) {
        imgElement.src = e.target.result;

        uploadImage(file, e.target.result);
      };
      reader.readAsDataURL(file);
    }

    function uploadImage(file, imageSrc) {
      setPhotoshapeStep(2, {
        note: "Removing background and detecting outline...",
        canBack: true,
        canNext: false,
        nextLabel: "Edit",
      });

      getBase64(file)
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

          const CONTOUR_API_BASE = import.meta.env.VITE_CONTOUR_API_BASE || "http://localhost:5000";

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
        // let shape = {
        //   kind: "photoshape",
        //   x: 0, // mouseRayPlaneIntersection.x,
        //   y: 0, // mouseRayPlaneIntersection.y,
        //   sizeZ: 300 * millimeters,
        //   sizeX: 200 * millimeters,
        //   sizeZ: 250 * millimeters,
        //   polygon: contoursData,
        //   rotation: 0,
        // };
        // shapesArray.push(shape);
        // commit();
        // selected = shape;
        // showPanelFromRight(selected.kind + "-panel");
        // doCsg();

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
            source: "photoshape"
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
        beginPhotoshapeEditSession();

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