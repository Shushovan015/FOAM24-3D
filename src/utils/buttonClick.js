export const buttonClick = (
  buttonName,
  panelLeft,
  panelRight,
  selected,
  showPanelFromLeft,
  showPanelFromRight,
  additionalCallback = () => {}
) => {
  document.querySelector(`#${buttonName}`).onclick = () => {
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

// export const depthButtonClick = (
//   buttonName,
//   panelLeft,
//   panelRight,
//   selected,
//   showPanelFromLeft,
//   showPanelFromRight,
//   additionalCallback = () => {}
// ) => {
//   document.querySelector(`#${buttonName}`).onclick = () => {
//     document.querySelector("#back-button").removeAttribute("disabled");
//     document.querySelector("#back-button").onclick = () => {
//       document.querySelector("#back-button").onclick = () => {
//         document.querySelector("#back-button").setAttribute("disabled", "");
//         showPanelFromLeft(`${panelLeft}`);
//         selected = null;
//       };
//       showPanelFromLeft(selected.kind + "-panel");
//     };
//     showPanelFromRight(`${panelRight}`);
//     additionalCallback();
//   };
// };

export const deleteButtonClick = (
  buttonName,
  shapesArray,
  commit,
  doCsg,
  selected,
  showPanelFromLeft
) => {
  document.querySelector(`#${buttonName}`).onclick = () => {
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
  document.querySelector(`#${buttonName}`).onclick = () => {
    document.querySelector("#back-button").removeAttribute("disabled");
    document.querySelector("#back-button").onclick = () => {
      document.querySelector("#back-button").setAttribute("disabled", "");
      showPanelFromLeft(`${panelLeft}`);
      // Check if selected is not null before modifying its properties
      if (selected) {
        selected.kind = null;
      }
    };
    showPanelFromRight(`${panelRight}`);
    additionalCallback();
  };
};

export const sliderButtonClick = (sliderName, sliderInput, doCsg, callback) => {
  document.querySelector(`#${sliderName}`).oninput = (e) => {
    document.querySelector(`#${sliderInput}`).value = e.target.value;
    callback(Number(e.target.value));
    // selected.radius = Number(e.target.value);
    doCsg();
  };
};

export const disableButton = (boolValue) => {
  if (boolValue) {
    document
      .querySelector("#polygon-depth-button")
      .removeAttribute("disabled", "");
    document
      .querySelector("#polygon-rotate-button")
      .removeAttribute("disabled", "");
    document
      .querySelector("#polygon-delete-button")
      .removeAttribute("disabled", "");
  } else {
    document
      .querySelector("#polygon-depth-button")
      .setAttribute("disabled", "");
    document
      .querySelector("#polygon-rotate-button")
      .setAttribute("disabled", "");
    document
      .querySelector("#polygon-delete-button")
      .setAttribute("disabled", "");
  }
};
