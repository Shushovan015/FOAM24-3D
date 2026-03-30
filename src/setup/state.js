import { DEFAULT_CASE } from "./caseConfigs";

export const units = {
  millimeters: 1,
  centimeters: 10,
  meters: 100 * 10,
};

export const state = {
  panels: null,
  currPanel: null,
  orthoCamera: null,
  cameraCopy: null,
  sceneCopy: null,
  rendererCopy: null,
  display2D: false,
  sidebar: null,
  undoRedoHistory: [],
  undoRedoPosition: 0,
  addPointMode: false,
  deletePointMode: false,
  _lastFrameTime: 0,
  copySpacingMm: 10,

  photoshapeOverlayMesh: null,
  photoshapeOverlayTexture: null,

  renderer: null,
  overlayCanvas: null,
  ctx: null,
  ssaaRenderTarget: null,
  scene: null,
  camera: null,
  camera1: null,
  controls: null,

  mouseX: 0,
  mouseY: 0,
  mouseNdcX: 0,
  mouseNdcY: 0,
  mouseRayPlaneIntersection: null,

  selected: null,
  oldSelected: null,
  dragOffset: null,
  dragging: false,
  dragged: false,

  postScene: null,
  postCamera: null,
  postQuad: null,
  topScene: null,
  currentIndex: 0,

  currentCaseId: DEFAULT_CASE.id,

  foam: {
    kind: "rectangle",
    x: 0,
    y: 0,
    sizeX: DEFAULT_CASE.foam.sizeX,
    sizeY: DEFAULT_CASE.foam.sizeY,
    sizeZ: DEFAULT_CASE.foam.sizeZ,
    rotation: 0,
    cornerRadius: DEFAULT_CASE.foam.cornerRadius,
  },
  cornerRadius: DEFAULT_CASE.foam.cornerRadius,

  shapesArray: [],
  worker: null,
  undoRedoHistory: [],
  undoRedoPosition: 0,

  copyPlacementActive: false,
  copyPlacementSourceId: null,
  copyPreviewShapes: [],
  copySpacingMm: 10,
};
