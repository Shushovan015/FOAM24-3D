import * as THREE from "three";
import { state } from "../setup/state";

export function displayLineXY() {
  const xLine = document.querySelector(".x-line");
  const yLine = document.querySelector(".y-line");
  const xCoordinates = document.querySelector(".x-coordinates");
  const yCoordinates = document.querySelector(".y-coordinates");

  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function getWorldPos(event) {
    const cam = state.orthoCamera || state.camera1 || state.camera;
    if (!cam) return null;

    const rect =
      state.renderer?.domElement?.getBoundingClientRect() || {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, cam);

    const hit = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(plane, hit)) return hit;
    return null;
  }

  document.addEventListener("mousemove", (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    xLine.style.top = `${mouseY}px`;
    yLine.style.left = `${mouseX}px`;
    xCoordinates.style.top = `${mouseY}px`;
    yCoordinates.style.left = `${mouseX}px`;

    const world = getWorldPos(event);
    if (world) {
      xCoordinates.textContent = `X: ${world.x.toFixed(1)}mm`;
      yCoordinates.textContent = `Y: ${world.y.toFixed(1)}mm`;
    } else {
      xCoordinates.textContent = `X: ${mouseX}px`;
      yCoordinates.textContent = `Y: ${mouseY}px`;
    }
  });
}

export function lineFunction(name1, name2, boolValue) {
  document.getElementById("buttonContainer").style.display = `${name2}`;
  document.getElementById("saveButtonContainer").style.display = `${name2}`;
  document.getElementById("saveButtonContainer").disabled = boolValue;
  document.querySelector(".x-line").style.display = `${name1}`;
  document.querySelector(".y-line").style.display = `${name1}`;
  document.querySelector(".x-coordinates").style.display = `${name1}`;
  document.querySelector(".y-coordinates").style.display = `${name1}`;
}
