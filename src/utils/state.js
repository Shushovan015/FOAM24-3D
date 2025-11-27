// utils/state.js
import { structuredClone, updateUndoRedoButtons } from "./common";
import { doCsg as runCsg } from "../csg/doCsg";

export const state = {
  foam: {
    kind: "rectangle",
    x: 0,
    y: 0,
    sizeX: 700, // 70 * cm
    sizeY: 500, // 50 * cm
    sizeZ: 370, // 37 * cm
    rotation: 0,
  },
  shapesArray: [],
  selected: null,
  display2D: false,
  scene: null,
  camera: null,
  camera1: null,
  controls: null,
  renderer: null,
  orthoCamera: null,
  sceneCopy: null,
  rendererCopy: null,
  undoRedoHistory: [],
  undoRedoPosition: 0,
  units: {
    millimeters: 1,
    centimeters: 10,
    meters: 1000,
  },
};

export function doCsg() {
  runCsg(state.foam, state.shapesArray, state.scene, state.units.centimeters);
}

export function commit() {
  if (state.undoRedoPosition !== state.undoRedoHistory.length - 1) {
    state.undoRedoHistory.splice(state.undoRedoPosition + 1);
  }
  state.undoRedoHistory.push(structuredClone(state.shapesArray));
  state.undoRedoPosition = state.undoRedoHistory.length - 1;
  updateUndoRedoButtons(state.undoRedoPosition, state.undoRedoHistory);
}

export function undo() {
  if (state.undoRedoPosition > 0) {
    state.undoRedoPosition--;
    state.shapesArray = structuredClone(
      state.undoRedoHistory[state.undoRedoPosition]
    );
    doCsg();
  }
  updateUndoRedoButtons(state.undoRedoPosition, state.undoRedoHistory);
  document.querySelector("#back-button")?.setAttribute("disabled", "");
  document.querySelector("#main-panel")?.classList.add("active");
  state.selected = null;
}

export function redo() {
  if (state.undoRedoPosition < state.undoRedoHistory.length - 1) {
    state.undoRedoPosition++;
    state.shapesArray = structuredClone(
      state.undoRedoHistory[state.undoRedoPosition]
    );
    doCsg();
  }
  updateUndoRedoButtons(state.undoRedoPosition, state.undoRedoHistory);
  document.querySelector("#back-button")?.setAttribute("disabled", "");
  document.querySelector("#main-panel")?.classList.add("active");
  state.selected = null;
}

// approach 1
// export function drawOutline(
//   shape,
//   style,
//   width,
//   z,
//   ctx,
//   camera,
//   display2D, // This flag controls dot visibility
//   renderer,
//   selected, // Your selected shape object
//   scene,
//   displayDot
//   // numSamples
// ) {
//   ctx.lineWidth = width;
//   ctx.strokeStyle = style;

//   const geom2 = shapeToGeom2(shape);
//   const geometries = Array.isArray(geom2) ? geom2 : [geom2];

//   // Check if we should show control points
//   const showControlPoints = display2D && displayDot;

//   geometries.forEach((geometry) => {
//     if (!geometry?.sides?.length) return;

//     ctx.beginPath();

//     // Get first point
//     const firstPoint = geometry.sides[0][0];
//     let p0 = projectPoint(firstPoint[0], firstPoint[1], z, camera, renderer);
//     ctx.moveTo(p0.x, p0.y);

//     // Draw subsequent points
//     geometry.sides.forEach((line) => {
//       const point = line[1];
//       const p1 = projectPoint(point[0], point[1], z, camera, renderer);
//       ctx.lineTo(p1.x, p1.y);
//     });

//     // Close path
//     ctx.lineTo(p0.x, p0.y);
//     ctx.stroke();

//     // If control points should be displayed, add or remove them
//     if (showControlPoints) {
//       // remove old
//       if (shape.controlPoints) {
//         shape.controlPoints.forEach((obj) => scene.remove(obj));
//       }
//       shape.controlPoints = [];

//       const CP_Z = 0; // keep everything on one plane

//       shape.points.forEach(([x, y], index) => {
//         const sphere = new THREE.Mesh(
//           new THREE.SphereGeometry(3, 16, 16),
//           new THREE.MeshBasicMaterial({ color: 0x00ffff })
//         );
//         sphere.position.set(x, y, CP_Z);
//         sphere.name = `controlPoint-${index}`;
//         sphere.userData.pointIndex = index;
//         sphere.userData.draggable = true;
//         scene.add(sphere);
//         shape.controlPoints.push(sphere);

//         // keep helper for cursor hit area, but invisible
//         const helper = new THREE.BoxHelper(sphere, 0xffff00);
//         helper.material.opacity = 0;
//         helper.material.transparent = true;
//         helper.material.colorWrite = false;
//         helper.visible = true;
//         scene.add(helper);
//       });

//       setupControlPointInteractions(shape, scene, camera, renderer);
//     } else {
//       if (shape.controlPoints) {
//         shape.controlPoints.forEach((obj) => scene.remove(obj));
//         shape.controlPoints = [];
//       }
//     }
//   });
// }

// function setupControlPointInteractions(shape, scene, camera, renderer) {
//   const state = {
//     isDragging: false,
//     selectedPoint: null,
//     raycaster: new THREE.Raycaster(),
//     mouse: new THREE.Vector2(),
//     originalPoints: shape.points.map((p) => [...p]),
//     CP_Z: 0,
//   };

//   const overlay = document.createElement("div");
//   Object.assign(overlay.style, {
//     position: "fixed",
//     inset: "0",
//     zIndex: "10000",
//     pointerEvents: "none",
//     opacity: "0",
//     cursor: "default",
//   });
//   document.body.appendChild(overlay);

//   const getRect = () => renderer.domElement.getBoundingClientRect();
//   const ndcFromEvent = (evt) => {
//     const r = getRect();
//     return {
//       x: ((evt.clientX - r.left) / r.width) * 2 - 1,
//       y: -((evt.clientY - r.top) / r.height) * 2 + 1,
//     };
//   };

//   // indicators + per-point helpers
//   shape.controlPoints.forEach((point) => {
//     const indicator = document.createElement("div");
//     Object.assign(indicator.style, {
//       position: "absolute",
//       width: "20px",
//       height: "20px",
//       background: "rgba(255,0,0,0.3)",
//       borderRadius: "50%",
//       transform: "translate(-50%, -50%)",
//       pointerEvents: "none",
//     });
//     overlay.appendChild(indicator);

//     // extend userData instead of replacing it
//     Object.assign(point.userData, {
//       indicator,
//       updatePosition: () => {
//         const r = getRect();
//         const v = point.position.clone().project(camera);
//         const x = (v.x * 0.5 + 0.5) * r.width + r.left;
//         const y = (-(v.y * 0.5) + 0.5) * r.height + r.top;
//         indicator.style.left = `${x}px`;
//         indicator.style.top = `${y}px`;
//       },
//     });
//   });

//   function onMouseDown(evt) {
//     const ndc = ndcFromEvent(evt);
//     state.mouse.set(ndc.x, ndc.y);
//     state.raycaster.setFromCamera(state.mouse, camera);
//     const hit = state.raycaster.intersectObjects(shape.controlPoints, false);

//     if (hit.length) {
//       evt.preventDefault();
//       state.isDragging = true;
//       state.selectedPoint = hit[0].object;

//       // debug
//       console.group("[drag] start");
//       console.log("selected index:", state.selectedPoint.userData.pointIndex);
//       console.log("points before:", JSON.parse(JSON.stringify(shape.points)));
//       console.groupEnd();

//       window.addEventListener("mousemove", onMouseMove);
//       window.addEventListener("mouseup", onMouseUp);
//     }
//   }

//   function onMouseMove(evt) {
//     if (!state.isDragging || !state.selectedPoint) return;

//     const ndc = ndcFromEvent(evt);
//     state.mouse.set(ndc.x, ndc.y);
//     state.raycaster.setFromCamera(state.mouse, camera);

//     // drag on the same Z plane as the spheres
//     const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -state.CP_Z);
//     const pos = new THREE.Vector3();
//     state.raycaster.ray.intersectPlane(dragPlane, pos);

//     // update sphere
//     state.selectedPoint.position.set(pos.x, pos.y, state.CP_Z);

//     // update data
//     const i = state.selectedPoint.userData.pointIndex;
//     shape.points[i] = [pos.x, pos.y];

//     // update indicator
//     state.selectedPoint.userData.updatePosition?.();

//     // if you have a live geometry, update it here
//     if (shape.geometry?.attributes?.position) {
//       const a = shape.geometry.attributes.position.array;
//       a[i * 3] = pos.x;
//       a[i * 3 + 1] = pos.y;
//       a[i * 3 + 2] = state.CP_Z;
//       shape.geometry.attributes.position.needsUpdate = true;
//       if (shape.geometry.index) shape.geometry.computeVertexNormals();
//     }
//   }

//   function onMouseUp() {
//     if (!state.isDragging) return;

//     console.group("[drag] end");
//     console.log("points after:", JSON.parse(JSON.stringify(shape.points)));
//     console.groupEnd();

//     window.removeEventListener("mousemove", onMouseMove);
//     window.removeEventListener("mouseup", onMouseUp);
//     state.isDragging = false;
//     state.selectedPoint = null;
//   }

//   function onHover(evt) {
//     const ndc = ndcFromEvent(evt);
//     state.mouse.set(ndc.x, ndc.y);
//     state.raycaster.setFromCamera(state.mouse, camera);
//     const hit = state.raycaster.intersectObjects(shape.controlPoints, false);
//     overlay.style.pointerEvents = hit.length ? "auto" : "none";
//     overlay.style.cursor = hit.length ? "move" : "default";
//   }

//   window.addEventListener("mousemove", onHover);
//   overlay.addEventListener("mousedown", onMouseDown);

//   // indicator loop
//   let rafId;
//   (function tick() {
//     shape.controlPoints.forEach((p) => p.userData.updatePosition?.());
//     rafId = requestAnimationFrame(tick);
//   })();

//   shape.cleanup = () => {
//     cancelAnimationFrame(rafId);
//     overlay.removeEventListener("mousedown", onMouseDown);
//     window.removeEventListener("mousemove", onHover);
//     window.removeEventListener("mousemove", onMouseMove);
//     window.removeEventListener("mouseup", onMouseUp);
//     document.body.removeChild(overlay);
//   };
// }

const data = null;

// approach 2
// export function drawOutline(
//   shape,
//   style,
//   width,
//   z,
//   ctx,
//   camera,
//   display2D, // This flag controls dot visibility
//   renderer,
//   selected, // Your selected shape object
//   scene,
//   displayDot
// ) {
//   ctx.lineWidth = width;
//   ctx.strokeStyle = style;

//   const geom2 = shapeToGeom2(shape);
//   const geometries = Array.isArray(geom2) ? geom2 : [geom2];

//   const showControlPoints = display2D && displayDot;

//   geometries.forEach((geometry) => {
//     if (!geometry?.sides?.length) return;

//     ctx.beginPath();

//     // Get first point
//     const firstPoint = geometry.sides[0][0];
//     let p0 = projectPoint(firstPoint[0], firstPoint[1], z, camera, renderer);
//     ctx.moveTo(p0.x, p0.y);

//     // Draw subsequent points
//     geometry.sides.forEach((line) => {
//       const point = line[1];
//       const p1 = projectPoint(point[0], point[1], z, camera, renderer);
//       ctx.lineTo(p1.x, p1.y);
//     });

//     // Close path
//     ctx.lineTo(p0.x, p0.y);
//     ctx.stroke();

//     // If control points should be displayed, add or remove them
//     // --- inside A1, replace ONLY the control-point creation block ---
//     if (showControlPoints) {
//       if (shape.controlPoints)
//         shape.controlPoints.forEach((o) => scene.remove(o));
//       if (shape.controlHelpers)
//         shape.controlHelpers.forEach((h) => scene.remove(h));
//       shape.controlPoints = [];
//       shape.controlHelpers = [];

//       const CP_Z = 0;

//       // Outline vertices in the same order you draw: first start, then each side end
//       const vertsRaw = [
//         geometry.sides[0][0],
//         ...geometry.sides.map((s) => s[1]),
//       ];
//       const sameXY = (a, b) => a[0] === b[0] && a[1] === b[1];
//       const verts =
//         vertsRaw.length > 1 &&
//         sameXY(vertsRaw[0], vertsRaw[vertsRaw.length - 1])
//           ? vertsRaw.slice(0, -1)
//           : vertsRaw;

//       const pts = shape.points;
//       const n = Math.min(verts.length, pts.length);
//       const d2 = (a, b) => {
//         const dx = a[0] - b[0],
//           dy = a[1] - b[1];
//         return dx * dx + dy * dy;
//       };

//       // Find the best cyclic shift (and direction) aligning verts with shape.points
//       const scoreRot = (seq, k) => {
//         let s = 0;
//         for (let j = 0; j < n; j++)
//           s += d2(verts[j], seq[(j + k) % seq.length]);
//         return s;
//       };
//       const best = (() => {
//         if (!n) return { rev: false, k: 0 };
//         let best = { rev: false, k: 0, score: Infinity };
//         const seqF = pts,
//           seqR = [...pts].reverse();
//         for (let k = 0; k < seqF.length; k++) {
//           const sc = scoreRot(seqF, k);
//           if (sc < best.score) best = { rev: false, k, score: sc };
//         }
//         for (let k = 0; k < seqR.length; k++) {
//           const sc = scoreRot(seqR, k);
//           if (sc < best.score) best = { rev: true, k, score: sc };
//         }
//         return best;
//       })();

//       const seq = best.rev ? [...pts].reverse() : pts;

//       for (let j = 0; j < n; j++) {
//         const [x, y] = verts[j];
//         const idxInSeq = (j + best.k) % seq.length;
//         const pointIndex = best.rev ? pts.length - 1 - idxInSeq : idxInSeq;

//         const sphere = new THREE.Mesh(
//           new THREE.SphereGeometry(3, 16, 16),
//           new THREE.MeshBasicMaterial({ color: 0x00ffff })
//         );
//         sphere.position.set(x, y, CP_Z);
//         Object.assign(sphere.userData, { pointIndex, draggable: true });
//         sphere.name = `controlPoint-${j}`;
//         scene.add(sphere);
//         shape.controlPoints.push(sphere);

//         const helper = new THREE.BoxHelper(sphere, 0xffff00);
//         helper.material.opacity = 0;
//         helper.material.transparent = true;
//         helper.material.colorWrite = false;
//         helper.visible = true;
//         scene.add(helper);
//         shape.controlHelpers.push(helper);
//       }

//       setupControlPointInteractions(shape, scene, camera, renderer);
//     } else {
//       if (shape.controlPoints)
//         shape.controlPoints.forEach((o) => scene.remove(o));
//       if (shape.controlHelpers)
//         shape.controlHelpers.forEach((h) => scene.remove(h));
//       shape.controlPoints = [];
//       shape.controlHelpers = [];
//     }
//   });
// }

// function setupControlPointInteractions(shape, scene, camera, renderer) {
//   const state = {
//     isDragging: false,
//     selectedPoint: null,
//     raycaster: new THREE.Raycaster(),
//     mouse: new THREE.Vector2(),
//     originalPoints: shape.points.map((p) => [...p]),
//     CP_Z: 0,
//     dragPlane: null,
//     grabDelta: new THREE.Vector3(),
//   };

//   const overlay = document.createElement("div");
//   Object.assign(overlay.style, {
//     position: "fixed",
//     inset: "0",
//     zIndex: "10000",
//     pointerEvents: "none",
//     opacity: "0",
//     cursor: "default",
//   });
//   document.body.appendChild(overlay);

//   const getRect = () => renderer.domElement.getBoundingClientRect();
//   const ndcFromEvent = (evt) => {
//     const r = getRect();
//     return {
//       x: ((evt.clientX - r.left) / r.width) * 2 - 1,
//       y: -((evt.clientY - r.top) / r.height) * 2 + 1,
//     };
//   };

//   // indicators + per-point helpers
//   shape.controlPoints.forEach((point) => {
//     const indicator = document.createElement("div");
//     Object.assign(indicator.style, {
//       position: "absolute",
//       width: "20px",
//       height: "20px",
//       background: "rgba(255,0,0,0.3)",
//       borderRadius: "50%",
//       transform: "translate(-50%, -50%)",
//       pointerEvents: "none",
//     });
//     overlay.appendChild(indicator);

//     // extend userData instead of replacing it
//     Object.assign(point.userData, {
//       indicator,
//       updatePosition: () => {
//         const r = getRect();
//         const v = point.position.clone().project(camera);
//         const x = (v.x * 0.5 + 0.5) * r.width + r.left;
//         const y = (-(v.y * 0.5) + 0.5) * r.height + r.top;
//         indicator.style.left = `${x}px`;
//         indicator.style.top = `${y}px`;
//       },
//     });
//   });

//   function onMouseDown(evt) {
//     const ndc = ndcFromEvent(evt);
//     state.mouse.set(ndc.x, ndc.y);
//     state.raycaster.setFromCamera(state.mouse, camera);
//     const hit = state.raycaster.intersectObjects(shape.controlPoints, false);

//     if (hit.length) {
//       evt.preventDefault();
//       state.isDragging = true;
//       state.selectedPoint = hit[0].object;

//       // 1) plane THROUGH the picked point (no snap)
//       const z0 = state.selectedPoint.position.z;
//       state.dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -z0);

//       // 2) compute grab offset so pointer stays “glued” to the point
//       const pOnPlane = new THREE.Vector3();
//       state.raycaster.ray.intersectPlane(state.dragPlane, pOnPlane);
//       state.grabDelta.copy(state.selectedPoint.position).sub(pOnPlane);

//       window.addEventListener("mousemove", onMouseMove);
//       window.addEventListener("mouseup", onMouseUp);
//     }
//   }

//   function onMouseMove(evt) {
//     if (!state.isDragging || !state.selectedPoint) return;

//     const ndc = ndcFromEvent(evt);
//     state.mouse.set(ndc.x, ndc.y);
//     state.raycaster.setFromCamera(state.mouse, camera);

//     const pOnPlane = new THREE.Vector3();
//     state.raycaster.ray.intersectPlane(state.dragPlane, pOnPlane);

//     // keep offset so there is zero jump
//     pOnPlane.add(state.grabDelta);

//     // update sphere
//     state.selectedPoint.position.set(
//       pOnPlane.x,
//       pOnPlane.y,
//       state.selectedPoint.position.z
//     );

//     // update data
//     const i = state.selectedPoint.userData.pointIndex;
//     shape.points[i] = [pOnPlane.x, pOnPlane.y];

//     // indicator
//     state.selectedPoint.userData.updatePosition?.();

//     // optional geometry update
//     if (shape.geometry?.attributes?.position) {
//       const a = shape.geometry.attributes.position.array;
//       a[i * 3] = pOnPlane.x;
//       a[i * 3 + 1] = pOnPlane.y;
//       a[i * 3 + 2] = state.selectedPoint.position.z;
//       shape.geometry.attributes.position.needsUpdate = true;
//       if (shape.geometry.index) shape.geometry.computeVertexNormals();
//     }
//   }

//   function onMouseUp() {
//     if (!state.isDragging) return;

//     // console.group("[drag] end");
//     // console.log("points after:", JSON.parse(JSON.stringify(shape.points)));
//     // console.groupEnd();

//     window.removeEventListener("mousemove", onMouseMove);
//     window.removeEventListener("mouseup", onMouseUp);
//     state.isDragging = false;
//     state.selectedPoint = null;
//   }

//   function onHover(evt) {
//     const ndc = ndcFromEvent(evt);
//     state.mouse.set(ndc.x, ndc.y);
//     state.raycaster.setFromCamera(state.mouse, camera);
//     const hit = state.raycaster.intersectObjects(shape.controlPoints, false);
//     overlay.style.pointerEvents = hit.length ? "auto" : "none";
//     overlay.style.cursor = hit.length ? "move" : "default";
//   }

//   window.addEventListener("mousemove", onHover);
//   overlay.addEventListener("mousedown", onMouseDown);

//   // indicator loop
//   let rafId;
//   (function tick() {
//     shape.controlPoints.forEach((p) => p.userData.updatePosition?.());
//     rafId = requestAnimationFrame(tick);
//   })();

//   shape.cleanup = () => {
//     cancelAnimationFrame(rafId);
//     overlay.removeEventListener("mousedown", onMouseDown);
//     window.removeEventListener("mousemove", onHover);
//     window.removeEventListener("mousemove", onMouseMove);
//     window.removeEventListener("mouseup", onMouseUp);
//     document.body.removeChild(overlay);
//   };
// }
