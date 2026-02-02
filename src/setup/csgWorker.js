import * as THREE from "three";
import { geom3ToMesh } from "../utils/threeFunctions";
import { FoamMaterial } from "../components/Material";
import { state, units } from "./state";
import { structuredClone } from "../utils/common";

let worker = null;
let inFlight = false;
let pending = null;
let requestId = 0;
let latestId = 0;

function ensureWorker() {
  if (worker) return;
  worker = new Worker(new URL("../../csg.js", import.meta.url), {
    type: "module",
  });

  worker.onmessage = (e) => {
    const { id, geom } = e.data || {};
    if (typeof id === "number" && id < latestId) {
      // stale result
    } else {
      const csgModel = state.scene.getObjectByName("csgModel");
      if (csgModel) {
        if (csgModel.material) csgModel.material.dispose();
        if (csgModel instanceof THREE.Mesh) csgModel.geometry.dispose();
        state.scene.remove(csgModel);
      }
      const mesh = geom3ToMesh(geom);
      mesh.material = new FoamMaterial(
        "red",
        "#333",
        2 * units.centimeters,
        37 * units.centimeters
      );
      mesh.name = "csgModel";
      state.scene.add(mesh);
    }

    inFlight = false;
    if (pending) {
      const next = pending;
      pending = null;
      sendToWorker(next);
    }
  };
}

function sendToWorker(payload) {
  inFlight = true;
  latestId = payload.id;
  worker.postMessage(payload);
}

export function doCsg() {
  ensureWorker();

  const defaultCornerRadius = state.cornerRadius;

  const foamForWorker = structuredClone(state.foam);
  if (
    foamForWorker &&
    typeof foamForWorker.cornerRadius !== "number" &&
    typeof defaultCornerRadius === "number"
  ) {
    foamForWorker.cornerRadius = defaultCornerRadius;
  }

  const shapesForWorker = structuredClone(state.shapesArray).map((shape) => {
    if (!shape || typeof shape !== "object") return shape;
    if (typeof shape.cornerRadius === "number") return shape;
    if (typeof defaultCornerRadius !== "number") return shape;
    return { ...shape, cornerRadius: defaultCornerRadius };
  });

  const payload = { id: ++requestId, foam: foamForWorker, shapesArray: shapesForWorker };

  if (inFlight) {
    pending = payload;
    return;
  }
  sendToWorker(payload);
}

