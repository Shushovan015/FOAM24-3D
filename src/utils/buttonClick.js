import { restoreCameraView } from "../setup/scene";
import { cleanupShapeEditArtifacts } from "../utils/threeFunctions";
import { state } from "../setup/state";

export const buttonClick = (
  buttonName,
  panelLeft,
  panelRight,
  selected,
  showPanelFromLeft,
  showPanelFromRight,
  additionalCallback = () => { }
) => {
  const btn = document.querySelector(`#${buttonName}`);
  if (!btn) return;
  btn.onclick = () => {
    document.querySelector("#back-button").removeAttribute("disabled");
    document.querySelector("#back-button").onclick = () => {
      document.querySelector("#back-button").setAttribute("disabled", "");
      showPanelFromLeft(`${panelLeft}`);
      selected = null;
    };
    showPanelFromRight(`${panelRight}`);
    additionalCallback();
  };
};

export const deleteButtonClick = (
  buttonName,
  getShapesArray,
  commit,
  doCsg,
  getSelected,
  showPanelFromLeft
) => {
  const btn = document.querySelector(`#${buttonName}`);
  if (!btn) return;
  btn.onclick = () => {
    const shapesArray = typeof getShapesArray === "function" ? getShapesArray() : [];
    const selected = typeof getSelected === "function" ? getSelected() : null;
    if (selected) {
      cleanupShapeEditArtifacts([selected], state.sceneCopy);
    }

    if (!selected) return;

    let idx = -1;
    if (selected.id) {
      idx = shapesArray.findIndex((s) => s.id === selected.id);
    }
    if (idx === -1) {
      idx = shapesArray.indexOf(selected);
    }
    if (idx === -1) return;

    shapesArray.splice(idx, 1);
    commit();
    doCsg();
    document.querySelector("#back-button").setAttribute("disabled", "");
    showPanelFromLeft("main-panel");

    if (window.__photoshapeCleanup) {
      window.__photoshapeCleanup();
    }
  };
};

export const depthButtonClick = (
  buttonName,
  panelLeft,
  panelRight,
  selected,
  showPanelFromLeft,
  showPanelFromRight,
  additionalCallback = () => { }
) => {
  const btn = document.querySelector(`#${buttonName}`);
  if (!btn) return;
  btn.onclick = () => {
    const backBtn = document.querySelector("#back-button");
    backBtn.removeAttribute("disabled");
    backBtn.onclick = () => {
      showPanelFromLeft(`${panelLeft}`);
      restoreCameraView();
      backBtn.removeAttribute("disabled");
      backBtn.onclick = () => {
        backBtn.setAttribute("disabled", "");
        showPanelFromLeft("main-panel");
      };
    };
    showPanelFromRight(`${panelRight}`);
    additionalCallback();
  };
};

export const sliderButtonClick = (sliderName, sliderInput, doCsg, callback) => {
  const slider = document.querySelector(`#${sliderName}`);
  const input = document.querySelector(`#${sliderInput}`);
  if (!slider || !input) return;
  slider.oninput = (e) => {
    input.value = e.target.value;
    callback(Number(e.target.value));
    doCsg();
  };
};

const polygonActionButtonIds = {
  depth: "polygon-depth-button",
  rotate: "polygon-rotate-button",
  remove: "polygon-delete-button",
  edit: "edit-shape",
};

function setButtonEnabledById(id, enabled) {
  const btn = document.getElementById(id);
  if (!btn) return;
  if (enabled) btn.removeAttribute("disabled");
  else btn.setAttribute("disabled", "");
}

export const setPolygonActionButtons = (config = {}) => {
  const { depth, rotate, remove, edit } = config;

  if (typeof depth === "boolean") {
    setButtonEnabledById(polygonActionButtonIds.depth, depth);
  }
  if (typeof rotate === "boolean") {
    setButtonEnabledById(polygonActionButtonIds.rotate, rotate);
  }
  if (typeof remove === "boolean") {
    setButtonEnabledById(polygonActionButtonIds.remove, remove);
  }
  if (typeof edit === "boolean") {
    setButtonEnabledById(polygonActionButtonIds.edit, edit);
  }
};

export const disableButton = (enabled) => {
  setPolygonActionButtons({
    depth: enabled,
    rotate: enabled,
    remove: enabled,
  });
};

