import { generateId } from "../../utils/common";
import { restoreCameraView } from "../../setup/scene";
export const createShapeRectangle = (
  millimeters,
  selected,
  shapesArray,
  commit,
  showPanelFromLeft,
  showPanelFromRight,
  doCsg,
  callback,
  defaultCornerRadius
) => {
  document.querySelector("#create-rectangle").onclick = () => {
    document.querySelector("#back-button").removeAttribute("disabled");
    document.querySelector("#back-button").onclick = () => {
      document.querySelector("#back-button").setAttribute("disabled", "");
      restoreCameraView();
      showPanelFromLeft("main-panel");
      selected = null;
    };
    let shape = {
      id: generateId(),
      kind: "rectangle",
      x: 0,
      y: 0,
      sizeZ: 250 * millimeters,
      sizeX: 200 * millimeters,
      sizeY: 200 * millimeters,
      rotation: 0,
      cornerRadius: defaultCornerRadius,
    };
    shapesArray.push(shape);
    commit();
    selected = shape;
    showPanelFromRight(selected.kind + "-panel");
    doCsg();

    callback(selected);
  };
};
