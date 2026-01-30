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
  if (!btn) return; // element may not exist in current UI
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
    document.querySelector("#back-button").removeAttribute("disabled");
    document.querySelector("#back-button").onclick = () => {
      document.querySelector("#back-button").setAttribute("disabled", "");
      showPanelFromLeft(`${panelLeft}`);
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

export const disableButton = (boolValue) => {
  const depthBtn = document.querySelector("#polygon-depth-button");
  const rotateBtn = document.querySelector("#polygon-rotate-button");
  const deleteBtn = document.querySelector("#polygon-delete-button");

  if (!depthBtn || !rotateBtn || !deleteBtn) return;

  if (boolValue) {
    depthBtn.removeAttribute("disabled");
    rotateBtn.removeAttribute("disabled");
    deleteBtn.removeAttribute("disabled");
  } else {
    depthBtn.setAttribute("disabled", "");
    rotateBtn.setAttribute("disabled", "");
    deleteBtn.setAttribute("disabled", "");
  }
};
