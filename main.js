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
  drawOutline,
  mouseOverShape,
  drawMeasurementsPhotoshape,
  drawMeasurementsCircle,
  drawMeasurementsRectangle,
  drawMeasurementsPolygon,
  drawMeasurementsLine,
  drawCircle,
  // createEditor,
} from "./src/utils/threeFunctions";
import {
  initPanels,
  showPanelFromRight,
  showPanelFromLeft,
  getCurrentPanel,
} from "./src/UI/panels";
import { createPdf } from "./src/components/createPdf";
import { createShapeCircle } from "./src/components/shapes/createShapeCircle";
import { createShapeFreehand } from "./src/components/shapes/createShapeFreehand";
import { createShapeRectangle } from "./src/components/shapes/createShapeRectangle";
import { createShapePhotoShape } from "./src/components/shapes/createShapePhotoshape";
import { FoamMaterial, LambertMaterial } from "./src/components/Material";
import { createDFX } from "./src/components/createDFX";
import { createImage } from "./src/components/createImage";

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
let sidebar;
// const shapeEditor = createEditor(cameraCopy, sceneCopy, shapesArray);

function initUI() {
  initPanels();
  // Get current panel state
  currPanel = getCurrentPanel();
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

  setTimeout(() => {
    createShapePhotoShape(
      millimeters,
      selected,
      shapesArray,
      commit,
      showPanelFromLeft,
      showPanelFromRight,
      doCsg,
      display2D,
      (modifiedSelected) => {
        // Use modifiedSelected here, which contains the updated value of selected
        selected = modifiedSelected;
      },
      (modifiedDisplay) => {
        display2D = modifiedDisplay;
      },
      cameraCopy,
      rendererCopy,
      sceneCopy
      // createEditor
    );
  }, 100);

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

  createDFX(foam, shapesArray, shapeToGeom2, "my_foam_shapes.dxf");

  document.getElementById("nextBtn").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % shapesArray.length; // circular navigation
    updateSelectedShape(currentIndex);
  });

  // Previous button functionality
  document.getElementById("prevBtn").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + shapesArray.length) % shapesArray.length; // circular navigation
    updateSelectedShape(currentIndex);
  });
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
let currentIndex = 0;

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
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.domElement.id = "foam-canvas";
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
  const aspect = window.innerWidth / window.innerHeight;
  const distance = 1 * meters; // Keep the same camera position

  // Convert FOV to Orthographic Frustum Size
  const frustumHeight =
    1.7 * distance * Math.tan(THREE.MathUtils.degToRad(50) / 2);
  const frustumWidth = frustumHeight * aspect;

  // Create Orthographic Camera
  camera1 = new THREE.OrthographicCamera(
    -frustumWidth / 2,
    frustumWidth / 2, // left, right
    frustumHeight / 2,
    -frustumHeight / 2, // top, bottom
    0.1 * meters,
    100 * meters // near, far (adjusted near plane)
  );

  // Match position and orientation
  camera1.position.set(0, 0, distance);
  camera1.up.set(0, 1, 0);
  camera1.lookAt(0, 0, 0);
  window.addEventListener("resize", onResize);
  onResize();
  createImage(renderer, scene, camera1, {
    buttonId: "export-image",
    scaleFactor: 4,
    filename: "foam-hd.png",
  });
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
  getValues(camera1, topScene, renderer, (camera1, topScene, renderer) => {
    cameraCopy = camera1;
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
      if (csgModel.material) {
        csgModel.material.dispose();
      }
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

function updateSelectedShape(index) {
  selected = shapesArray[index];
  currentIndex = index;
}
function onFrame() {
  let numSamples = parseInt(document.getElementById("pointsCount").value, 10);
  document.getElementById("pointsCount").addEventListener("input", (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= 5) {
      numSamples = value;
      // document.getElementById("points-input").value = numSamples;
    }
  });

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
  const baseZ = 37 * centimeters;
  const currentCamera = display2D ? camera1 : camera;
  for (let shape of shapesArray) {
    if (display2D) {
      drawOutline(
        shape,
        "black",
        1,
        baseZ,
        ctx,
        currentCamera,
        display2D,
        renderer,
        selected,
        sceneCopy,
        false,
        numSamples
      );
    }
    if (selected === shape) {
      drawOutline(
        shape,
        "orange",
        3,
        baseZ,
        ctx,
        currentCamera,
        display2D,
        renderer,
        selected,
        sceneCopy,
        true,
        numSamples
      );

      // Only show depth outline in 3D mode
      if (currPanel.id.endsWith("depth-panel") && !display2D) {
        ctx.setLineDash([5, 5]);
        drawOutline(
          shape,
          "orange",
          1,
          baseZ - shape.sizeZ,
          ctx,
          currentCamera,
          display2D,
          renderer,
          selected,
          sceneCopy,
          false,
          numSamples
        );
        ctx.setLineDash([]);
      }
      drawMeasurements(shape);
      // ... rest of selected shape rendering ...
    } else {
      ctx.setLineDash([5, 5]);
      drawOutline(
        shape,
        "gray",
        1,
        baseZ,
        ctx,
        currentCamera,
        display2D,
        renderer,
        selected,
        sceneCopy,
        false,
        numSamples
      );
      ctx.setLineDash([]);
    }
  }

  getCameraValue(camera1, (camera1) => {
    orthoCamera = camera1;
  });
  window.requestAnimationFrame(onFrame);
}

if (typeof window === "object") {
  initUI();
  init3D();
  // createImage(renderer, scene, camera);
  commit();
}

export {};

document.addEventListener("DOMContentLoaded", function () {
  const myShapesButton = document.getElementById("my-shapes-button");
  const myShapesContainer = document.getElementById("my-shapes-container");
  let appendedDiv;
  let isOpen = false;

  myShapesButton.addEventListener("click", function () {
    if (isOpen) {
      myShapesContainer.style.display = "none";
      if (appendedDiv) appendedDiv.remove();
      window.removeEventListener("resize", resizeHandler);
    } else {
      // Create a new div element
      appendedDiv = document.createElement("div");
      appendedDiv.style.backgroundColor =
        getComputedStyle(myShapesButton).backgroundColor;

      // Set position and width styles for the new div
      const buttonRect = myShapesButton.getBoundingClientRect();
      appendedDiv.style.position = "fixed";
      appendedDiv.style.top = buttonRect.bottom - 38 + "px";
      appendedDiv.style.left = "0";
      appendedDiv.style.width = "100%";
      appendedDiv.style.borderRadius = "3px";

      // Append the new div to the container
      myShapesContainer.appendChild(appendedDiv);

      // Show the container
      myShapesContainer.style.display = "block";

      // Update the height initially and listen for window resize
      resizeHandler = updateAppendedDivHeight;
      window.addEventListener("resize", resizeHandler);
      // updateAppendedDivHeight();
      // window.addEventListener("resize", updateAppendedDivHeight);
    }
    isOpen = !isOpen;
  });

  const dropdownButton = document.getElementById("export-dropdown-button");
  const dropdown = document.getElementById("export-dropdown");

  dropdownButton.addEventListener("click", () => {
    dropdown.style.display =
      dropdown.style.display === "none" ? "block" : "none";
  });

  // Optional: hide dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!dropdownButton.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

  function updateAppendedDivHeight() {
    if (appendedDiv) {
      const buttonRect = myShapesButton.getBoundingClientRect();
      const remainingHeight = window.innerHeight - buttonRect.bottom;
      appendedDiv.style.height = remainingHeight + "px";
    }
  }
});
