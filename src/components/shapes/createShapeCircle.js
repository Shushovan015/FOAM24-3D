import { generateId } from "../../utils/common";
export const createShapeCircle = (
  millimeters,
  selected,
  shapesArray,
  commit,
  showPanelFromLeft,
  showPanelFromRight,
  doCsg,
  callback // Add a callback parameter to handle the modified selected variable
) => {
  document.querySelector("#create-circle").onclick = () => {
    document.querySelector("#back-button").removeAttribute("disabled");
    document.querySelector("#back-button").onclick = () => {
      document.querySelector("#back-button").setAttribute("disabled", "");
      showPanelFromLeft("main-panel");
      selected = null;
    };

    let shape = {
      id: generateId(),
      kind: "circle",
      x: 0, // mouseRayPlaneIntersection.x,
      y: 0, // mouseRayPlaneIntersection.y,
      sizeZ: 250 * millimeters,
      radius: 100 * millimeters,
    };

    shapesArray.push(shape);
    commit();
    selected = shape;
    showPanelFromRight(selected.kind + "-panel");
    doCsg();

    // Call the callback with the modified selected variable
    callback(selected);
  };
};
