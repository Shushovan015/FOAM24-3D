export const buttonClick = (
  buttonName,
  panelLeft,
  panelRight,
  selected,
  showPanelFromLeft,
  showPanelFromRight,
  additionalCallback = () => {}
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
  shapesArray,
  commit,
  doCsg,
  selected,
  showPanelFromLeft
) => {
  const btn = document.querySelector(`#${buttonName}`);
  if (!btn) return;
  btn.onclick = () => {
    shapesArray.splice(shapesArray.indexOf(selected), 1);
    commit();
    doCsg();
    document.querySelector("#back-button").setAttribute("disabled", "");
    showPanelFromLeft("main-panel");
    selected = null;
  };
};

export const depthButtonClick = (
  buttonName,
  panelLeft,
  panelRight,
  selected,
  showPanelFromLeft,
  showPanelFromRight,
  additionalCallback = () => {}
) => {
  const btn = document.querySelector(`#${buttonName}`);
  if (!btn) return;
  btn.onclick = () => {
    document.querySelector("#back-button").removeAttribute("disabled");
    document.querySelector("#back-button").onclick = () => {
      document.querySelector("#back-button").setAttribute("disabled", "");
      showPanelFromLeft(`${panelLeft}`);
      if (selected) {
        selected.kind = null;
      }
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
