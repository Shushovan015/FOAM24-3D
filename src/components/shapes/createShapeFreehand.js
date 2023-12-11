import * as THREE from "three";
import { displayLineXY, lineFunction } from "../../utils/displayLinesXY";
import { disableButton } from "../../utils/buttonClick";

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
  callback // Add a callback parameter to handle the modified selected variable
) => {
  document.querySelector("#create-polygon").onclick = () => {
    let newPoints;
    lineFunction("block", "flex", true);
    disableButton(false);
    display2D = true;
    // document.querySelector("#back-button").removeAttribute("disabled");
    document.querySelector("#back-button").onclick = () => {
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
        kind: "polygon",
        x: 0, // mouseRayPlaneIntersection.x,
        y: 0, //mouseRayPlaneIntersection.y,
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
    function customConfirm() {
      var result = window.confirm(
        "The shape is saved temporarily. Do you want to save in the the shape library?"
      );
      if (result) {
        var jsonString = localStorage.getItem("cachedJson");
        if (jsonString) {
          var retrievedObject = JSON.parse(jsonString);
          console.log(retrievedObject, "object");
        } else {
          alert("No JSON found in cache.");
        }
      } else {
        console.log("User clicked No or closed the dialog.");
      }
    }
    saveButton.onclick = () => {
      newPoints = finalPoints?.map((point) => [point.x, point.y]);
      var shape = {
        kind: "polygon",
        x: 0, // mouseRayPlaneIntersection.x,
        y: 0, //mouseRayPlaneIntersection.y,
        sizeZ: 300 * millimeters,
        sizeX: 200 * millimeters,
        sizeY: 200 * millimeters,
        points: newPoints,
        rotation: 0,
        free: true,
      };
      var jsonString = JSON.stringify(shape);
      localStorage.setItem("cachedJson", jsonString);
      customConfirm();
      drawing = false;
      registering = false;
    };
    var drawing = false;
    var points = [];
    var circles = [];
    var lines = [];
    let finalPoints = [];
    let mesh;
    var proximityThreshold = 5; // Set the proximity threshold for closing the polygon
    let objectZCoordinate = 0;
    const distanceText = document.createElement("div");
    distanceText.style.position = "absolute";
    distanceText.style.top = "10px";
    distanceText.style.left = "10px";
    distanceText.style.color = "white";
    document.body.appendChild(distanceText);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
    });
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(6), 3)
    );
    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.renderOrder = 1;
    let point,
      registering = false;

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersection = new THREE.Vector3();
    document.addEventListener("pointerdown", pointerDown);
    displayLineXY();
    function onMouseMove(event) {
      if (registering) {
        const intersection = getMouseIntersection(event);
        const endPoint = intersection.clone();
        const midpoint = new THREE.Vector3().lerpVectors(point, endPoint, 0.5);
        sceneCopy.add(line);
        line.geometry.attributes.position.setXYZ(
          1,
          endPoint.x,
          endPoint.y,
          endPoint.z
        );
        line.geometry.attributes.position.needsUpdate = true;
        const screenX = midpoint.x + window.innerWidth / 2;
        const screenY = midpoint.y + window.innerHeight / 2 - 20;
        distanceText.style.top = `${screenY}px`;
        distanceText.style.left = `${screenX}px`;
        const distance = point.distanceTo(endPoint) * 10;
        const unit = "mm";
        distanceText.textContent = `Distance: ${distance.toFixed(2)} ${unit}`;
      }
    }
    function getMouseIntersection(event) {
      raycaster.setFromCamera(mouse, orthoCamera);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(
        new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
        intersection
      );
      return intersection;
    }
    function pointerDown(event) {
      const rect = event.target.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, orthoCamera);
      // starting of dyamic line drawing form point click
      raycaster.ray.intersectPlane(plane, intersection);
      registering = true;
      if (registering) {
        const intersection = getMouseIntersection(event);
        point = intersection.clone();
        line.geometry.attributes.position.setXYZ(0, point.x, point.y, point.z);
        line.geometry.attributes.position.setXYZ(1, point.x, point.y, point.z);
        line.geometry.attributes.position.needsUpdate = true;
        line.visible = true;
      }
      if (drawing) {
        if (points.length > 1) {
          const firstPoint = points[0];
          const distanceToFirstPoint = firstPoint.distanceTo(intersection);
          if (distanceToFirstPoint < proximityThreshold) {
            distanceText.textContent = "";
            // make the button enabled for functioning
            disableButton(true);
            registering = false;
            document.getElementById("saveButtonContainer").disabled = false;
            finalPoints = [...points];
            drawing = false;
            const newPoints = points.map(
              (point) => new THREE.Vector3(point.x, point.y, point.z)
            );
            const shape = new THREE.Shape(
              newPoints.map((point) => new THREE.Vector2(point.x, point.y))
            );
            const extrudeSettings = {
              depth: 0,
              bevelEnabled: false,
            };
            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            const material = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              side: THREE.DoubleSide,
            });
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.z = objectZCoordinate;
            sceneCopy.add(mesh);
            points = [];
          }
        }
        if (drawing) {
          const unprojectedPoint = intersection.clone();
          unprojectedPoint.z = objectZCoordinate + 1;
          points.push(unprojectedPoint);
          const geometry = new THREE.CircleGeometry(3, 32);
          const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
          const circle = new THREE.Mesh(geometry, material);
          circle.position.copy(unprojectedPoint);
          sceneCopy.add(circle);
          circles.push(circle);
          if (points.length > 1) {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(
              points
            );
            const lineMaterial = new THREE.LineBasicMaterial({
              color: 0xffa500,
              linewidth: 15,
            });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            sceneCopy.add(line);
            lines.push(line);
          }
        }
      } else {
        drawing = true;
        const unprojectedPoint = intersection.clone();
        unprojectedPoint.z = objectZCoordinate + 1;
        const geometry = new THREE.CircleGeometry(3, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const circle = new THREE.Mesh(geometry, material);
        circle.position.copy(unprojectedPoint);
        sceneCopy.add(circle);
        circles.push(circle);
        points.push(unprojectedPoint.clone());
        document.addEventListener("mousemove", (event) => {
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          onMouseMove(event);
        });
      }
    }
    showPanelFromRight("polygon-panel");
    doCsg();
    callback(selected, display2D);
  };
};
