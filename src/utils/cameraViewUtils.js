export function buildCameraSnapshot(camera, controls) {
  if (!camera || !controls) return null;

  return {
    position: camera.position.clone(),
    target: controls.target.clone(),
    up: camera.up.clone(),
  };
}

export function applyCameraSnapshot(camera, controls, saved) {
  if (!saved || !camera || !controls) return false;

  camera.position.copy(saved.position);
  controls.target.copy(saved.target);
  camera.up.copy(saved.up);
  camera.lookAt(saved.target);
  controls.update();
  return true;
}

function getViewParams(foam, units) {
  const targetX = foam?.x || 0;
  const targetY = foam?.y || 0;
  const targetZ = 37 * units.centimeters;

  const maxDim = Math.max(foam?.sizeX || 0, foam?.sizeY || 0);
  const distance = Math.max(maxDim * 2, 1 * units.meters);

  return { targetX, targetY, targetZ, distance };
}

export function setCameraTopView(camera, controls, foam, units) {
  if (!camera || !controls) return false;

  const { targetX, targetY, targetZ, distance } = getViewParams(foam, units);
  const epsilon = distance * 0.001;

  camera.up.set(0, 0, 1);
  controls.target.set(targetX, targetY, targetZ);
  camera.position.set(targetX, targetY - epsilon, targetZ + distance);
  camera.lookAt(targetX, targetY, targetZ);
  controls.update();
  return true;
}

export function setCameraFrontView(camera, controls, foam, units) {
  if (!camera || !controls) return false;

  const { targetX, targetY, targetZ, distance } = getViewParams(foam, units);

  camera.up.set(0, 0, 1);
  controls.target.set(targetX, targetY, targetZ);
  camera.position.set(targetX, targetY - distance, targetZ);
  camera.lookAt(targetX, targetY, targetZ);
  controls.update();
  return true;
}
