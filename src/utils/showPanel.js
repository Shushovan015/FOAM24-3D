export function showPanelFromRights(id, currPanel) {
  let nextPanel = document.querySelector("#" + id);
  if (nextPanel == currPanel) {
    return;
  }
  currPanel.style.animationName = "disappear-left";
  currPanel.style.animationDuration = "0.25s";
  currPanel.style.animationFillMode = "forwards";
  currPanel.style.pointerEvents = "none";
  nextPanel.style.animationName = "appear-right";
  nextPanel.style.animationDuration = "0.25s";
  nextPanel.style.animationFillMode = "forwards";
  nextPanel.style.pointerEvents = "auto";

  currPanel = nextPanel;
}

export function showPanelFromLefts(id, currPanel) {
  let nextPanel = document.querySelector("#" + id);

  if (nextPanel == currPanel) {
    return;
  }

  currPanel.style.animationName = "disappear-right";
  currPanel.style.animationDuration = "0.25s";
  currPanel.style.animationFillMode = "forwards";
  currPanel.style.pointerEvents = "none";
  nextPanel.style.animationName = "appear-left";
  nextPanel.style.animationDuration = "0.25s";
  nextPanel.style.animationFillMode = "forwards";
  nextPanel.style.pointerEvents = "auto";

  currPanel = nextPanel;
}

export function init2D() {
  // Iterate through the scene's children and hide or remove 3D models except for the foam model.
  scene.children.forEach((child) => {
    if (child !== foamModel) {
      // Hide or remove the child if it's not the foam model.
      // For example, if you want to remove the object from the scene:
      // scene.remove(child);
      // Or if you want to hide the object:
      child.visible = false;
    }
  });

  // Adjust camera position and controls for a 2D view.
  camera.position.set(0, 0, 0); // Set a suitable position for 2D view.
  controls.enabled = false; // Disable OrbitControls or any camera controls.
  renderer.clear();

  // Render the scene to show only the foam model or its 2D representation.
  // Optionally, you can render the foam model or 2D representation of the foam here.
  // For example, if foamModel is a THREE.Mesh representing the foam:
  // scene.add(foamModel);
  // renderer.render(scene, camera);
}
