// doCsg.js
import * as THREE from "three";
import { FoamMaterial } from "../components/Material";
import { geom3ToMesh } from "../utils/threeFunctions";

let worker = null;

export function doCsg(foam, shapesArray, scene, centimeters) {
  if (worker) {
    worker.terminate();
  }

  worker = new Worker(new URL("../../csg.js", import.meta.url), {
    type: "module",
  });

  worker.onmessage = (e) => {
    const existing = scene.getObjectByName("csgModel");
    if (existing) {
      if (existing.material) existing.material.dispose();
      if (existing instanceof THREE.Mesh) existing.geometry.dispose();
      scene.remove(existing);
    }

    const mesh = geom3ToMesh(e.data);
    mesh.material = new FoamMaterial(
      "red",
      "#333",
      2 * centimeters,
      37 * centimeters
    );
    mesh.name = "csgModel";
    scene.add(mesh);
  };

  worker.postMessage({ foam, shapesArray });
}
