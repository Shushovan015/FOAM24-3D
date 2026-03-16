import * as THREE from "three";
import { displayLineXY, lineFunction } from "../../utils/displayLinesXY";
import { setPolygonActionButtons } from "../../utils/buttonClick";
import { generateId } from "../../utils/common";
import { restoreCameraView } from "../../setup/scene";
import { saveShapeToLibrary } from "../../utils/shapeLibrary";
import {
  isValidPolygonPoints,
  drawAngleArc,
  buildPreviewMesh,
  makePolygonShape,
  showToast,
  getFoamWorldBox,
  createDistanceTextElement,
  createAngleOverlayCanvas,
  resizeOverlayCanvas,
  disposeObject3D,
  disposeListFromScene,
  createFreehandPoint,
  createFreehandSegment
} from "../../utils/freehandUtils";

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
    window.__freehandActive = true;
    setPolygonActionButtons({
      depth: false,
      rotate: false,
      remove: false,
      edit: false,
    });
    lineFunction("block", "flex", true);
    display2D = true;
    const foamBox = getFoamWorldBox(foamMesh);

    function isInsideFoam(point) {
      return foamBox.containsPoint(point);
    }

    const backButton = document.querySelector("#back-button");
    const previousBackOnClick = backButton ? backButton.onclick : null;

    const restoreBackButton = () => {
      if (!backButton) return;
      backButton.onclick = previousBackOnClick;
      backButton.setAttribute("disabled", "");
    };

    if (backButton) {
      backButton.removeAttribute("disabled");
      backButton.onclick = () => {
        cleanupDrawing({ restoreView: true });
        selected = null;
      };
    }

    document.querySelector("#buttonContainer").onclick = () => {
      if (!finalizedPolygons.length) {
        cleanupDrawing({ restoreView: true });
        return;
      }

      let lastShape = null;
      finalizedPolygons.forEach((pts) => {
        if (!Array.isArray(pts) || pts.length < 3) return;
        const shape = makePolygonShape(pts, millimeters);
        shape.id = generateId();
        shapesArray.push(shape);
        lastShape = shape;
      });

      cleanupDrawing({ restoreView: false });

      if (!lastShape) return;

      commit();
      selected = lastShape;
      window.__freehandActive = false;
      setPolygonActionButtons({
        depth: true,
        rotate: true,
        remove: true,
        edit: true,
      });
      showPanelFromRight(selected.kind + "-panel");
      doCsg();
      callback(selected, false);
    };

    const saveButton = document.getElementById("saveButtonContainer");
    saveButton.onclick = () => {
      if (!finalizedPolygons.length) {
        alert("Close a shape first before saving.");
        return;
      }

      const newPoints = finalizedPolygons[finalizedPolygons.length - 1];
      const shape = makePolygonShape(newPoints, millimeters);
      shape.id = generateId();
      const defaultName = `freehand-${new Date().toISOString().slice(0, 10)}`;
      const name = window.prompt("Save shape as:", defaultName);
      if (name !== null) {
        saveShapeToLibrary(shape, name.trim() || defaultName);
        showToast("Shape saved successfully under My Shapes");
      }

      drawing = false;
      registering = false;
      points.length = 0;

      line.geometry.attributes.position.setXYZ(0, 0, 0, 0);
      line.geometry.attributes.position.setXYZ(1, 0, 0, 0);
      line.geometry.attributes.position.needsUpdate = true;

      disposeListFromScene(sceneCopy, lines);
      disposeListFromScene(sceneCopy, circles);
      lines = [];
      circles = [];
    };

    var drawing = false;
    var points = [];
    var circles = [];
    var lines = [];
    var closedCircles = [];
    var closedLines = [];
    let finalizedPolygons = [];
    let mesh;
    let previewMeshes = [];

    var proximityThresholdMm = 5;
    let objectZCoordinate = 0;
    const distanceText = createDistanceTextElement();
    const angleOverlay = createAngleOverlayCanvas();

    function resizeAngleOverlay() {
      resizeOverlayCanvas(angleOverlay);
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
      window.__freehandActive = false;
      setPolygonActionButtons({
        depth: false,
        rotate: false,
        remove: false,
        edit: true,
      });
      restoreBackButton();

      if (restoreView) {
        restoreCameraView();
        showPanelFromLeft("main-panel");
      }
      points.length = 0;
      if (line) {
        sceneCopy.remove(line);
        disposeObject3D(line);
      }
      if (mesh) {
        sceneCopy.remove(mesh);
        disposeObject3D(mesh);
      }
      disposeListFromScene(sceneCopy, previewMeshes);
      disposeListFromScene(sceneCopy, circles);
      disposeListFromScene(sceneCopy, lines);
      disposeListFromScene(sceneCopy, closedCircles);
      disposeListFromScene(sceneCopy, closedLines);

      previewMeshes = [];
      closedCircles = [];
      closedLines = [];
      callback1(false);
      angleCtx.clearRect(0, 0, angleOverlay.width, angleOverlay.height);
      angleOverlay.remove();
      distanceText.remove();
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
          drawAngleArc(prev, curr, endPoint, angleCtx, angleOverlay, orthoCamera);
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
            setPolygonActionButtons({
              depth: false,
              rotate: false,
              remove: false,
              edit: false,
            });
            registering = false;
            document.getElementById("saveButtonContainer").disabled = false;
            const closedPoints = points.map((p) => [p.x, p.y]);
            if (isValidPolygonPoints(closedPoints)) {
              finalizedPolygons.push(closedPoints);
            }
            drawing = false;
            mesh = buildPreviewMesh(points, objectZCoordinate);
            sceneCopy.add(mesh);
            previewMeshes.push(mesh);
            closedCircles.push(...circles);
            closedLines.push(...lines);
            circles = [];
            lines = [];
            points = [];
            return;
          }
        }
        const unprojectedPoint = intersect.clone();
        unprojectedPoint.z = objectZCoordinate + 1;
        points.push(unprojectedPoint);
        const circle = createFreehandPoint(unprojectedPoint, 0);
        sceneCopy.add(circle);
        circles.push(circle);

        if (points.length > 1) {
          const segment = createFreehandSegment(points);
          sceneCopy.add(segment);
          lines.push(segment);
        }
      } else {
        drawing = true;
        const unprojectedPoint = intersect.clone();
        unprojectedPoint.z = objectZCoordinate + 1;
        const circle = createFreehandPoint(unprojectedPoint, 0);
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
