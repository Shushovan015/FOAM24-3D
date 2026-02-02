import * as THREE from "three";
import { displayLineXY, lineFunction } from "../../utils/displayLinesXY";
import { disableButton } from "../../utils/buttonClick";
import { generateId } from "../../utils/common";
import { restoreCameraView } from "../../setup/scene";
import { saveShapeToLibrary } from "../../utils/shapeLibrary";

export const createShapeFreehand = (
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
  callback1,
  callback,
  foamMesh,
  defaultCornerRadius
) => {
  document.querySelector("#create-polygon").onclick = () => {
    let newPoints;
    lineFunction("block", "flex", true);
    disableButton(false);
    display2D = true;

    const foamBox = (() => {
      foamMesh.geometry.computeBoundingBox();
      const box = foamMesh.geometry.boundingBox.clone();
      foamMesh.updateMatrixWorld();
      box.applyMatrix4(foamMesh.matrixWorld);
      return box;
    })();

    function isInsideFoam(point) {
      return foamBox.containsPoint(point);
    }

    document.querySelector("#back-button").onclick = () => {
      cleanupDrawing({ restoreView: true });
      selected = null;
    };

    document.querySelector("#buttonContainer").onclick = () => {
      newPoints = finalPoints?.map((point) => [point.x, point.y]);
      cleanupDrawing({ restoreView: true });
      if (!Array.isArray(newPoints) || newPoints.length < 3) return;
      let shape = {
        id: generateId(),
        kind: "polygon",
        x: 0,
        y: 0,
        sizeZ: 300 * millimeters,
        sizeX: 200 * millimeters,
        sizeY: 200 * millimeters,
        points: newPoints,
        rotation: 0,
        free: true,
      };
      shapesArray.push(shape);
      commit();
      selected = shape;
      showPanelFromRight(selected.kind + "-panel");
      doCsg();
      callback(selected);
    };

    const saveButton = document.getElementById("saveButtonContainer");
    saveButton.onclick = () => {
      newPoints = finalPoints?.map((point) => [point.x, point.y]);
      const shape = {
        id: generateId(),
        kind: "polygon",
        x: 0,
        y: 0,
        sizeZ: 300 * millimeters,
        sizeX: 200 * millimeters,
        sizeY: 200 * millimeters,
        points: newPoints,
        rotation: 0,
        free: true,
      };

      const defaultName = `freehand-${new Date().toISOString().slice(0, 10)}`;
      const name = window.prompt("Save shape as:", defaultName);
      if (name !== null) {
        saveShapeToLibrary(shape, name.trim() || defaultName);
      }

      drawing = false;
      registering = false;
    };

    var drawing = false;
    var points = [];
    var circles = [];
    var lines = [];
    let finalPoints = [];
    let mesh;
    var proximityThresholdMm = 5;
    let objectZCoordinate = 0;
    const distanceText = document.createElement("div");
    Object.assign(distanceText.style, {
      position: "absolute",
      top: "10px",
      left: "10px",
      color: "white",
    });
    document.body.appendChild(distanceText);
    const angleOverlay = document.createElement("canvas");
    angleOverlay.style.position = "absolute";
    angleOverlay.style.top = "0";
    angleOverlay.style.left = "0";
    angleOverlay.style.pointerEvents = "none";
    angleOverlay.style.zIndex = "10";
    document.body.appendChild(angleOverlay);

    function resizeAngleOverlay() {
      angleOverlay.width = window.innerWidth * (window.devicePixelRatio || 1);
      angleOverlay.height = window.innerHeight * (window.devicePixelRatio || 1);
      angleOverlay.style.width = window.innerWidth + "px";
      angleOverlay.style.height = window.innerHeight + "px";
    }
    resizeAngleOverlay();
    window.addEventListener("resize", resizeAngleOverlay);
    const angleCtx = angleOverlay.getContext("2d");

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.renderOrder = 1;
    let point, registering = false;

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersection = new THREE.Vector3();
    document.addEventListener("pointerdown", pointerDown);
    const originalCursor = document.body.style.cursor;
    document.addEventListener("mousemove", onMouseMove);
    let drawingActive = true;
    displayLineXY();

    function cleanupDrawing({ restoreView = true } = {}) {
      drawingActive = false;
      document.body.style.cursor = originalCursor || "default";
      distanceText.textContent = "";
      registering = false;

      lineFunction("none", "none", true);
      document.querySelector("#back-button").setAttribute("disabled", "");

      if (restoreView) {
        restoreCameraView();
        showPanelFromLeft("main-panel");
      }

      points.length = 0;

      if (line) sceneCopy.remove(line);
      if (mesh) sceneCopy.remove(mesh);
      circles.forEach((circle) => sceneCopy.remove(circle));
      lines.forEach((l) => sceneCopy.remove(l));

      callback1(false);
      angleCtx.clearRect(0, 0, angleOverlay.width, angleOverlay.height);
      angleOverlay.remove();
      window.removeEventListener("resize", resizeAngleOverlay);

      document.removeEventListener("pointerdown", pointerDown);
      document.removeEventListener("mousemove", onMouseMove);
    }

    function getMouseIntersection(event) {
      raycaster.setFromCamera(mouse, orthoCamera);
      const intersect = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersect);
      return intersect;
    }

    function angleAtPoint(prev, curr, next) {
      const v1 = new THREE.Vector2(prev.x - curr.x, prev.y - curr.y);
      const v2 = new THREE.Vector2(next.x - curr.x, next.y - curr.y);
      const denom = v1.length() * v2.length();
      if (denom === 0) return null;
      const cos = THREE.MathUtils.clamp(v1.dot(v2) / denom, -1, 1);
      const rad = Math.acos(cos);
      return THREE.MathUtils.radToDeg(rad);
    }

    function projectToScreen(vec3) {
      const v = vec3.clone().project(orthoCamera);
      const x = (v.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-v.y * 0.5 + 0.5) * window.innerHeight;
      return { x, y };
    }

    function drawAngleArc(prev, curr, next) {
      angleCtx.clearRect(0, 0, angleOverlay.width, angleOverlay.height);

      const pPrev = projectToScreen(prev);
      const pCurr = projectToScreen(curr);
      const pNext = projectToScreen(next);

      const v1x = pPrev.x - pCurr.x;
      const v1y = pPrev.y - pCurr.y;
      const v2x = pNext.x - pCurr.x;
      const v2y = pNext.y - pCurr.y;

      const len1 = Math.hypot(v1x, v1y);
      const len2 = Math.hypot(v2x, v2y);
      if (len1 === 0 || len2 === 0) return;

      const dot = (v1x * v2x + v1y * v2y) / (len1 * len2);
      const angleDeg = THREE.MathUtils.radToDeg(
        Math.acos(THREE.MathUtils.clamp(dot, -1, 1))
      );

      const a1 = Math.atan2(v1y, v1x);
      const a2 = Math.atan2(v2y, v2x);

      let delta = a2 - a1;
      while (delta <= -Math.PI) delta += Math.PI * 2;
      while (delta > Math.PI) delta -= Math.PI * 2;

      const start = a1;
      const end = a1 + delta;
      const anticlockwise = delta < 0;

      const dpr = window.devicePixelRatio || 1;
      const radius = 30 * dpr;

      angleCtx.save();
      angleCtx.setTransform(1, 0, 0, 1, 0, 0);
      angleCtx.scale(dpr, dpr);
      angleCtx.strokeStyle = "yellow";
      angleCtx.fillStyle = "yellow";
      angleCtx.lineWidth = 2;

      angleCtx.beginPath();
      angleCtx.arc(pCurr.x, pCurr.y, radius / dpr, start, end, anticlockwise);
      angleCtx.stroke();

      const mid = (start + end) / 2;
      const lx = pCurr.x + Math.cos(mid) * 40;
      const ly = pCurr.y + Math.sin(mid) * 40;

      angleCtx.font = "bold 16px sans-serif";
      angleCtx.strokeStyle = "black";
      angleCtx.lineWidth = 3;
      angleCtx.strokeText(`${angleDeg.toFixed(1)}°`, lx, ly);
      angleCtx.fillText(`${angleDeg.toFixed(1)}°`, lx, ly);
      angleCtx.restore();
    }

    function onMouseMove(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      const intersect = getMouseIntersection(event);
      document.body.style.cursor = display2D && drawingActive && isInsideFoam(intersect) ? 'crosshair' : originalCursor;

      if (registering && isInsideFoam(intersect)) {
        const endPoint = intersect.clone();
        const midpoint = new THREE.Vector3().lerpVectors(point, endPoint, 0.5);
        sceneCopy.add(line);
        line.geometry.attributes.position.setXYZ(1, endPoint.x, endPoint.y, endPoint.z);
        line.geometry.attributes.position.needsUpdate = true;
        distanceText.style.top = `${midpoint.y + window.innerHeight / 2 - 20}px`;
        distanceText.style.left = `${midpoint.x + window.innerWidth / 2}px`;
        const distance = point.distanceTo(endPoint) * millimeters;
        if (points.length >= 2) {
          const prev = points[points.length - 2];
          const curr = points[points.length - 1];
          drawAngleArc(prev, curr, endPoint);
        } else {
          angleCtx.clearRect(0, 0, angleOverlay.width, angleOverlay.height);
        }

        distanceText.textContent = `Distance: ${distance.toFixed(2)} mm`;

      }
    }

    function pointerDown(event) {
      const rect = event.target.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, orthoCamera);
      raycaster.ray.intersectPlane(plane, intersection);
      const intersect = getMouseIntersection(event);
      if (!isInsideFoam(intersect)) return;

      registering = true;
      point = intersect.clone();
      line.geometry.attributes.position.setXYZ(0, point.x, point.y, point.z);
      line.geometry.attributes.position.setXYZ(1, point.x, point.y, point.z);
      line.geometry.attributes.position.needsUpdate = true;
      line.visible = true;

      if (drawing) {
        if (points.length > 1) {
          const firstPoint = points[0];
          const distanceToFirstPointMm =
            firstPoint.distanceTo(intersect) * millimeters;

          if (distanceToFirstPointMm < proximityThresholdMm) {
            disableButton(true);
            registering = false;
            document.getElementById("saveButtonContainer").disabled = false;
            finalPoints = [...points];
            drawing = false;
            const newPoints = points.map(p => new THREE.Vector3(p.x, p.y, p.z));
            const shape = new THREE.Shape(newPoints.map(p => new THREE.Vector2(p.x, p.y)));
            const extrudeSettings = { depth: 0, bevelEnabled: false };
            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.z = objectZCoordinate;
            sceneCopy.add(mesh);
            points = [];
            return;
          }
        }

        const unprojectedPoint = intersect.clone();
        unprojectedPoint.z = objectZCoordinate + 1;
        points.push(unprojectedPoint);
        const geometry = new THREE.CircleGeometry(3, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const circle = new THREE.Mesh(geometry, material);
        circle.position.copy(unprojectedPoint);
        sceneCopy.add(circle);
        circles.push(circle);

        if (points.length > 1) {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffa500, linewidth: 15 });
          const line = new THREE.Line(lineGeometry, lineMaterial);
          sceneCopy.add(line);
          lines.push(line);
        }
      } else {
        drawing = true;
        const unprojectedPoint = intersect.clone();
        unprojectedPoint.z = objectZCoordinate + 1;
        const geometry = new THREE.CircleGeometry(3, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const circle = new THREE.Mesh(geometry, material);
        circle.position.copy(unprojectedPoint);
        sceneCopy.add(circle);
        circles.push(circle);
        points.push(unprojectedPoint.clone());
      }
    }

    showPanelFromRight("polygon-panel");
    doCsg();
    callback(selected, display2D);
  };
};
