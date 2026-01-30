import * as THREE from "three";
import * as OrbitControls from "three/examples/jsm/controls/OrbitControls";
import * as OBJLoader from "three/examples/jsm/loaders/OBJLoader";
import { state, units } from "./state";
import { doCsg } from "./csgWorker";
import { commit } from "./history";
import {
  shapeToGeom2,
  geom3ToMesh,
  drawOutline,
  mouseOverShape,
  drawMeasurementsPhotoshape,
  drawMeasurementsCircle,
  drawMeasurementsRectangle,
  drawMeasurementsPolygon,
  drawMeasurementsLine,
  drawCircle,
  mergeIntoPolygon,
  shapesIntersectGeneric,
  isNearGeneric,
  drawEdgeToFoamMeasurements
} from "../utils/threeFunctions";
import { pointInsidePolygon, confirmMerge, getValues, getCameraValue } from "../utils/common";
import { LambertMaterial } from "../components/Material";
import { createImage } from "../components/createImage";
import { getCurrentPanel, showPanelFromRight, showPanelFromLeft } from "./panels";


const case1Url = "./models/case1.obj";

function shapeUnderMouse() {
  if (state.mouseRayPlaneIntersection) {
    for (const shape of state.shapesArray.slice().reverse()) {
      if (mouseOverShape(shape, state.mouseRayPlaneIntersection, pointInsidePolygon)) {
        return shape;
      }
    }
  }
  return null;
}

const deleteButtonsByKind = {
  circle: "delete-button",
  rectangle: "rectangle-delete-button",
  polygon: "polygon-delete-button",
  photoshape: "photoshape-delete-button",
};

const updateDeleteButtons = (selected) => {
  Object.values(deleteButtonsByKind).forEach((id) => {
    const btn = document.querySelector(`#${id}`);
    if (btn) btn.setAttribute("disabled", "");
  });
  if (!selected) return;
  const id = deleteButtonsByKind[selected.kind];
  const btn = id ? document.querySelector(`#${id}`) : null;
  if (btn) btn.removeAttribute("disabled");
};


export function init3D() {
  state.renderer = new THREE.WebGL1Renderer({
    antialias: true,
    precision: "highp",
    preserveDrawingBuffer: true,
  });
  state.renderer.setPixelRatio(window.devicePixelRatio || 1);
  state.renderer.domElement.id = "foam-canvas";
  state.renderer.autoClear = false;

  state.overlayCanvas = document.createElement("canvas");
  state.ctx = state.overlayCanvas.getContext("2d");

  state.ssaaRenderTarget = new THREE.WebGLRenderTarget();
  state.ssaaRenderTarget.texture.minFilter = THREE.LinearFilter;

  state.scene = new THREE.Scene();
  state.topScene = new THREE.Scene();

  state.camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1 * units.millimeters,
    100 * units.meters
  );

  state.camera.position.set(0, -1 * units.meters, 1.5 * units.meters);
  state.camera.up.set(0, 0, 1);
  state.controls = new OrbitControls.OrbitControls(
    state.camera,
    state.renderer.domElement
  );
  state.controls.target.set(0, 0, 37 * units.centimeters);
  state.controls.update();
  state.controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
  state.controls.mouseButtons.MIDDLE = THREE.MOUSE.PAN;
  state.controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN,
  };

  const aspect = window.innerWidth / window.innerHeight;
  const distance = 1 * units.meters;
  const frustumHeight =
    1.7 * distance * Math.tan(THREE.MathUtils.degToRad(50) / 2);
  const frustumWidth = frustumHeight * aspect;

  state.camera1 = new THREE.OrthographicCamera(
    -frustumWidth / 2,
    frustumWidth / 2,
    frustumHeight / 2,
    -frustumHeight / 2,
    0.1 * units.meters,
    100 * units.meters
  );

  state.camera1.position.set(0, 0, distance);
  state.camera1.up.set(0, 1, 0);
  state.camera1.lookAt(0, 0, 0);

  window.addEventListener("resize", onResize);
  onResize();

  createImage(state.renderer, state.scene, state.camera1, {
    buttonId: "export-image",
    scaleFactor: 4,
    filename: "foam-hd.png",
  });

  state.renderer.domElement.style.position = "fixed";
  state.renderer.domElement.style.width = window.innerWidth + "px";
  state.renderer.domElement.style.height = window.innerHeight + "px";

  state.overlayCanvas.style.position = "fixed";
  state.overlayCanvas.style.width = window.innerWidth + "px";
  state.overlayCanvas.style.height = window.innerHeight + "px";
  state.overlayCanvas.style.pointerEvents = "none";

  document.body.appendChild(state.renderer.domElement);
  document.body.appendChild(state.overlayCanvas);

  doCsg();

  function recalculateMouse(e) {
    state.mouseX = e.clientX * (window.devicePixelRatio || 1);
    state.mouseY = e.clientY * (window.devicePixelRatio || 1);
    state.mouseNdcX = (state.mouseX / state.renderer.domElement.width - 0.5) * 2;
    state.mouseNdcY = -((state.mouseY / state.renderer.domElement.height - 0.5) * 2);

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera({ x: state.mouseNdcX, y: state.mouseNdcY }, state.camera);
    const ray = raycaster.ray;
    const foamPlane = new THREE.Plane(
      new THREE.Vector3(0, 0, 1),
      -37 * units.centimeters
    );

    const intersection = ray.intersectPlane(foamPlane, new THREE.Vector3());
    if (intersection) {
      state.mouseRayPlaneIntersection = new THREE.Vector2(
        intersection.x,
        intersection.y
      );
      if (state.dragging && state.selected) {
        state.dragged = true;
        state.selected.x = state.mouseRayPlaneIntersection.x - state.dragOffset.x;
        state.selected.y = state.mouseRayPlaneIntersection.y - state.dragOffset.y;
        doCsg();
      }
    } else {
      state.mouseRayPlaneIntersection = null;
      state.dragging = false;
    }
  }

  state.renderer.domElement.addEventListener("pointermove", (e) => {
    if (window.__editingPoints) return;

    recalculateMouse(e);
  });

  const openSelectedPanel = () => {
    if (!state.selected) return;
    showPanelFromRight(state.selected.kind + "-panel");
    updateDeleteButtons(state.selected);
    document.querySelector("#back-button").removeAttribute("disabled");
    document.querySelector("#back-button").onclick = () => {
      document.querySelector("#back-button").setAttribute("disabled", "");
      state.selected = null;
      updateDeleteButtons(null);
      showPanelFromLeft("main-panel");
    };
  };

  state.renderer.domElement.addEventListener("pointerdown", (e) => {
    if (window.__editingPoints) return;
    recalculateMouse(e);
    e.preventDefault();
    state.oldSelected = state.selected;
    if (
      state.selected &&
      mouseOverShape(state.selected, state.mouseRayPlaneIntersection, pointInsidePolygon)
    ) {
      openSelectedPanel();
      state.dragging = true;
      state.dragged = false;
      state.dragOffset = new THREE.Vector2().subVectors(
        state.mouseRayPlaneIntersection,
        new THREE.Vector2(state.selected.x, state.selected.y)
      );
      state.controls.enabled = false;
      return;
    }
    state.selected = shapeUnderMouse();
    if (state.selected) {
      openSelectedPanel();
      state.dragging = true;
      state.dragged = false;
      state.dragOffset = new THREE.Vector2().subVectors(
        state.mouseRayPlaneIntersection,
        new THREE.Vector2(state.selected.x, state.selected.y)
      );
      state.controls.enabled = false;
    } else {
      state.selected = state.oldSelected;
    }
  });


  state.renderer.domElement.addEventListener("pointerup", () => {
    if (window.__editingPoints) return;
    if (!state.dragging) return;
    if (state.dragged) {
      commit();
      if (state.selected) {
        const otherIdx = state.shapesArray.findIndex(
          (s) => s !== state.selected && shapesIntersectGeneric(state.selected, s)
        );
        if (otherIdx !== -1) {
          const other = state.shapesArray[otherIdx];
          confirmMerge(state.selected, other, (shouldMerge) => {
            if (shouldMerge) {
              const selIdx = state.shapesArray.indexOf(state.selected);
              const otherIdx2 = state.shapesArray.indexOf(other);
              const merged = mergeIntoPolygon(state.selected, other);
              const [high, low] = [selIdx, otherIdx2].sort((a, b) => b - a);
              state.shapesArray.splice(high, 1);
              state.shapesArray.splice(low, 1);
              state.shapesArray.splice(low, 0, merged);
              state.selected = merged;
              doCsg();
              commit();
            } else {
              state.selected.x += 10;
              state.selected.y += 10;
              doCsg();
            }
          });
        }
      }
    }
    state.dragging = false;
    state.controls.enabled = true;
  });

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100 * units.meters, 100 * units.meters, 1, 1),
    new LambertMaterial("white")
  );
  state.scene.add(ground);

  const loader = new OBJLoader.OBJLoader();
  loader.load(case1Url, (group) => {
    group.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.material = new LambertMaterial("cadetblue");
      }
    });
    const caseModel = state.scene.getObjectByName("caseModel");
    if (caseModel) {
      state.scene.remove(caseModel);
    }
    group.name = "caseModel";
    state.scene.add(group);
  });

  state.postScene = new THREE.Scene();
  state.postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  state.postQuad = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 1, 1),
    new THREE.MeshBasicMaterial({ map: state.ssaaRenderTarget.texture })
  );
  state.postScene.add(state.postQuad);

  getValues(state.camera1, state.topScene, state.renderer, (camera1, topScene, renderer) => {
    state.cameraCopy = camera1;
    state.sceneCopy = topScene;
    state.rendererCopy = renderer;
  });

  window.requestAnimationFrame(onFrame);
  onFrame();
}

export function onResize() {
  state.overlayCanvas.style.width = window.innerWidth + "px";
  state.overlayCanvas.style.height = window.innerHeight + "px";
  state.overlayCanvas.width = window.innerWidth * (window.devicePixelRatio || 1);
  state.overlayCanvas.height = window.innerHeight * (window.devicePixelRatio || 1);
  state.ssaaRenderTarget.setSize(window.innerWidth * 2, window.innerHeight * 2);
  state.renderer.setPixelRatio(window.devicePixelRatio || 1);
  state.renderer.setSize(window.innerWidth, window.innerHeight, true);
  state.camera.aspect = window.innerWidth / window.innerHeight;
  state.camera.updateProjectionMatrix();
}

function drawMeasurements(shape) {
  state.ctx.lineWidth = 1;
  switch (shape.kind) {
    case "circle":
      drawMeasurementsCircle(shape, state.ctx, state.camera, state.currPanel, units.centimeters);
      break;
    case "rectangle":
      drawMeasurementsRectangle(shape, state.ctx, state.camera, state.currPanel, units.centimeters);
      break;
    case "polygon":
      drawMeasurementsPolygon(shape, state.ctx, state.camera, state.currPanel, units.centimeters);
      break;
    case "photoshape":
      drawMeasurementsPhotoshape(shape, state.ctx, state.camera, state.currPanel, units.centimeters);
      break;
    case "circleOnClick":
      drawCircle(shape, state.ctx, state.camera, units.centimeters);
      break;
    case "line":
      drawMeasurementsLine(shape, state.ctx, state.camera, units.centimeters);
      break;
  }
}

export function onFrame() {
  state.ctx.canvas.width = state.ctx.canvas.width;
  state.ctx.canvas.height = state.ctx.canvas.height;
  state.ctx.strokeStyle = "orange";
  state.currPanel = getCurrentPanel();


  state.renderer.clear(true);
  state.display2D
    ? state.renderer.render(state.scene, state.camera1)
    : state.renderer.render(state.scene, state.camera);
  state.renderer.clearDepth();
  state.display2D
    ? state.renderer.render(state.topScene, state.camera1)
    : state.renderer.render(state.topScene, state.camera);

  const baseZ = 37 * units.centimeters;
  const currentCamera = state.display2D ? state.camera1 : state.camera;
  const NEAR_THRESHOLD = 1 * units.centimeters;

  for (const shape of state.shapesArray) {
    if (
      state.selected &&
      shape !== state.selected &&
      isNearGeneric(state.selected, shape, NEAR_THRESHOLD)
    ) {
      state.ctx.setLineDash([5, 5]);
      drawOutline(
        shape,
        "red",
        2,
        baseZ,
        state.ctx,
        currentCamera,
        state.display2D,
        state.renderer,
        state.selected,
        state.sceneCopy,
        false
      );
      state.ctx.setLineDash([]);
      continue;
    }

    if (state.display2D) {
      drawOutline(
        shape,
        "black",
        1,
        baseZ,
        state.ctx,
        currentCamera,
        state.display2D,
        state.renderer,
        state.selected,
        state.sceneCopy,
        false
      );
    }

    if (state.selected === shape) {
      drawOutline(
        shape,
        "orange",
        3,
        baseZ,
        state.ctx,
        currentCamera,
        state.display2D,
        state.renderer,
        state.selected,
        state.sceneCopy,
        true
      );
      if (state.currPanel && state.currPanel.id.endsWith("depth-panel") && !state.display2D) {
        state.ctx.setLineDash([5, 5]);
        drawOutline(
          shape,
          "orange",
          1,
          baseZ - shape.sizeZ,
          state.ctx,
          currentCamera,
          state.display2D,
          state.renderer,
          state.selected,
          state.sceneCopy,
          false
        );
        state.ctx.setLineDash([]);
      }
      drawMeasurements(shape);
      drawEdgeToFoamMeasurements(shape, state.foam, state.ctx, currentCamera);
    } else {
      state.ctx.setLineDash([5, 5]);
      drawOutline(
        shape,
        "gray",
        1,
        baseZ,
        state.ctx,
        currentCamera,
        state.display2D,
        state.renderer,
        state.selected,
        state.sceneCopy,
        false
      );
      state.ctx.setLineDash([]);
    }
  }

  getCameraValue(state.camera1, (camera1) => {
    state.orthoCamera = camera1;
  });

  window.requestAnimationFrame(onFrame);
}

export function updateSelectedShape(index) {
  state.selected = state.shapesArray[index];
  state.currentIndex = index;
  updateDeleteButtons(state.selected);
}

