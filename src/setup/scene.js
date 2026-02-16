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
  simplifyPointsForDrag,
  drawEdgeToFoamMeasurements,
  getBoundingBox
} from "../utils/threeFunctions";
import {
  pointInsidePolygon,
  confirmMerge,
  getValues,
  getCameraValue,
  structuredClone,
  generateId
} from "../utils/common";
import { LambertMaterial } from "../components/Material";
import { createImage } from "../components/createImage";
import { getCurrentPanel, showPanelFromRight, showPanelFromLeft } from "./panels";


const case1Url = "./models/case1.obj";
const MAX_DPR = 1.0;
const SSAA_SCALE = 1.0;

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

const copyButtonsByKind = {
  circle: "copy-button",
  rectangle: "rectangle-copy-button",
  polygon: "polygon-copy-button",
  photoshape: "photoshape-copy-button",
};

export function saveCameraView() {
  if (!state.camera || !state.controls) return;

  state._savedCameraView = {
    position: state.camera.position.clone(),
    target: state.controls.target.clone(),
    up: state.camera.up.clone(),
  };
}

export function restoreCameraView() {
  const saved = state._savedCameraView;
  if (!saved || !state.camera || !state.controls) return;

  state.camera.position.copy(saved.position);
  state.controls.target.copy(saved.target);
  state.camera.up.copy(saved.up);
  state.camera.lookAt(saved.target);
  state.controls.update();
}

export const updateDeleteButtons = (selected) => {
  Object.values(deleteButtonsByKind).forEach((id) => {
    const btn = document.querySelector(`#${id}`);
    if (btn) btn.setAttribute("disabled", "");
  });

  Object.values(copyButtonsByKind).forEach((id) => {
    const btn = document.querySelector(`#${id}`);
    if (btn) btn.setAttribute("disabled", "");
  });

  const unmergeBtn = document.querySelector("#polygon-unmerge-button");
  if (unmergeBtn) unmergeBtn.setAttribute("disabled", "");

  if (!selected) return;

  const deleteId = deleteButtonsByKind[selected.kind];
  const deleteBtn = deleteId ? document.querySelector(`#${deleteId}`) : null;
  if (deleteBtn) deleteBtn.removeAttribute("disabled");

  const copyId = copyButtonsByKind[selected.kind];
  const copyBtn = copyId ? document.querySelector(`#${copyId}`) : null;
  if (copyBtn) copyBtn.removeAttribute("disabled");

  if (
    unmergeBtn &&
    selected.kind === "polygon" &&
    Array.isArray(selected.mergedFrom) &&
    selected.mergedFrom.length
  ) {
    unmergeBtn.removeAttribute("disabled");
  }
};

function resetCopyPlacementState() {
  state.copyPlacementActive = false;
  state.copyPlacementSourceId = null;
  state.copyPreviewShapes = [];
}

export function cancelCopyPlacement() {
  resetCopyPlacementState();
}

function cleanShapeRuntimeFields(shape) {
  if (!shape) return;
  delete shape.controlPoints;
  delete shape.cleanup;
  delete shape._controlPointsSetup;
  delete shape._controlPointHandlersInitialized;
  delete shape._selectedPointIndex;
  delete shape._draggingPoint;
  delete shape._dragOriginalPoints;
  delete shape._drawPointsCache;
  delete shape._drawPointsCacheTarget;
  delete shape._pointsDirty;
}

function clampPreviewToFoam(copyShape) {
  const foamLeft = state.foam.x - state.foam.sizeX / 2;
  const foamRight = state.foam.x + state.foam.sizeX / 2;
  const foamBottom = state.foam.y - state.foam.sizeY / 2;
  const foamTop = state.foam.y + state.foam.sizeY / 2;

  const box = getBoundingBox(copyShape);
  let shiftX = 0;
  let shiftY = 0;

  if (box.minX < foamLeft) shiftX = foamLeft - box.minX;
  else if (box.maxX > foamRight) shiftX = foamRight - box.maxX;

  if (box.minY < foamBottom) shiftY = foamBottom - box.minY;
  else if (box.maxY > foamTop) shiftY = foamTop - box.maxY;

  copyShape.x += shiftX;
  copyShape.y += shiftY;
}

function buildCopyPreviewShapes(sourceShape) {
  const box = getBoundingBox(sourceShape);
  const width = Math.max(10, box.maxX - box.minX);
  const height = Math.max(10, box.maxY - box.minY);
  const gap = 10 * units.millimeters;

  const offsets = [
    [width + gap, 0],
    [-(width + gap), 0],
    [0, height + gap],
    [0, -(height + gap)],
  ];

  const previews = [];
  const seen = new Set();

  for (const [dx, dy] of offsets) {
    const preview = structuredClone(sourceShape);
    cleanShapeRuntimeFields(preview);

    preview.x = sourceShape.x + dx;
    preview.y = sourceShape.y + dy;

    clampPreviewToFoam(preview);

    const key = `${preview.x.toFixed(3)},${preview.y.toFixed(3)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    if (
      Math.abs(preview.x - sourceShape.x) < 0.001 &&
      Math.abs(preview.y - sourceShape.y) < 0.001
    ) {
      continue;
    }

    preview.id = `${sourceShape.id || "shape"}-copy-preview-${previews.length}`;
    previews.push(preview);
  }

  return previews;
}

export function beginCopyPlacement() {
  if (!state.selected) return;
  if (!state.selected.id) return;

  const previews = buildCopyPreviewShapes(state.selected);
  if (!previews.length) return;

  state.copyPlacementActive = true;
  state.copyPlacementSourceId = state.selected.id;
  state.copyPreviewShapes = previews;
}

function copyPreviewUnderMouse() {
  if (!state.copyPlacementActive || !state.mouseRayPlaneIntersection) return null;
  for (const preview of state.copyPreviewShapes.slice().reverse()) {
    if (mouseOverShape(preview, state.mouseRayPlaneIntersection, pointInsidePolygon)) {
      return preview;
    }
  }
  return null;
}

function commitCopyFromPreview(previewShape) {
  const sourceShape =
    state.selected && state.selected.id === state.copyPlacementSourceId
      ? state.selected
      : state.shapesArray.find((s) => s.id === state.copyPlacementSourceId);

  if (!sourceShape) {
    cancelCopyPlacement();
    return;
  }

  const newShape = structuredClone(sourceShape);
  cleanShapeRuntimeFields(newShape);
  newShape.id = generateId();
  newShape.x = previewShape.x;
  newShape.y = previewShape.y;

  state.shapesArray.push(newShape);
  state.selected = newShape;
  cancelCopyPlacement();
  updateDeleteButtons(state.selected);

  doCsg();
  commit();
}

export function resetCameraToTopView() {
  if (!state.camera || !state.controls) return;

  const targetX = state.foam?.x || 0;
  const targetY = state.foam?.y || 0;
  const targetZ = 37 * units.centimeters;

  const maxDim = Math.max(state.foam.sizeX, state.foam.sizeY);
  const distance = Math.max(maxDim * 2, 1 * units.meters);

  state.camera.up.set(0, 0, 1);

  const epsilon = distance * 0.001;

  state.controls.target.set(targetX, targetY, targetZ);
  state.camera.position.set(targetX, targetY - epsilon, targetZ + distance);
  state.camera.lookAt(targetX, targetY, targetZ);
  state.controls.update();
}

export function resetCameraToFrontView() {
  if (!state.camera || !state.controls) return;

  const targetX = state.foam?.x || 0;
  const targetY = state.foam?.y || 0;
  const targetZ = 37 * units.centimeters;

  const maxDim = Math.max(state.foam.sizeX, state.foam.sizeY);
  const distance = Math.max(maxDim * 2, 1 * units.meters);

  state.camera.up.set(0, 0, 1);

  state.controls.target.set(targetX, targetY, targetZ);
  state.camera.position.set(targetX, targetY - distance, targetZ);
  state.camera.lookAt(targetX, targetY, targetZ);
  state.controls.update();
}

export function init3D() {
  if (state.renderer) {
    state.renderer.dispose();
    state.renderer.forceContextLoss();
    state.renderer.domElement?.remove();
    state.renderer = null;
  }
  if (state.overlayCanvas) {
    state.overlayCanvas.remove();
    state.overlayCanvas = null;
  }
  if (state.ssaaRenderTarget) {
    state.ssaaRenderTarget.dispose();
    state.ssaaRenderTarget = null;
  }
  state.renderer = new THREE.WebGL1Renderer({
    antialias: true,
    precision: "highp",
    preserveDrawingBuffer: false,
    powerPreference: "high-performance",
  });
  state._contextLost = false;
  state.renderer.domElement.addEventListener(
    "webglcontextlost",
    (e) => {
      e.preventDefault();
      state._contextLost = true;
    },
    false
  );
  state.renderer.domElement.addEventListener(
    "webglcontextrestored",
    () => {
      state._contextLost = false;
      doCsg();
    },
    false
  );

  const getDpr = () => Math.min(window.devicePixelRatio || 1, 1.5);
  state.renderer.setPixelRatio(getDpr());
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

  let dragCsgTimer = null;
  const scheduleDragCsg = () => {
    if (dragCsgTimer) return;
    dragCsgTimer = setTimeout(() => {
      dragCsgTimer = null;
      doCsg();
    }, 80);
  };

  function recalculateMouse(e) {
    const dpr = getDpr();
    state.mouseX = e.clientX * dpr;
    state.mouseY = e.clientY * dpr;
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
        scheduleDragCsg();
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
      restoreCameraView();
      state.selected = null;
      cancelCopyPlacement();
      updateDeleteButtons(null);
      showPanelFromLeft("main-panel");
    };
  };

  const maybeSimplifyForDrag = (shape) => {
    if (!shape || shape.kind !== "polygon" || !Array.isArray(shape.points)) return;
    if (shape.points.length <= 200) return;
    if (!shape._dragOriginalPoints) {
      shape._dragOriginalPoints = shape.points;
      shape.points = simplifyPointsForDrag(shape.points, 200);
    }
  };

  const restoreAfterDrag = (shape) => {
    if (shape && shape._dragOriginalPoints) {
      shape.points = shape._dragOriginalPoints;
      delete shape._dragOriginalPoints;
    }
  };

  state.renderer.domElement.addEventListener("pointerdown", (e) => {
    if (window.__editingPoints) return;
    recalculateMouse(e);
    e.preventDefault();
    if (state.copyPlacementActive) {
      const previewHit = copyPreviewUnderMouse();
      if (previewHit) {
        commitCopyFromPreview(previewHit);
      }
      return;
    }

    state.oldSelected = state.selected;
    if (
      state.selected &&
      mouseOverShape(state.selected, state.mouseRayPlaneIntersection, pointInsidePolygon)
    ) {
      openSelectedPanel();
      maybeSimplifyForDrag(state.selected);
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
      maybeSimplifyForDrag(state.selected);
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
              merged.mergedFrom = [
                structuredClone(state.selected),
                structuredClone(other),
              ];
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
    restoreAfterDrag(state.selected);
    doCsg();
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
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  state.overlayCanvas.width = window.innerWidth * dpr;
  state.overlayCanvas.height = window.innerHeight * dpr;
  state.ssaaRenderTarget.setSize(
    window.innerWidth * SSAA_SCALE,
    window.innerHeight * SSAA_SCALE
  );
  state.renderer.setPixelRatio(dpr);
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
  const now = performance.now();
  const targetFps = window.__editingPoints ? 30 : 60;
  const minFrameMs = 1000 / targetFps;
  if (state._lastFrameTime && now - state._lastFrameTime < minFrameMs) {
    window.requestAnimationFrame(onFrame);
    return;
  }
  state._lastFrameTime = now;

  if (state._contextLost) {
    window.requestAnimationFrame(onFrame);
    return;
  }
  state.ctx.clearRect(0, 0, state.ctx.canvas.width, state.ctx.canvas.height);
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
      if (!window.__editingPoints) {
        drawMeasurements(shape);
        drawEdgeToFoamMeasurements(shape, state.foam, state.ctx, currentCamera);
      }

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

  if (
    state.copyPlacementActive &&
    (!state.selected ||
      state.selected.id !== state.copyPlacementSourceId ||
      !state.copyPreviewShapes.length)
  ) {
    cancelCopyPlacement();
  }

  if (state.copyPlacementActive && state.copyPreviewShapes.length) {
    state.ctx.setLineDash([7, 5]);
    for (const previewShape of state.copyPreviewShapes) {
      drawOutline(
        previewShape,
        "#1f6fff",
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
    }
    state.ctx.setLineDash([]);
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

