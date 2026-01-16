import * as THREE from "three";
import { geom3ToMesh } from "../utils/threeFunctions";
import { FoamMaterial } from "../components/Material";
import { state, units } from "./state";
import { structuredClone } from "../utils/common";

export function doCsg() {
  if (state.worker) {
    state.worker.terminate();
  }
  state.worker = new Worker(new URL("../../csg.js", import.meta.url), {
    type: "module",
  });
  state.worker.onmessage = (e) => {
    const csgModel = state.scene.getObjectByName("csgModel");
    if (csgModel) {
      if (csgModel.material) {
        csgModel.material.dispose();
      }
      if (csgModel instanceof THREE.Mesh) {
        csgModel.geometry.dispose();
      }
      state.scene.remove(csgModel);
    }
    const mesh = geom3ToMesh(e.data);
    mesh.material = new FoamMaterial(
      "red",
      "#333",
      2 * units.centimeters,
      37 * units.centimeters
    );
    mesh.name = "csgModel";
    state.scene.add(mesh);
  };

  const foamForWorker = structuredClone(state.foam);
  const shapesForWorker = structuredClone(state.shapesArray);
  state.worker.postMessage({ foam: foamForWorker, shapesArray: shapesForWorker });
}
