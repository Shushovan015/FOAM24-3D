import * as THREE from "three";
import * as OrbitControls from "three/examples/jsm/controls/OrbitControls";
import * as OBJLoader from "three/examples/jsm/loaders/OBJLoader";
import * as getImageOutline from "image-outline";
import {
  structuredClone,
  pointInsidePolygon,
  rightestPoint,
  leftestPoint,
  highestPoint,
  lowestPoint,
  updateUndoRedoButtons,
  getValues,
  getCameraValue,
} from "./src/utils/common";
import {
  buttonClick,
  deleteButtonClick,
  depthButtonClick,
  sliderButtonClick,
} from "./src/utils/buttonClick";
import {
  shapeToGeom2,
  shapeToGeom3,
  geom2ToMesh,
  geom3ToMesh,
  mouseOverShape,
  drawOutline,
  drawMeasurementsPhotoshape,
  drawMeasurementsCircle,
  drawMeasurementsRectangle,
  drawMeasurementsPolygon,
  drawMeasurementsLine,
  drawCircle,
} from "./src/utils/threeFunctions";
import { createPdf } from "./src/components/createPdf";
import { createShapeCircle } from "./src/components/shapes/createShapeCircle";
import { createShapeFreehand } from "./src/components/shapes/createShapeFreehand";
import { createShapeRectangle } from "./src/components/shapes/createShapeRectangle";
import { FoamMaterial, LambertMaterial } from "./src/components/Material";

// Assets
// import case1Url from "url:./models/case1.obj";
const case1Url = "./models/case1.obj";

/* UI */
let panels;
let currPanel;
let orthoCamera;
let cameraCopy;
let sceneCopy;
let rendererCopy;
let display2D = false;

function showPanelFromRight(id) {
  let nextPanel = document.querySelector("#" + id);
  if (nextPanel == currPanel) return;
  currPanel.style.animationName = "disappear-left";
  currPanel.style.animationDuration = "0.25s";
  currPanel.style.animationFillMode = "forwards";
  currPanel.style.pointerEvents = "none";
  nextPanel.style.animationName = "appear-right";
  nextPanel.style.animationDuration = "0.25s";
  nextPanel.style.animationFillMode = "forwards";
  nextPanel.style.pointerEvents = "auto";

  currPanel = nextPanel;
}

function showPanelFromLeft(id) {
  let nextPanel = document.querySelector("#" + id);
  if (nextPanel == currPanel) return;
  currPanel.style.animationName = "disappear-right";
  currPanel.style.animationDuration = "0.25s";
  currPanel.style.animationFillMode = "forwards";
  currPanel.style.pointerEvents = "none";
  nextPanel.style.animationName = "appear-left";
  nextPanel.style.animationDuration = "0.25s";
  nextPanel.style.animationFillMode = "forwards";
  nextPanel.style.pointerEvents = "auto";

  currPanel = nextPanel;
}

let sidebar;

function initUI() {
  document.querySelectorAll("button").forEach((button) => {
    let { icon } = button.dataset;
    if (icon) {
      let i = document.createElement("i");
      i.innerText = icon;
      i.classList.add("material-symbols-outlined");
      button.prepend(i);
    }
  });
  panels = document.querySelectorAll(".panel");
  panels.forEach((panel) => {
    panel.style.opacity = 0;
    panel.style.pointerEvents = "none";
  });
  currPanel = panels[0];
  currPanel.style.opacity = 1;
  currPanel.style.pointerEvents = "auto";
  sidebar = document.querySelector("#sidebar");
  buttonClick(
    "shapes-button",
    "main-panel",
    "shapes-panel",
    selected,
    showPanelFromLeft,
    showPanelFromRight
  );
  buttonClick(
    "foam-button",
    "main-panel",
    "foam-panel",
    selected,
    showPanelFromLeft,
    showPanelFromRight
  );
  buttonClick(
    "case-button",
    "main-panel",
    "case-panel",
    selected,
    showPanelFromLeft,
    showPanelFromRight
  );
  buttonClick(
    "create-photoshape",
    "main-panel",
    "upload-photo-panel",
    selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#upload-photo-input").value = null;
    }
  );

  document.querySelector("#upload-photo-input").onchange = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = (e) => {
      document.querySelector("#upload-photo-img").onload = (e) => {
        let polygon = getImageOutline(e.target).map(({ x, y }) => [x, y]);
        let box = new THREE.Box2();
        polygon.forEach(([x, y]) => {
          box.expandByPoint(new THREE.Vector2(x, y));
        });
        let center = box.getCenter(new THREE.Vector2());
        polygon = polygon.map(([x, y]) => [center.x - x, y - center.y]);
        polygon.reverse();
        let shape = {
          kind: "photoshape",
          x: 0, // mouseRayPlaneIntersection.x,
          y: 0, //mouseRayPlaneIntersection.y,
          sizeZ: 250 * millimeters,
          polygon,
          rotation: 0,
        };
        shapesArray.push(shape);
        commit();
        doCsg();
        selected = shape;
        showPanelFromRight(selected.kind + "-panel");
      };
      document.querySelector("#upload-photo-img").src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  createShapeRectangle(
    millimeters,
    selected,
    shapesArray,
    commit,
    showPanelFromLeft,
    showPanelFromRight,
    doCsg,
    (modifiedSelected) => {
      // Use modifiedSelected here, which contains the updated value of selected
      selected = modifiedSelected;
    }
  );

  depthButtonClick(
    "rectangle-resize-button",
    "main-panel",
    "rectangle-resize-panel",
    selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#rectangle-width-input").value = selected.sizeX;
      document.querySelector("#rectangle-width-slider").value = selected.sizeX;
      document.querySelector("#rectangle-height-input").value = selected.sizeY;
      document.querySelector("#rectangle-height-slider").value = selected.sizeY;
    }
  );
  depthButtonClick(
    "rectangle-depth-button",
    "main-panel",
    "rectangle-depth-panel",
    selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#rectangle-depth-input").value = selected.sizeZ;
      document.querySelector("#rectangle-depth-slider").value = selected.sizeZ;
    }
  );
  depthButtonClick(
    "rectangle-rotate-button",
    "main-panel",
    "rectangle-rotate-panel",
    selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#rectangle-rotate-input").value =
        selected.rotation;
      document.querySelector("#rectangle-rotate-slider").value =
        selected.rotation;
    }
  );

  sliderButtonClick(
    "rectangle-width-slider",
    "rectangle-width-input",
    doCsg,
    (sizeX) => {
      selected.sizeX = sizeX;
    }
  );
  sliderButtonClick(
    "rectangle-width-input",
    "rectangle-width-slider",
    doCsg,
    (sizeX) => {
      selected.sizeX = sizeX;
    }
  );
  document.querySelector("#rectangle-width-slider").onchange = commit;
  document.querySelector("#rectangle-width-input").onchange = commit;

  sliderButtonClick(
    "rectangle-height-slider",
    "rectangle-height-input",
    doCsg,
    (sizeY) => {
      selected.sizeY = sizeY;
    }
  );
  sliderButtonClick(
    "rectangle-height-input",
    "rectangle-height-slider",
    doCsg,
    (sizeY) => {
      selected.sizeY = sizeY;
    }
  );
  document.querySelector("#rectangle-height-slider").onchange = commit;
  document.querySelector("#rectangle-height-input").onchange = commit;

  sliderButtonClick(
    "rectangle-rotate-input",
    "rectangle-rotate-slider",
    doCsg,
    (rotation) => {
      selected.rotation = rotation;
    }
  );
  sliderButtonClick(
    "rectangle-rotate-slider",
    "rectangle-rotate-input",
    doCsg,
    (rotation) => {
      selected.rotation = rotation;
    }
  );
  document.querySelector("#rectangle-rotate-slider").onchange = commit;
  document.querySelector("#rectangle-rotate-input").onchange = commit;

  sliderButtonClick(
    "rectangle-depth-slider",
    "rectangle-depth-input",
    doCsg,
    (sizeZ) => {
      selected.sizeZ = sizeZ;
    }
  );
  sliderButtonClick(
    "rectangle-depth-input",
    "rectangle-depth-slider",
    doCsg,
    (sizeZ) => {
      selected.sizeZ = sizeZ;
    }
  );
  document.querySelector("#rectangle-depth-slider").onchange = commit;
  document.querySelector("#rectangle-depth-input").onchange = commit;

  deleteButtonClick(
    "rectangle-delete-button",
    shapesArray,
    commit,
    doCsg,
    selected,
    showPanelFromLeft
  );

  createShapeCircle(
    millimeters,
    selected,
    shapesArray,
    commit,
    showPanelFromLeft,
    showPanelFromRight,
    doCsg,
    (modifiedSelected) => {
      selected = modifiedSelected;
    }
  );

  depthButtonClick(
    "radius-button",
    "main-panel",
    "radius-panel",
    selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#radius-input").value = selected.radius;
      document.querySelector("#radius-slider").value = selected.radius;
    }
  );

  depthButtonClick(
    "depth-button",
    "main-panel",
    "depth-panel",
    selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#depth-input").value = selected.sizeZ;
      document.querySelector("#depth-slider").value = selected.sizeZ;
    }
  );

  sliderButtonClick("radius-slider", "radius-input", doCsg, (radius) => {
    selected.radius = radius;
  });
  sliderButtonClick("radius-input", "radius-slider", doCsg, (radius) => {
    selected.radius = radius;
  });

  document.querySelector("#radius-slider").onchange = commit;
  document.querySelector("#radius-input").onchange = commit;

  sliderButtonClick("depth-slider", "depth-input", doCsg, (sizeZ) => {
    selected.sizeZ = sizeZ;
  });
  sliderButtonClick("depth-input", "depth-slider", doCsg, (sizeZ) => {
    selected.sizeZ = sizeZ;
  });
  document.querySelector("#depth-slider").onchange = commit;
  document.querySelector("#depth-input").onchange = commit;

  setTimeout(() => {
    createShapeFreehand(
      millimeters,
      selected,
      shapesArray,
      commit,
      showPanelFromLeft,
      showPanelFromRight,
      doCsg,
      orthoCamera,
      sceneCopy,
      rendererCopy,
      display2D,
      (modifiedDisplay) => {
        display2D = modifiedDisplay;
      },
      (modifiedSelected, modifiedDisplay) => {
        selected = modifiedSelected;
        display2D = modifiedDisplay;
      }
    );
  }, 100);

  depthButtonClick(
    "polygon-depth-button",
    "main-panel",
    "polygon-depth-panel",
    selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#polygon-depth-input").value = selected.sizeZ;
      document.querySelector("#polygon-depth-slider").value = selected.sizeZ;
    }
  );
  depthButtonClick(
    "polygon-rotate-button",
    "main-panel",
    "polygon-rotate-panel",
    selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#polygon-rotate-input").value = selected.rotation;
      document.querySelector("#polygon-rotate-slider").value =
        selected.rotation;
    }
  );

  sliderButtonClick(
    "polygon-rotate-input",
    "polygon-rotate-slider",
    doCsg,
    (rotation) => {
      selected.rotation = rotation;
    }
  );
  sliderButtonClick(
    "polygon-rotate-slider",
    "polygon-rotate-input",
    doCsg,
    (rotation) => {
      selected.rotation = rotation;
    }
  );
  document.querySelector("#polygon-rotate-slider").onchange = commit;
  document.querySelector("#polygon-rotate-input").onchange = commit;

  sliderButtonClick(
    "polygon-depth-slider",
    "polygon-depth-input",
    doCsg,
    (sizeZ) => {
      selected.sizeZ = sizeZ;
    }
  );
  sliderButtonClick(
    "polygon-depth-input",
    "polygon-depth-slider",
    doCsg,
    (sizeZ) => {
      selected.sizeZ = sizeZ;
    }
  );
  document.querySelector("#polygon-depth-slider").onchange = commit;
  document.querySelector("#polygon-depth-input").onchange = commit;

  deleteButtonClick(
    "polygon-delete-button",
    shapesArray,
    commit,
    doCsg,
    selected,
    showPanelFromLeft
  );

  deleteButtonClick(
    "delete-button",
    shapesArray,
    commit,
    doCsg,
    selected,
    showPanelFromLeft
  );

  depthButtonClick(
    "photoshape-depth-button",
    "main-panel",
    "photoshape-depth-panel",
    selected,
    showPanelFromLeft,
    showPanelFromRight,
    () => {
      document.querySelector("#photoshape-depth-input").value = selected.sizeZ;
      document.querySelector("#photoshape-depth-slider").value = selected.sizeZ;
    }
  );

  document.querySelector("#photoshape-rotate-button").onclick = () => {
    document.querySelector("#back-button").removeAttribute("disabled");
    document.querySelector("#back-button").onclick = () => {
      document.querySelector("#back-button").onclick = () => {
        document.querySelector("#back-button").setAttribute("disabled", "");
        showPanelFromLeft("main-panel");
        selected = null;
      };
      showPanelFromLeft(selected.kind + "-panel");
    };
    showPanelFromRight("photoshape-rotate-panel");
    document.querySelector("#photoshape-rotate-input").value =
      selected.rotation;
    document.querySelector("#photoshape-rotate-slider").value =
      selected.rotation;
  };
  sliderButtonClick(
    "photoshape-rotate-input",
    "photoshape-rotate-slider",
    doCsg,
    (rotation) => {
      selected.rotation = rotation;
    }
  );
  sliderButtonClick(
    "photoshape-rotate-slider",
    "photoshape-rotate-input",
    doCsg,
    (rotation) => {
      selected.rotation = rotation;
    }
  );
  document.querySelector("#photoshape-rotate-slider").onchange = commit;
  document.querySelector("#photoshape-rotate-input").onchange = commit;

  sliderButtonClick(
    "photoshape-depth-slider",
    "photoshape-depth-input",
    doCsg,
    (sizeZ) => {
      selected.sizeZ = sizeZ;
    }
  );
  sliderButtonClick(
    "photoshape-depth-input",
    "photoshape-depth-slider",
    doCsg,
    (sizeZ) => {
      selected.sizeZ = sizeZ;
    }
  );
  document.querySelector("#photoshape-depth-slider").onchange = commit;
  document.querySelector("#photoshape-depth-input").onchange = commit;

  deleteButtonClick(
    "photoshape-delete-button",
    shapesArray,
    commit,
    doCsg,
    selected,
    showPanelFromLeft
  );

  document.querySelector("#undo-button").onclick = undo;
  document.querySelector("#redo-button").onclick = redo;

  // Create the pdf
  createPdf(
    foam,
    shapesArray,
    shapeToGeom2,
    rightestPoint,
    leftestPoint,
    highestPoint,
    lowestPoint
  );
}

/* 3D */
let renderer;
let overlayCanvas;
let ctx;
let ssaaRenderTarget;
let scene;
let camera;
let camera1;
let controls;
let millimeters = 1;
let centimeters = 10 * millimeters;
let meters = 100 * centimeters;
let mouseX = 0;
let mouseY = 0;
let mouseNdcX = 0;
let mouseNdcY = 0;
let mouseRayPlaneIntersection = null;
let selected = null;
let oldSelected = null;
let dragOffset = null;
let dragging = false;
let dragged = false;
let postScene;
let postCamera;
let postQuad;
let topScene;

function shapeUnderMouse() {
  if (mouseRayPlaneIntersection) {
    for (let shape of shapesArray.slice().reverse()) {
      if (
        mouseOverShape(shape, mouseRayPlaneIntersection, pointInsidePolygon)
      ) {
        return shape;
      }
    }
  }
  return null;
}

function init3D() {
  renderer = new THREE.WebGL1Renderer({
    antialias: true,
    precision: "highp",
  });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.autoClear = false;

  overlayCanvas = document.createElement("canvas");
  ctx = overlayCanvas.getContext("2d");

  ssaaRenderTarget = new THREE.WebGLRenderTarget();
  ssaaRenderTarget.texture.minFilter = THREE.LinearFilter;

  scene = new THREE.Scene();
  topScene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1 * millimeters,
    100 * meters
  );

  camera.position.set(0, -1 * meters, 1.5 * meters);
  camera.up.set(0, 0, 1);
  controls = new OrbitControls.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 37 * centimeters);
  controls.update();
  controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
  controls.mouseButtons.MIDDLE = THREE.MOUSE.PAN;
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN,
  };
  window.addEventListener("resize", onResize);
  onResize();

  renderer.domElement.style.position = "fixed";

  renderer.domElement.style.width = window.innerWidth + "px";
  renderer.domElement.style.height = window.innerHeight + "px";
  overlayCanvas.style.position = "fixed";

  overlayCanvas.style.width = window.innerWidth + "px";
  overlayCanvas.style.height = window.innerHeight + "px";
  overlayCanvas.style.pointerEvents = "none";

  document.body.appendChild(renderer.domElement);
  document.body.appendChild(overlayCanvas);

  doCsg();

  function recalculateMouse(e) {
    mouseX = e.clientX * (window.devicePixelRatio || 1);
    mouseY = e.clientY * (window.devicePixelRatio || 1);
    mouseNdcX = (mouseX / renderer.domElement.width - 0.5) * 2;
    mouseNdcY = -((mouseY / renderer.domElement.height - 0.5) * 2);

    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera({ x: mouseNdcX, y: mouseNdcY }, camera);
    let ray = raycaster.ray;
    let foamPlane = new THREE.Plane(
      new THREE.Vector3(0, 0, 1),
      -37 * centimeters
    );

    let intersection = ray.intersectPlane(foamPlane, new THREE.Vector3());
    if (intersection) {
      mouseRayPlaneIntersection = new THREE.Vector2(
        intersection.x,
        intersection.y
      );
      if (dragging && selected) {
        dragged = true;
        selected.x = mouseRayPlaneIntersection.x - dragOffset.x;
        selected.y = mouseRayPlaneIntersection.y - dragOffset.y;
        doCsg();
      }
    } else {
      mouseRayPlaneIntersection = null;
      dragging = false;
    }
  }

  renderer.domElement.addEventListener("pointermove", (e) => {
    recalculateMouse(e);
  });

  renderer.domElement.addEventListener("pointerdown", (e) => {
    recalculateMouse(e);
    e.preventDefault();
    oldSelected = selected;
    if (
      selected &&
      mouseOverShape(selected, mouseRayPlaneIntersection, pointInsidePolygon)
    ) {
      dragging = true;
      dragged = false;
      dragOffset = new THREE.Vector2().subVectors(
        mouseRayPlaneIntersection,
        new THREE.Vector2(selected.x, selected.y)
      );
      controls.enabled = false;
      return;
    }
    selected = shapeUnderMouse();
    if (selected) {
      document.querySelector("#back-button").removeAttribute("disabled");
      document.querySelector("#back-button").onclick = () => {
        document.querySelector("#back-button").setAttribute("disabled", "");
        showPanelFromLeft("main-panel");
        selected = null;
      };
      showPanelFromRight(selected.kind + "-panel");

      dragging = true;
      dragged = false;
      dragOffset = new THREE.Vector2().subVectors(
        mouseRayPlaneIntersection,
        new THREE.Vector2(selected.x, selected.y)
      );
      controls.enabled = false;
    } else {
      /*
            document.querySelector("#back-button").setAttribute("disabled", "");
            showPanelFromLeft("main-panel")                              
              */
      selected = oldSelected;
    }
  });

  renderer.domElement.addEventListener("pointerup", (e) => {
    if (dragging) {
      if (dragged) {
        commit();
      }
      if (selected) {
        shapesArray.splice(shapesArray.indexOf(selected), 1);
        if (!dragged && selected === oldSelected) {
          shapesArray.unshift(selected);
          selected = shapeUnderMouse();
          document.querySelector("#back-button").removeAttribute("disabled");
          document.querySelector("#back-button").onclick = () => {
            document.querySelector("#back-button").setAttribute("disabled", "");
            showPanelFromLeft("main-panel");
            selected = null;
          };
          showPanelFromRight(selected.kind + "-panel");
        } else {
          shapesArray.push(selected);
        }
      }
      dragging = false;
      controls.enabled = true;
    }
  });

  let ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100 * meters, 100 * meters, 1, 1),
    new LambertMaterial("white")
  );
  scene.add(ground);

  //fetch(case1Url).then((response)=>response.text()).then((text)=>console.log(text))
  let loader = new OBJLoader.OBJLoader();
  loader.load(case1Url, (group) => {
    group.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        let mesh = object;
        mesh.material = new LambertMaterial("cadetblue");
      }
    });
    let caseModel = scene.getObjectByName("caseModel");
    if (caseModel) {
      scene.remove(caseModel);
    }
    group.name = "caseModel";
    scene.add(group);
  });

  postScene = new THREE.Scene();
  postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  postQuad = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 1, 1),
    new THREE.MeshBasicMaterial({ map: ssaaRenderTarget.texture })
  );
  postScene.add(postQuad);
  getValues(camera, topScene, renderer, (camera, topScene, renderer) => {
    cameraCopy = camera;
    sceneCopy = topScene;
    rendererCopy = renderer;
  });

  window.requestAnimationFrame(onFrame);
  onFrame();
}

function onResize() {
  overlayCanvas.style.width = window.innerWidth + "px";
  overlayCanvas.style.height = window.innerHeight + "px";
  overlayCanvas.width = window.innerWidth * (window.devicePixelRatio || 1);
  overlayCanvas.height = window.innerHeight * (window.devicePixelRatio || 1);
  ssaaRenderTarget.setSize(window.innerWidth * 2, window.innerHeight * 2);
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(window.innerWidth, window.innerHeight, true);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

let foam = {
  kind: "rectangle",
  x: 0,
  y: 0,
  sizeX: 70 * centimeters,
  sizeY: 50 * centimeters,
  sizeZ: 37 * centimeters,
  rotation: 0,
};
let shapesArray = [];
let worker = null;
let undoRedoHistory = [];
let undoRedoPosition = 0;

function commit() {
  if (undoRedoPosition != undoRedoHistory.length - 1) {
    undoRedoHistory.splice(undoRedoPosition + 1);
  }
  undoRedoHistory.push(structuredClone(shapesArray));
  undoRedoPosition = undoRedoHistory.length - 1;
  updateUndoRedoButtons(undoRedoPosition, undoRedoHistory);
}

function undo() {
  if (undoRedoPosition > 0) {
    undoRedoPosition -= 1;
    shapesArray = structuredClone(undoRedoHistory[undoRedoPosition]);
    doCsg();
  }
  updateUndoRedoButtons(undoRedoPosition, undoRedoHistory);
  document.querySelector("#back-button").setAttribute("disabled", "");
  showPanelFromLeft("main-panel");
  selected = null;
}

function redo() {
  if (undoRedoPosition < undoRedoHistory.length - 1) {
    undoRedoPosition += 1;
    shapesArray = structuredClone(undoRedoHistory[undoRedoPosition]);
    doCsg();
  }
  updateUndoRedoButtons(undoRedoPosition, undoRedoHistory);
  document.querySelector("#back-button").setAttribute("disabled", "");
  showPanelFromLeft("main-panel");
  selected = null;
}

function doCsg() {
  if (worker) {
    worker.terminate();
  }
  worker = new Worker(new URL("./csg.js", import.meta.url), { type: "module" });
  worker.onmessage = (e) => {
    let csgModel = scene.getObjectByName("csgModel");
    if (csgModel) {
      if (csgModel instanceof THREE.Mesh) {
        csgModel.geometry.dispose();
      }
      scene.remove(csgModel);
    }
    let mesh = geom3ToMesh(e.data);
    mesh.material = new FoamMaterial(
      "red",
      "#333",
      2 * centimeters,
      37 * centimeters
    );
    mesh.name = "csgModel";
    scene.add(mesh);
  };
  worker.postMessage({ foam, shapesArray: shapesArray });
}

function drawMeasurements(shape) {
  ctx.lineWidth = 1;
  switch (shape.kind) {
    case "circle":
      drawMeasurementsCircle(shape, ctx, camera, currPanel, centimeters);
      break;
    case "rectangle":
      drawMeasurementsRectangle(shape, ctx, camera, currPanel, centimeters);
      break;
    case "polygon":
      drawMeasurementsPolygon(shape, ctx, camera, currPanel, centimeters);
      break;
    case "photoshape":
      drawMeasurementsPhotoshape(shape, ctx, camera, currPanel, centimeters);
      break;
    case "circleOnClick":
      drawCircle(shape, ctx, camera, centimeters);
    case "line":
      drawMeasurementsLine(shape, ctx, camera, centimeters);
      break;
  }
}

function onFrame() {
  camera1 = new THREE.OrthographicCamera(
    -window.innerWidth / 2.9,
    window.innerWidth / 2.9,
    window.innerHeight / 2.9,
    -window.innerHeight / 2.9,
    1,
    1000
  );
  camera1.position.set(0, 0, 1000);
  camera1.up.set(0, 0, 20);
  ctx.canvas.width = ctx.canvas.width;
  ctx.canvas.height = ctx.canvas.height;
  ctx.strokeStyle = "orange";
  //renderer.setRenderTarget(ssaaRenderTarget);
  renderer.clear(true);
  display2D ? renderer.render(scene, camera1) : renderer.render(scene, camera);
  renderer.clearDepth();
  display2D
    ? renderer.render(topScene, camera1)
    : renderer.render(topScene, camera);
  for (let shape of shapesArray) {
    let geom2 = shapeToGeom2(shape);
    let geom3 = shapeToGeom3(shape);
    if (display2D) {
      drawOutline(shape, "black", 1, 37 * centimeters, ctx, camera);
    }
    if (selected === shape) {
      drawOutline(shape, "orange", 3, 37 * centimeters, ctx, camera);
      if (currPanel.id.endsWith("depth-panel")) {
        ctx.setLineDash([5, 5]);
        drawOutline(
          shape,
          "orange",
          1,
          37 * centimeters - shape.sizeZ,
          ctx,
          camera
        );
        ctx.setLineDash([]);
      }
      drawMeasurements(shape);
      let panel = geom2ToMesh(geom2);
      panel.position.set(0, 0, 37 * centimeters);
      panel.material = new THREE.MeshBasicMaterial({
        color: "orange",
        opacity: 0.2,
        transparent: true,
        depthTest: false,
      });
      renderer.render(panel, camera);
      panel.geometry.dispose();
      if (currPanel.id.endsWith("depth-panel")) {
        let body = geom3ToMesh(geom3);
        body.position.set(0, 0, 37 * centimeters - shape.sizeZ);
        body.material = new THREE.MeshBasicMaterial({
          color: "orange",
          opacity: 0.1,
          transparent: true,
          depthTest: false,
        });
        renderer.render(body, camera);
        body.geometry.dispose();
      }
    } else {
      ctx.setLineDash([5, 5]);
      drawOutline(shape, "gray", 1, 37 * centimeters, ctx, camera);
      ctx.setLineDash([]);
    }
  }
  getCameraValue(camera1, (camera1) => {
    orthoCamera = camera1;
  });
  /*
  if (selected === null) {
  for (let shape of shapesArray) {
    let geom2 = shapeToGeom2(shape)
    let geom3 = shapeToGeom3(shape)
    ctx.setLineDash([5, 5]);        
    drawOutline(shape, "gray", 1, 37*centimeters);
    ctx.setLineDash([]);  
  }
  }
  */
  //renderer.setRenderTarget(null);
  //renderer.render(postScene, postCamera)
  window.requestAnimationFrame(onFrame);
}

if (typeof window === "object") {
  initUI();
  init3D();
  commit();
}

export {};
