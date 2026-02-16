import { state, units } from "./state";
import { doCsg } from "./csgWorker";
import { commit, undo, redo } from "./history";
import {
  initPanels,
  showPanelFromRight,
  showPanelFromLeft,
  getCurrentPanel,
} from "./panels";
import { createPdf } from "../components/createPdf";
import { createPdfIso } from "../components/createPdfIsometric";
import { createShapeCircle } from "../components/shapes/createShapeCircle";
import { createShapeFreehand } from "../components/shapes/createShapeFreehand";
import { createShapeRectangle } from "../components/shapes/createShapeRectangle";
import { createShapePhotoShape } from "../components/shapes/createShapePhotoshape";
import { createDFX } from "../components/createDFX";
import {
  buttonClick,
  deleteButtonClick,
  depthButtonClick,
  sliderButtonClick,
} from "../utils/buttonClick";
import {
  updateSelectedShape,
  updateDeleteButtons,
  resetCameraToTopView,
  resetCameraToFrontView,
  saveCameraView,
  restoreCameraView,
  beginCopyPlacement,
  cancelCopyPlacement
} from "./scene";
import { rightestPoint, leftestPoint, highestPoint, lowestPoint, structuredClone } from "../utils/common";
import { shapeToGeom2, simplifyPointsForDrag } from "../utils/threeFunctions";
import {
  saveShapeToLibrary,
  loadShapeLibrary,
  removeShapeFromLibrary,
  cloneShapeForInsert
} from "../utils/shapeLibrary";

export function initUI() {
  initPanels();
  state.currPanel = getCurrentPanel();

  const exit2DMode = () => {
    if (!state.display2D) return;
    state.display2D = false;
    restoreCameraView();
  };

  document.querySelectorAll("button").forEach((button) => {
    const { icon } = button.dataset;
    if (icon) {
      const i = document.createElement("i");
      i.innerText = icon;
      i.classList.add("material-symbols-outlined");
      button.prepend(i);
    }
  });

  state.panels = document.querySelectorAll(".panel");
  state.panels.forEach((panel) => {
    panel.style.opacity = 0;
    panel.style.pointerEvents = "none";
  });
  state.currPanel = state.panels[0];
  state.currPanel.style.opacity = 1;
  state.currPanel.style.pointerEvents = "auto";
  state.sidebar = document.querySelector("#sidebar");

  const copyButtonIds = [
    "copy-button",
    "rectangle-copy-button",
    "polygon-copy-button",
    "photoshape-copy-button",
  ];

  copyButtonIds.forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.onclick = () => {
      if (btn.hasAttribute("disabled")) return;
      beginCopyPlacement();
    };
  });

  buttonClick(
    "shapes-button",
    "main-panel",
    "shapes-panel",
    state.selected,
    showPanelFromLeft,
    showPanelFromRight
  );
  buttonClick(
    "foam-button",
    "main-panel",
    "foam-panel",
    state.selected,
    showPanelFromLeft,
    showPanelFromRight
  );
  buttonClick(
    "case-button",
    "main-panel",
    "case-panel",
    state.selected,
    showPanelFromLeft,
    showPanelFromRight
  );
  buttonClick(
    "create-photoshape",
    "main-panel",
    "upload-photo-panel",
    state.selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#upload-photo-input").value = null;
    }
  );

  const initPhotoShapeWhenReady = () => {
    if (state.cameraCopy && state.rendererCopy && state.sceneCopy) {
      createShapePhotoShape(
        units.millimeters,
        state.selected,
        state.shapesArray,
        commit,
        showPanelFromLeft,
        showPanelFromRight,
        doCsg,
        state.display2D,
        (modifiedSelected) => {
          state.selected = modifiedSelected;
          if (!state.display2D) {
            saveCameraView();
            resetCameraToTopView();
          }
        },
        (modifiedDisplay) => {
          state.display2D = modifiedDisplay;
        },
        state.cameraCopy,
        state.rendererCopy,
        state.sceneCopy,
        state.cornerRadius
      );
      return;
    }
    setTimeout(initPhotoShapeWhenReady, 100);
  };

  initPhotoShapeWhenReady();

  createShapeRectangle(
    units.millimeters,
    state.selected,
    state.shapesArray,
    commit,
    showPanelFromLeft,
    showPanelFromRight,
    doCsg,
    (modifiedSelected) => {
      state.selected = modifiedSelected;
      if (!state.display2D) {
        saveCameraView();
        resetCameraToTopView();
      }
    },
    state.cornerRadius
  );

  depthButtonClick(
    "rectangle-resize-button",
    "rectangle-panel",
    "rectangle-resize-panel",
    state.selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#rectangle-width-input").value = state.selected.sizeX;
      document.querySelector("#rectangle-width-slider").value = state.selected.sizeX;
      document.querySelector("#rectangle-height-input").value = state.selected.sizeY;
      document.querySelector("#rectangle-height-slider").value = state.selected.sizeY;
    }
  );
  depthButtonClick(
    "rectangle-depth-button",
    "rectangle-panel",
    "rectangle-depth-panel",
    state.selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#rectangle-depth-input").value = state.selected.sizeZ;
      document.querySelector("#rectangle-depth-slider").value = state.selected.sizeZ;
      if (!state.display2D) resetCameraToFrontView();
    }
  );
  depthButtonClick(
    "rectangle-rotate-button",
    "rectangle-panel",
    "rectangle-rotate-panel",
    state.selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#rectangle-rotate-input").value = state.selected.rotation;
      document.querySelector("#rectangle-rotate-slider").value = state.selected.rotation;
    }
  );

  sliderButtonClick("rectangle-width-slider", "rectangle-width-input", doCsg, (sizeX) => {
    state.selected.sizeX = sizeX;
  });
  sliderButtonClick("rectangle-width-input", "rectangle-width-slider", doCsg, (sizeX) => {
    state.selected.sizeX = sizeX;
  });
  document.querySelector("#rectangle-width-slider").onchange = commit;
  document.querySelector("#rectangle-width-input").onchange = commit;

  sliderButtonClick("rectangle-height-slider", "rectangle-height-input", doCsg, (sizeY) => {
    state.selected.sizeY = sizeY;
  });
  sliderButtonClick("rectangle-height-input", "rectangle-height-slider", doCsg, (sizeY) => {
    state.selected.sizeY = sizeY;
  });
  document.querySelector("#rectangle-height-slider").onchange = commit;
  document.querySelector("#rectangle-height-input").onchange = commit;

  sliderButtonClick("rectangle-rotate-input", "rectangle-rotate-slider", doCsg, (rotation) => {
    state.selected.rotation = rotation;
  });
  sliderButtonClick("rectangle-rotate-slider", "rectangle-rotate-input", doCsg, (rotation) => {
    state.selected.rotation = rotation;
  });
  document.querySelector("#rectangle-rotate-slider").onchange = commit;
  document.querySelector("#rectangle-rotate-input").onchange = commit;

  sliderButtonClick("rectangle-depth-slider", "rectangle-depth-input", doCsg, (sizeZ) => {
    state.selected.sizeZ = sizeZ;
  });
  sliderButtonClick("rectangle-depth-input", "rectangle-depth-slider", doCsg, (sizeZ) => {
    state.selected.sizeZ = sizeZ;
  });
  document.querySelector("#rectangle-depth-slider").onchange = commit;
  document.querySelector("#rectangle-depth-input").onchange = commit;

  deleteButtonClick("rectangle-delete-button", () => state.shapesArray, commit, doCsg, () => state.selected, showPanelFromLeft);

  createShapeCircle(
    units.millimeters,
    state.selected,
    state.shapesArray,
    commit,
    showPanelFromLeft,
    showPanelFromRight,
    doCsg,
    (modifiedSelected) => {
      state.selected = modifiedSelected;
      if (!state.display2D) {
        saveCameraView();
        resetCameraToTopView();
      }
    }
  );

  depthButtonClick(
    "radius-button",
    "circle-panel",
    "radius-panel",
    state.selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#radius-input").value = state.selected.radius;
      document.querySelector("#radius-slider").value = state.selected.radius;
    }
  );

  depthButtonClick(
    "depth-button",
    "circle-panel",
    "depth-panel",
    state.selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#depth-input").value = state.selected.sizeZ;
      document.querySelector("#depth-slider").value = state.selected.sizeZ;
      if (!state.display2D) resetCameraToFrontView();
    }
  );

  sliderButtonClick("radius-slider", "radius-input", doCsg, (radius) => {
    state.selected.radius = radius;
  });
  sliderButtonClick("radius-input", "radius-slider", doCsg, (radius) => {
    state.selected.radius = radius;
  });
  document.querySelector("#radius-slider").onchange = commit;
  document.querySelector("#radius-input").onchange = commit;

  sliderButtonClick("depth-slider", "depth-input", doCsg, (sizeZ) => {
    state.selected.sizeZ = sizeZ;
  });
  sliderButtonClick("depth-input", "depth-slider", doCsg, (sizeZ) => {
    state.selected.sizeZ = sizeZ;
  });
  document.querySelector("#depth-slider").onchange = commit;
  document.querySelector("#depth-input").onchange = commit;

  function waitForFoamAndInitFreehand() {
    const foamMesh = state.scene.getObjectByName("csgModel");
    if (foamMesh) {
      createShapeFreehand(
        units.millimeters,
        state.selected,
        state.shapesArray,
        commit,
        showPanelFromLeft,
        showPanelFromRight,
        doCsg,
        state.orthoCamera,
        state.sceneCopy,
        state.rendererCopy,
        state.display2D,
        (modifiedDisplay) => {
          state.display2D = modifiedDisplay;
        },
        (modifiedSelected, modifiedDisplay) => {
          state.selected = modifiedSelected;
          state.display2D = modifiedDisplay;
          if (!state.display2D) {
            saveCameraView();
            resetCameraToTopView();
          }
        },
        foamMesh,
        state.cornerRadius
      );
    } else {
      setTimeout(waitForFoamAndInitFreehand, 100);
    }
  }
  waitForFoamAndInitFreehand();

  depthButtonClick(
    "polygon-depth-button",
    "polygon-panel",
    "polygon-depth-panel",
    state.selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#polygon-depth-input").value = state.selected.sizeZ;
      document.querySelector("#polygon-depth-slider").value = state.selected.sizeZ;
      if (!state.display2D) resetCameraToFrontView();
    }
  );

  depthButtonClick(
    "polygon-rotate-button",
    "polygon-panel",
    "polygon-rotate-panel",
    state.selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#polygon-rotate-input").value = state.selected.rotation;
      document.querySelector("#polygon-rotate-slider").value = state.selected.rotation;
    }
  );

  const editShapeButton = document.getElementById("edit-shape");
  let isEditingPolygon = false;

  const addPointButton = document.getElementById("add-point");
  const deletePointButton = document.getElementById("delete-point");

  const setDeletePointButtonEnabled = (enabled) => {
    if (!deletePointButton) return;
    if (enabled) deletePointButton.removeAttribute("disabled");
    else deletePointButton.setAttribute("disabled", "");
  };

  const setDeletePointMode = (on) => {
    state.deletePointMode = on;
    if (deletePointButton) {
      deletePointButton.textContent = on ? "Exit Delete Point" : "Delete point";
    }
  };

  const setAddPointButtonEnabled = (enabled) => {
    if (!addPointButton) return;
    if (enabled) addPointButton.removeAttribute("disabled");
    else addPointButton.setAttribute("disabled", "");
  };

  const setAddPointMode = (on) => {
    state.addPointMode = on;
    if (addPointButton) {
      addPointButton.textContent = on ? "Exit Add Point" : "Add point";
    }
  };

  const setPointEditUi = (editing) => {
    window.__editingPoints = editing;
    setAddPointMode(false);
    setDeletePointMode(false);
    setAddPointButtonEnabled(editing);
    setDeletePointButtonEnabled(editing);

    if (editShapeButton) {
      editShapeButton.textContent = editing ? "Finish Edit" : "Edit points";
    }
  };

  window.__setPointEditUi = setPointEditUi;


  const exitPolygonEditMode = () => {
    if (!isEditingPolygon) return;

    isEditingPolygon = false;
    setPointEditUi(false);

    commit();

    if (state.display2D) {
      state.display2D = false;
      restoreCameraView();
    }
  };

  setAddPointButtonEnabled(false);
  setAddPointMode(false);
  setDeletePointButtonEnabled(false);
  setDeletePointMode(false);

  if (editShapeButton) {
    editShapeButton.onclick = () => {
      if (!state.selected || state.selected.kind !== "polygon") return;
      if (state.selected?.source === "photoshape" && Array.isArray(state.selected.points)) {
        state.selected.points = simplifyPointsForDrag(state.selected.points, 300);
      }
      if (!isEditingPolygon) {
        isEditingPolygon = true;
        setPointEditUi(true);
        if (!state.display2D) {
          saveCameraView();
          resetCameraToTopView();
        }
        state.display2D = true;
      } else {
        isEditingPolygon = false;
        setPointEditUi(false);
        commit();
        if (!state.display2D) return;
        state.display2D = false;
        restoreCameraView();
      }
    };
  }

  const backButton = document.querySelector("#back-button");
  if (backButton) {
    backButton.addEventListener(
      "click",
      () => {
        if (window.__photoshapeExit) window.__photoshapeExit();
        if (window.__editingPoints) {
          setPointEditUi(false);
        }
        if (state.display2D) {
          state.display2D = false;
          restoreCameraView();
        }
        cancelCopyPlacement();
      },
      true
    );
  }

  if (addPointButton) {
    addPointButton.onclick = () => {
      if (addPointButton.hasAttribute("disabled")) return;
      if (!state.selected || state.selected.kind !== "polygon") return;
      if (!window.__editingPoints) return;
      setDeletePointMode(false);
      setAddPointMode(!state.addPointMode);
    };
  }

  if (deletePointButton) {
    deletePointButton.onclick = () => {
      if (deletePointButton.hasAttribute("disabled")) return;
      if (!state.selected || state.selected.kind !== "polygon") return;
      if (!window.__editingPoints) return;
      setAddPointMode(false);
      setDeletePointMode(!state.deletePointMode);
    };
  }

  sliderButtonClick("polygon-rotate-input", "polygon-rotate-slider", doCsg, (rotation) => {
    state.selected.rotation = rotation;
  });
  sliderButtonClick("polygon-rotate-slider", "polygon-rotate-input", doCsg, (rotation) => {
    state.selected.rotation = rotation;
  });
  document.querySelector("#polygon-rotate-slider").onchange = commit;
  document.querySelector("#polygon-rotate-input").onchange = commit;

  sliderButtonClick("polygon-depth-slider", "polygon-depth-input", doCsg, (sizeZ) => {
    state.selected.sizeZ = sizeZ;
  });
  sliderButtonClick("polygon-depth-input", "polygon-depth-slider", doCsg, (sizeZ) => {
    state.selected.sizeZ = sizeZ;
  });
  document.querySelector("#polygon-depth-slider").onchange = commit;
  document.querySelector("#polygon-depth-input").onchange = commit;

  deleteButtonClick("polygon-delete-button", () => state.shapesArray, commit, doCsg, () => state.selected, showPanelFromLeft);
  deleteButtonClick("delete-button", () => state.shapesArray, commit, doCsg, () => state.selected, showPanelFromLeft);

  depthButtonClick(
    "photoshape-depth-button",
    "photoshape-panel",
    "photoshape-depth-panel",
    state.selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#photoshape-depth-input").value = state.selected.sizeZ;
      document.querySelector("#photoshape-depth-slider").value = state.selected.sizeZ;
      if (!state.display2D) resetCameraToFrontView();
    }
  );

  const unmergeBtn = document.querySelector("#polygon-unmerge-button");
  if (unmergeBtn) {
    unmergeBtn.onclick = () => {
      const selected = state.selected;
      if (
        !selected ||
        selected.kind !== "polygon" ||
        !Array.isArray(selected.mergedFrom) ||
        selected.mergedFrom.length === 0
      ) {
        return;
      }

      const idx = state.shapesArray.indexOf(selected);
      if (idx === -1) return;

      const originals = selected.mergedFrom.map((s) => structuredClone(s));
      state.shapesArray.splice(idx, 1, ...originals);

      state.selected = originals[0] || null;
      updateDeleteButtons(state.selected);

      doCsg();
      commit();

      if (state.selected) {
        const backBtn = document.querySelector("#back-button");
        if (backBtn) {
          backBtn.removeAttribute("disabled");
          backBtn.onclick = () => {
            backBtn.setAttribute("disabled", "");
            exit2DMode();
            showPanelFromLeft("main-panel");
            state.selected = null;
          };
        }
        showPanelFromRight(state.selected.kind + "-panel");
      } else {
        showPanelFromLeft("main-panel");
      }
    };
  }

  document.querySelector("#photoshape-rotate-button").onclick = () => {
    document.querySelector("#back-button").removeAttribute("disabled");
    document.querySelector("#back-button").onclick = () => {
      document.querySelector("#back-button").onclick = () => {
        exit2DMode();
        document.querySelector("#back-button").setAttribute("disabled", "");
        showPanelFromLeft("main-panel");
        state.selected = null;
      };
      showPanelFromLeft(state.selected.kind + "-panel");
    };
    showPanelFromRight("photoshape-rotate-panel");
    document.querySelector("#photoshape-rotate-input").value = state.selected.rotation;
    document.querySelector("#photoshape-rotate-slider").value = state.selected.rotation;
  };
  sliderButtonClick("photoshape-rotate-input", "photoshape-rotate-slider", doCsg, (rotation) => {
    state.selected.rotation = rotation;
  });
  sliderButtonClick("photoshape-rotate-slider", "photoshape-rotate-input", doCsg, (rotation) => {
    state.selected.rotation = rotation;
  });
  document.querySelector("#photoshape-rotate-slider").onchange = commit;
  document.querySelector("#photoshape-rotate-input").onchange = commit;

  sliderButtonClick("photoshape-depth-slider", "photoshape-depth-input", doCsg, (sizeZ) => {
    state.selected.sizeZ = sizeZ;
  });
  sliderButtonClick("photoshape-depth-input", "photoshape-depth-slider", doCsg, (sizeZ) => {
    state.selected.sizeZ = sizeZ;
  });
  document.querySelector("#photoshape-depth-slider").onchange = commit;
  document.querySelector("#photoshape-depth-input").onchange = commit;

  deleteButtonClick("photoshape-delete-button", () => state.shapesArray, commit, doCsg, () => state.selected, showPanelFromLeft);

  document.querySelector("#undo-button").onclick = undo;
  document.querySelector("#redo-button").onclick = redo;

  createPdf(
    state.foam,
    state.shapesArray,
    shapeToGeom2,
    rightestPoint,
    leftestPoint,
    highestPoint,
    lowestPoint
  );
  createPdfIso(
    state.foam,
    state.shapesArray,
    shapeToGeom2,
    rightestPoint,
    leftestPoint,
    highestPoint,
    lowestPoint
  );
  createDFX(state.foam, state.shapesArray, shapeToGeom2, "my_foam_shapes.dxf");

  // document.getElementById("nextBtn").addEventListener("click", () => {
  //   state.currentIndex = (state.currentIndex + 1) % state.shapesArray.length;
  //   updateSelectedShape(state.currentIndex);
  // });

  // document.getElementById("prevBtn").addEventListener("click", () => {
  //   state.currentIndex =
  //     (state.currentIndex - 1 + state.shapesArray.length) %
  //     state.shapesArray.length;
  //   updateSelectedShape(state.currentIndex);
  // });

  let resizeHandler;
  const myShapesButton = document.getElementById("my-shapes-button");
  const myShapesContainer = document.getElementById("my-shapes-container");
  let appendedDiv;
  let isOpen = false;

  const saveShapeButton = document.getElementById("save-shape");
  const renderMyShapes = () => {
    if (!appendedDiv) return;
    appendedDiv.innerHTML = "";

    const items = loadShapeLibrary();

    const isValidPolygonPoints = (pts) => {
      if (!Array.isArray(pts) || pts.length < 3) return false;
      let area = 0;
      for (let i = 0; i < pts.length; i++) {
        const [x1, y1] = pts[i];
        const [x2, y2] = pts[(i + 1) % pts.length];
        area += x1 * y2 - x2 * y1;
      }
      return Math.abs(area) > 1e-6;
    };

    const cleaned = items.filter((entry) => {
      if (!entry?.shape) return false;
      if (entry.shape.kind === "polygon") {
        return isValidPolygonPoints(entry.shape.points);
      }
      return true;
    });

    if (cleaned.length !== items.length) {
      localStorage.setItem("myShapes", JSON.stringify(cleaned));
    }

    if (!cleaned.length) {
      const empty = document.createElement("div");
      empty.style.padding = "12px";
      empty.textContent = "No saved shapes yet.";
      appendedDiv.appendChild(empty);
      return;
    }

    cleaned.forEach((entry) => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.gap = "8px";
      row.style.padding = "8px 12px";
      row.style.alignItems = "center";

      const useBtn = document.createElement("button");
      useBtn.className = "column grow white";
      useBtn.textContent = entry.name;
      useBtn.onclick = () => {
        const newShape = cloneShapeForInsert(entry.shape);

        if (newShape.kind === "polygon") {
          if (!isValidPolygonPoints(newShape.points)) {
            alert("This saved shape is invalid (not enough points or zero area).");
            return;
          }
        }

        state.shapesArray.push(newShape);
        commit();
        state.selected = newShape;
        showPanelFromRight(newShape.kind + "-panel");
        doCsg();
      };

      const delBtn = document.createElement("button");
      delBtn.className = "column white";
      delBtn.textContent = "Delete";
      delBtn.onclick = () => {
        removeShapeFromLibrary(entry.id);
        renderMyShapes();
      };

      row.appendChild(useBtn);
      row.appendChild(delBtn);
      appendedDiv.appendChild(row);
    });
  };

  if (saveShapeButton) {
    saveShapeButton.onclick = () => {
      if (!state.selected) return;
      saveShapeToLibrary(state.selected);
      renderMyShapes();
    };
  }

  const loadShapeButton = document.getElementById("load-shape");
  const loadShapeInput = document.getElementById("load-shape-input");

  if (loadShapeButton && loadShapeInput) {
    loadShapeButton.onclick = () => loadShapeInput.click();

    loadShapeInput.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result);
          const addShape = (shape) => {
            const newShape = JSON.parse(JSON.stringify(shape));
            newShape.id = `shape-${Date.now()}`;
            state.shapesArray.push(newShape);
            commit();
            state.selected = newShape;
            showPanelFromRight(newShape.kind + "-panel");
            doCsg();
          };

          if (Array.isArray(json)) {
            json.forEach(addShape);
          } else if (json && typeof json === "object") {
            addShape(json);
          }
        } catch (err) {
          console.error("Invalid JSON file", err);
        }
      };
      reader.readAsText(file);
      loadShapeInput.value = "";
    };
  }


  myShapesButton.addEventListener("click", function () {
    if (isOpen) {
      myShapesContainer.style.display = "none";
      if (appendedDiv) appendedDiv.remove();
      window.removeEventListener("resize", resizeHandler);
    } else {
      appendedDiv = document.createElement("div");
      appendedDiv.style.backgroundColor =
        getComputedStyle(myShapesButton).backgroundColor;

      const buttonRect = myShapesButton.getBoundingClientRect();
      appendedDiv.style.position = "fixed";
      appendedDiv.style.top = buttonRect.bottom - 38 + "px";
      appendedDiv.style.left = "0";
      appendedDiv.style.width = "100%";
      appendedDiv.style.borderRadius = "3px";

      myShapesContainer.appendChild(appendedDiv);
      myShapesContainer.style.display = "block";
      renderMyShapes();

      resizeHandler = updateAppendedDivHeight;
      window.addEventListener("resize", resizeHandler);
    }
    isOpen = !isOpen;
  });

  const dropdownButton = document.getElementById("export-dropdown-button");
  const dropdown = document.getElementById("export-dropdown");

  dropdownButton.addEventListener("click", () => {
    dropdown.style.display =
      dropdown.style.display === "none" ? "block" : "none";
  });

  document.addEventListener("click", (e) => {
    if (!dropdownButton.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

  function updateAppendedDivHeight() {
    if (appendedDiv) {
      const buttonRect = myShapesButton.getBoundingClientRect();
      const remainingHeight = window.innerHeight - buttonRect.bottom;
      appendedDiv.style.height = remainingHeight + "px";
    }
  }
}
