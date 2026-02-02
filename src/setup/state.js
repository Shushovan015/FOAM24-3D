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

  foam: {
    kind: "rectangle",
    x: 0,
    y: 0,
    sizeX: 70 * 10,
    sizeY: 50 * 10,
    sizeZ: 37 * 10,
    rotation: 0,
    cornerRadius: 5,
  },
  cornerRadius: 5,
  shapesArray: [],
  worker: null,
  undoRedoHistory: [],
  undoRedoPosition: 0,
};
