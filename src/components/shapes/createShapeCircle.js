import { generateId } from "../../utils/common";
import { restoreCameraView } from "../../setup/scene";
export const createShapeCircle = (
  millimeters,
  selected,
  shapesArray,
  commit,
  showPanelFromLeft,
  showPanelFromRight,
  doCsg,
  callback
) => {
  document.querySelector("#create-circle").onclick = () => {
    document.querySelector("#back-button").removeAttribute("disabled");
    document.querySelector("#back-button").onclick = () => {
      document.querySelector("#back-button").setAttribute("disabled", "");
      restoreCameraView();
      showPanelFromLeft("main-panel");
      selected = null;
    };
    let shape = {
      id: generateId(),
      kind: "circle",
      x: 0,
      y: 0,
      sizeZ: 250 * millimeters,
      radius: 100 * millimeters,
    };
    shapesArray.push(shape);
    commit();
    selected = shape;
    showPanelFromRight(selected.kind + "-panel");
    doCsg();
    callback(selected);
  };
};
