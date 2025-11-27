// init3D.js
import * as THREE from "three";
import { FoamMaterial, LambertMaterial } from "../components/Material";
import { createImage } from "../components/createImage";
import { doCsg } from "../csg/doCsg"; // <-- we’ll move this next
import { getValues } from "../utils/common";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export function init3D(state, onSceneReady) {
  const { millimeters, centimeters, meters } = state.units;

  const renderer = new THREE.WebGL1Renderer({
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.autoClear = false;

  const scene = new THREE.Scene();
  const topScene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1 * millimeters,
    100 * meters
  );
  camera.position.set(0, -1 * meters, 1.5 * meters);
  camera.up.set(0, 0, 1);

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.target.set(0, 0, 37 * centimeters);
  controls.update();

  const camera1 = new THREE.OrthographicCamera(
    -1,
    1,
    1,
    -1,
    0.1 * meters,
    100 * meters
  );
  camera1.position.set(0, 0, 1 * meters);
  camera1.up.set(0, 1, 0);
  camera1.lookAt(0, 0, 0);

  // Add ground and OBJ loader here (if needed)

  // Pass values back to main.js
  getValues(camera1, topScene, renderer, (cam, sceneTop, ren) => {
    state.orthoCamera = cam;
    state.sceneCopy = sceneTop;
    state.rendererCopy = ren;
    onSceneReady(); // ✅ Callback when done
  });

  return {
    renderer,
    scene,
    camera,
    controls,
    camera1,
    topScene,
  };
}
