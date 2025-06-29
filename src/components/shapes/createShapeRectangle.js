import { generateId } from "../../utils/common";
export const createShapeRectangle = (
  millimeters,
  selected,
  shapesArray,
  commit,
  showPanelFromLeft,
  showPanelFromRight,
  doCsg,
  callback // Add a callback parameter to handle the modified selected variable
) => {
  document.querySelector("#create-rectangle").onclick = () => {
    document.querySelector("#back-button").removeAttribute("disabled");
    document.querySelector("#back-button").onclick = () => {
      document.querySelector("#back-button").setAttribute("disabled", "");
      showPanelFromLeft("main-panel");
      selected = null;
    };
    let shape = {
      id: generateId(),
      kind: "rectangle",
      x: 0, // mouseRayPlaneIntersection.x,
      y: 0, //mouseRayPlaneIntersection.y,
      sizeZ: 250 * millimeters,
      sizeX: 200 * millimeters,
      sizeY: 200 * millimeters,
      rotation: 0,
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
