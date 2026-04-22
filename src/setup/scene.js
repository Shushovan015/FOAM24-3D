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
  buildCameraSnapshot,
  applyCameraSnapshot,
  setCameraTopView,
  setCameraFrontView,
} from "../utils/cameraViewUtils";
import {
  pointInsidePolygon,
  confirmMerge,
  getValues,
  getCameraValue,
  structuredClone,
  generateId
} from "../utils/common";
import {
  buildCopyPreviewShapes,
  getCopyPreviewUnderMouse,
  cloneShapeForCopyCommit,
  getShapeUnderMouse,
  resolveCopySourceShape,
  maybeSimplifyForDrag,
  restoreAfterDrag,
} from "../utils/copyPlacementUtils";
import { LambertMaterial } from "../components/Material";
import { createImage } from "../components/createImage";
import { getCurrentPanel, showPanelFromRight, showPanelFromLeft } from "./panels";
import { setPolygonActionButtons } from "../utils/buttonClick";
import { getCaseById } from "./caseConfigs";

const MAX_DPR = 1.0;
const SSAA_SCALE = 1.0;

let copyBatchDirty = false;
let copyBatchCsgTimer = null;

function disposeCaseModel(model) {
  model?.traverse?.((obj) => {
    if (obj.geometry?.dispose) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach((m) => m?.dispose?.());
      else obj.material.dispose?.();
    }
  });
}

function applyModelTransform(group, cfg) {
  const t = cfg.modelTransform || {};
  const p = t.position || {};
  const r = t.rotationDeg || {};
  const s = t.scale || {};

  group.position.set(p.x || 0, p.y || 0, p.z || 0);
  group.rotation.set(
    THREE.MathUtils.degToRad(r.x || 0),
    THREE.MathUtils.degToRad(r.y || 0),
    THREE.MathUtils.degToRad(r.z || 0)
  );
  group.scale.set(s.x || 1, s.y || 1, s.z || 1);
}

function loadCaseModel(cfg) {
  return new Promise((resolve, reject) => {
    const loader = new OBJLoader.OBJLoader();
    loader.load(
      cfg.objUrl,
      (group) => {
        group.traverse((object) => {
          if (object instanceof THREE.Mesh) object.material = new LambertMaterial("cadetblue");
        });

        const old = state.scene.getObjectByName("caseModel");
        if (old) {
          disposeCaseModel(old);
          state.scene.remove(old);
        }

        group.name = "caseModel";
        applyModelTransform(group, cfg);
        state.scene.add(group);

        group.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(group);
        const size = new THREE.Vector3();
        box.getSize(size);

        resolve({ group, boxSize: size });
      },
      undefined,
      (err) => {
        console.error(`Failed to load case OBJ: ${cfg.objUrl}`, err);
        reject(err);
      }
    );
  });
}

export async function applyCaseConfig(caseId, { refitCamera = true } = {}) {
  const cfg = getCaseById(caseId);
  state.currentCaseId = cfg.id;

  try {
    const { boxSize } = await loadCaseModel(cfg);

    if (cfg.foam) {
      state.foam.sizeX = cfg.foam.sizeX;
      state.foam.sizeY = cfg.foam.sizeY;
      state.foam.sizeZ = cfg.foam.sizeZ;
      state.foam.cornerRadius = cfg.foam.cornerRadius ?? state.foam.cornerRadius;
    }

    state.cornerRadius = state.foam.cornerRadius;

    doCsg();

    if (state.controls) {
      state.controls.target.set(state.foam.x, state.foam.y, state.foam.sizeZ);
      state.controls.update();
    }

    if (refitCamera) setCameraTopView(state.camera, state.controls, state.foam, units);
  } catch (e) {
    console.error("applyCaseConfig failed:", e);
  }
}

function flushCopyBatch() {
  if (!copyBatchDirty) return;

  if (copyBatchCsgTimer) {
    clearTimeout(copyBatchCsgTimer);
    copyBatchCsgTimer = null;
  }

  doCsg();
  commit();
  copyBatchDirty = false;
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
  const saved = buildCameraSnapshot(state.camera, state.controls);
  if (!saved) return;
  state._savedCameraView = saved;
}

export function restoreCameraView() {
  applyCameraSnapshot(state.camera, state.controls, state._savedCameraView);
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

  const polygonDepthBtn = document.querySelector("#polygon-depth-button");
  const polygonRotateBtn = document.querySelector("#polygon-rotate-button");

  if (polygonDepthBtn) polygonDepthBtn.setAttribute("disabled", "");
  if (polygonRotateBtn) polygonRotateBtn.setAttribute("disabled", "");

  const unmergeBtn = document.querySelector("#polygon-unmerge-button");
  if (unmergeBtn) unmergeBtn.setAttribute("disabled", "");

  setPolygonActionButtons({
    depth: false,
    rotate: false,
    remove: false,
    edit: false,
  });

  if (!selected) return;

  const deleteId = deleteButtonsByKind[selected.kind];
  const deleteBtn = deleteId ? document.querySelector(`#${deleteId}`) : null;
  if (deleteBtn) deleteBtn.removeAttribute("disabled");

  const copyId = copyButtonsByKind[selected.kind];
  const copyBtn = copyId ? document.querySelector(`#${copyId}`) : null;
  if (copyBtn) copyBtn.removeAttribute("disabled");

  if (selected.kind === "polygon") {
    if (polygonDepthBtn) polygonDepthBtn.removeAttribute("disabled");
    if (polygonRotateBtn) polygonRotateBtn.removeAttribute("disabled");
  }

  if (
    unmergeBtn &&
    selected.kind === "polygon" &&
    Array.isArray(selected.mergedFrom) &&
    selected.mergedFrom.length
  ) {
    unmergeBtn.removeAttribute("disabled");
  }


  if (selected.kind === "polygon" && !window.__freehandActive) {
    setPolygonActionButtons({
      depth: true,
      rotate: true,
      remove: true,
      edit: true,
    });
  }

};

function resetCopyPlacementState() {
  state.copyPlacementActive = false;
  state.copyPlacementSourceId = null;
  state.copyPreviewShapes = [];
}

export function cancelCopyPlacement() {
  flushCopyBatch();
  resetCopyPlacementState();
}

export function beginCopyPlacement() {
  if (!state.copyPlacementActive) {
    copyBatchDirty = false;
  }

  if (!activateCopyPlacementForSource(state.selected)) {
    cancelCopyPlacement();
  }
}

function activateCopyPlacementForSource(sourceShape) {
  if (!sourceShape || !sourceShape.id) return false;

  state.copyPlacementActive = true;
  state.copyPlacementSourceId = sourceShape.id;
  state.copyPreviewShapes = buildCopyPreviewShapes({
    sourceShape,
    foam: state.foam,
    shapesArray: state.shapesArray,
    gapMm: state.copySpacingMm,
  });
  return true;
}

export function updateCopyPlacementSpacing(spacingMm) {
  const nextSpacing = Math.max(10, Number(spacingMm) || 10);
  state.copySpacingMm = nextSpacing;

  if (!state.copyPlacementActive) return;

  const sourceShape = resolveCopySourceShape({
    selected: state.selected,
    copyPlacementSourceId: state.copyPlacementSourceId,
    shapesArray: state.shapesArray,
  });

  if (!sourceShape) {
    cancelCopyPlacement();
    return;
  }

  activateCopyPlacementForSource(sourceShape);
}

function copyPreviewUnderMouse() {
  return getCopyPreviewUnderMouse({
    copyPlacementActive: state.copyPlacementActive,
    mouseRayPlaneIntersection: state.mouseRayPlaneIntersection,
    copyPreviewShapes: state.copyPreviewShapes,
  });
}

function commitCopyFromPreview(previewShape) {
  const sourceShape = resolveCopySourceShape({
    selected: state.selected,
    copyPlacementSourceId: state.copyPlacementSourceId,
    shapesArray: state.shapesArray,
  });

  if (!sourceShape) {
    cancelCopyPlacement();
    return;
  }

  const newShape = cloneShapeForCopyCommit({
    sourceShape,
    previewShape,
    generateId,
  });

  state.shapesArray.push(newShape);
  state.selected = newShape;
  updateDeleteButtons(state.selected);

  if (!activateCopyPlacementForSource(newShape)) {
    cancelCopyPlacement();
  }

  doCsg();
  commit();
}

export function resetCameraToTopView() {
  setCameraTopView(state.camera, state.controls, state.foam, units);
}

export function resetCameraToFrontView() {
  setCameraFrontView(state.camera, state.controls, state.foam, units);
}

function ensurePhotoshapeOverlayMesh() {
  if (!state.scene) return null;

  const foam = state.foam;
  let mesh = state.photoshapeOverlayMesh;

  if (!mesh) {
    const geometry = new THREE.PlaneGeometry(foam.sizeX, foam.sizeY, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.name = "photoshapeOverlay";
    mesh.renderOrder = 1000;

    state.photoshapeOverlayMesh = mesh;
    state.scene.add(mesh);
  }

  const currentWidth = mesh.geometry?.parameters?.width;
  const currentHeight = mesh.geometry?.parameters?.height;
  if (currentWidth !== foam.sizeX || currentHeight !== foam.sizeY) {
    mesh.geometry?.dispose();
    mesh.geometry = new THREE.PlaneGeometry(foam.sizeX, foam.sizeY, 1, 1);
  }

  mesh.position.set(foam.x, foam.y, foam.sizeZ + 0.2);
  mesh.rotation.set(0, 0, 0);
  mesh.visible = true;

  if (!state.scene.children.includes(mesh)) {
    state.scene.add(mesh);
  }

  return mesh;
}

export function setFoamPhotoOverlay(imageSrc) {
  if (!imageSrc) return;

  const mesh = ensurePhotoshapeOverlayMesh();
  if (!mesh) return;

  if (mesh.userData?.imageSrc === imageSrc && state.photoshapeOverlayTexture) {
    mesh.visible = true;
    return;
  }

  const loader = new THREE.TextureLoader();
  loader.load(
    imageSrc,
    (texture) => {
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.encoding = THREE.sRGBEncoding;
      texture.needsUpdate = true;

      if (state.photoshapeOverlayTexture) {
        state.photoshapeOverlayTexture.dispose();
      }

      state.photoshapeOverlayTexture = texture;
      mesh.material.map = texture;
      mesh.material.needsUpdate = true;
      mesh.userData.imageSrc = imageSrc;
      mesh.visible = true;
    },
    undefined,
    (error) => {
      console.error("Failed to load photoshape overlay image:", error);
    }
  );
}

export function clearFoamPhotoOverlay() {
  const mesh = state.photoshapeOverlayMesh;

  if (mesh) {
    if (mesh.parent) mesh.parent.remove(mesh);
    mesh.geometry?.dispose();
    mesh.material?.dispose();
  }

  state.photoshapeOverlayMesh = null;

  if (state.photoshapeOverlayTexture) {
    state.photoshapeOverlayTexture.dispose();
    state.photoshapeOverlayTexture = null;
  }
}

export function init3D() {
  clearFoamPhotoOverlay();
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
  state.controls.target.set(0, 0, state.foam.sizeZ);
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
    const foamPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -state.foam.sizeZ);

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

    const hasDraftPhotoshape = state.shapesArray.some(
      (s) => s?.source === "photoshape" && s?._draft
    );
    if (state.photoshapeOverlayMesh && hasDraftPhotoshape) {
      state.photoshapeOverlayMesh.visible = true;
    }

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

  state.renderer.domElement.addEventListener("pointerdown", (e) => {
    if (window.__editingPoints) return;
    recalculateMouse(e);
    e.preventDefault();
    if (state.copyPlacementActive) {
      const previewHit = copyPreviewUnderMouse();
      if (previewHit) {
        commitCopyFromPreview(previewHit);
        return;
      }

      const clickedShape = getShapeUnderMouse(state.shapesArray, state.mouseRayPlaneIntersection)

      if (clickedShape) {
        cancelCopyPlacement();
      } else {
        return;
      }
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
    state.selected = getShapeUnderMouse(state.shapesArray, state.mouseRayPlaneIntersection)

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

  applyCaseConfig(state.currentCaseId, { refitCamera: false });

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

  const baseZ = state.foam.sizeZ;
  const currentCamera = state.display2D ? state.camera1 : state.camera;
  const NEAR_THRESHOLD = 1 * units.centimeters;
  const lightCopyRender = state.copyPlacementActive && state.shapesArray.length > 20;

  for (const shape of state.shapesArray) {
    if (lightCopyRender && shape !== state.selected) continue;
    if (
      !lightCopyRender &&
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
      if (!window.__editingPoints && !state.copyPlacementActive) {
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
    (!state.selected || state.selected.id !== state.copyPlacementSourceId)
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

