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
  rightestPoint,
  leftestPoint,
  highestPoint,
  lowestPoint,
} from "../utils/common";
import { shapeToGeom2 } from "../utils/threeFunctions";
import { updateSelectedShape } from "./scene";

export function initUI() {
  initPanels();
  state.currPanel = getCurrentPanel();

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

  setTimeout(() => {
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
      },
      (modifiedDisplay) => {
        state.display2D = modifiedDisplay;
      },
      state.cameraCopy,
      state.rendererCopy,
      state.sceneCopy
    );
  }, 100);

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
    }
  );

  depthButtonClick(
    "rectangle-resize-button",
    "main-panel",
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
    "main-panel",
    "rectangle-depth-panel",
    state.selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#rectangle-depth-input").value = state.selected.sizeZ;
      document.querySelector("#rectangle-depth-slider").value = state.selected.sizeZ;
    }
  );
  depthButtonClick(
    "rectangle-rotate-button",
    "main-panel",
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

  deleteButtonClick(
    "rectangle-delete-button",
    state.shapesArray,
    commit,
    doCsg,
    state.selected,
    showPanelFromLeft
  );

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
    }
  );

  depthButtonClick(
    "radius-button",
    "main-panel",
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
    "main-panel",
    "depth-panel",
    state.selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#depth-input").value = state.selected.sizeZ;
      document.querySelector("#depth-slider").value = state.selected.sizeZ;
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
        },
        foamMesh
      );
    } else {
      setTimeout(waitForFoamAndInitFreehand, 100);
    }
  }
  waitForFoamAndInitFreehand();

  depthButtonClick(
    "polygon-depth-button",
    "main-panel",
    "polygon-depth-panel",
    state.selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#polygon-depth-input").value = state.selected.sizeZ;
      document.querySelector("#polygon-depth-slider").value = state.selected.sizeZ;
    }
  );
  depthButtonClick(
    "polygon-rotate-button",
    "main-panel",
    "polygon-rotate-panel",
    state.selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#polygon-rotate-input").value = state.selected.rotation;
      document.querySelector("#polygon-rotate-slider").value = state.selected.rotation;
    }
  );

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

  deleteButtonClick(
    "polygon-delete-button",
    state.shapesArray,
    commit,
    doCsg,
    state.selected,
    showPanelFromLeft
  );

  deleteButtonClick(
    "delete-button",
    state.shapesArray,
    commit,
    doCsg,
    state.selected,
    showPanelFromLeft
  );

  depthButtonClick(
    "photoshape-depth-button",
    "main-panel",
    "photoshape-depth-panel",
    state.selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#photoshape-depth-input").value = state.selected.sizeZ;
      document.querySelector("#photoshape-depth-slider").value = state.selected.sizeZ;
    }
  );

  document.querySelector("#photoshape-rotate-button").onclick = () => {
    document.querySelector("#back-button").removeAttribute("disabled");
    document.querySelector("#back-button").onclick = () => {
      document.querySelector("#back-button").onclick = () => {
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

  deleteButtonClick(
    "photoshape-delete-button",
    state.shapesArray,
    commit,
    doCsg,
    state.selected,
    showPanelFromLeft
  );

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

  document.getElementById("nextBtn").addEventListener("click", () => {
    state.currentIndex = (state.currentIndex + 1) % state.shapesArray.length;
    updateSelectedShape(state.currentIndex);
  });

  document.getElementById("prevBtn").addEventListener("click", () => {
    state.currentIndex =
      (state.currentIndex - 1 + state.shapesArray.length) %
      state.shapesArray.length;
    updateSelectedShape(state.currentIndex);
  });

  let resizeHandler;
  const myShapesButton = document.getElementById("my-shapes-button");
  const myShapesContainer = document.getElementById("my-shapes-container");
  let appendedDiv;
  let isOpen = false;

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
