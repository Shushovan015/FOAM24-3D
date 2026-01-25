export function structuredClone(val) {
  let str = JSON.stringify(val);
  return JSON.parse(str);
}

export function pointInsidePolygon(point, vs) {
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

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]); // Get only the base64 string
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export function generateId() {
  return `shape-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function drawResponsiveText(
  page,
  font,
  text,
  x,
  y,
  maxWidth,
  maxFontSize = 10
) {
  let fontSize = maxFontSize;
  while (font.widthOfTextAtSize(text, fontSize) > maxWidth && fontSize > 4) {
    fontSize -= 0.5;
  }

  page.drawText(text, {
    x,
    y,
    size: fontSize,
    font,
  });
}

export function confirmMerge(shapeA, shapeB, callback) {
  const existing = document.getElementById("merge-dialog");
  if (existing) existing.remove();

  const dialog = document.createElement("div");
  dialog.id = "merge-dialog";
  dialog.style.position = "fixed";
  dialog.style.top = "50%";
  dialog.style.left = "50%";
  dialog.style.transform = "translate(-50%, -50%)";
  dialog.style.background = "#fff";
  dialog.style.padding = "24px 32px";
  dialog.style.borderRadius = "12px";
  dialog.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.2)";
  dialog.style.zIndex = "9999";
  dialog.style.fontFamily = "sans-serif";
  dialog.style.minWidth = "320px";
  dialog.style.textAlign = "center";

  dialog.innerHTML = `
    <p style="margin-bottom: 24px; font-size: 16px; color: #333;">
      Shapes are too close. Do you want to merge them?
    </p>
    <div style="display: flex; justify-content: center; gap: 16px;">
      <button id="merge-yes" style="
        padding: 10px 20px;
        background-color: #4a90e2;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.2s;
      ">Yes</button>
      <button id="merge-no" style="
        padding: 10px 20px;
        background-color: #e0e0e0;
        color: #333;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.2s;
      ">No</button>
    </div>
  `;

  document.body.appendChild(dialog);

  document.getElementById("merge-yes").onclick = () => {
    dialog.remove();
    callback(true);
  };
  document.getElementById("merge-no").onclick = () => {
    dialog.remove();
    callback(false);
  };
}
