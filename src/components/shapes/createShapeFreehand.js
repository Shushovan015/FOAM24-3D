import * as THREE from "three";
import { displayLineXY, lineFunction } from "../../utils/displayLinesXY";
import { disableButton } from "../../utils/buttonClick";
import { generateId } from "../../utils/common";

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
  foamMesh
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
      drawingActive = false;
      document.body.style.cursor = originalCursor;
      document.body.style.cursor = "default";
      distanceText.textContent = "";
      registering = false;
      lineFunction("none", "none", true);
      document.querySelector("#back-button").setAttribute("disabled", "");
      showPanelFromLeft("main-panel");
      selected = null;
      points.length = 0;
      sceneCopy.remove(mesh);
      circles.map((circle) => sceneCopy.remove(circle));
      lines.map((line) => sceneCopy.remove(line));
      callback1(false);
      document.removeEventListener("pointerdown", pointerDown);
    };

    document.querySelector("#buttonContainer").onclick = () => {
      drawingActive = false;
      document.body.style.cursor = originalCursor;
      document.body.style.cursor = "default";
      distanceText.textContent = "";
      registering = false;
      sceneCopy.remove(line);
      lineFunction("none", "none", true);
      document.querySelector("#back-button").setAttribute("disabled", "");
      showPanelFromLeft("main-panel");
      points.length = 0;
      callback1(false);
      document.removeEventListener("pointerdown", pointerDown);
      sceneCopy.remove(mesh);
      circles.map((circle) => sceneCopy.remove(circle));
      lines.map((line) => sceneCopy.remove(line));
      newPoints = finalPoints?.map((point) => [point.x, point.y]);
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
      var shape = {
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
      localStorage.setItem("cachedJson", JSON.stringify(shape));
      if (window.confirm("The shape is saved temporarily. Do you want to save in the the shape library?")) {
        const json = localStorage.getItem("cachedJson");
        if (json) console.log(JSON.parse(json));
        else alert("No JSON found in cache.");
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
    var proximityThreshold = 5;
    let objectZCoordinate = 0;
    const distanceText = document.createElement("div");
    Object.assign(distanceText.style, {
      position: "absolute",
      top: "10px",
      left: "10px",
      color: "white",
    });
    document.body.appendChild(distanceText);

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
        const distance = point.distanceTo(endPoint) * 10;
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
          const distanceToFirstPoint = firstPoint.distanceTo(intersect);
          if (distanceToFirstPoint < proximityThreshold) {
            distanceText.textContent = "";
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
