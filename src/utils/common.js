export function structuredClone(val) {
  let str = JSON.stringify(val);
  return JSON.parse(str);
}

export function pointInsidePolygon(point, vs) {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

  var x = point[0],
    y = point[1];

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0],
      yi = vs[i][1];
    var xj = vs[j][0],
      yj = vs[j][1];

    var intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

export function rightestPoint(shape, shapeToGeom2) {
  let geom2 = shapeToGeom2(shape);
  let maxP = [0, 0];
  let maxX = -Infinity;
  geom2.sides.forEach(([p0, p1]) => {
    if (p0[0] > maxX) {
      maxX = p0[0];
      maxP = p0;
    }
    if (p1[0] > maxX) {
      maxX = p1[0];
      maxP = p1;
    }
  });
  return maxP;
}

export function leftestPoint(shape, shapeToGeom2) {
  let geom2 = shapeToGeom2(shape);
  let minP = [0, 0];
  let minX = +Infinity;
  geom2.sides.forEach(([p0, p1]) => {
    if (p0[0] < minX) {
      minX = p0[0];
      minP = p0;
    }
    if (p1[0] < minX) {
      minX = p1[0];
      minP = p1;
    }
  });
  return minP;
}

export function highestPoint(shape, shapeToGeom2) {
  let geom2 = shapeToGeom2(shape);
  let maxP = [0, 0];
  let maxY = -Infinity;
  geom2.sides.forEach(([p0, p1]) => {
    if (p0[1] > maxY) {
      maxY = p0[1];
      maxP = p0;
    }
    if (p1[1] > maxY) {
      maxY = p1[1];
      maxP = p1;
    }
  });
  return maxP;
}

export function lowestPoint(shape, shapeToGeom2) {
  let geom2 = shapeToGeom2(shape);
  let minP = [0, 0];
  let minY = +Infinity;
  geom2.sides.forEach(([p0, p1]) => {
    if (p0[1] < minY) {
      minY = p0[1];
      minP = p0;
    }
    if (p1[1] < minY) {
      minY = p1[1];
      minP = p1;
    }
  });
  return minP;
}

export function updateUndoRedoButtons(undoRedoPosition, undoRedoHistory) {
  if (undoRedoPosition > 0) {
    document.querySelector("#undo-button").removeAttribute("disabled");
  } else {
    document.querySelector("#undo-button").setAttribute("disabled", "");
  }
  if (undoRedoPosition < undoRedoHistory.length - 1) {
    document.querySelector("#redo-button").removeAttribute("disabled");
  } else {
    document.querySelector("#redo-button").setAttribute("disabled", "");
  }
}

export function togglePanels() {
  let container = document.querySelector("#panel-container");
  if (container.style.animationName == "disappear-top") {
    container.style.animationName = "appear-top";
    container.style.animationDuration = "0.25s";
    container.style.animationFillMode = "forwards";
  } else {
    container.style.animationName = "disappear-top";
    container.style.animationDuration = "0.25s";
    container.style.animationFillMode = "forwards";
  }
}

const getMousePosition = (event) => {
  // Helper function to get normalized mouse coordinates within the canvas
  const rect = event.target.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
    y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
  };
};

export const getValues = (camera, postScene, renderer, callback) => {
  callback(camera, postScene, renderer);
};

export const getCameraValue = (camera1, callback) => {
  callback(camera1);
};

export function addAllObjectsFromScene(scene) {
  scene.children.forEach(function (obj) {
    obj.visible = true;
  });
}

export function removeAllObjectsFromScene(scene) {
  scene.children.forEach(function (obj) {
    obj.visible = false;
  });
}

/* between 786 and 790
function draw3dLine(p0, p1, camera) {
    let p0_ = p0.project(camera).multiply(new THREE.Vector3(1,-1,1)).addScalar(1.0).multiplyScalar(0.5).multiply(new THREE.Vector3(ctx.canvas.width, ctx.canvas.height, 1))
    let p1_ = p1.project(camera).multiply(new THREE.Vector3(1,-1,1)).addScalar(1.0).multiplyScalar(0.5).multiply(new THREE.Vector3(ctx.canvas.width, ctx.canvas.height, 1))
    ctx.moveTo(p0_.x, p0_.y);
    ctx.lineTo(p1_.x, p1_.y);
    ctx.stroke()
}
*/

// between 439 and 442
// document.querySelector("#photoshape-depth-button").onclick = () => {
//   document.querySelector("#back-button").removeAttribute("disabled");
//   document.querySelector("#back-button").onclick = () => {
//     document.querySelector("#back-button").onclick = () => {
//       document.querySelector("#back-button").setAttribute("disabled", "");
//       showPanelFromLeft("main-panel");
//       selected = null;
//     };
//     showPanelFromLeft(selected.kind + "-panel");
//   };
//   showPanelFromRight("photoshape-depth-panel");
//   document.querySelector("#photoshape-depth-input").value = selected.sizeZ;
//   document.querySelector("#photoshape-depth-slider").value = selected.sizeZ;
// };

// between 277 and 279
// document.querySelector("#radius-slider").oninput = (e) => {
//   document.querySelector("#radius-input").value = e.target.value;
//   selected.radius = Number(e.target.value);
//   doCsg();
// };

// between 257 259
// document.querySelector("#depth-button").onclick = () => {
//   document.querySelector("#back-button").removeAttribute("disabled");
//   document.querySelector("#back-button").onclick = () => {
//     document.querySelector("#back-button").onclick = () => {
//       document.querySelector("#back-button").setAttribute("disabled", "");
//       showPanelFromLeft("main-panel");
//       selected = null;
//     };
//     showPanelFromLeft(selected.kind + "-panel");
//   };
//   showPanelFromRight("depth-panel");
//   document.querySelector("#depth-input").value = selected.sizeZ;
//   document.querySelector("#depth-slider").value = selected.sizeZ;
// };

/* between 140 and 142
    ["#create-rectangle", "#create-polygon", "#create-circle"].forEach((id) => {
          document.querySelector(id).onclick = () => {
             document.querySelector("#back-button").removeAttribute("disabled");
             showPanelFromRight("shape-panel")
          }
       })
    */

/* between 832 and 833
    let p0 = project(new THREE.Vector3(shape.x, shape.y, 37*centimeters), camera)
    
    ctx.font = "bold " + (20 * window.devicePixelRatio) + "px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(shapesArray.indexOf(shape), p0.x, p0.y)
    ctx.strokeStyle = "black";
    ctx.strokeText(shapesArray.indexOf(shape), p0.x, p0.y)        
    ctx.strokeStyle = "orange";
        
    ctx.beginPath();
    ctx.arc(p0.x, p0.y, 4, 0, 2*Math.PI);
    ctx.fill();      
    */
